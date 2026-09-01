import React from 'react';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'default' | 'dark';
}

export function Tag({ tone = 'default', className = '', ...props }: TagProps) {
  return <span className={`wr-tag wr-tag--${tone} ${className}`.trim()} {...props} />;
}
