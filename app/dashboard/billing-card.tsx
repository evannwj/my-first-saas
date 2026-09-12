export default function BillingCard() {
  return (
    <div className="mt-10 w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-left">
      <h2 className="text-2xl font-bold">Kittykuan Pro</h2>

      <p className="mt-2 text-sm text-zinc-400">
        Test subscription: S$5/month. This uses Stripe test mode only.
      </p>

      <a
        href="https://buy.stripe.com/test_3cIfZh9Lif4W2bb9Lg0oM00"
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-black"
      >
        Start Test Subscription
      </a>
    </div>
  )
}
