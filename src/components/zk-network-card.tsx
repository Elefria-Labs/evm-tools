import {
  CardTitle,
  CardContent,
  Card,
  CardFooter,
  CardHeader,
} from '@shadcn-components/ui/card';
import { Button } from '@shadcn-components/ui/button';
import { BlockchainNetwork } from '@types';
import { CardStackPlusIcon } from '@radix-ui/react-icons';

type ZkNetworkCardType = {
  onClickAdd: (network: number | undefined) => void;
  blockchainNetwork: BlockchainNetwork;
};
export function ZkNetworkCard(props: ZkNetworkCardType) {
  const { onClickAdd, blockchainNetwork } = props;
  return (
    <Card className="h-[254px] min-w-[325px]">
      <CardHeader>
        <CardTitle> {blockchainNetwork.name}</CardTitle>
      </CardHeader>
      <CardContent className="font-thin min-h-[72px]">
        <p>{`Name: ${blockchainNetwork.name}`}</p>
        <p>{`Chain Id: ${blockchainNetwork.chainId}`}</p>
        <p>{`Currency: ${blockchainNetwork.nativeCurrency?.name} (${blockchainNetwork.nativeCurrency?.symbol})`}</p>
        <p>{`Decimals: ${blockchainNetwork.nativeCurrency?.decimals}`}</p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onClickAdd(blockchainNetwork.networkId)}
        >
          Add Network &nbsp;
          <CardStackPlusIcon className="mr-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
