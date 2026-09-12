import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured yet.' },
      { status: 500 }
    )
  }

  let body: { prompt?: unknown }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''

  if (!prompt) {
    return NextResponse.json({ error: 'Enter a question first.' }, { status: 400 })
  }

  if (prompt.length > 2000) {
    return NextResponse.json(
      { error: 'Keep the question under 2,000 characters.' },
      { status: 400 }
    )
  }

  const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5.6-luna',
      instructions:
        'You are a concise SaaS product coach. Give practical, specific advice in plain English. Keep the answer under 180 words.',
      input: prompt,
      reasoning: { effort: 'none' },
      max_output_tokens: 300,
    }),
  })

  if (!openAIResponse.ok) {
    console.error('OpenAI API error:', openAIResponse.status)

    return NextResponse.json(
      { error: 'The AI request failed. Check the API key and API billing.' },
      { status: 502 }
    )
  }

  const data = await openAIResponse.json()

  const text = Array.isArray(data.output)
    ? data.output
        .flatMap((item: { content?: Array<{ type?: string; text?: string }> }) =>
          Array.isArray(item.content) ? item.content : []
        )
        .filter(
          (item: { type?: string; text?: string }) =>
            item.type === 'output_text' && typeof item.text === 'string'
        )
        .map((item: { text?: string }) => item.text ?? '')
        .join('\n')
        .trim()
    : ''

  if (!text) {
    return NextResponse.json(
      { error: 'The AI returned no text.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ text })
}
