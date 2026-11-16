import React from "react";

export function Toast({ openBag, toastState }) {
  return (
    <div className={`toast${toastState.on ? " on" : ""}`} role="status">
      <span>{toastState.msg}</span>
      {toastState.showBtn && <button onClick={openBag}>View bag</button>}
    </div>

  );
}
