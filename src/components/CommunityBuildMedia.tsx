"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { CommunityBuildMedia as Media } from "@/content/communityBuilds";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const getServerReducedMotion = () => true;

export default function CommunityBuildMedia({ media }: { media: Media }) {
  const reducedMotion = useSyncExternalStore(subscribeToMotion, getReducedMotion, getServerReducedMotion);
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const photos = [media.primary, ...(media.rotation ?? [])];
  const rotating = photos.length > 1 && !reducedMotion;
  const active = rotating ? current % photos.length : 0;

  useEffect(() => {
    if (!rotating || hovered || focused || paused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setCurrent((index) => (index + 1) % photos.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [rotating, hovered, focused, paused, photos.length]);

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)} onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}>
      <div className="community-build-image">
        {(rotating ? photos : [media.primary]).map((photo, index) => (
          <Image key={photo.src} src={photo.src} alt={index === active ? photo.alt : ""}
            aria-hidden={index !== active} fill
            sizes="(min-width: 900px) 38vw, (min-width: 768px) 80vw, 92vw"
            className="community-build-documentary-image" data-active={index === active} />
        ))}
      </div>
      {rotating ? <button type="button" className="community-build-motion-control"
        aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
        {paused ? "Resume photographs" : "Pause photographs"}
      </button> : null}
    </div>
  );
}
