import React from 'react';

type ToolBaseProps = {
  title: string;
  isWalletRequired?: boolean;
  toolComponent: JSX.Element;
};
export default function ToolBase(props: ToolBaseProps) {
  return (
    <div className="max-w-1024">
      <h1 className="mt-4 mb-4 font-bold text-lg">{props.title}</h1>
      {props.toolComponent}
    </div>
  );
}
