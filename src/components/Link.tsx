import React from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  children?: React.ReactNode;
}

/**
 * Plain HTML link supporting full browser document navigation.
 * Pure anchor element without client-side interception.
 */
export const Link: React.FC<LinkProps> = ({ to, href, children, ...props }) => {
  const target = to || href || '';
  return (
    <a href={target} {...props}>
      {children}
    </a>
  );
};

export default Link;
