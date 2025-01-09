import React, { useState, useRef, useEffect } from "react";
import { useToast } from "~/hooks/use-toast";
import { Toaster } from "~/components/ui/toaster";
import { useSettings } from "~/hooks/use-settings";
import { useTextSelection } from "~/hooks/use-text-selection";
import { useTextObserver } from "~/hooks/use-text-observer";
import { FloatingMenu } from "~/components/app/floating-menu";
import { ResultCard } from "~/components/app/result-card";
import {
  fuzzySearch,
  advancedSearch,
} from "~/services/api";
import type { AdvancedSearchResponse, FuzzySearchResponse, ResultState } from "~/types";

const App: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [result, setResult] = useState<
    Array<{
      fuzzySearch?: FuzzySearchResponse;
      advancedSearch?: AdvancedSearchResponse["coin"];
    }>
  >([]);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const { settings } = useSettings();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const hideAll = () => {
    setShowMenu(false);
    setResult([]);
    setLoading(false);
  };

  const { showFloating, position, selectedText, setShowFloating } =
    useTextSelection({
      menuRef,
      resultRef,
      onHide: hideAll,
    });

  useTextObserver();

  const handleAction = async () => {
    try {
      setLoading(true);
      const data = await fuzzySearch(selectedText);
      const fuzzyInfo = data.data;
      console.log("fuzzyInfo: ", fuzzyInfo);

      if (!fuzzyInfo) {
        return;
      }

      let result: any[] = [];

      for (const item of fuzzyInfo) {
        let advancedInfo = null;
          console.log("item: ", item);
          if (!item.complete) {
            const advancedData = await advancedSearch(item.mint);
            console.log("advancedData: ", advancedData);
            advancedInfo = advancedData.data?.coin;
          }
          result.push({ fuzzySearch: item, advancedSearch: advancedInfo });
      }

      setLoading(false);
      console.log("result: ", result);
      setResult(result);
      setShowMenu(false);
    } catch (error) {
      console.error(`pumpSearch failed:`, error);
      toast({
        variant: "destructive",
        description: `pumpSearch failed, please try again`,
        duration: 2000,
      });
      hideAll();
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          pointerEvents: "none",
        }}
      >
        {showFloating && (
          <div ref={menuRef} data-floating-menu>
            <FloatingMenu
              position={position}
              showMenu={showMenu}
              loading={loading}
              onButtonClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              onPumpSearch={() => handleAction()}
            />
          </div>
        )}

        {result.length > 0 && (
          <div
            ref={resultRef}
            style={{
              position: "absolute",
              left: `${position.x}px`,
              top: `${position.y + 20}px`,
              transform: "translateX(-50%)",
              pointerEvents: "auto",
            }}
          >
            <ResultCard
              result={result}
              loading={loading}
              onClose={hideAll}
            />
          </div>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default App;
