import React from 'react';
import { Input } from '@shadcn-components/ui/input';
import { Button } from '@shadcn-components/ui/button';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Label } from '@shadcn-components/ui/label';
import InputBaseCopy from '@components/common/BaseInputCopy';
import { useGlobalStore } from '@store/global-store';

function BitMaskingComponent() {
  const bitManipulationState = useGlobalStore.use.bitManipulation();

  const binaryValue = bitManipulationState.binaryValue;
  const setBinaryValue = useGlobalStore.use.setBinaryValue();
  const maskValue = bitManipulationState.maskValue;
  const setMaskValue = useGlobalStore.use.setMaskValue();
  const shiftedValue = bitManipulationState.shiftedValue;
  const setShiftedValue = useGlobalStore.use.setShiftedValue();
  // const [binaryValue, setBinaryValue] = useState<string>('0');
  // const [maskValue, setMaskValue] = useState<string>('0');
  // const [shiftedValue, setShiftedValue] = useState<string>(binaryValue);

  const binaryToDecimal = (binary: string) => {
    if (binary == null || binary.length == 0) {
      return;
    }
    return BigInt('0b' + binary).toString(10);
  };

  const handleShiftLeft = () => {
    setShiftedValue((shiftedValue + '0').slice(-shiftedValue.length));
  };

  const handleShiftRight = () => {
    setShiftedValue(('0' + shiftedValue).slice(0, shiftedValue.length));
  };

  const handleBinaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[01]*$/.test(value) && value.length <= 256) {
      setBinaryValue(value);
      setShiftedValue(value);
    }
  };

  const handleMaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[01]*$/.test(value) && value.length <= 256) {
      setMaskValue(value);
    }
  };

  const applyMask = () => {
    const length = shiftedValue.length;
    const paddedBinaryValue = shiftedValue.padStart(length, '0');
    const paddedMaskValue = maskValue.padStart(length, '0');
    if (paddedBinaryValue.length == 0) {
      return 0;
    }
    const maskedValue =
      BigInt('0b' + paddedBinaryValue) & BigInt('0b' + paddedMaskValue);
    return maskedValue.toString(2).padStart(length, '0');
  };
  return (
    <div className="flex flex-row justify-center">
      <div className="max-w-[480px] w-[100%] mb-4">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '16px',
          }}
        >
          <div className="flex flex-col mb-4">
            <Label className="mb-2">Binary Number</Label>

            <InputBaseCopy value={binaryValue} onChange={handleBinaryChange} />

            <small>
              {binaryValue.length} bit/s{' '}
              {binaryToDecimal(binaryValue)
                ? `(${binaryToDecimal(binaryValue)})`
                : ``}
            </small>
          </div>
        </div>

        <Label className="mb-2">
          Shift Operation
          <p
            className="text-xs hover:underline-offset-4 underline cursor-pointer decoration-sky-500 italic"
            onClick={() => {
              setShiftedValue(binaryValue);
            }}
          >
            {'Reset'}
          </p>
        </Label>
        <div className="flex flex-row items-center  mb-8">
          <Button onClick={handleShiftLeft} style={{ marginRight: '8px' }}>
            &nbsp;
            <DoubleArrowLeftIcon />
          </Button>

          <Input className="w-full" value={shiftedValue} disabled />

          <Button onClick={handleShiftRight} style={{ marginLeft: '8px' }}>
            &nbsp;
            <DoubleArrowRightIcon />
          </Button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Label>Mask</Label>
          <InputBaseCopy
            value={maskValue}
            onChange={handleMaskChange}
            placeholder="Enter mask"
          />
          <small>{maskValue.length} bit/s</small>
        </div>

        <div>
          <Label>Applied Mask Value:</Label>
          <span>
            <InputBaseCopy
              value={applyMask().toString()}
              onChange={handleMaskChange}
              disabled
            />
            <small>
              {applyMask().toString().length} bit/s{' '}
              {binaryToDecimal(applyMask().toString())
                ? `(${binaryToDecimal(applyMask().toString())})`
                : ``}
            </small>
            {/* <p>{applyMask()}</p> */}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BitMaskingComponent;
