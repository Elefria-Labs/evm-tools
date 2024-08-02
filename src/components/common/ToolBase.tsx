import React from 'react';

type ToolBaseProps = {
  title: string;
  isWalletRequired?: boolean;
  toolComponent: JSX.Element;
  category?: string;
  link?: string;
};

export default function ToolBase(props: ToolBaseProps) {
  return (
    <div className="max-w-[640px] lg:max-w-[1024px] mt-4">
      <div className="flex flex-row justify-center">
        <h1 className="mt-4 text-2xl font-bold">{props.title}</h1>
      </div>
      <hr className="my-3 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />
      {props.toolComponent}
    </div>
  );
}
