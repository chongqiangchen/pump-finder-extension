import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";

interface PumpData {
  id: number;
  pumpAddresses: string[];
  tweet: {
    basic: {
      id: string;
      text: string;
      user: {
        result: {
          legacy: {
            followers_count: number;
            friends_count: number;
            name: string;
            screen_name: string;
            profile_image_url_https: string;
          }
        }
      }
    }
  }
}

export default () => {
  const [pumpData, setPumpData] = useState<PumpData[]>([]);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [includeScreenNames, setIncludeScreenNames] = useState<string[]>([]);
  const [excludeScreenNames, setExcludeScreenNames] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [inputMode, setInputMode] = useState<'include' | 'exclude'>('include');

  const fetchData = async () => {
    try {
      const response = await browser.runtime.sendMessage({ 
        type: "pumpListener",
        includeScreenNames: includeScreenNames.join(','),
        excludeScreenNames: excludeScreenNames.join(',')
      });
      if (response.success && response.data.data.items) {
        const filteredData = response.data.data.items.filter(
          (item: PumpData) => item.tweet.basic.user.result.legacy.followers_count >= followerCount
        );
        setPumpData(filteredData);
      }
    } catch (error) {
      console.error("获取数据失败:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const newScreenName = inputValue.trim().replace('@', '');
      if (inputMode === 'include') {
        setIncludeScreenNames(prev => [...new Set([...prev, newScreenName])]);
      } else {
        setExcludeScreenNames(prev => [...new Set([...prev, newScreenName])]);
      }
      setInputValue('');
    }
  };

  const removeScreenName = (name: string, mode: 'include' | 'exclude') => {
    if (mode === 'include') {
      setIncludeScreenNames(prev => prev.filter(n => n !== name));
    } else {
      setExcludeScreenNames(prev => prev.filter(n => n !== name));
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [followerCount, includeScreenNames, excludeScreenNames]);

  const copyToClipboard = async (text: string, index: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [index]: false }));
      }, 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const openTweet = (tweetId: string) => {
    browser.tabs.create({
      url: `https://twitter.com/i/web/status/${tweetId}`,
      active: true
    });
  };

  const openGmgn = (address: string) => {
    browser.tabs.create({
      url: `https://gmgn.ai/sol/token/${address}`,
      active: true
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-3 mb-6">
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <p className="text-amber-800 text-sm">
            ☕️ 如果这个工具对你有帮助，欢迎请我喝杯咖啡：
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <code className="text-xs bg-amber-100 px-2 py-1 rounded font-mono text-amber-700">
              FYyUWw1cZqM5VZjQ3LtQKc4Wym7vYWb7ChPCqEPv6e3R
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 rounded-full hover:bg-amber-200/70"
              onClick={() => copyToClipboard("FYyUWw1cZqM5VZjQ3LtQKc4Wym7vYWb7ChPCqEPv6e3R", "donation")}
            >
              {copiedStates["donation"] ? (
                <span className="text-xs text-green-600 font-medium">已复制!</span>
              ) : (
                <svg 
                  className="w-3.5 h-3.5 text-amber-700" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-blue-800 text-sm flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            数据每 3-5 秒自动刷新一次
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                推主筛选
              </label>
              <div className="flex gap-2">
                <Button
                  variant={inputMode === 'include' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInputMode('include')}
                  className="h-7"
                >
                  包含
                </Button>
                <Button
                  variant={inputMode === 'exclude' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInputMode('exclude')}
                  className="h-7"
                >
                  排除
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="输入推主名称后按回车（如：@example）"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full"
              />
              {includeScreenNames.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500">包含：</span>
                  {includeScreenNames.map(name => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs"
                    >
                      @{name}
                      <button
                        onClick={() => removeScreenName(name, 'include')}
                        className="hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {excludeScreenNames.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500">排除：</span>
                  {excludeScreenNames.map(name => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs"
                    >
                      @{name}
                      <button
                        onClick={() => removeScreenName(name, 'exclude')}
                        className="hover:text-red-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label 
              htmlFor="followerCount" 
              className="text-sm font-medium text-gray-700"
            >
              粉丝数过滤
            </label>
            <Input
              id="followerCount"
              type="number"
              placeholder="最小粉丝数"
              value={followerCount}
              onChange={(e) => setFollowerCount(Number(e.target.value))}
              className="w-32"
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {pumpData.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white/50 backdrop-blur-sm"
              onClick={() => openTweet(item.tweet.basic.id)}
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.tweet.basic.user.result.legacy.profile_image_url_https}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border-2 border-gray-100 shadow-sm"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.tweet.basic.user.result.legacy.name}</h3>
                      <p className="text-sm text-gray-500">@{item.tweet.basic.user.result.legacy.screen_name}</p>
                    </div>
                    <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-md">
                      <div className="flex items-center gap-1">
                        <span>粉丝:</span>
                        <span className="font-medium">{item.tweet.basic.user.result.legacy.followers_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>关注:</span>
                        <span className="font-medium">{item.tweet.basic.user.result.legacy.friends_count}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-800">{item.tweet.basic.text}</p>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Pump Addresses:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.pumpAddresses.map((address, index) => (
                        <div 
                          key={index}
                          className="group relative flex items-center bg-gray-50 rounded-lg p-2.5 border border-gray-100 hover:border-gray-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <code className="text-sm font-mono text-gray-700">
                            {address.slice(0, 6)}...{address.slice(-6)}
                          </code>
                          <div className="flex items-center gap-1.5 ml-2 border-l pl-2 border-gray-200">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 rounded-full hover:bg-gray-200/70"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(address, `${item.id}-${index}`);
                              }}
                            >
                              {copiedStates[`${item.id}-${index}`] ? (
                                <span className="text-xs text-green-600 font-medium">已复制!</span>
                              ) : (
                                <svg 
                                  className="w-4 h-4 text-gray-600" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
                                  />
                                </svg>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 rounded-full hover:bg-gray-200/70"
                              onClick={(e) => {
                                e.stopPropagation();
                                openGmgn(address);
                              }}
                            >
                              <svg 
                                width="16" 
                                height="16" 
                                viewBox="0 0 32 32" 
                                className="opacity-90"
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_468_9437)">
                                  <path d="M8 30V32H30V30H28V26H26V24H28V22H30V20H32V12H30V4H28V2H22V4H20V8H18V4H16V2H10V4H8V12H4V10H0V20H2V22H8V24H12V26H10V30H8Z" fill="#9ED455"/>
                                  <path fillRule="evenodd" clipRule="evenodd" d="M16 2H14V4H16V6V8V10H18H20H22V8V6V4L20 4V6V8H18V6V4H16V2ZM6 20H8V22H6H4H2L2 20H4H6ZM4 12H2L2 14L2 16V18L2 20H0V18V16V14V12V10H2H4V12ZM4 12V14H6H8V12H10V10V8V6V4L8 4V6V8V10V12H6H4ZM12 26V24H10H8V22H10H12H14V24V26H12ZM10 30V28V26H12V28V30H10ZM10 30V32H8V30H10ZM30 30H28V28V26H26V24H28V22H30V20H32V18V16V14V12H30V10V8V6V4H28V2H26V4H28V6V8V10V12H30V14V16V18V20H28V22H26H24V24V26H26V28V30H28V32H30V30Z" fill="#457F2C"/>
                                  <rect x="10" y="6" width="4" height="6" fill="white"/>
                                  <rect x="10" y="8" width="2" height="4" fill="black"/>
                                  <rect x="12" y="18" width="2" height="6" transform="rotate(90 12 18)" fill="black"/>
                                  <path fillRule="evenodd" clipRule="evenodd" d="M14 4V6L10 6V4H14ZM4 14L4 12H2V14H4ZM4 14H10V16H4V14ZM26 6V4H22V6L26 6Z" fill="#D5F86B"/>
                                  <rect x="22" y="30" width="2" height="10" transform="rotate(90 22 30)" fill="#D09C4F"/>
                                  <rect x="22" y="28" width="2" height="8" transform="rotate(90 22 28)" fill="#D09C4F"/>
                                  <rect x="20" y="26" width="2" height="6" transform="rotate(90 20 26)" fill="#D09C4F"/>
                                  <rect x="20" y="24" width="2" height="4" transform="rotate(90 20 24)" fill="#D09C4F"/>
                                  <path fillRule="evenodd" clipRule="evenodd" d="M28 12V6H26V12H28ZM10 14V12H8V14H10ZM6 18V20H2V18H6ZM30 20V18V14H28V18H26V20H22V22V24H20V26H22H24V30H26V32H28V30H26V26H24V22H28V20H30ZM14 20V22H8V20H14ZM14 26V22H16V26H14ZM12 30V26H14V30H12ZM12 30H10V32H12V30ZM22 10V12H20V10H22Z" fill="#57A756"/>
                                  <rect x="22" y="6" width="4" height="6" fill="white"/>
                                  <rect x="22" y="8" width="2" height="4" fill="black"/>
                                </g>
                                <defs>
                                  <clipPath id="clip0_468_9437">
                                    <rect width="32" height="32" fill="white"/>
                                  </clipPath>
                                </defs>
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
