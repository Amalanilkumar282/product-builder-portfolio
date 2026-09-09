'use client';

import { useId, useRef, useState } from 'react';
import Image from 'next/image';
import { uploadApi, type UploadTarget } from '@/lib/admin-api';

interface FileUploadProps {
  /** Where the file belongs. Drives validation and the DB column written. */
  target: UploadTarget;
  /** Omit for the `unattached_*` targets. */
  entityId?: string;
  label?: string;
  currentUrl?: string;
  onUploadSuccess?: (url: string) => void;
  /** PDF instead of an image — used for the résumé. */
  kind?: 'image' | 'document';
}

const MAX_IMAGE_MB = 10;
const MAX_DOC_MB = 8;

/**
 * Admin file upload for both images and PDFs.
 *
 * Kept at the original filename so existing admin imports keep resolving, but
 * it is no longer image-only: passing `kind="document"` accepts a PDF, which is
 * how a résumé is uploaded to Cloudinary and written to `Profile.resumeUrl`.
 */
export default function ImageUpload({
  target,
  entityId,
  label,
  currentUrl,
  onUploadSuccess,
  kind = 'image',
}: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(currentUrl ?? null);
  const [fileName, setFileName] = useState<string | null>(null);

  const accept = kind === 'document' ? 'application/pdf' : 'image/*';
  const maxMb = kind === 'document' ? MAX_DOC_MB : MAX_IMAGE_MB;

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (kind === 'document' && file.type !== 'application/pdf') {
      setError('Please choose a PDF file.');
      return;
    }
    if (kind === 'image' && !file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > maxMb * 1024 * 1024) {
      setError(`File must be smaller than ${maxMb} MB.`);
      return;
    }

    setUploading(true);
    try {
      const result = await uploadApi.upload(file, target, entityId);
      setUrl(result.url);
      setFileName(file.name);
      onUploadSuccess?.(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      // Reset so re-picking the same file still fires a change event.
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="meta mb-1.5 block uppercase tracking-[0.14em]">
          {label}
        </label>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {kind === 'image' && url && (
          <Image
            src={url}
            alt=""
            width={56}
            height={56}
            className="size-14 rounded-md border border-rule object-cover"
          />
        )}

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={uploading}
          className="block w-full max-w-sm text-sm text-ink-dim file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-md file:border file:border-rule-strong file:bg-raised file:px-3 file:text-sm file:text-ink hover:file:border-verdigris"
        />
      </div>

      <p role="status" aria-live="polite" className="meta mt-2">
        {uploading
          ? 'Uploading…'
          : error
            ? ''
            : url
              ? kind === 'document'
                ? `Uploaded${fileName ? `: ${fileName}` : ''}`
                : 'Uploaded'
              : `PNG, JPG, WebP or SVG up to ${maxMb} MB`}
      </p>

      {kind === 'document' && url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex min-h-11 items-center text-sm text-verdigris underline underline-offset-4"
        >
          View current file
        </a>
      )}

      {error && (
        <p role="alert" className="mt-1 text-sm text-critical">
          {error}
        </p>
      )}
    </div>
  );
}
