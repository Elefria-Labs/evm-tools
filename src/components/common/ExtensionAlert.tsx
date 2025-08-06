import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@shadcn-components/ui/alert';
import { RocketIcon } from '@radix-ui/react-icons';
import { extensionLink } from '@config/constants';
import PhraseAnimation from './PhraseAnimation';

function ClosableAlert() {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <Alert className="relative flex flex-col justify-center align-middle items-center border-0 border-l-0 border-r-0 rounded-none">
      {/* <AlertTitle>Now access all the evm tools by just one click!</AlertTitle> */}
      <AlertTitle className="text-xl">
        Go-To Tool Kit For Web3 Developers
        <PhraseAnimation />
      </AlertTitle>
      <AlertDescription className="mt-8">
        <div>
          <button
            onClick={() => window.open(extensionLink, '_blank')}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              <div className="flex flex-row">
                Try Extension
                <RocketIcon className="h-4 w-4 ml-4" />
              </div>
            </span>
          </button>

          {/* <button
            onClick={() => window.open(extensionLink, '_blank')}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              <div className="flex flex-row">
                Try Extension
                <RocketIcon className="h-4 w-4 ml-4" />
              </div>
            </span>
          </button> */}
        </div>
      </AlertDescription>
      {/* <button onClick={handleClose} className="absolute top-2 right-2">
        <Cross2Icon className="h-4 w-4" />
      </button> */}
    </Alert>
  );
}

export default ClosableAlert;
