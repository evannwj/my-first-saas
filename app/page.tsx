export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <p className="text-sm font-semibold text-zinc-400 mb-4">
          MY FIRST SaaS
        </p>

        <h1 className="text-5xl font-bold tracking-tight">
          Building my first software business with AI.
        </h1>

        <p className="mt-6 text-lg text-zinc-400">
          One founder. Tiny company. AI-powered.
        </p>

        <button className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-200">
          Get Started
        </button>

        <p className="mt-10 text-sm text-zinc-600">
          Version 0.001
        </p>
      </div>
    </main>
  );
}