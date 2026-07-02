import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8 w-8" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} transition-all duration-300 fill-current text-neutral-900 dark:text-white`}
      xmlns="http://www.w3.org/2000/svg"
      id="verve-custom-logo"
    >
      <defs>
        {/* Mask to create the precise negative space gap around the diagonal cut */}
        <mask id="logo-cut-mask">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          {/* Slicing line in black to subtract from the V arms */}
          <line
            x1="22"
            y1="92"
            x2="78"
            y2="8"
            stroke="black"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </mask>
      </defs>

      {/* Masked V element */}
      <g mask="url(#logo-cut-mask)">
        {/* Left bold arm */}
        <polygon points="16,28 36,28 50,72 30,72" />
        {/* Right bold arm */}
        <polygon points="64,28 84,28 70,72 50,72" />
      </g>

      {/* Crisp, clear diagonal line drawn on top */}
      <line
        x1="22"
        y1="92"
        x2="78"
        y2="8"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
