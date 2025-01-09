import { useState, useEffect, RefObject } from "react";
import {
  AdvancedSearchResponse,
  DexPair,
  DexSearchResponse,
  FuzzySearchResponse,
  type Position,
} from "~/types";
import ReactDOM from "react-dom/client";
import pumpIcon from "~/assets/gmgn.ico";
import { advancedSearch, dexSearch, fuzzySearch } from "~/services/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { formatAddress, formatMarketCap } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";

interface PumpLinkProps {
  address: string;
}

interface PumpInfoProps {
  address: string;
}

const PumpInfo: React.FC<PumpInfoProps> = ({ address }) => {
  const [tokenInfo, setTokenInfo] = useState<{
    fuzzySearch: FuzzySearchResponse | undefined;
    dexSearch: DexPair | undefined;
  }>();
  const [advancedInfo, setAdvancedInfo] = useState<
    AdvancedSearchResponse["coin"] | undefined
  >();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        const data = await fuzzySearch(address);
        const fuzzyInfo = data.data?.[0];

        console.log("fuzzyInfo: ", data);

        if (!fuzzyInfo) {
          return;
        }

        let dexInfo: DexPair | undefined;
        if (!fuzzyInfo?.complete) {
          const advancedData = await advancedSearch(address);
          const advancedInfo = advancedData.data?.coin;
          setAdvancedInfo(advancedInfo);
          console.log(advancedInfo);
        } else {
          const dexData = await dexSearch(address);
          dexInfo = dexData.data?.pairs[0];
        }

        setTokenInfo({ fuzzySearch: fuzzyInfo, dexSearch: dexInfo });
      } catch (error) {
        console.error("获取代币信息失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTokenInfo();
  }, [address]);

  return (
    <div className="p-4 min-w-[300px]">
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          <span className="ml-2">加载中...</span>
        </div>
      ) : tokenInfo ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-3 pb-2 border-b border-gray-200">
            <div>
              <div className="font-bold text-lg">
                {tokenInfo.fuzzySearch?.symbol}
              </div>
              <div className="text-sm text-gray-500">
                创建者:{" "}
                <a
                  href={`https://pump.fun/profile/${tokenInfo.fuzzySearch?.creator}`}
                  target="_blank"
                  className="hover:text-blue-500 hover:underline"
                >
                  {formatAddress(tokenInfo.fuzzySearch?.creator)}
                </a>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">内盘状态:</span>
              {tokenInfo.fuzzySearch?.complete ? (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    tokenInfo.fuzzySearch?.complete
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {tokenInfo.fuzzySearch?.complete ? "已完成" : "未完成"}
                </span>
              ) : (
                <span className="font-bold">{advancedInfo?.progress}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">市值:</span>
              <span className="font-medium">
                ${formatMarketCap(tokenInfo.dexSearch?.marketCap)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">币价:</span>
              <span className="font-medium">
                ${tokenInfo.dexSearch?.priceUsd.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">官方推特:</span>
              {tokenInfo.fuzzySearch?.twitter ? (
                <a
                  href={tokenInfo.fuzzySearch?.twitter}
                  target="_blank"
                  className="hover:text-blue-600 hover:underline flex items-center"
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
              ) : (
                <span className="text-gray-400">暂无</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">购买链接:</span>
              <a
                target="_blank"
                href={`https://gmgn.ai/sol/token/xqM3s7nA_${address}`}
                className="text-blue-500 hover:text-blue-600 hover:underline flex items-center"
                title="查看 Pump 详情"
              >
                <img src={pumpIcon} alt="Pump" className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">未找到代币信息</div>
      )}
    </div>
  );
};

const PumpLink: React.FC<PumpLinkProps> = ({ address }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <a
          target="_blank"
          href={`https://gmgn.ai/sol/token/xqM3s7nA_${address}`}
          className="pl-1 inline-block hover:opacity-80 w-4 h-4"
          title="查看 Pump 详情"
        >
          <img src={pumpIcon} alt="Pump" className="w-4 h-4" />
        </a>
      </TooltipTrigger>
      <TooltipContent className="bg-card text-card-foreground">
        <PumpInfo address={address} />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function useTextObserver() {
  const [showFloating, setShowFloating] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    const scanDocument = (node: any) => {
      if (node.parentElement?.hasAttribute("data-pump-processed")) {
        return;
      }

      if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
        const text = node.textContent || "";
        const pumpAddressRegex = /[1-9A-HJ-NP-Za-km-z]{32,44}pump/g;
        const matches = text.match(pumpAddressRegex);

        if (matches) {
          node.parentElement.setAttribute("data-pump-processed", "true");

          let lastIndex = 0;
          const fragment = document.createDocumentFragment();

          matches.forEach((address: string) => {
            const index = text.indexOf(address, lastIndex);
            fragment.appendChild(
              document.createTextNode(
                text.slice(lastIndex, index + address.length)
              )
            );

            const container = document.createElement("span");
            container.style.position = "relative";
            container.style.display = "inline-block";
            container.style.marginLeft = "2px";
            const root = ReactDOM.createRoot(container);
            root.render(<PumpLink address={address} />);
            fragment.appendChild(container);

            lastIndex = index + address.length;
          });

          if (lastIndex < text.length) {
            fragment.appendChild(
              document.createTextNode(text.slice(lastIndex))
            );
          }

          node.parentElement.replaceChild(fragment, node);
        }
      }

      if (node.childNodes.length > 0) {
        node.childNodes.forEach((child: any) => scanDocument(child));
      }
      // if (node.childNodes.length === 0) {
      //   console.log(node);
      //   processNode(node);
      // }

      // node.childNodes.forEach(child => scanDocument(child));

      // if (node instanceof HTMLElement && node.tagName === 'ARTICLE') {
      //   node.setAttribute('data-pump-processed', 'true');
      // }
    };

    const debouncedDetectPumpAddresses = (mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => scanDocument(node));
      });
    };

    // 首次加载时扫描现有的 article 元素
    document.querySelectorAll("article").forEach((article) => {
      scanDocument(article);
    });

    const observer = new MutationObserver(debouncedDetectPumpAddresses);

    // 观察整个 document.body 以捕获新添加的 article 元素
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [showFloating]);

  return {
    showFloating,
    setShowFloating,
    position,
    selectedText,
  };
}
