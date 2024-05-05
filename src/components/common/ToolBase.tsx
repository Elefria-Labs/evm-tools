import React from 'react';
import { Container } from '@chakra-ui/react';

type ToolBaseProps = {
  title: string;
  isWalletRequired?: boolean;
  toolComponent: JSX.Element;
};
export default function ToolBase(props: ToolBaseProps) {
  return (
    <Container maxW={'container.lg'} position="relative">
      <h1 className="mt-4 mb-4 font-bold text-lg">{props.title}</h1>
      {props.toolComponent}
    </Container>
  );
}
