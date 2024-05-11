import { Button, Image } from '@chakra-ui/react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@shadcn-components/ui/menubar';
import { Links, evmToolsXLink } from '@config/constants';
import Link from 'next/link';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shadcn-components/ui/dropdown-menu';
import { ExternalLinkIcon, MinusIcon } from '@chakra-ui/icons';
import { TwitterIcon } from './icon/twitter';

type MenuLinkProps = {
  text: string;
  link: string;
  newTab?: boolean;
};

function MenuLink(props: MenuLinkProps) {
  const { text, link, newTab = false } = props;

  return (
    <Link href={link} target={newTab ? '_blank' : '_self'}>
      <MenubarItem>{text}</MenubarItem>
    </Link>
  );
}
const menuLinks = [
  {
    title: 'Home',
    link: Links.home,
  },
  {
    title: 'Storage Reader',
    link: Links.evmTools,
    newTab: true,
  },
  // {
  //   title: 'ZK Tools',
  //   link: Links.zkTools,
  // },
  {
    title: 'ZK Networks',
    link: Links.zkChains,
  },
  {
    title: 'Learn',
    link: Links.blog,
  },
  {
    title: 'Contribute',
    link: Links.contribute,
  },
  // {
  //   title: 'Subscribe',
  //   link: Links.subscribe,
  // },
];
function DesktopMenuLinks() {
  return (
    <div className="flex flex-row items-center">
      <Menubar>
        {menuLinks.map((m, i) => (
          <MenubarMenu key={i}>
            <Link href={m.link} target={m?.newTab ? '_blank' : '_self'}>
              <MenubarTrigger className="cursor-pointer">
                {m.title}
              </MenubarTrigger>
            </Link>
          </MenubarMenu>
        ))}

        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer">EVM Tools</MenubarTrigger>
          <MenubarContent>
            <MenuLink text={'View all'} link={Links.devTools} />
            <MenuLink text={'EVM Visualizer'} link={Links.evmTools} />
            <MenuLink text={'EIP-712'} link={`/${Links.eip712}`} />
            <MenuLink text={'ERC-191'} link={`/${Links.erc191}`} />
            <MenuLink
              text={'Checksum Address'}
              link={`/${Links.evmChecksumAddress}`}
            />
            <MenuLink text={'Tx Decoder'} link={`/${Links.txDecoder}`} />
            <MenuLink text={'Gas Converter'} link={`/${Links.gasConverter}`} />
            <MenuLink text={'Burner Wallet'} link={`/${Links.burnerWallet}`} />
            <MenuLink
              text={'Merkle Tree Generator'}
              link={`/${Links.merkleTreeGenerator}`}
            />

            <MenuLink
              text={'Bytes32 Conversion'}
              link={`/${Links.byteconversion}`}
            />
            <MenuLink
              text={'Deterministic Address'}
              link={`/${Links.contractAddressGen}`}
            />
          </MenubarContent>
        </MenubarMenu>
        {/* <MenubarMenu></MenubarMenu> */}
      </Menubar>
      <Link className="ml-2" href={Links.subscribe} target={'_self'}>
        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Subscribe
          </span>
        </button>
        {/* <MenubarTrigger className="cursor-pointer">
                {m.title}
              </MenubarTrigger> */}
      </Link>
    </div>
  );
}

function MobileMenuLinks() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* <HamburgerMenuIcon color="red" onClick={() => setIsOpen(true)} /> */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <HamburgerMenuIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="cursor-pointer">
            <Link href={Links.home}>Home</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Link href={Links.zkTools}>Zk Tools</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Link href={Links.boilerplate}>Boilerplate</Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <Link href={Links.contribute}>Contribute</Link>
          </DropdownMenuItem>

          <DropdownMenuLabel>EVM Tools</DropdownMenuLabel>
          <a href="http://evmtools.xyz?ref=ext" target="_blank">
            <DropdownMenuItem className="cursor-pointer">
              EVM Storage Reader
              <span className="ml-2">
                <ExternalLinkIcon />
              </span>
            </DropdownMenuItem>
          </a>
          <DropdownMenuItem>
            <MinusIcon className="h-4 w-4" />
            <span className="sr-only"> Request Feature</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <a href={evmToolsXLink} target="_blank">
            <DropdownMenuItem className="cursor-pointer">
              <p className="mr-2">Follow</p>{' '}
              <TwitterIcon className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
          </a>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* {isOpen && (
        <div
          className="flex flex-col content-center justify-center left-0 right-0 bottom-0 top-0 z-999"
          // left={0}
          // right={0}
          // bottom={0}
          // top={0}

          // spacing="12px"
          // zIndex={999}
        >
          <Link href={Links.home}>Home</Link>
          <Link href={Links.zkTools}>Zk Tools</Link>
          <Link href={Links.boilerplate}>Boilerplate</Link>
          <Link href={Links.blog} target="_blank">
            Learn
          </Link>
          <Link href={Links.zkChains}>Zk Chains</Link>
          <Link href={Links.subscribe}>Subscribe</Link>
          
          <Link href={Links.contribute}>Contribute</Link>
          <CloseButton
            onClick={() => setIsOpen(false)}
            pos="fixed"
            top="40px"
            right="15px"
            size="lg"
          />
        </div>
      )} */}
    </>
  );
}

export function GlobalHeader() {
  return (
    <div className="min-w-[375px] p-4 flex flex-row justify-center">
      <div className="flex flex-row justify-between items-center w-full md:w-[1024px] lg:w-[1024px]">
        <Link href={Links.home}>
          <div className="flex flex-row items-center">
            <Image
              alt=""
              h="60px"
              w="60px"
              src="../assets/images/evm-tools-logo-2.svg"
              mr="10px"
            />
            <span>evmtools</span>
          </div>
        </Link>
        <div className="invisible sm:visible md:visible lg:visible">
          <DesktopMenuLinks />
        </div>
      </div>
      <div className="sm:invisible md:invisible lg:invisible">
        <MobileMenuLinks />
      </div>
    </div>
  );
}
