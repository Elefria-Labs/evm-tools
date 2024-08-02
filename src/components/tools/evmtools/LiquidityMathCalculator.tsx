import React, { useState } from 'react';
import { Card } from '@shadcn-components/ui/card';
import { Input } from '@shadcn-components/ui/input';
import { Button } from '@shadcn-components/ui/button';
import { Label } from '@shadcn-components/ui/label';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@shadcn-components/ui/alert';

const UniswapV3LiquidityCalculator: React.FC = () => {
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [lowerPrice, setLowerPrice] = useState<string>('');
  const [upperPrice, setUpperPrice] = useState<string>('');
  const [liquidity, setLiquidity] = useState<string>('');
  const [tokenXAmount, setTokenXAmount] = useState<string>('');
  const [tokenYAmount, setTokenYAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const calculateAmounts = () => {
    try {
      setError('');
      setTokenXAmount('');
      setTokenYAmount('');

      const P = parseFloat(currentPrice);
      const Pa = parseFloat(lowerPrice);
      const Pb = parseFloat(upperPrice);
      const L = parseFloat(liquidity);

      if (isNaN(P) || isNaN(Pa) || isNaN(Pb) || isNaN(L)) {
        throw new Error('All inputs must be valid numbers');
      }

      if (Pa >= Pb) {
        throw new Error('Lower price must be less than upper price');
      }

      if (P < Pa || P > Pb) {
        throw new Error('Current price must be within the price range');
      }

      // Calculate square roots
      const sqrtP = Math.sqrt(P);
      const sqrtPa = Math.sqrt(Pa);
      const sqrtPb = Math.sqrt(Pb);

      // Calculate amounts
      const x = (L * (sqrtPb - sqrtP)) / (sqrtP * sqrtPb);
      const y = L * (sqrtP - sqrtPa);

      setTokenXAmount(x.toFixed(6));
      setTokenYAmount(y.toFixed(6));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div>
        <Label htmlFor="currentPrice">Current Price:</Label>
        <Input
          id="currentPrice"
          value={currentPrice}
          onChange={(e) => setCurrentPrice(e.target.value)}
          placeholder="e.g., 2000"
        />
      </div>
      <div>
        <Label htmlFor="lowerPrice">Lower Price Bound:</Label>
        <Input
          id="lowerPrice"
          value={lowerPrice}
          onChange={(e) => setLowerPrice(e.target.value)}
          placeholder="e.g., 1800"
        />
      </div>
      <div>
        <Label htmlFor="upperPrice">Upper Price Bound:</Label>
        <Input
          id="upperPrice"
          value={upperPrice}
          onChange={(e) => setUpperPrice(e.target.value)}
          placeholder="e.g., 2200"
        />
      </div>
      <div>
        <Label htmlFor="liquidity">Desired Liquidity (L):</Label>
        <Input
          id="liquidity"
          value={liquidity}
          onChange={(e) => setLiquidity(e.target.value)}
          placeholder="e.g., 1000000"
        />
      </div>
      <Button onClick={calculateAmounts}>Calculate Token Amounts</Button>
      {(tokenXAmount || tokenYAmount) && (
        <div className="space-y-2">
          <div>
            <Label>Required Amount of Token X:</Label>
            <Input value={tokenXAmount} readOnly />
          </div>
          <div>
            <Label>Required Amount of Token Y:</Label>
            <Input value={tokenYAmount} readOnly />
          </div>
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </Card>
  );
};

export default UniswapV3LiquidityCalculator;
