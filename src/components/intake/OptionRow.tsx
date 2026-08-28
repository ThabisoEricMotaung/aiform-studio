"use client";

type OptionRowProps = {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function OptionRow({ type, name, value, label, checked, onChange }: OptionRowProps) {
  return (
    <label className="option-row">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="option-row-body">
        <span className="option-row-title">{label}</span>
      </span>
    </label>
  );
}
