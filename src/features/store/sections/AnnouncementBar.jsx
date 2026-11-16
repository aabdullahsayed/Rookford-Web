import React from "react";
import { ANNOUNCEMENTS } from "../../../lib/constants";

export function AnnouncementBar({ annIdx }) {
  return (
    <div className="ann" role="status">
      {ANNOUNCEMENTS.map((a, i) => (
        <span key={a} className={i === annIdx ? "on" : ""}>{a}</span>
      ))}
    </div>
  );
}
