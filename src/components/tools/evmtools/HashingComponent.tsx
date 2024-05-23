import { useState } from 'react';
import { ethers } from 'ethers';
import { Label } from '@shadcn-components/ui/label';
import { Textarea } from '@shadcn-components/ui/textarea';
import InputBaseCopy from '@components/common/BaseInputCopy';

function HashingComponent() {
  const [inputText, setInputText] = useState('');
  const [keccak256Hash, setKeccak256Hash] = useState('');
  const [sha256Hash, setSha256Hash] = useState('');
  const [sha512Hash, setSha512Hash] = useState('');

  return (
    <div>
      <div>
        <div>
          <Label>Text</Label>
          <Textarea
            className="mt-4"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);

              const text = ethers.utils.toUtf8Bytes(e.target.value);
              // if (!ethers.utils.isHexString(text)) {

              // }
              const keccack256 = ethers.utils.keccak256(text);
              setKeccak256Hash(keccack256);

              const sha256 = ethers.utils.sha256(text);
              setSha256Hash(sha256);

              const sha512 = ethers.utils.sha512(text);
              setSha512Hash(sha512);
            }}
          />
        </div>
        <div className="mt-4">
          <Label>Keccak256</Label>
          <p>(keccak256(toUtf8Bytes(text)))</p>
          <InputBaseCopy value={keccak256Hash} disabled />
        </div>
        <div className="mt-4">
          <Label>Sha256</Label>
          <p>(sha256(toUtf8Bytes(text)))</p>
          <InputBaseCopy value={sha256Hash} disabled />
        </div>
        <div className="mt-4">
          <Label>Sha512</Label>
          <p>(sha512(toUtf8Bytes(text)))</p>
          <InputBaseCopy value={sha512Hash} disabled />
        </div>
      </div>
    </div>
  );
}

export default HashingComponent;
