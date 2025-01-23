import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import LogoSvg from '../assets/logo.svg';

export const Logo = React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
  return (
    <SvgIcon ref={ref} component={LogoSvg} inheritViewBox {...props} />
  );
}); 