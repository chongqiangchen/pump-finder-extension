import {AdvancedSearchResponse, APIRequest, APIResponse, DexSearchResponse, FuzzySearchResponse, OpenAIResponse} from "~/types";

export async function sendMessageToBackground<T>(
  message: APIRequest
): Promise<APIResponse<T>> {
  const response = await browser.runtime.sendMessage(message);
  return response;
}

export async function fuzzySearch(keyword: string): Promise<APIResponse<FuzzySearchResponse[]>> {
  return sendMessageToBackground<FuzzySearchResponse[]>({
    type: "fuzzySearch",
    text: keyword,
  });
}

export async function dexSearch(tokenAddress: string): Promise<APIResponse<DexSearchResponse>> {
  return sendMessageToBackground<DexSearchResponse>({
    type: "dexSearch",
    text: tokenAddress,
  });
}

export async function advancedSearch(tokenAddress: string): Promise<APIResponse<AdvancedSearchResponse>> {
  return sendMessageToBackground<AdvancedSearchResponse>({
    type: "advancedSearch",
    text: tokenAddress,
  });
}
