import Image from 'next/image';
import { HamburgerMenuIcon, ExternalLinkIcon } from '@radix-ui/react-icons';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@shadcn-components/ui/menubar';
import { Links, evmToolsXLink } from '@config/constants';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shadcn-components/ui/dropdown-menu';

import { TwitterIcon } from './icon/twitter';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Badge } from '@shadcn-components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shadcn-components/ui/tooltip';

type MenuLinkProps = {
  text: string;
  link: string;
  newTab?: boolean;
  badgeText?: string;
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
  // {
  //   title: 'Home',
  //   link: Links.home,
  // },

  // {
  //   title: 'ZK Tools',
  //   link: Links.zkTools,
  // },
  {
    title: 'ZK Networks',
    link: Links.zkChains,
  },
  {
    title: 'Storage Reader',
    link: Links.evmTools,
    newTab: true,
    disabled: true,
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
// TODO
function DesktopMenuLink(props: {
  link: {
    title: string;
    link: string;
    newTab?: boolean;
    badgeText?: string;
    disabled?: boolean;
  };
}) {
  const { link } = props;
  return (
    <MenubarMenu>
      {link?.disabled ? (
        <MenubarTrigger
          disabled={link?.disabled}
          className="cursor-pointer text-gray-400"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                onClick={(event) => {
                  const target = event.currentTarget;
                  target.blur();
                  target.focus();
                }}
              >
                {link.title}
              </TooltipTrigger>
              <TooltipContent>
                <p>Coming Soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </MenubarTrigger>
      ) : (
        <Link href={link.link} target={link?.newTab ? '_blank' : '_self'}>
          <MenubarTrigger disabled={link?.disabled} className="cursor-pointer">
            {link.title}
          </MenubarTrigger>
          {link?.badgeText && <Badge>{link?.badgeText}</Badge>}
        </Link>
      )}
    </MenubarMenu>
  );
}
function DesktopMenuLinks() {
  return (
    <div className="flex flex-row items-center align-middle">
      <Menubar>
        <DesktopMenuLink
          link={{
            title: 'Home',
            link: Links.home,
          }}
        />
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer">EVM Tools</MenubarTrigger>
          <MenubarContent>
            <MenuLink text={'View all'} link={Links.devTools} />

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
            <MenuLink text={'EVM Visualizer'} link={Links.evmTools} />
          </MenubarContent>
        </MenubarMenu>
        {menuLinks.map((m, i) => (
          <DesktopMenuLink key={i} link={m} />
        ))}

        {/* <MenubarMenu></MenubarMenu> */}
      </Menubar>

      <Link className="ml-2" href={evmToolsXLink} target={'_blank'}>
        <button className="relative inline-flex items-center justify-center p-0.5 me-1 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
          <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            <TwitterIcon className="w-6 h-6" />
          </span>
        </button>

        {/* <MenubarTrigger className="cursor-pointer">
                {m.title}
              </MenubarTrigger> */}
      </Link>
      <div className="ml-[2px]">
        <ConnectButton
          chainStatus="icon"
          showBalance={false}
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
        />
      </div>
    </div>
  );
}

function MobileMenuLinks() {
  // const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* <HamburgerMenuIcon color="red" onClick={() => setIsOpen(true)} /> */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <HamburgerMenuIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="cursor-pointer">
            <Link href={Links.home}>Home</Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="cursor-pointer">
            <Link href={Links.zkTools}>Zk Tools</Link>
          </DropdownMenuItem> */}
          <DropdownMenuItem>
            <ConnectButton
              chainStatus="icon"
              showBalance={false}
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
            />
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Link href={Links.boilerplate}>Boilerplate</Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <Link href={Links.contribute}>Contribute</Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <DropdownMenuLabel>EVM Tools</DropdownMenuLabel>
            <a href="http://evmtools.xyz?ref=ext" target="_blank">
              <DropdownMenuItem className="cursor-pointer">
                EVM Storage Reader
                <span className="ml-2">
                  <ExternalLinkIcon />
                </span>
              </DropdownMenuItem>
            </a>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <a href={evmToolsXLink} target="_blank">
            <DropdownMenuItem className="cursor-pointer">
              <p className="mr-2">Follow</p>
              <TwitterIcon className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
          </a>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function GlobalHeader() {
  return (
    <nav>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href={Links.home}>
          <div className="flex flex-row items-center self-start">
            <Image
              alt=""
              height="60"
              width="60"
              src="../assets/images/evm-tools-logo-2.svg"
              style={{ marginRight: '10px' }}
            />
            <span>evmtools</span>
          </div>
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <MobileMenuLinks />
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <DesktopMenuLinks />
        </div>
      </div>
    </nav>

    // <div
    //   className="min-w-[375px] flex flex-row justify-center"
    //   style={{ border: '1px solid red' }}
    // >
    //   <div
    //     className="flex flex-row p-4 min-w-[345px] sm:max-w-[1024px] lg:max-w-[1024px] justify-between align-middle"
    //     style={{ border: '1px solid blue' }}
    //   >
    //     <Link href={Links.home}>
    //       <div className="flex flex-row items-center self-start">
    //         <Image
    //           alt=""
    //           h="60px"
    //           w="60px"
    //           src="../assets/images/evm-tools-logo-2.svg"
    //           mr="10px"
    //         />
    //         <span>evmtools</span>
    //       </div>
    //     </Link>
    //     <div className="sm:invisible md:invisible lg:invisible self-end">
    //       <MobileMenuLinks />
    //     </div>
    //     <div className="invisible sm:max-w-[1024px] sm:visible md:visible lg:visible">
    //       <DesktopMenuLinks />
    //     </div>
    //   </div>
    // </div>
  );
}
