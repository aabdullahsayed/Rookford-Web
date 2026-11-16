import React, { useState } from "react";

export function LineNote({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="rm"
        style={{ margin: "10px 0 0", display: "inline-block" }}
        onClick={() => setOpen((o) => !o)}
      >
        {value ? "Edit note" : "+ Add note / hem request"}
      </button>
      {open && (
        <div className="ln-row on">
          <input
            maxLength={120}
            value={value}
            placeholder="e.g. hem to 31 in, monogram R.K."
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
        </div>
      )}
    </>
  );
}
