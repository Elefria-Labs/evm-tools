import React from 'react';

type PageWrapperProps = {
  children: React.ReactNode;
};

export function PageWrapper(props: PageWrapperProps) {
  const { children } = props;

  return <div className="w-full min-h-screen">{children}</div>;
}
