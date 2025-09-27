import Image from 'next/image';
import { Links, evmToolsXLink } from '@config/constants';
import { TwitterIcon } from './icon/twitter';
import Link from 'next/link';

export function GlobalFooter() {
  return (
    <footer className="m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link className="flex flex-row items-center ml-2" href={Links.home}>
            <Image
              alt=""
              height="60"
              width="60"
              src="/assets/images/evm-tools-logo-2.svg"
            />
            evmtools
          </Link>

          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <Link className="ml-4" href={evmToolsXLink}>
                <div className="w-[30px] h-[30px]">
                  <p>
                    <TwitterIcon />
                  </p>
                </div>
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-3 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          <a href={Links.main} className="hover:underline">
            evmtools.xyz
            <p>
              Tools for zero knowledge proofs, smart contracts, ethereum (& L2),
              web3 apps and cryptography.
            </p>
          </a>
          <div className="mt-2">
            <a
              href="/llms.txt"
              className="hover:underline text-xs text-gray-400"
            >
              /llms.txt
            </a>
          </div>
        </span>
      </div>
    </footer>
  );
}
