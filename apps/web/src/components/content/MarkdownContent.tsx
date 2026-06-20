import type { ReactNode } from 'react';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

function renderInline(text: string): ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);

  return tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }

    if (token.startsWith('`') && token.endsWith('`')) {
      return <code key={index}>{token.slice(1, -1)}</code>;
    }

    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const external = href.startsWith('http');

      return (
        <a
          key={index}
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {label}
        </a>
      );
    }

    return token;
  });
}

function flushParagraph(paragraph: string[], key: string) {
  if (!paragraph.length) {
    return null;
  }

  return (
    <p key={key}>
      {renderInline(paragraph.join(' '))}
    </p>
  );
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const lines = content.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let codeLines: string[] = [];
  let codeFence = false;

  const flushList = (key: string) => {
    if (!listItems.length) {
      return;
    }

    blocks.push(
      <ul key={key}>
        {listItems.map((item, index) => (
          <li key={`${key}-${index}`}>{renderInline(item)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  const flushCode = (key: string) => {
    if (!codeLines.length) {
      return;
    }

    blocks.push(
      <pre key={key}>
        <code>{codeLines.join('\n')}</code>
      </pre>,
    );
    codeLines = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      blocks.push(flushParagraph(paragraph, `p-${index}`));
      paragraph = [];
      flushList(`list-${index}`);

      if (codeFence) {
        flushCode(`code-${index}`);
        codeFence = false;
      } else {
        codeFence = true;
      }
      return;
    }

    if (codeFence) {
      codeLines.push(line);
      return;
    }

    if (!trimmed) {
      blocks.push(flushParagraph(paragraph, `p-${index}`));
      paragraph = [];
      flushList(`list-${index}`);
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      blocks.push(flushParagraph(paragraph, `p-${index}`));
      paragraph = [];
      flushList(`list-${index}`);

      const [, hashes, value] = headingMatch;
      const level = hashes.length;
      const rendered = renderInline(value);

      if (level === 1) {
        blocks.push(<h1 key={`h1-${index}`}>{rendered}</h1>);
      } else if (level === 2) {
        blocks.push(<h2 key={`h2-${index}`}>{rendered}</h2>);
      } else if (level === 3) {
        blocks.push(<h3 key={`h3-${index}`}>{rendered}</h3>);
      } else {
        blocks.push(<h4 key={`h4-${index}`}>{rendered}</h4>);
      }
      return;
    }

    const listMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      blocks.push(flushParagraph(paragraph, `p-${index}`));
      paragraph = [];
      listItems.push(listMatch[1]);
      return;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      blocks.push(flushParagraph(paragraph, `p-${index}`));
      paragraph = [];
      listItems.push(orderedMatch[1]);
      return;
    }

    paragraph.push(trimmed);
  });

  blocks.push(flushParagraph(paragraph, 'p-final'));
  flushList('list-final');
  flushCode('code-final');

  return <div className={className}>{blocks.filter(Boolean)}</div>;
}
