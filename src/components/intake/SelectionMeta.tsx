export default function SelectionMeta({ count }: { count: number }) {
  return (
    <p className="intake-meta">Select all that apply{count > 0 ? ` · ${count} selected` : ""}</p>
  );
}
