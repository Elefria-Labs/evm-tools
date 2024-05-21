import React from 'react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { toastOptions } from '@components/common/toast';
import { repoLink, zkToosLink } from '@config/constants';
import Link from 'next/link';
import { CheckCircledIcon } from '@radix-ui/react-icons';

export default function Contribute() {
  const { toast } = useToast();
  return (
    <Main
      meta={
        <Meta
          title="EVM Tools | Tools for web3 and evm developers"
          description="Tools for zero knowledge proofs, smart contracts, ethereum (& L2), web3 apps and cryptography."
        />
      }
    >
      <div className="max-w-1024px w-[100%]">
        <h1 className="font-bold text-lg my-4">Contribute ❤️</h1>
        <p className="mb-4">Github links below:</p>

        <p className="mb-4">
          <Link
            className="font-bold text-md hover:bg-gray-100 hover:text-blue-700"
            href={repoLink}
          >
            zk-block boilerplate
          </Link>
        </p>

        <p className="mb-4">
          <Link
            className="font-bold text-md hover:bg-gray-100 hover:text-blue-700"
            href={zkToosLink}
          >
            evm-tools
          </Link>
        </p>
        <p className="mb-4">You can contribute by:</p>

        <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {[
            'Improving the documentation',
            'Creating an issue if something is broken',
            'Writing tests',
            'Suggestion to improve the setup',
            'Fixing grammar mistakes, typos on the website or in the content',
          ].map((list) => {
            return (
              <li
                key={list}
                className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
              >
                <CheckCircledIcon className="mr-2" />
                {list}
              </li>
            );
          })}
          <li
            key={'donate'}
            className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600"
          >
            <div
              className="cursor-pointer flex flex-row items-center text-black dark:text-white"
              onClick={() => {
                navigator.clipboard.writeText(
                  `0xD5141c47DEE803D0dD9793fcD5703daF4f750148`,
                );
                toast({
                  ...toastOptions,
                  title: 'Copied!',
                  variant: 'default',
                });
              }}
            >
              {`Donation Address: ${'0xD5141c47DEE803D0dD9793fcD5703daF4f750148'}`}
            </div>
          </li>
        </ul>
      </div>
    </Main>
  );
}
