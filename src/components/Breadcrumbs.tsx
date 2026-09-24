import React from 'react';
import { Link } from './Link';

export interface Crumb {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-8 border-b border-white/[0.06] bg-[#0E0E18]/50 text-xs">
      <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-2 text-[#A1A1B5]">
        <Link to="/" className="hover:text-white transition-colors">
          Home
        </Link>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={item.url}>
              <span className="text-white/20 select-none">/</span>
              {isLast ? (
                <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link to={item.url} className="hover:text-white transition-colors">
                  {item.name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
