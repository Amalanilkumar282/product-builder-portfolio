import Image from 'next/image';
import { EmptyState } from '@/components/ui/primitives';
import type { TechStack } from '@/lib/types';

export default function TechStackSection({ techStack }: { techStack: TechStack[] }) {
  if (techStack.length === 0) {
    return <EmptyState title="No tech stack recorded yet" />;
  }

  const grouped = new Map<string, TechStack[]>();
  for (const item of techStack) {
    const list = grouped.get(item.category);
    if (list) list.push(item);
    else grouped.set(item.category, [item]);
  }

  return (
    <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
      {[...grouped.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([category, items]) => (
          <div key={category}>
            <h3 className="meta border-b border-rule pb-2 uppercase tracking-[0.14em]">
              {category}
            </h3>
            <ul className="mt-3 space-y-1.5">
              {items.map((item) => {
                const content = (
                  <>
                    {item.iconUrl && (
                      <Image
                        src={item.iconUrl}
                        alt=""
                        width={16}
                        height={16}
                        className="size-4 shrink-0 object-contain"
                      />
                    )}
                    <span>{item.name}</span>
                  </>
                );

                return (
                  <li key={item.id}>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        // The linked and unlinked branches used to render
                        // identical markup, leaving no static cue which chips
                        // were clickable. An underline is that cue.
                        className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-dim underline decoration-rule-strong underline-offset-4 transition-colors hover:text-verdigris hover:decoration-verdigris"
                      >
                        {content}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 py-2 text-sm text-ink-dim">
                        {content}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
    </div>
  );
}
