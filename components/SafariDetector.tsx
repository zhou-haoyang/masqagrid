"use client";

import { useEffect } from "react";

export function SafariDetector() {
  useEffect(() => {
    const ua = navigator.userAgent;
    const isSafari = ua.includes("Safari") && !ua.includes("Chrome") && !ua.includes("Chromium") && !ua.includes("Edg"); // Exclude Chrome, Chromium, and Edge which also put "Safari" in UA

    if (isSafari) {
      document.documentElement.classList.add("safari");
    }
  }, []);

  return null;
}
