'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}

export default function FaqAccordion({ items, className }: FaqAccordionProps) {
  if (!items.length) return null;

  return (
    <Accordion.Root
      type="single"
      collapsible
      className={cn('divide-y divide-rule border-y border-rule', className)}
    >
      {items.map((item, i) => (
        <Accordion.Item key={i} value={`item-${i}`}>
          <Accordion.Header>
            {/* The focus ring comes from the one global :focus-visible rule.
                The per-component `focus-visible:ring-accent` used here before
                generated no CSS at all. */}
            <Accordion.Trigger className="group flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left text-sm text-ink transition-colors hover:text-verdigris">
              <span>{item.question}</span>
              <Plus
                size={16}
                aria-hidden="true"
                className="shrink-0 text-ink-faint transition-transform duration-200 group-data-[state=open]:rotate-45"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className="measure pb-4 text-sm text-ink-dim">{item.answer}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
