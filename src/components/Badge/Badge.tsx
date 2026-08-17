type BadgeProps = {
  text: string;
};

export default function Badge({ text }: BadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-red-100 px-5 py-2 text-sm font-semibold uppercase tracking-[4px] text-red-600">
      {text}
    </span>
  );
}