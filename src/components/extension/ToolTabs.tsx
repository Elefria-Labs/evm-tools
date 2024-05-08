import React, { useState } from 'react';
import { playgroundToolsList } from '@data/playground';
import BurnerWalletComponent from '@components/tools/evmtools/BurnerWalletComponent';
import EvmAddressChecksumComponent from '@components/tools/evmtools/EVMAddressChecksumComponent';
import MerkleTreeVerifier from '@components/tools/evmtools/MerkleTreeVerifier';
import StringByteConversion from '@components/tools/evmtools/StringByteConversion';
import TxDecoderComponent from '@components/tools/evmtools/TxDecoderComponent';
import { Links } from '@config/constants';
import GasConvertorComponent from '@components/tools/evmtools/GasConvertorComponent';
import CheatsheetComponent from '@components/tools/evmtools/CheatsheetComponent';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shadcn-components/ui/tabs';

// type ToolTabsProps = {
//   toolNameSearchQuery?: string;
// };

function RenderToolTabPanel(link: string) {
  let component = <>Not Found</>;
  switch (link) {
    case Links.txDecoder:
      component = <TxDecoderComponent />;
      break;
    case Links.byteconversion:
      component = <StringByteConversion />;
      break;
    case Links.merkleTreeGenerator:
      component = <MerkleTreeVerifier />;
      break;
    case Links.evmChecksumAddress:
      component = <EvmAddressChecksumComponent />;
      break;
    case Links.burnerWallet:
      component = <BurnerWalletComponent />;
      break;
    case Links.gasConverter:
      component = <GasConvertorComponent />;
      break;
    case Links.cheatsheet:
      component = <CheatsheetComponent />;
      break;
  }
  return (
    <TabsContent
      value={link}
      className=" h-[472px] pb-4 overflow-y-auto overflow-x-hidden"
      key={link}
    >
      {component}
    </TabsContent>
  );
}
export default function ToolTabs() {
  const [toolTabs] = useState(
    playgroundToolsList.filter((t) => t?.isWalletRequired == false),
  );

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Tabs defaultValue="account">
        <TabsList className="w-[464px] overflow-x-scroll">
          {toolTabs.map((t) => (
            <TabsTrigger key={t.link} value={t.link}>
              {t.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {/* //height: `472px`, // -${56}px -${70}px */}
        <div>{toolTabs.map((t) => RenderToolTabPanel(t.link))}</div>
      </Tabs>
    </div>
  );
}
