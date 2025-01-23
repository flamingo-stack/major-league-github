import React from 'react';
import { Box, BoxProps } from '@mui/material';
// @ts-ignore
import logoUrl from '../assets/logo.svg';

export const Logo = React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  return (
    <Box
      ref={ref}
      component="img"
      src={logoUrl}
      alt="Major League Github"
      sx={{
        width: 24,
        height: 24,
        display: 'block',
        filter: theme => theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
      }}
      {...props}
    />
  );
}); 