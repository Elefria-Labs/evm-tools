import React, { useState } from 'react';
import { Input } from '@shadcn-components/ui/input';
import { Label } from '@shadcn-components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@shadcn-components/ui/card';
import { Button } from '@shadcn-components/ui/button';

const PurchaseCalculator = () => {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [profitValue, setProfitValue] = useState('');
  const [profitPercentage, setProfitPercentage] = useState('');

  const handleInputChange = (setter: any) => (e: any) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  const onCalculate = () => {
    let calculatedPrice, calculatedQuantity, calculatedAmount;

    if (price && quantity) {
      calculatedAmount = (parseFloat(price) * parseFloat(quantity)).toFixed(8);
      setAmount(calculatedAmount);
      calculatedPrice = price;
      calculatedQuantity = quantity;
    } else if (price && amount) {
      calculatedQuantity = (parseFloat(amount) / parseFloat(price)).toFixed(8);
      setQuantity(calculatedQuantity);
      calculatedPrice = price;
      calculatedAmount = amount;
    } else if (quantity && amount) {
      calculatedPrice = (parseFloat(amount) / parseFloat(quantity)).toFixed(8);
      setPrice(calculatedPrice);
      calculatedQuantity = quantity;
      calculatedAmount = amount;
    } else {
      // If not enough information, clear profit calculations
      setProfitValue('');
      setProfitPercentage('');
      return;
    }

    // Calculate profit if current price is provided
    if (currentPrice) {
      const initialValue =
        parseFloat(calculatedPrice) * parseFloat(calculatedQuantity);
      const currentValue =
        parseFloat(currentPrice) * parseFloat(calculatedQuantity);
      const profitVal = (currentValue - initialValue).toFixed(8);
      const profitPct = (BigInt(profitVal) / BigInt(initialValue)) * 100n;

      setProfitValue(profitVal);
      setProfitPercentage(profitPct.toString());
    } else {
      setProfitValue('');
      setProfitPercentage('');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Price Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="price">Asset Price</Label>
          <Input
            id="price"
            type="text"
            value={price}
            onChange={handleInputChange(setPrice)}
            placeholder="Enter price"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="text"
            value={quantity}
            onChange={handleInputChange(setQuantity)}
            placeholder="Enter quantity"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Purchase Amount</Label>
          <Input
            id="amount"
            type="text"
            value={amount}
            onChange={handleInputChange(setAmount)}
            placeholder="Enter purchase amount"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentPrice">Current Asset Price</Label>
          <Input
            id="currentPrice"
            type="text"
            value={currentPrice}
            onChange={handleInputChange(setCurrentPrice)}
            placeholder="Enter current price"
          />
        </div>
        <Button onClick={onCalculate} className="w-full">
          Calculate
        </Button>
        {profitValue && profitPercentage && (
          <div className="mt-4 p-4 rounded-md">
            <p>
              <strong>Profit Value:</strong> {profitValue}
            </p>
            <p>
              <strong>Profit Percentage:</strong> {profitPercentage}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PurchaseCalculator;
