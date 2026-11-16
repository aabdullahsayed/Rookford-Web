import React from "react";

export function Reviews({ revIdx, reviews, setRevIdx }) {
  if (!(reviews.length > 0)) return null;
  return (
    <section className="rev">
      <div className="wrap">
        <div className="stars rv">★ ★ ★ ★ ★</div>
        <blockquote className="rv">“{reviews[revIdx]?.quote || ""}”</blockquote>
        <cite>{reviews[revIdx]?.author || ""}</cite>
        <div className="dots">
          {reviews.map((_, k) => (
            <button
              key={k}
              className={k === revIdx ? "on" : ""}
              aria-label={`Review ${k + 1}`}
              onClick={() => setRevIdx(k)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
