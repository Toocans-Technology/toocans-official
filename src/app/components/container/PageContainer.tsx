'use client';

import { ReactNode } from 'react';

type Props = {
  description?: string;
  children: ReactNode;
  title?: string;
};

const PageContainer = ({ title, description, children }: Props) => {
  return (
    <div className="page-container">
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {children}
    </div>
  );
};

export default PageContainer;
