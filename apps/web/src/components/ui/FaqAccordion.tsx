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
          className="glass rounded-xl border border-default overflow-hidden"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group w-full flex items-center justify-between gap-4 px-6 py-4 text-left text-primary font-medium text-sm hover:text-accent-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <span>{item.question}</span>
              <ChevronDown
                size={16}
                className="text-muted shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="px-6 pb-5 pt-0 text-sm text-secondary leading-relaxed border-t border-default">
              {item.answer}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}


