import { useState } from 'react';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';
import { Button } from '@shadcn-components/ui/button';
import {
  TabsList,
  TabsTrigger,
  TabsContent,
  Tabs,
} from '@shadcn-components/ui/tabs';
import { toast } from '@shadcn-components/ui/use-toast';
import { toastOptions } from '@components/common/toast';
import Big from 'big.js';

// https://docs.uniswap.org/contracts/v3/reference/core/libraries/TickMath
// https://blog.uniswap.org/uniswap-v3-math-primer#how-do-i-calculate-the-current-exchange-rate
const X96 = new Big('2').pow(96);
const calculateUniswapV4LPPrice = (
  sqrtPriceX96: string,
  decimalsToken0: string,
  decimalsToken1: string,
): Big | void => {
  try {
    const sqrtPriceX96Bn = new Big(sqrtPriceX96);
    const sqrtPrice = sqrtPriceX96Bn.div(X96);
    const price = sqrtPrice.pow(2);

    const decimalAdjustment = new Big('10').pow(
      new Big(decimalsToken1).sub(new Big(decimalsToken0)).toNumber(),
    );

    const decimalAdjPrice = price.div(decimalAdjustment);
    return decimalAdjPrice;
  } catch (e) {
    toast({
      ...toastOptions,
      title: 'Please provide correct values!' + JSON.stringify(e),
    });
    return;
  }
};

function calculatePriceFromTick(
  tick: string,
  decimalsToken0: string,
  decimalsToken1: string,
): Big | void {
  try {
    // Calculate the raw price from the tick value
    const rawPrice = Math.pow(1.0001, Number(tick));

    // Adjust the price based on token decimals
    const decimalAdjustment = new Big('10').pow(
      new Big(decimalsToken1).sub(new Big(decimalsToken0)).toNumber(),
    );
    const decimalAdjPrice = new Big(rawPrice).div(decimalAdjustment);

    return decimalAdjPrice;
  } catch (e) {
    toast({
      ...toastOptions,
      title: 'Please provide correct values!' + JSON.stringify(e),
    });
    return;
  }
}

function UniswapV4ToolComponent() {
  const [token0Decimals, setToken0Decimals] = useState<string>('6');
  const [token1Decimals, setToken1Decimals] = useState<string>('18');
  const [sqrtPrice, setSqrtPrice] = useState<string>(
    '79228162514264337593543950336',
  );
  const [tickValue, setTickValue] = useState<string>('202919');
  const [price, setPrice] = useState<Big | null>(null);

  const handleSubmit = (fromTickValue?: boolean) => {
    let calculatedPrice;
    if (fromTickValue) {
      calculatedPrice = calculatePriceFromTick(
        tickValue,
        token0Decimals,
        token1Decimals,
      );
    } else {
      calculatedPrice = calculateUniswapV4LPPrice(
        sqrtPrice,
        token0Decimals,
        token1Decimals,
      );
    }

    if (calculatedPrice == null) {
      setPrice(null);
      return;
    }

    setPrice(calculatedPrice);
    toast({
      ...toastOptions,
      title: 'Calculated!',
      variant: 'default',
    });
  };

  const renderTab = (fromTickValue?: boolean) => {
    return (
      <>
        <div>
          <div style={{ marginBottom: '10px' }}>
            <Label htmlFor="token0Decimals">Token0 Decimals</Label>
            <Input
              type="string"
              id="token0Decimals"
              value={token0Decimals.toString()}
              onChange={(e) => setToken0Decimals(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Label htmlFor="token1Decimals">Token1 Decimals</Label>
            <Input
              type="string"
              id="token1Decimals"
              value={token1Decimals.toString()}
              onChange={(e) => setToken1Decimals(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            {fromTickValue ? (
              <>
                <Label htmlFor="tickValue">Tick Value</Label>
                <Input
                  type="string"
                  id="tickValue"
                  value={tickValue.toString()}
                  onChange={(e) => setTickValue(e.target.value)}
                />
              </>
            ) : (
              <>
                <Label htmlFor="sqrtPrice">Sqrt Price (X96)</Label>
                <Input
                  type="string"
                  id="sqrtPrice"
                  value={sqrtPrice.toString()}
                  onChange={(e) => setSqrtPrice(e.target.value)}
                />
              </>
            )}
          </div>
          <Button
            className="w-full"
            onClick={() => handleSubmit(fromTickValue)}
          >
            Calculate
          </Button>
        </div>
        {price !== null && (
          <div style={{ marginTop: '20px' }}>
            <p>
              <strong>Price0:</strong> {price.toFixed(18)}
            </p>
            <p>
              <strong>Price1: </strong>
              {new Big('1').div(price).toFixed(18)}
            </p>
          </div>
        )}
      </>
    );
  };
  return (
    <div>
      <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <Tabs defaultValue="sqrtPrice">
          <TabsList>
            <TabsTrigger value={'sqrtPrice'}>
              Convert from sqrtPrice
            </TabsTrigger>

            <TabsTrigger value={'tickValue'}>
              Convert from Tick Value
            </TabsTrigger>
          </TabsList>
          {/* //height: `472px`, // -${56}px -${70}px */}
          <div>
            <TabsContent value={'sqrtPrice'}>{renderTab(false)}</TabsContent>

            <TabsContent value={'tickValue'}>{renderTab(true)}</TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default UniswapV4ToolComponent;
