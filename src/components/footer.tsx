import { Image } from '@chakra-ui/react';
import { Links, twitterLink } from '@config/constants';
import { TwitterIcon } from './icon/twitter';
import Link from 'next/link';

// function NavigationLinks() {
//   return (
//     <>
//       <Stack
//         isInline
//         display={['none', 'none', 'flex']}
//         color="gray.400"
//         fontWeight={600}
//         spacing="30px"
//       >
//         <Link _hover={{ color: 'black' }} href={Links.devTools} target="_blank">
//           Dev Tools
//         </Link>
//         <Link _hover={{ color: 'black' }} href={Links.zkTools}>
//           Tools
//         </Link>
//         <Link _hover={{ color: 'black' }} href={Links.boilerplate}>
//           Boilerplate
//         </Link>
//         <Link _hover={{ color: 'black' }} href={Links.blog} target="_blank">
//           Learn
//         </Link>
//         <Link _hover={{ color: 'black' }} href={Links.zkChains} target="_blank">
//           Zk Chains
//         </Link>
//         <Link _hover={{ color: 'black' }} href={Links.subscribe}>
//           Subscribe
//         </Link>
//         <Link _hover={{ color: 'black' }} href={Links.contribute}>
//           Contribute
//         </Link>

//         <Link _hover={{ color: 'black' }} href={Links.about}>
//           About
//         </Link>
//       </Stack>

//       <Stack
//         display={['flex', 'flex', 'none']}
//         color="gray.400"
//         fontWeight={600}
//         spacing={0}
//       >
//         <Link
//           py="7px"
//           borderBottomWidth={1}
//           borderBottomColor="gray.800"
//           _hover={{ color: 'gray' }}
//           href={Links.zkTools}
//         >
//           Zk Tools
//         </Link>
//         <Link
//           py="7px"
//           borderBottomWidth={1}
//           borderBottomColor="gray.800"
//           _hover={{ color: 'gray' }}
//           href={Links.boilerplate}
//         >
//           Boilerplate
//         </Link>
//         <Link
//           py="7px"
//           borderBottomWidth={1}
//           borderBottomColor="gray.800"
//           _hover={{ color: 'gray' }}
//           href={Links.blog}
//           target="_blank"
//         >
//           Learn
//         </Link>
//         <Link
//           py="7px"
//           borderBottomWidth={1}
//           borderBottomColor="gray.800"
//           _hover={{ color: 'gray' }}
//           href={Links.zkChains}
//           target="_blank"
//         >
//           Zk Chains
//         </Link>
//         <Link
//           py="7px"
//           borderBottomWidth={1}
//           borderBottomColor="gray.800"
//           _hover={{ color: 'gray' }}
//           href={Links.subscribe}
//         >
//           Subscribe
//         </Link>
//         <Link
//           py="7px"
//           borderBottomWidth={1}
//           borderBottomColor="gray.800"
//           _hover={{ color: 'gray' }}
//           href={Links.contribute}
//         >
//           Contribute
//         </Link>

//         <Link
//           py="7px"
//           borderBottomWidth={1}
//           borderBottomColor="gray.800"
//           _hover={{ color: 'gray' }}
//           href={Links.about}
//         >
//           About
//         </Link>
//       </Stack>
//     </>
//   );
// }

export function Footer() {
  return (
    <div className="pt-4 w-2/3">
      <div>
        {/* <NavigationLinks /> */}
        <div className="flex flex-row w-full divide-x border-t-2">
          <div className="mt-8 mb-8">
            <div className="flex flex-row items-center">
              <Link className="flex flex-row items-center" href={Links.home}>
                <Image
                  alt=""
                  h="60px"
                  w="60px"
                  src="../assets/images/evm-tools-logo-2.svg"
                  mr="6px"
                />
                evmtools
              </Link>
              <span className="mx-2">by</span>
              <Link
                className="bg-black rounded-sm text-white px-2"
                href="https://github.com/heypran/zk-block"
                target="_blank"
              >
                @heypran
              </Link>
              <Link className="ml-4" href={twitterLink}>
                <div className="w-[30px] h-[30px]">
                  <TwitterIcon />
                </div>
              </Link>
            </div>
            <p className="my-4">
              Tools for zero knowledge proofs, smart contracts, ethereum (& L2),
              web3 apps and cryptography.
            </p>
            <p>
              <span className="mr-4 mb-4">&copy; evmtools.xyz</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
