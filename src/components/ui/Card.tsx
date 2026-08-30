import React from 'react';

type CardProps = React.HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'section' | 'div';
};

export function Card({ as: Element = 'article', className = '', ...props }: CardProps) {
  return <Element className={`wr-card wr-card-default card-default ${className}`.trim()} {...props} />;
}
