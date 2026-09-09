import type { Award, Education, Experience, Project } from '@/lib/types';

/**
 * Lanes of the career density map.
 *
 * The lane split is the whole point of the component: a flat CV list hides
 * concurrency, and concurrency is the single most distinctive true fact in
 * this dataset — seven leadership roles were held alongside a degree, two
 * internships, freelance work and five competition wins.
 */
export const LANES = [
  { id: 'work', label: 'Work', color: 'var(--lane-work)' },
  { id: 'internship', label: 'Internships', color: 'var(--lane-internship)' },
  { id: 'leadership', label: 'Leadership', color: 'var(--lane-leadership)' },
  { id: 'recognition', label: 'Recognition', color: 'var(--lane-award)' },
] as const;

export type LaneId = (typeof LANES)[number]['id'];

export interface RecordItem {
  id: string;
  lane: LaneId;
  title: string;
  subtitle?: string;
  description?: string;
  /** Epoch ms. */
  start: number;
  /** Epoch ms. Equals `start` for point events such as an award. */
  end: number;
  isPresent: boolean;
  /** A point event renders as a diamond marker rather than a bar. */
  isPoint: boolean;
  href?: string;
  tags?: string[];
}

export interface RecordBand {
  id: string;
  label: string;
  start: number;
  end: number;
}

export interface RecordModel {
  items: RecordItem[];
  /** Education spans, drawn as a tinted band behind the lanes. */
  bands: RecordBand[];
  domainStart: number;
  domainEnd: number;
  years: number[];
}

function toMs(value: string | Date | null | undefined): number | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  const ms = date.getTime();
  return Number.isNaN(ms) ? null : ms;
}

const EXPERIENCE_LANE: Record<Experience['experienceType'], LaneId> = {
  WORK: 'work',
  // Freelance is professional delivery, so it belongs in the work lane rather
  // than a lane of its own — four lanes is already the readable maximum.
  FREELANCE: 'work',
  INTERNSHIP: 'internship',
  LEADERSHIP: 'leadership',
};

/**
 * Normalises four differently-shaped DB collections onto one time axis.
 *
 * `now` is passed in from the server rather than read from the clock here:
 * this model is built during both SSR and hydration, and a `Date.now()` on
 * each side would produce two different domains and a React hydration error.
 */
export function buildRecordModel({
  experience,
  awards,
  education,
  projects,
  now,
}: {
  experience: Experience[];
  awards: Award[];
  education: Education[];
  projects: Project[];
  now: number;
}): RecordModel {
  const items: RecordItem[] = [];

  for (const role of experience) {
    const start = toMs(role.startDate);
    if (start === null) continue;
    const end = role.isPresent ? now : (toMs(role.endDate) ?? start);

    items.push({
      id: `exp-${role.id}`,
      lane: EXPERIENCE_LANE[role.experienceType] ?? 'work',
      title: role.role,
      subtitle: role.company,
      description: role.description,
      start,
      end: Math.max(end, start),
      isPresent: role.isPresent,
      isPoint: false,
      tags: role.experienceType === 'FREELANCE' ? ['Freelance'] : undefined,
    });
  }

  /*
   * Awards carry only a year. Anchoring them at mid-year avoids implying a
   * precision the data does not have, and keeps a January-dated bar from
   * colliding visually with an award marker for the same year.
   */
  for (const award of awards) {
    const at = Date.UTC(award.year, 6, 1);
    items.push({
      id: `award-${award.id}`,
      lane: 'recognition',
      title: award.title,
      subtitle: award.issuer,
      description: award.description ?? undefined,
      start: at,
      end: at,
      isPresent: false,
      isPoint: true,
      href: award.url || undefined,
    });
  }

  /*
   * Projects have no authored dates, only `createdAt` — which is when the row
   * was entered into the CMS, not when the work happened. Presenting that as a
   * position on a career timeline would be a fabrication, so projects are
   * deliberately excluded from the axis and surfaced through their own
   * section instead.
   */
  void projects;

  const bands: RecordBand[] = [];
  for (const entry of education) {
    // Six of the nine education rows are certifications filed under the
    // Education table; they are point-in-time and would clutter the band.
    if (/certification/i.test(entry.degree)) continue;
    const start = toMs(entry.startDate);
    const end = toMs(entry.endDate) ?? now;
    if (start === null) continue;
    bands.push({
      id: `edu-${entry.id}`,
      label: `${entry.degree} · ${entry.institution}`,
      start,
      end: Math.max(end, start),
    });
  }

  const allStarts = [...items.map((i) => i.start), ...bands.map((b) => b.start)];
  const allEnds = [...items.map((i) => i.end), ...bands.map((b) => b.end)];

  // A sane fallback domain keeps the axis renderable when the DB is empty.
  const rawStart = allStarts.length ? Math.min(...allStarts) : now - 4 * 365 * 864e5;
  const rawEnd = allEnds.length ? Math.max(...allEnds, now) : now;

  // Snap outward to whole years so the gridlines land on round labels.
  const domainStart = Date.UTC(new Date(rawStart).getUTCFullYear(), 0, 1);
  const domainEnd = Date.UTC(new Date(rawEnd).getUTCFullYear() + 1, 0, 1);

  const years: number[] = [];
  for (
    let y = new Date(domainStart).getUTCFullYear();
    y <= new Date(domainEnd).getUTCFullYear();
    y++
  ) {
    years.push(y);
  }

  items.sort((a, b) => a.start - b.start);

  return { items, bands, domainStart, domainEnd, years };
}

/** Fraction 0–1 of a timestamp's position across the domain. */
export function positionOf(ms: number, start: number, end: number): number {
  if (end <= start) return 0;
  return Math.min(1, Math.max(0, (ms - start) / (end - start)));
}

/** Items active at a given instant — the concurrency readout. */
export function activeAt(items: RecordItem[], ms: number): RecordItem[] {
  return items.filter((item) =>
    item.isPoint
      ? // A point event counts as "active" for the month around it, so the
        // playhead can actually land on one.
        Math.abs(item.start - ms) < 45 * 864e5
      : ms >= item.start && ms <= item.end,
  );
}
