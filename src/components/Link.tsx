import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
}

export const Link: React.FC<LinkProps> = ({ to, href, children, onClick, ...props }) => {
  const target = to || href || '';
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    const isExternal =
      target.startsWith('http') ||
      target.startsWith('mailto:') ||
      target.startsWith('tel:') ||
      target.startsWith('#') ||
      props.target === '_blank';

    if (
      !e.defaultPrevented &&
      !isExternal &&
      target &&
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey
    ) {
      e.preventDefault();
      const bar = document.getElementById('page-progress-bar');
      if (bar) {
        bar.style.width = '0%';
        bar.classList.remove('finish');
        bar.classList.add('active');
        void bar.offsetWidth;
        bar.classList.add('loading');
      }
      navigate(target);
    }
  };

  return (
    <a href={target} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default Link;
