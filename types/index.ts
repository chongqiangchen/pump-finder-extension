export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface FuzzySearchResponse {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  metadata_uri: string;
  twitter: string;
  telegram: string;
  bonding_curve: string;
  associated_bonding_curve: string;
  creator: string;
  created_timestamp: number;
  raydium_pool: string;
  complete: boolean;
  virtual_sol_reserves: number;
  virtual_token_reserves: number;
  hidden: string;
  total_supply: number;
  website: string;
  show_name: boolean;
  last_trade_timestamp: number;
  king_of_the_hill_timestamp: number;
  market_cap: number;
  reply_count: number;
  last_reply: number;
  nsfw: boolean;
  market_id: string;
  inverted: boolean;
  is_currently_live: boolean;
  username: string;
  profile_image: string;
  usd_market_cap: number;
}

export interface AdvancedSearchResponse {
  coin: {
    current_market_price: string;
    volume: string;
    creation_time: string;
    imageUrl: string;
    dev: string;
    ticker: string;
    sniper_count: string;
    progress: string;
    num_holders: string;
    name: string;
    marketcap: string;
  };
  trades: {
    [key: string]: Array<{
      signature: string;
      mint: string;
      sol_amount: number;
      token_amount: number;
      is_buy: boolean;
      user: string;
      timestamp: number;
      virtual_sol_reserves: number;
      virtual_token_reserves: number;
      hidden: string;
      tx_index: number;
      slot: number;
    }>;
  };
}

export interface DexPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  labels: Array<string>;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info: {
    imageUrl: string;
    websites: Array<{
      url: string;
    }>;
    socials: Array<{
      platform: string;
      handle: string;
    }>;
  };
  boosts: {
    active: number;
  };
}
export interface DexSearchResponse {
  schemaVersion: string;
  pairs: Array<DexPair>;
}

// 应用状态相关类型
export interface Position {
  x: number;
  y: number;
}

export type ResultType =
  | "fuzzySearch"
  | "dexSearch"
  | "advancedSearch"
  | "pumpListener";

export interface ResultState {
  type: ResultType;
  text: string;
  loading: boolean;
}

// API 请求相关类型
export interface APIRequest {
  type: ResultType;
  config?: {
    baseUrl: string;
    apiKey: string;
    model: string;
  };
  text?: string;
  targetLang?: string;
  includeScreenNames?: string;
  excludeScreenNames?: string;
}

export interface APIResponse<T> {
  success?: boolean;
  data?: T;
}

export interface Settings {
  baseUrl: string;
  apiKey: string;
  model: string;
  targetLang: string;
  isValidated?: boolean;
}

export const defaultSettings: Settings = {
  baseUrl: "https://api.openai.com/v1",
  apiKey: "",
  model: "gpt-3.5-turbo",
  targetLang: "zh",
  isValidated: false,
};
