"use client";

import { useEffect, useState } from "react";

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

function isIosDevice() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  const navigatorWithStandalone = window.navigator as NavigatorWithStandalone;
  return window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true;
}

export function PwaInstallGuide() {
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    setShowIosGuide(isIosDevice() && !isStandalone());
  }, []);

  if (!showIosGuide) return null;

  return (
    <section className="card install-card">
      <h2>Встановити на iPhone</h2>
      <p className="muted">
        Відкрийте цю сторінку в Safari, натисніть <strong>Share</strong> і виберіть <strong>Add to Home Screen</strong>.
        Після цього Wortwerk відкриватиметься як окремий застосунок без адресного рядка Safari.
      </p>
    </section>
  );
}
