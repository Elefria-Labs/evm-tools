import { createClient } from '@supabase/supabase-js';

export const AppConfig = {
  site_name: 'Evm Tools',
  title: 'Evm Tools - Tools for developing web3 apps',
  description: 'Tools and Boilerplate for zk, solidity and evm tools',
  locale: 'en',
};

export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const endpoints = {
  getLatestTweets: `${BACKEND_BASE_URL}/project/v1-get-latest-tweets`,
  listProjects: `${BACKEND_BASE_URL}/project/v1-list-projects`,
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SBASE_URL!,
  process.env.NEXT_PUBLIC_SBASE_ANON_KEY!,
);
