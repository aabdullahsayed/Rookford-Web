import React, { useEffect, useState } from "react";
import { AdminApp } from "../features/admin/AdminApp";
import { StoreApp } from "../features/store/StoreApp";
import { CSS } from "../styles/index";

export default function RookfordStore() {
  const [route, setRoute] = useState(() => {
    if (typeof window === "undefined") return "store";
    return window.location.hash === "#admin" ? "admin" : "store";
  });

  useEffect(() => {
    if (typeof document !== "undefined" && !document.querySelector("meta[name='viewport']")) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.head.appendChild(meta);
    }
  }, []);

  useEffect(() => {
    const onHash = () =>
      setRoute(window.location.hash === "#admin" ? "admin" : "store");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (route === "admin") {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <AdminApp
          onExit={() => {
            window.location.hash = "";
            setRoute("store");
          }}
        />
      </>
    );
  }

  return <StoreApp />;
}
