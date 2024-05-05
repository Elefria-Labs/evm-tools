import { Container, Image } from '@chakra-ui/react';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@shadcn-components/ui/menubar';
import { Links } from '@config/constants';
import Link from 'next/link';

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
    title: 'EVM Tools',
    link: Links.home,
  },
  {
    title: 'ZK Tools',
    link: Links.zkTools,
  },
  {
    title: 'ZK Networks',
    link: Links.zkChains,
  },
  {
    title: 'Contribute',
    link: Links.contribute,
  },
  {
    title: 'Learn',
    link: Links.blog,
  },
  {
    title: 'Storage Reader',
    link: Links.evmTools,
    newTab: true,
  },
  {
    title: 'Subscribe',
    link: Links.subscribe,
  },
];
function DesktopMenuLinks() {
  return (
    <div className="flex flex-row">
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
      </Menubar>
    </div>
  );
}

// function MobileMenuLinks() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       <IconButton
//         rounded="5px"
//         padding={0}
//         aria-label={'Menu'}
//         display={['block', 'none', 'none']}
//         icon={<HamburgerMenuIcon color="black" />}
//         color="black"
//         cursor="pointer"
//         h="auto"
//         bg="transparent"
//         _hover={{ bg: 'transparent' }}
//         _active={{ bg: 'transparent' }}
//         _focus={{ bg: 'transparent' }}
//         onClick={() => setIsOpen(true)}
//       />

//       {isOpen && (
//         <Stack
//           color="gray.100"
//           fontSize={['22px', '22px', '22px', '32px']}
//           alignItems="center"
//           justifyContent="center"
//           pos="fixed"
//           left={0}
//           right={0}
//           bottom={0}
//           top={0}
//           bg="gray.900"
//           spacing="12px"
//           zIndex={999}
//         >
//           <Link href={Links.home}>Home</Link>
//           <Link href={Links.zkTools}>Zk Tools</Link>
//           <Link href={Links.boilerplate}>Boilerplate</Link>
//           <Link href={Links.blog} target="_blank">
//             Learn
//           </Link>
//           <Link href={Links.zkChains}>Zk Chains</Link>
//           <Link href={Links.subscribe}>Subscribe</Link>
//           <Link href={Links.about}>About</Link>
//           <Link href={Links.contribute}>Contribute</Link>
//           <CloseButton
//             onClick={() => setIsOpen(false)}
//             pos="fixed"
//             top="40px"
//             right="15px"
//             size="lg"
//           />
//         </Stack>
//       )}
//     </>
//   );
// }

type GlobalHeaderProps = {
  variant?: 'transparent' | 'solid';
};

export function GlobalHeader(props: GlobalHeaderProps) {
  return (
    <div className="p-4">
      <Container maxW="container.lg">
        <div className="flex flex-row justify-between items-center">
          <Link href={Links.home}>
            <div className="flex flex-row">
              <Image
                alt=""
                h="30px"
                w="30px"
                src="../assets/images/zk-block-logo.svg"
                mr="10px"
              />
              <span>zkblock</span>
            </div>
          </Link>
          <DesktopMenuLinks />
          {/* <MobileMenuLinks /> */}
        </div>
      </Container>
    </div>
  );
}
