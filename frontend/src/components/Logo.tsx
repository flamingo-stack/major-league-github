import React from 'react';
import { MlgLogo } from '@flamingo/ui-kit/components/icons';

export const Logo = React.forwardRef<SVGSVGElement, React.ComponentProps<typeof MlgLogo>>((props, ref) => {
  return (
    <MlgLogo ref={ref} {...props} />
  );
});
