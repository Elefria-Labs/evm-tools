import React, { useState } from 'react';
import { Checkbox } from '@shadcn-components/ui/checkbox';
import { Input } from '@shadcn-components/ui/input';
import { Button } from '@shadcn-components/ui/button';
import { Label } from '@shadcn-components/ui/label';
import { handleCopyClick } from '@utils/wallet';

interface Hook {
  name: string;
  before: string;
  after: string;
}

const hooks: Hook[] = [
  { name: 'Initialize', before: 'beforeInitialize', after: 'afterInitialize' },
  {
    name: 'AddLiquidity',
    before: 'beforeAddLiquidity',
    after: 'afterAddLiquidity',
  },
  {
    name: 'RemoveLiquidity',
    before: 'beforeRemoveLiquidity',
    after: 'afterRemoveLiquidity',
  },
  { name: 'Swap', before: 'beforeSwap', after: 'afterSwap' },
  { name: 'Donate', before: 'beforeDonate', after: 'afterDonate' },
];

const ContractGenerator: React.FC = () => {
  const [selectedHooks, setSelectedHooks] = useState<string[]>([]);
  const [contractName, setContractName] = useState<string>(
    'YourHooksContractName',
  );
  const [generatedCode, setGeneratedCode] = useState<string>('');

  const handleHookToggle = (hookName: string) => {
    setSelectedHooks((prev) =>
      prev.includes(hookName)
        ? prev.filter((h) => h !== hookName)
        : [...prev, hookName],
    );
  };

  const generateContract = () => {
    const code = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/BaseHook.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta} from "v4-core/src/types/BeforeSwapDelta.sol";

contract ${contractName} is BaseHook {
    using PoolIdLibrary for PoolKey;

    constructor(IPoolManager _poolManager) BaseHook(_poolManager) {}

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            ${hooks
              .map(
                (hook) => `
            ${hook.before}: ${selectedHooks.includes(hook.name)},
            ${hook.after}: ${selectedHooks.includes(hook.name)}`,
              )
              .join(',')}
        });
    }

    ${
      selectedHooks.includes('Initialize')
        ? `
    /// @notice The hook called before the state of a pool is initialized
    /// @param sender The initial msg.sender for the initialize call
    /// @param key The key for the pool being initialized
    /// @param sqrtPriceX96 The sqrt(price) of the pool as a Q64.96
    /// @param hookData Arbitrary data handed into the PoolManager by the initializer to be be passed on to the hook
    /// @return bytes4 The function selector for the hook
    function beforeInitialize(address sender, PoolKey calldata key, uint160 sqrtPriceX96, bytes calldata hookData)
        external
        override
        returns (bytes4)
    {
        // Implement your logic here
        return BaseHook.beforeInitialize.selector;
    }

    /// @notice The hook called after the state of a pool is initialized
    /// @param sender The initial msg.sender for the initialize call
    /// @param key The key for the pool being initialized
    /// @param sqrtPriceX96 The sqrt(price) of the pool as a Q64.96
    /// @param tick The current tick after the state of a pool is initialized
    /// @param hookData Arbitrary data handed into the PoolManager by the initializer to be be passed on to the hook
    /// @return bytes4 The function selector for the hook
    function afterInitialize(address sender, PoolKey calldata key, uint160 sqrtPriceX96, int24 tick, bytes calldata hookData)
        external
        override
        returns (bytes4)
    {
        // Implement your logic here
        return BaseHook.afterInitialize.selector;
    }`
        : ''
    }

    ${
      selectedHooks.includes('AddLiquidity')
        ? `
    /// @notice The hook called before liquidity is added
    /// @param sender The initial msg.sender for the add liquidity call
    /// @param key The key for the pool
    /// @param params The parameters for adding liquidity
    /// @param hookData Arbitrary data handed into the PoolManager by the liquidity provider to be passed on to the hook
    /// @return bytes4 The function selector for the hook
    function beforeAddLiquidity(address sender, PoolKey calldata key, IPoolManager.ModifyLiquidityParams calldata params, bytes calldata hookData)
        external
        override
        returns (bytes4)
    {
        // Implement your logic here
        return BaseHook.beforeAddLiquidity.selector;
    }

    /// @notice The hook called after liquidity is added
    /// @param sender The initial msg.sender for the add liquidity call
    /// @param key The key for the pool
    /// @param params The parameters for adding liquidity
    /// @param delta The amount owed to the pool (positive) or to the user (negative)
    /// @param hookData Arbitrary data handed into the PoolManager by the liquidity provider to be passed on to the hook
    /// @return bytes4 The function selector for the hook
    /// @return BalanceDelta The hook's delta in token0 and token1. Positive: the hook is owed/took currency, negative: the hook owes/sent currency
    function afterAddLiquidity(address sender, PoolKey calldata key, IPoolManager.ModifyLiquidityParams calldata params, BalanceDelta delta, bytes calldata hookData)
        external
        override
        returns (bytes4, BalanceDelta)
    {
        // Implement your logic here
        return (BaseHook.afterAddLiquidity.selector, BalanceDelta(0, 0));
    }`
        : ''
    }

    ${
      selectedHooks.includes('RemoveLiquidity')
        ? `
    /// @notice The hook called before liquidity is removed
    /// @param sender The initial msg.sender for the remove liquidity call
    /// @param key The key for the pool
    /// @param params The parameters for removing liquidity
    /// @param hookData Arbitrary data handed into the PoolManager by the liquidty provider to be be passed on to the hook
    /// @return bytes4 The function selector for the hook
    function beforeRemoveLiquidity(address sender, PoolKey calldata key, IPoolManager.ModifyLiquidityParams calldata params, bytes calldata hookData)
        external
        override
        returns (bytes4)
    {
        // Implement your logic here
        return BaseHook.beforeRemoveLiquidity.selector;
    }

    /// @notice The hook called after liquidity is removed
    /// @param sender The initial msg.sender for the remove liquidity call
    /// @param key The key for the pool
    /// @param params The parameters for removing liquidity
    /// @param delta The amount owed to the pool (positive) or to the user (negative)
    /// @param hookData Arbitrary data handed into the PoolManager by the liquidty provider to be be passed on to the hook
    /// @return bytes4 The function selector for the hook
    /// @return BalanceDelta The hook's delta in token0 and token1. Positive: the hook is owed/took currency, negative: the hook owes/sent currency
    function afterRemoveLiquidity(address sender, PoolKey calldata key, IPoolManager.ModifyLiquidityParams calldata params, BalanceDelta delta, bytes calldata hookData)
        external
        override
        returns (bytes4, BalanceDelta)
    {
        // Implement your logic here
        return (BaseHook.afterRemoveLiquidity.selector, BalanceDelta(0, 0));
    }`
        : ''
    }

    ${
      selectedHooks.includes('Swap')
        ? `
    /// @notice The hook called before a swap
    /// @param sender The initial msg.sender for the swap call
    /// @param key The key for the pool
    /// @param params The parameters for the swap
    /// @param hookData Arbitrary data handed into the PoolManager by the swapper to be be passed on to the hook
    /// @return bytes4 The function selector for the hook
    /// @return BeforeSwapDelta The hook's delta in specified and unspecified currencies. Positive: the hook is owed/took currency, negative: the hook owes/sent currency
    /// @return uint24 Optionally override the lp fee, only used if three conditions are met: 1) the Pool has a dynamic fee, 2) the value's leading bit is set to 1 (24th bit, 0x800000), 3) the value is less than or equal to the maximum fee (1 million)
    function beforeSwap(address sender, PoolKey calldata key, IPoolManager.SwapParams calldata params, bytes calldata hookData)
        external
        override
        returns (bytes4, BeforeSwapDelta, uint24)
    {
        // Implement your logic here
        return (BaseHook.beforeSwap.selector, BeforeSwapDelta(0, 0), 0);
    }

    /// @notice The hook called after a swap
    /// @param sender The initial msg.sender for the swap call
    /// @param key The key for the pool
    /// @param params The parameters for the swap
    /// @param delta The amount owed to the caller (positive) or owed to the pool (negative)
    /// @param hookData Arbitrary data handed into the PoolManager by the swapper to be be passed on to the hook
    /// @return bytes4 The function selector for the hook
    /// @return int128 The hook's delta in unspecified currency. Positive: the hook is owed/took currency, negative: the hook owes/sent currency
    function afterSwap(address sender, PoolKey calldata key, IPoolManager.SwapParams calldata params, BalanceDelta delta, bytes calldata hookData)
        external
        override
        returns (bytes4, int128)
    {
        // Implement your logic here
        return (BaseHook.afterSwap.selector, 0);
    }`
        : ''
    }

    ${
      selectedHooks.includes('Donate')
        ? `
    /// @notice The hook called before donate
    /// @param sender The initial msg.sender for the donate call
    /// @param key The key for the pool
    /// @param amount0 The amount of token0 being donated
    /// @param amount1 The amount of token1 being donated
    /// @param hookData Arbitrary data handed into the PoolManager by the donor to be be passed on to the hook
    /// @return bytes4 The function selector for the hook
    function beforeDonate(address sender, PoolKey calldata key, uint256 amount0, uint256 amount1, bytes calldata hookData)
        external
        override
        returns (bytes4)
    {
        // Implement your logic here
        return BaseHook.beforeDonate.selector;
    }

    /// @notice The hook called after donate
    /// @param sender The initial msg.sender for the donate call
    /// @param key The key for the pool
    /// @param amount0 The amount of token0 being donated
    /// @param amount1 The amount of token1 being donated
    /// @param hookData Arbitrary data handed into the PoolManager by the donor to be be passed on to the hook
    /// @return bytes4 The function selector for the hook
    function afterDonate(address sender, PoolKey calldata key, uint256 amount0, uint256 amount1, bytes calldata hookData)
        external
        override
        returns (bytes4)
    {
        // Implement your logic here
        return BaseHook.afterDonate.selector;
    }`
        : ''
    }
}`;

    setGeneratedCode(code);
  };

  return (
    <div className="flex flex-row justify-center">
      <div className="min-w-[320px] w-[100%] mb-4">
        <div className="p-4 space-y-4">
          <div>
            <Label htmlFor="contractName">Contract Name:</Label>
            <Input
              id="contractName"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              placeholder="Enter contract name"
            />
          </div>
          <div>
            <Label>Select Hooks:</Label>
            {hooks.map((hook) => (
              <div key={hook.name} className="flex items-center space-x-2">
                <Checkbox
                  id={hook.name}
                  checked={selectedHooks.includes(hook.name)}
                  onCheckedChange={() => handleHookToggle(hook.name)}
                />
                <label htmlFor={hook.name}>{hook.name}</label>
              </div>
            ))}
          </div>
          <Button onClick={generateContract}>Generate Contract</Button>
          {generatedCode && (
            <div>
              <Label>Generated Contract:</Label>{' '}
              <Button onClick={() => handleCopyClick(generatedCode)}>
                Copy Code
              </Button>
              <pre className="bg-gray-800 p-4 mt-4 rounded-md overflow-x-auto">
                <code>{generatedCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractGenerator;
