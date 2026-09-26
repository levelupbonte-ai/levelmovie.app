import React from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  children?: React.ReactNode;
}

/**
 * Universal Link component triggering standard native document navigation
 * for optimal MPA multi-page caching, full page reload markers, and zero client router traps.
 */
export const Link: React.FC<LinkProps> = ({ to, href, children, onClick, ...props }) => {
  const target = to || href || '';

  return (
    <a href={target} onClick={onClick} {...props}>
      {children}
    </a>
  );
};

export default Link;
