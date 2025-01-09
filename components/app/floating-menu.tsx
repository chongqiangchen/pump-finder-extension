import React from "react";
import { Button } from "~/components/ui/button";
import { Wand2, Languages, Sparkles, Copy, Loader2 } from "lucide-react";
import type { Position } from "~/types";
import { MenuItem } from "./menu-item";

interface FloatingMenuProps {
  position: Position;
  showMenu: boolean;
  onButtonClick: (e: React.MouseEvent) => void;
  onPumpSearch: () => void;
  loading: boolean;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  position,
  showMenu,
  onButtonClick,
  onPumpSearch,
  loading,
}) => (
  <div
    style={{
      position: "absolute",
      left: `${position.x}px`,
      top: `${position.y}px`,
      transform: "translate(-50%, -100%)",
      pointerEvents: "auto",
    }}
  >
    <div className="relative">
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8 bg-background"
        onClick={onPumpSearch}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
      </Button>

      {showMenu && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-32 py-1 rounded-md border bg-background shadow-md">
          <MenuItem onClick={onPumpSearch}>
            Pump 搜索
          </MenuItem>
        </div>
      )}
    </div>
  </div>
);
