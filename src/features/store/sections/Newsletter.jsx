import React from "react";

export function Newsletter({ email, newsMsg, onSubscribe, setEmail }) {
  return (
    <section className="news">
      <div className="wrap">
        <span className="eyebrow rv">The Dispatch</span>
        <h2 className="h-lg rv d1">Letters from the <em>loom.</em></h2>
        <p className="rv d2">
          New bolts, quiet restocks and the occasional story. Join and get 10% off your first order
          with code <b>WEST10</b>.
        </p>
        <form className="nform rv d3" onSubmit={onSubscribe} noValidate>
          <input
            type="email"
            placeholder="Your email address"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe →</button>
        </form>
        <div className="nmsg" aria-live="polite">{newsMsg}</div>
      </div>
    </section>
  );
}
