import React from 'react';

/**
 * e-Devlet Kapısı crescent-and-star orbital swirl emblem.
 */
export default function EDevletLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer tilted orbital swirl */}
      <ellipse
        cx="32"
        cy="22"
        rx="27"
        ry="14.5"
        transform="rotate(-14 32 22)"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeDasharray="112 18"
        strokeLinecap="round"
      />
      {/* Inner tilted orbital swirl */}
      <ellipse
        cx="32.5"
        cy="22.5"
        rx="21.5"
        ry="10.8"
        transform="rotate(-14 32.5 22.5)"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="82 14"
        strokeLinecap="round"
        opacity="0.88"
      />
      {/* Crescent */}
      <path
        d="M31.8 14.3C26.9 14.3 23 17.8 23 22.2C23 26.6 26.9 30.1 31.8 30.1C34.2 30.1 36.4 29.2 38 27.7C36.9 28.1 35.7 28.4 34.4 28.4C30.4 28.4 27.1 25.6 27.1 22.2C27.1 18.8 30.4 16 34.4 16C35.7 16 36.9 16.3 38 16.7C36.4 15.2 34.2 14.3 31.8 14.3Z"
        fill="currentColor"
      />
      {/* Star */}
      <path
        d="M39.5 18.4L40.6 21.1L43.5 21.3L41.2 23.1L42 25.9L39.5 24.3L37 25.9L37.8 23.1L35.5 21.3L38.4 21.1L39.5 18.4Z"
        fill="currentColor"
      />
    </svg>
  );
}
