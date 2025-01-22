import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const Logo = React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
  return (
    <SvgIcon ref={ref} viewBox="0 0 24 24" {...props}>
      {/* Soccer ball */}
      <circle
        cx="17"
        cy="15"
        r="2.5"
        fill="currentColor"
      />
      
      {/* Soccer ball pattern */}
      <path
        d="M17 13.2l1.2 0.7v1.4L17 16l-1.2-0.7v-1.4l1.2-0.7z
           M18.5 14.3l0.5 1-0.4 1h-1l-0.6-0.7 1.2-0.7
           M15.5 14.3l-0.5 1 0.4 1h1l0.6-0.7-1.2-0.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.3"
        strokeLinejoin="round"
        opacity="0.3"
      />

      {/* Octocat body */}
      <path
        d="M11 3c-3.5 0-6.5 2.5-6.5 6.5 0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38.1-.03.2-.05.3-.08"
        fill="currentColor"
      />

      {/* Octocat tentacle kicking ball */}
      <path
        d="M12.5 11c1.5 1 3 2.5 4.5 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Motion lines */}
      <path
        d="M19 14.5l1.5 0.5M19.2 15l1.5 0M19 15.5l1.5 -0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.3"
        strokeLinecap="round"
        opacity="0.5"
      />
    </SvgIcon>
  );
}); 