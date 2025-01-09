import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card.tsx";
import { Loader2 } from "lucide-react";
import { AdvancedSearchResponse, FuzzySearchResponse } from "~/types";
import { ScrollArea } from "~/components/ui/scroll-area";
import pumpIcon from "~/assets/gmgn.ico";

interface ResultCardProps {
  result?: Array<{
    fuzzySearch?: FuzzySearchResponse;
    advancedSearch?: AdvancedSearchResponse["coin"];
  }>;
  loading?: boolean;
  onClose: () => void;
}

const formatMarketCap = (value?: number | string) => {
  if (!value) return "N/A";
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  
  return num.toFixed(2);
};

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  loading = false,
  onClose,
}) => {
  return (
    <Card className="w-[400px] shadow-lg" data-pump-processed="true">
      <CardHeader className={"!px-4 !py-2"}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">搜索结果</CardTitle>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-accent"
            aria-label="关闭"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </CardHeader>
      <CardContent className={"!px-4 !py-2 relative"}>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="flex flex-col gap-4 p-4 max-h-[400px]">
            {result?.map((item) => (
              <div
                key={item.fuzzySearch?.mint}
                className="border rounded-lg p-3 mb-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  {item.fuzzySearch?.image_uri && (
                    <img
                      src={item.fuzzySearch?.image_uri}
                      alt={item.fuzzySearch?.name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{item.fuzzySearch?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.fuzzySearch?.symbol}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">市值</span>
                    <span className="font-medium">
                      ${formatMarketCap(item.fuzzySearch?.usd_market_cap)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">内盘状态</span>
                    {item.fuzzySearch?.complete ? (
                      <span className="font-medium text-green-600">已完成</span>
                    ) : (
                      <span className="font-medium text-yellow-600">
                        {item.advancedSearch?.progress || "未完成"}
                      </span>
                    )}
                  </div>
                </div>

                {item.fuzzySearch?.description && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {item.fuzzySearch?.description}
                  </p>
                )}

                <div className="flex gap-2 mt-3">
                  {item.fuzzySearch?.twitter && (
                    <a
                      href={item.fuzzySearch.twitter}
                      target="_blank"
                      className="text-sm hover:underline"
                    >
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 21 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                      >
                        <path
                          d="M18.8333 18.8332L12.3156 9.11953L12.3267 9.12862L18.2034 2.1665H16.2396L11.4523 7.83317L7.65057 2.1665H2.50014L8.58506 11.2354L8.58432 11.2347L2.16666 18.8332H4.13049L9.45286 12.5286L13.6829 18.8332H18.8333ZM6.87245 3.68166L16.0173 17.318H14.461L5.30879 3.68166H6.87245Z"
                          fill="currentColor"
                        />
                      </svg>
                    </a>
                  )}
                  <a
                    href={`https://gmgn.ai/sol/token/xqM3s7nA_${item.fuzzySearch?.mint}`}
                    target="_blank"
                    className="text-sm hover:underline"
                  >
                    <img src={pumpIcon} alt="GMGN" className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
