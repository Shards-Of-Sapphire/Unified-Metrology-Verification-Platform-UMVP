"use client";

import { useEffect, useRef } from "react";

export default function usePolling(callback: () => void | Promise<void>, interval = 5000) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let timer: number | undefined;
    const poll = () => {
      if (document.visibilityState === "visible") void callbackRef.current();
    };
    const start = () => { window.clearInterval(timer); timer = window.setInterval(poll, interval); };
    const stop = () => window.clearInterval(timer);
    document.addEventListener("visibilitychange", poll);
    start();
    return () => { stop(); document.removeEventListener("visibilitychange", poll); };
  }, [interval]);
}
