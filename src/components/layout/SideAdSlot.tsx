interface SideAdSlotProps {
  label: string;
}

export default function SideAdSlot({ label }: SideAdSlotProps) {
  return (
    <div className="sticky top-28 h-[520px] w-full rounded-xl border border-slate-200 bg-white p-2 text-center text-xs text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      {label}
    </div>
  );
}

