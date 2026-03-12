interface TagProps {
  label: string;
}

export default function Tag({ label }: TagProps) {
  return (
    <span
      className="inline-block px-3 py-1 text-[11px] font-semibold rounded-md"
      style={{
        background: "rgba(59, 130, 246, 0.1)",
        border: "1px solid rgba(59, 130, 246, 0.15)",
        color: "#60a5fa",
      }}
    >
      {label}
    </span>
  );
}
