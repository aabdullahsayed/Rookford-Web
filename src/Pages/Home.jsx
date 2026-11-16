import React, { useEffect, useState } from "react";
import { AdminApp } from "../features/admin/AdminApp";
import { StoreApp } from "../features/store/StoreApp";
import { CSS } from "../styles/index";

export default function RookfordStore() {
  // 1. Initialize route by checking the pathname instead of the hash
  const [route, setRoute] = useState(() => {
    if (typeof window === "undefined") return "store";
    return window.location.pathname.startsWith("/admin") ? "admin" : "store";
  });

  useEffect(() => {
    if (typeof document !== "undefined" && !document.querySelector("meta[name='viewport']")) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.head.appendChild(meta);
    }
  }, []);

  // 2. Listen to popstate (browser back/forward) instead of hashchange
  useEffect(() => {
    const onPopState = () => {
      setRoute(window.location.pathname.startsWith("/admin") ? "admin" : "store");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // 3. Handle exit by pushing the root path and updating state
  const handleExit = () => {
    window.history.pushState({}, "", "/");
    setRoute("store");
  };

  if (route === "admin") {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <AdminApp onExit={handleExit} />
      </>
    );
  }

  return <StoreApp />;
}