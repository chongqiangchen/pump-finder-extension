import { APIRequest } from "~/types";
import { ofetch } from "ofetch";

export default defineBackground(() => {
  // 处理来自 popup 和 content script 的消息
  browser.runtime.onMessage.addListener(
    (request: APIRequest, sender, sendResponse) => {
      (async () => {
        try {
          let response;
          switch (request.type) {
            case "fuzzySearch":
              response = await fuzzySearch(request.text!);
              console.log("fuzzySearch response:", response);
              break;
            case "advancedSearch":
              response = await advancedSearch(request.text!);
              console.log("advancedSearch response:", response);
              break;
            case "dexSearch":
              response = await dexSearch(request.text!);
              console.log("dexSearch response:", response);
              break;
            default: {
              throw new Error("Unknown request type: " + request.type);
            }
          }
          sendResponse({ success: true, data: response });
        } catch (error: any) {
          console.error("Request failed:", error);
          sendResponse({ success: false, error: error.message || "请求失败" });
        }
      })();

      return true;
    }
  );
});

async function callOpenAI(
  config: {
    baseUrl: string;
    apiKey: string;
    model: string;
  },
  messages: Array<{ role: string; content: string }>
) {
  try {
    const response = await ofetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      timeout: 10000,
      body: JSON.stringify({
        model: config.model,
        messages,
      }),
    });
    return response;
  } catch (error: any) {
    console.error("API call failed:", error);
    throw new Error(error.message || "请求失败");
  }
}

// 添加缓存对象
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5000 // 5秒缓存时间

async function fuzzySearch(keyword: string) {
  // 检查缓存
  const cacheKey = `fuzzy:${keyword}`
  const cachedResult = cache.get(cacheKey)
  if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
    return cachedResult.data
  }

  try {
    const response = await fetch("https://frontend-api-v2.pump.fun/coins/search?offset=0&limit=10&sort=market_cap&order=DESC&includeNsfw=false&searchTerm=" + keyword, {
      "method": "GET"
    });
    console.log("fuzzySearch response:", response);
    const data = await response.json()
    // 存储到缓存
    cache.set(cacheKey, { data, timestamp: Date.now() })
    return data
  } catch (error: any) {
    throw new Error(`搜索失败: ${error.message}`);
  }
}

async function advancedSearch(tokenAddress: string) {
  // 检查缓存
  const cacheKey = `advanced:${tokenAddress}`
  const cachedResult = cache.get(cacheKey)
  if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
    return cachedResult.data
  }

  const url = `https://advanced-api-v2.pump.fun/coins/metadata-and-trades/${tokenAddress}`
  const response = await fetch(url, {
    "method": "GET"
  });
  console.log("pumpSearch response:", response);
  const data = await response.json()
  
  // 存储到缓存
  cache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}

async function dexSearch(tokenAddress: string) {
  // 检查缓存
  const cacheKey = `dex:${tokenAddress}`
  const cachedResult = cache.get(cacheKey)
  if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
    return cachedResult.data
  }

  const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
  const response = await fetch(url, {
    "method": "GET"
  });
  console.log("dexSearch response:", response);
  const data = await response.json()
  
  // 存储到缓存
  cache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}
