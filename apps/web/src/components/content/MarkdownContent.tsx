import type { JSX } from 'react';

/**
 * A minimal, dependency-free markdown renderer for DB-authored bodies.
 *
 * Two things it fixes over the previous implementation: `# ` no longer emits an
 * `<h1>` (which put a second h1 inside every article), and ordered lists render
 * as `<ol>` rather than being silently converted to `<ul>`. Headings are also
 * shifted down one level so an article body nests correctly beneath the page's
 * own h1.
 *
 * Output styling comes from the `.prose` class in globals.css. The
 * `@tailwindcss/typography` plugin was referenced across five pages but was
 * never installed, so all of this content previously rendered completely
 * unstyled — no heading scale, no list markers, no link underlines.
 */

type Block =
  | { kind: 'heading'; level: 2 | 3 | 4; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'code'; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'hr' };

function parse(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    if (/^```/.test(line)) {
      const buffer: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buffer.push(lines[i++]);
      i++; // closing fence
      blocks.push({ kind: 'code', text: buffer.join('\n') });
      continue;
    }

    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      blocks.push({ kind: 'hr' });
      i++;
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      // Shift down one level and clamp: `#` becomes h2, never a second h1.
      const level = Math.min(4, Math.max(2, heading[1].length + 1)) as 2 | 3 | 4;
      blocks.push({ kind: 'heading', level, text: heading[2].trim() });
      i++;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const buffer: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buffer.push(lines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      blocks.push({ kind: 'quote', text: buffer.join(' ') });
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, '').trim());
        i++;
      }
      blocks.push({ kind: 'ul', items });
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, '').trim());
        i++;
      }
      blocks.push({ kind: 'ol', items });
      continue;
    }

    const buffer: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,6}\s|```|\s*[-*+]\s|\s*\d+\.\s|\s*>)/.test(lines[i])
    ) {
      buffer.push(lines[i].trim());
      i++;
    }
    blocks.push({ kind: 'paragraph', text: buffer.join(' ') });
  }

  return blocks;
}

/**
 * Inline formatting. Rendered as React elements rather than an HTML string —
 * there is no `dangerouslySetInnerHTML` anywhere in this component, so
 * DB-authored content cannot inject markup.
 */
function inline(text: string, keyPrefix: string): (string | JSX.Element)[] {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(pattern).filter((part) => part !== '');

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const href = link[2];
      const external = /^https?:\/\//.test(href);
      return (
        <a
          key={key}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {link[1]}
        </a>
      );
    }
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(part)) return <em key={key}>{part.slice(1, -1)}</em>;
    if (/^`[^`]+`$/.test(part)) return <code key={key}>{part.slice(1, -1)}</code>;
    return part;
  });
}

export default function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  if (!content?.trim()) return null;
  const blocks = parse(content);

  return (
    <div className={className ? `prose ${className}` : 'prose'}>
      {blocks.map((block, index) => {
        const key = `b-${index}`;

        switch (block.kind) {
          case 'heading': {
            const Tag = `h${block.level}` as 'h2' | 'h3' | 'h4';
            return <Tag key={key}>{inline(block.text, key)}</Tag>;
          }
          case 'paragraph':
            return <p key={key}>{inline(block.text, key)}</p>;
          case 'ul':
            return (
              <ul key={key}>
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`}>{inline(item, `${key}-${j}`)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={key}>
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`}>{inline(item, `${key}-${j}`)}</li>
                ))}
              </ol>
            );
          case 'code':
            return (
              <pre key={key}>
                <code>{block.text}</code>
              </pre>
            );
          case 'quote':
            return (
              <blockquote key={key}>
                <p>{inline(block.text, key)}</p>
              </blockquote>
            );
          case 'hr':
            return <hr key={key} />;
        }
      })}
    </div>
  );
}
