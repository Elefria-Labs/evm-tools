import React from 'react';
import { Main } from '@templates/Main';
import { Meta } from '@layout/Meta';
import ToolBase from '@components/common/ToolBase';

export const SIGNUP_FORM_ACTION = 'https://zkblock.substack.com/';
export const SIGNUP_EMAIL_INPUT_NAME = 'email';

export function FreeSignUp() {
  return (
    <iframe
      src="https://zkblock.substack.com/embed"
      width="480"
      height="320"
      style={{ border: '1px solid #EEE', background: 'white' }}
      frameBorder="0"
      scrolling="no"
    ></iframe>
  );
}

export default function Subscribe() {
  return (
    <Main
      meta={
        <Meta
          title="Zk Block | Subscribe to Zk Block"
          description="Subscribe to ZKBlock for updates on zero knowledge projects and web3."
        />
      }
    >
      <ToolBase
        title="Subscribe"
        toolComponent={
          <div className="mb-[60px]">
            <div className="max-w-[640px] lg:max-w-[1024px]">
              <div className="max-w-[400px] mx-auto my-[30px] md:my-[80px]">
                <FreeSignUp />
              </div>
            </div>
          </div>
        }
      />
    </Main>
  );
}
