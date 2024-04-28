// exchange-page-uni-info.tsx

import React from 'react';

export function HeaderString({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <h1 className={className}>{children}</h1>
  );
}
