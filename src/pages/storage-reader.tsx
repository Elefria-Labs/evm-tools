import React, { useState } from 'react';
import { useToast } from '@shadcn-components/ui/use-toast';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@shadcn-components/ui/card';

import { ToastAction } from '@radix-ui/react-toast';
import { supabase } from '@utils/AppConfig';
import { Input } from '@shadcn-components/ui/input';
import { Button } from '@shadcn-components/ui/button';

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export default function Contribute() {
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string>();

  const handleSubmit = async () => {
    if (!userEmail || !validateEmail(userEmail)) {
      toast({
        title: 'Uh oh! Invalid email.',
      });
      return;
    }
    const { error } = await supabase
      .from('user-email')
      .insert([{ email: userEmail }]);
    if (error) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    toast({
      title: 'You will be amongst first one to get access!',
      variant: 'default',
    });
  };

  return (
    <Main
      meta={
        <Meta
          title="Contract Reader | Tools for web3 and evm developers"
          description="Tools for zero knowledge proofs, smart contracts, ethereum (& L2), web3 apps and cryptography."
        />
      }
    >
      <div className="max-w-1024px w-[100%] flex flex-col items-center mt-8">
        <h1 className="font-bold text-2xl my-4">Contract Storage Reader 👁️‍🗨️</h1>
        <p className="mb-4 text-xl">
          Discover a new way of looking at the contracts. Demystify all the
          contract slots.
        </p>

        <div className="max-w-1024px w-[100%] flex flex-row justify-center mt-8">
          <Card className="w-[420px]">
            <CardHeader>
              <CardTitle className="font-bold text-xl flex flex-row justify-center">
                Be the first one to get access ❤️
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={userEmail}
                type="email"
                placeholder="vitalik@gmail.com"
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={!userEmail}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Main>
  );
}
