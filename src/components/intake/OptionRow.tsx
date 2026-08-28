"use client";

import type { ReactNode } from "react";
import { IconCheck } from "./icons";

type OptionRowProps = {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: ReactNode;
  hint?: string;
};

export default function OptionRow({
  type,
  name,
  value,
  label,
  checked,
  onChange,
  icon,
  hint,
}: OptionRowProps) {
  return (
    <label className="option-row">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {icon ? (
        <span className="option-row-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="option-row-body">
        <span className="option-row-title">{label}</span>
        {hint ? <span className="option-row-hint">{hint}</span> : null}
      </span>
      <span className="option-row-indicator" aria-hidden="true">
        <IconCheck />
      </span>
    </label>
  );
}
