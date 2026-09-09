'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { cn, formatDateRange, formatDuration, monthsBetween } from '@/lib/utils';
import { Chip } from '@/components/ui/primitives';
import {
  LANES,
  activeAt,
  buildRecordModel,
  positionOf,
  type LaneId,
  type RecordItem,
} from './record-data';
import type { Award, Education, Experience, Project } from '@/lib/types';

const ROW_H = 34; // px per packed sub-row on the desktop track
const PACK_GAP_MS = 20 * 864e5; // visual breathing room between bars in a row
const POINT_SPAN_MS = 60 * 864e5; // nominal width a point event occupies when packing

interface TheRecordProps {
  experience: Experience[];
  awards: Award[];
  education: Education[];
  projects: Project[];
}

/**
 * Greedy interval packing: assigns each item the first sub-row whose last
 * occupant has already ended. Without this, concurrent roles — which is
 * precisely what this component exists to show — would draw on top of one
 * another.
 */
function packLane(items: RecordItem[]) {
  const rowEnds: number[] = [];
  const rowOf = new Map<string, number>();

  for (const item of items) {
    const span = item.isPoint ? POINT_SPAN_MS : 0;
    const start = item.start - span / 2;
    const end = item.end + span / 2;

    let row = rowEnds.findIndex((endsAt) => start > endsAt + PACK_GAP_MS);
    if (row === -1) {
      rowEnds.push(end);
      row = rowEnds.length - 1;
    } else {
      rowEnds[row] = end;
    }
    rowOf.set(item.id, row);
  }

  return { rowOf, rowCount: Math.max(1, rowEnds.length) };
}

export default function TheRecord({
  experience,
  awards,
  education,
  projects,
}: TheRecordProps) {
  /*
   * "Now" is derived from the data for the server render and only refined to
   * the real clock after mount.
   *
   * Reading the clock during render would make this component impure and, more
   * concretely, would bake the build timestamp into the prerendered HTML while
   * the client computed a different one — a hydration mismatch on every visit.
   * The latest date present in the records is a deterministic stand-in, and
   * because the axis snaps outward to whole years the two agree visually.
   */
  const dataLatest = useMemo(() => {
    const stamps = [
      ...experience.map((role) => Date.parse(role.endDate ?? role.startDate)),
      ...experience.map((role) => Date.parse(role.startDate)),
      ...education.map((item) => Date.parse(item.endDate ?? item.startDate)),
      ...awards.map((award) => Date.UTC(award.year, 11, 31)),
    ].filter((value) => Number.isFinite(value));
    return stamps.length ? Math.max(...stamps) : 0;
  }, [experience, education, awards]);

  const [now, setNow] = useState(dataLatest);

  // After hydration the real clock is safe to use: an in-progress role should
  // extend to today, not to whenever the page was last built.
  useEffect(() => {
    setNow(Date.now());
  }, []);

  const model = useMemo(
    () => buildRecordModel({ experience, awards, education, projects, now }),
    [experience, awards, education, projects, now],
  );

  const [activeLanes, setActiveLanes] = useState<Set<LaneId>>(
    () => new Set(LANES.map((l) => l.id)),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scrub, setScrub] = useState(1000); // 0–1000 across the domain
  const sliderId = useId();

  const { domainStart, domainEnd, years, items, bands } = model;

  const visibleItems = useMemo(
    () => items.filter((item) => activeLanes.has(item.lane)),
    [items, activeLanes],
  );

  const scrubMs = domainStart + ((domainEnd - domainStart) * scrub) / 1000;
  const concurrent = useMemo(
    () => activeAt(visibleItems, scrubMs),
    [visibleItems, scrubMs],
  );

  /** The headline fact: the busiest the record ever got, and when. */
  const peak = useMemo(() => {
    let best = { count: 0, at: domainStart };
    // Sampling at every item boundary is exact — concurrency can only change
    // where an item starts or ends.
    for (const item of items) {
      for (const at of [item.start, item.end]) {
        const count = activeAt(items, at).length;
        if (count > best.count) best = { count, at };
      }
    }
    return best;
  }, [items, domainStart]);

  const lanesWithItems = useMemo(
    () =>
      LANES.map((lane) => {
        const laneItems = items.filter((item) => item.lane === lane.id);
        return { ...lane, items: laneItems, ...packLane(laneItems) };
      }).filter((lane) => lane.items.length > 0),
    [items],
  );

  const selected = items.find((item) => item.id === selectedId) ?? null;

  function toggleLane(id: LaneId) {
    setActiveLanes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        // Never let the last lane be switched off — an empty axis is a dead
        // end with no affordance to recover from.
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  if (items.length === 0) return null;

  const scrubLabel = new Date(scrubMs).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <div className="mt-2">
      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter the record by lane">
          {LANES.map((lane) => {
            const on = activeLanes.has(lane.id);
            const count = items.filter((i) => i.lane === lane.id).length;
            if (count === 0) return null;
            return (
              <button
                key={lane.id}
                type="button"
                onClick={() => toggleLane(lane.id)}
                aria-pressed={on}
                className={cn(
                  'inline-flex min-h-11 items-center gap-2 rounded-md border px-3 font-mono text-2xs transition-colors',
                  on
                    ? 'border-rule-strong bg-raised text-ink'
                    : 'border-rule text-ink-faint hover:text-ink-dim',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn('size-2 rounded-xs transition-opacity', !on && 'opacity-30')}
                  style={{ background: lane.color }}
                />
                {lane.label}
                <span className="text-ink-faint">{count}</span>
              </button>
            );
          })}
        </div>

        <p className="meta">
          Peak{' '}
          <span className="text-copper">{peak.count} concurrent</span>{' '}
          in {new Date(peak.at).getUTCFullYear()}
        </p>
      </div>

      {/* ── Desktop track ────────────────────────────────────────────────────
          Hidden below lg, where the vertical layout below takes over. Both
          read from the same `items`, so there is no duplicated content: the
          desktop track and the mobile list are two presentations of one list,
          each hidden from assistive tech when it is not the active layout. */}
      <div className="mt-6 hidden lg:block" aria-hidden="true">
        <div className="relative rounded-lg border border-rule bg-surface p-4 pt-8">
          {/* Year gridlines + labels */}
          <div className="pointer-events-none absolute inset-x-4 inset-y-0">
            {years.map((year) => {
              const left = positionOf(Date.UTC(year, 0, 1), domainStart, domainEnd) * 100;
              return (
                <div
                  key={year}
                  className="absolute inset-y-0 border-l border-rule/70"
                  style={{ left: `${left}%` }}
                >
                  <span className="absolute -top-0.5 left-1.5 font-mono text-2xs text-ink-faint">
                    {year}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Education band, drawn behind the lanes */}
          {bands.map((band) => {
            const left = positionOf(band.start, domainStart, domainEnd) * 100;
            const width =
              (positionOf(band.end, domainStart, domainEnd) -
                positionOf(band.start, domainStart, domainEnd)) *
              100;
            return (
              <div
                key={band.id}
                className="pointer-events-none absolute inset-y-6 rounded-sm bg-verdigris-soft"
                style={{ left: `calc(1rem + ${left}%)`, width: `${width}%` }}
              >
                <span className="absolute bottom-1 left-2 font-mono text-2xs text-ink-faint">
                  {band.label}
                </span>
              </div>
            );
          })}

          {/* Playhead */}
          <div
            className="pointer-events-none absolute inset-y-6 z-20 w-px bg-copper"
            style={{ left: `calc(1rem + ${(scrub / 1000) * 100}%)` }}
          >
            <span className="absolute -top-6 -translate-x-1/2 whitespace-nowrap rounded-xs bg-copper px-1.5 py-0.5 font-mono text-2xs text-canvas">
              {scrubLabel}
            </span>
          </div>

          {/* Lanes */}
          <div className="relative space-y-3">
            {lanesWithItems.map((lane) => {
              const dimmed = !activeLanes.has(lane.id);
              return (
                <div
                  key={lane.id}
                  className={cn('relative transition-opacity', dimmed && 'opacity-20')}
                  style={{ height: lane.rowCount * ROW_H }}
                >
                  {lane.items.map((item) => {
                    const left = positionOf(item.start, domainStart, domainEnd) * 100;
                    const rawWidth =
                      (positionOf(item.end, domainStart, domainEnd) -
                        positionOf(item.start, domainStart, domainEnd)) *
                      100;
                    const top = (lane.rowOf.get(item.id) ?? 0) * ROW_H;

                    if (item.isPoint) {
                      return (
                        <span
                          key={item.id}
                          className={cn(
                            'absolute flex size-6 -translate-x-1/2 rotate-45 items-center justify-center rounded-xs border',
                            selectedId === item.id
                              ? 'border-copper bg-copper'
                              : 'border-copper/60 bg-copper-soft',
                          )}
                          style={{ left: `${left}%`, top: top + 2 }}
                        />
                      );
                    }

                    return (
                      <span
                        key={item.id}
                        className={cn(
                          'absolute flex items-center overflow-hidden rounded-sm border px-2',
                          selectedId === item.id
                            ? 'border-ink bg-raised'
                            : 'border-rule-strong bg-raised',
                        )}
                        style={{
                          left: `${left}%`,
                          width: `max(0.5rem, ${rawWidth}%)`,
                          top,
                          height: ROW_H - 8,
                          borderLeftColor: lane.color,
                          borderLeftWidth: 2,
                        }}
                      >
                        <span className="truncate font-mono text-2xs text-ink-dim">
                          {item.title}
                        </span>
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* The scrubber is a real range input: it gets keyboard operation,
            a native thumb target and screen-reader semantics for free. */}
        <div className="mt-3 flex items-center gap-3">
          <label htmlFor={sliderId} className="meta shrink-0 uppercase tracking-[0.14em]">
            Scrub
          </label>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={1000}
            value={scrub}
            onChange={(event) => setScrub(Number(event.target.value))}
            aria-valuetext={`${scrubLabel}: ${concurrent.length} concurrent ${
              concurrent.length === 1 ? 'commitment' : 'commitments'
            }`}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-rule accent-copper"
          />
          <output
            htmlFor={sliderId}
            className="shrink-0 font-mono text-2xs text-ink-dim tabular"
            aria-live="polite"
          >
            {concurrent.length} active
          </output>
        </div>

        {/* Buttons live outside the aria-hidden track so the desktop view is
            still fully operable by keyboard and screen reader. */}
        <ul className="sr-only">
          {visibleItems.map((item) => (
            <li key={item.id}>
              {item.title}
              {item.subtitle ? `, ${item.subtitle}` : ''},{' '}
              {formatDateRange(new Date(item.start), new Date(item.end), item.isPresent)}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Record list ──────────────────────────────────────────────────────
          The primary layout on touch, and the accessible representation
          everywhere. A horizontal scrub is unusable at 390px, so the axis
          becomes the scroll axis and each entry is a full-width disclosure —
          a first-class layout rather than a squeezed desktop port. */}
      <div className="mt-6 space-y-6 lg:mt-8">
        {lanesWithItems
          .filter((lane) => activeLanes.has(lane.id))
          .map((lane) => (
            <div key={lane.id}>
              <h3 className="meta flex items-center gap-2 uppercase tracking-[0.14em]">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-xs"
                  style={{ background: lane.color }}
                />
                {lane.label}
              </h3>

              <ul className="mt-2 divide-y divide-rule border-t border-rule">
                {lane.items.map((item) => {
                  const open = selectedId === item.id;
                  const months = item.isPoint ? 0 : monthsBetween(item.start, item.end);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(open ? null : item.id)}
                        aria-expanded={open}
                        aria-controls={`${item.id}-detail`}
                        className="flex w-full items-baseline gap-3 py-3 text-left transition-colors hover:bg-raised"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-3 w-0.5 shrink-0 self-start"
                          style={{ background: lane.color }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-ink">
                            {item.title}
                          </span>
                          {item.subtitle && (
                            <span className="block text-sm text-ink-dim">{item.subtitle}</span>
                          )}
                        </span>
                        <span className="meta shrink-0 text-right">
                          {item.isPoint
                            ? new Date(item.start).getUTCFullYear()
                            : formatDateRange(
                                new Date(item.start),
                                new Date(item.end),
                                item.isPresent,
                              )}
                          {months > 1 && (
                            <span className="block text-ink-faint">
                              {formatDuration(months)}
                            </span>
                          )}
                        </span>
                      </button>

                      {open && item.description && (
                        <div id={`${item.id}-detail`} className="pb-4 pl-[calc(0.5rem+0.75rem)]">
                          <p className="measure text-sm text-ink-dim">{item.description}</p>
                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {item.tags.map((tag) => (
                                <Chip key={tag}>{tag}</Chip>
                              ))}
                            </div>
                          )}
                          {item.href && (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block text-sm text-verdigris underline underline-offset-4"
                            >
                              View credential
                            </a>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
      </div>

      {selected && (
        <p className="sr-only" aria-live="polite">
          {selected.title} expanded.
        </p>
      )}
    </div>
  );
}
