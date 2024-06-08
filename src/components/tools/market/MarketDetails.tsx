import React, { useState, useEffect } from 'react';

import { Input } from '@shadcn-components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shadcn-components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shadcn-components/ui/table';
import { Button } from '@shadcn-components/ui/button';
import axios from 'axios';
import { FaStar, FaRegStar } from 'react-icons/fa';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap_rank: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  market_cap: number;
  image: string;
}

interface CoinTableProps {
  coins: Coin[];
  watchlist: string[];
  onToggleWatchlist: (coinId: string) => void;
}

const CoinTable: React.FC<CoinTableProps> = ({
  coins,
  watchlist,
  onToggleWatchlist,
}) => {
  return (
    <div>
      <Table defaultValue="market">
        <TableCaption>Market data powered by coingecko</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Coin</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>24h</TableHead>
            <TableHead>Market Cap</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto max-h-[600px]">
          {coins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No match found
              </TableCell>
            </TableRow>
          ) : (
            coins.map((coin) => (
              <TableRow key={coin.id}>
                <TableCell>
                  {/* {coin.market_cap_rank} */}
                  {watchlist.includes(coin.id) ? (
                    <FaStar
                      className="text-yellow-500"
                      onClick={() => onToggleWatchlist(coin.id)}
                    />
                  ) : (
                    <FaRegStar onClick={() => onToggleWatchlist(coin.id)} />
                  )}
                </TableCell>
                <TableCell className="flex items-center min-w-[140px]">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-6 h-6 mr-2 ml-4"
                  />
                  {coin.name}
                </TableCell>
                <TableCell>{coin.symbol.toUpperCase()}</TableCell>
                <TableCell>${coin.current_price.toLocaleString()}</TableCell>
                <TableCell
                  className={`${
                    coin.price_change_percentage_24h < 0
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </TableCell>
                <TableCell>${coin.market_cap.toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const MarketData: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const fetchCoins = async (page: number) => {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets`,
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 50,
          page: page,
        },
      },
    );
    setCoins((prevCoins) => {
      const uniqueCoins = new Map<string, Coin>();
      [...prevCoins, ...response.data].forEach((coin) =>
        uniqueCoins.set(coin.id, coin),
      );
      return Array.from(uniqueCoins.values());
    });
  };

  useEffect(() => {
    fetchCoins(page);
  }, [page]);

  useEffect(() => {
    const storedWatchlist = localStorage.getItem('watchlist');
    if (storedWatchlist) {
      setWatchlist(JSON.parse(storedWatchlist));
    }
  }, []);

  const handleToggleWatchlist = (coinId: string) => {
    const updatedWatchlist = watchlist.includes(coinId)
      ? watchlist.filter((id) => id !== coinId)
      : [...watchlist, coinId];

    setWatchlist(updatedWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredWatchlistCoins = coins.filter(
    (coin) =>
      watchlist.includes(coin.id) &&
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <Input
        placeholder="Search coin..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      <div className="overflow-y-scroll custom-scrollbar">
        <Tabs defaultValue="market">
          <TabsList className="flex flex-row justify-center">
            {['Market', 'Watchlist'].map((t) => (
              <TabsTrigger key={t} value={t.toLowerCase()}>
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value="market"
            className="overflow-y-scroll h-[322px] custom-scrollbar"
          >
            <CoinTable
              coins={filteredCoins}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
            />
            <div className="text-center mt-4">
              <Button onClick={() => setPage(page + 1)}>Load More</Button>
            </div>
          </TabsContent>

          <TabsContent
            value="watchlist"
            className="overflow-y-scroll h-[322px] custom-scrollbar"
          >
            <CoinTable
              coins={filteredWatchlistCoins}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketData;
