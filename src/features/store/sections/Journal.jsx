import React from "react";

export function Journal({ posts }) {
  return (
    <section id="journal">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="sec-num">07 / The Journal</span>
            <h2 className="h-lg rv d1">Stories, <em>stitched.</em></h2>
          </div>
          <a href="#" className="link rv" onClick={(e) => e.preventDefault()}>
            All stories <span className="arrow">→</span>
          </a>
        </div>
        {posts.length ? (
          <div className="jgrid">
            {posts.map((post, i) => (
              <article className={`post rv${i ? " d" + i : ""}`} key={post.id ?? i}>
                <div className="pic">
                  <div style={{ background: post.cover || "linear-gradient(160deg,#4b5561,#1b2027)" }} />
                </div>
                {post.meta ? <span className="meta">{post.meta}</span> : null}
                <h3>{post.title || post.name}</h3>
                {post.excerpt ? <p>{post.excerpt}</p> : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="empty"><p>Stories are on their way from the workshop.</p></div>
        )}
      </div>
    </section>
  );
}
