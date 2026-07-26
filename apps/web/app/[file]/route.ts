import { NextResponse } from 'next/server';

/**
 * IndexNow key verification file.
 * IndexNow (used by Bing, Copilot/Bing Chat, Yandex) requires a plain-text
 * file at https://<domain>/<key>.txt containing exactly the key, before it
 * will accept submissions signed with that key.
 *
 * The key itself lives in the INDEXNOW_KEY env var, so the file name is
 * dynamic here — any request matching "<INDEXNOW_KEY>.txt" at the site root
 * returns the key; everything else 404s.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const key = process.env.INDEXNOW_KEY;
  const { file } = await params;

  if (!key || file !== `${key}.txt`) {
    return new NextResponse('Not found', { status: 404 });
  }

  return new NextResponse(key, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
