import type { TimelineItem } from "../data/store";

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <div key={index} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 bg-primary rounded-full mt-1.5 shrink-0"></div>
            {index < items.length - 1 && (
              <div className="w-px flex-1 bg-border mt-1"></div>
            )}
          </div>
          <div className="pb-4">
            <div className="text-[14px] font-semibold text-foreground">
              {item.title}
            </div>
            <div className="text-[12px] text-muted-foreground">{item.date}</div>
            <div className="text-[13px] text-muted-foreground mt-0.5">
              {item.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
