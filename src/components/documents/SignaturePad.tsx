"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { SignaturePoint, SignatureStrokes } from "@/lib/leora-document";
import styles from "@/app/documents/leora-group/nda/sign/sign.module.css";

export default function SignaturePad({ onChange }: { onChange: (strokes: SignatureStrokes) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<SignatureStrokes>([]);
  const active = useRef<number | null>(null);
  const [hasInk, setHasInk] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  function redraw() {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    context.clearRect(0, 0, element.width, element.height);
    context.strokeStyle = "#173b2c";
    context.lineWidth = element.width / 300;
    context.lineCap = "round";
    context.lineJoin = "round";
    for (const stroke of strokes.current) {
      context.beginPath();
      stroke.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x * element.width, point.y * element.height);
        else context.lineTo(point.x * element.width, point.y * element.height);
      });
      context.stroke();
    }
  }
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      const rect = element.getBoundingClientRect();
      element.width = Math.round(rect.width * window.devicePixelRatio);
      element.height = Math.round(rect.height * window.devicePixelRatio);
      redraw();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function position(event: PointerEvent<HTMLCanvasElement>): SignaturePoint {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) };
  }
  function publish() {
    strokes.current = strokes.current.filter((stroke) => stroke.length > 1);
    onChange(strokes.current.map((stroke) => [...stroke]));
    setHasInk(strokes.current.length > 0);
    redraw();
  }
  function start(event: PointerEvent<HTMLCanvasElement>) {
    if (active.current !== null || !event.isPrimary || event.button !== 0 || strokes.current.length >= 80) return;
    event.preventDefault();
    active.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    strokes.current.push([position(event)]);
  }
  function move(event: PointerEvent<HTMLCanvasElement>) {
    if (active.current !== event.pointerId) return;
    const stroke = strokes.current.at(-1)!;
    if (stroke.length >= 1500 || strokes.current.reduce((sum, item) => sum + item.length, 0) >= 6000) {
      setLimitReached(true);
      return;
    }
    stroke.push(position(event));
    redraw();
  }
  function end(event: PointerEvent<HTMLCanvasElement>) {
    if (active.current !== event.pointerId) return;
    active.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    publish();
  }
  return (
    <div>
      <p id="signature-help" className={styles.help}>Draw your signature below using a mouse, touch, or stylus. Resizing the page preserves your signature.</p>
      <canvas ref={canvas} className={styles.canvas} role="img" aria-label="Electronic signature drawing area" aria-describedby="signature-help signature-state"
        onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}>
        Your browser must support canvas to draw a signature. Please contact AiForm Studio for another signing method.
      </canvas>
      <div className={styles.signatureTools}>
        <p id="signature-state" className={styles.help} aria-live="polite">{limitReached ? "Signature limit reached. Clear it and draw again." : hasInk ? "Signature captured. It will be recorded only when you submit." : "No signature drawn yet."}</p>
        <button type="button" className={styles.textButton} onClick={() => { active.current = null; strokes.current = []; setLimitReached(false); publish(); }}>Clear signature</button>
      </div>
      <p className={styles.help}>Unable to draw a signature? Contact AiForm Studio to arrange another signing method.</p>
    </div>
  );
}
