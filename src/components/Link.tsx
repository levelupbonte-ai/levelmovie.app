import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
}

export const Link: React.FC<LinkProps> = ({ to, href, children, ...props }) => {
  return (
    <a href={to || href} {...props}>
      {children}
    </a>
  );
};

export default Link;
