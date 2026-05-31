'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
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
      className={cn('space-y-3', className)}
    >
      {items.map((item, i) => (
        <Accordion.Item
          key={i}
          value={`item-${i}`}
          className="glass rounded-xl border border-white/[0.07] overflow-hidden"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group w-full flex items-center justify-between gap-4 px-6 py-4 text-left text-slate-200 font-medium text-sm hover:text-purple-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50">
              <span>{item.question}</span>
              <ChevronDown
                size={16}
                className="text-slate-500 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="px-6 pb-5 pt-0 text-sm text-slate-400 leading-relaxed border-t border-white/[0.05]">
              {item.answer}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
