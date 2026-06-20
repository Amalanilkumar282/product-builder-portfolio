import type { ComponentProps } from 'react';

type IconProps = ComponentProps<'svg'>;

function BaseIcon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function GitHubIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 19c-4.5 1.4-4.5-2.5-6-3m12 6v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6.2a4.8 4.8 0 0 0-1.3-3.3A4.5 4.5 0 0 0 18.6 4S17.5 3.7 15 5.3a13.4 13.4 0 0 0-6 0C6.5 3.7 5.4 4 5.4 4a4.5 4.5 0 0 0-.1 3 4.8 4.8 0 0 0-1.3 3.3c0 4.8 2.7 5.9 5.5 6.2-.6.6-.6 1-.5 2V22" />
    </BaseIcon>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7" />
      <path d="M8 7h.01" />
      <path d="M12 17v-4a2 2 0 1 1 4 0v4" />
      <path d="M12 10v7" />
    </BaseIcon>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </BaseIcon>
  );
}

export function XIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 4l16 16" />
      <path d="M20 4L8.5 15.5" />
      <path d="M9.5 8.5L4 20" />
    </BaseIcon>
  );
}
