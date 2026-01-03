"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getBrowserIcon } from "./analytics-icons";

interface BrowserItem {
  name: string;
  value: number;
}

interface BrowserBreakdownProps {
  data: BrowserItem[];
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export function BrowserBreakdown({ data }: BrowserBreakdownProps) {
  if (data.length === 0) {
    return null;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;

  const getShare = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(2) : "0";
  };

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const isFirstRow = (index: number) => index === 0;

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Browsers</CardTitle>
        <CardDescription>Browser breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          <div className="grid grid-cols-[1fr_80px_80px_80px] gap-4 px-2 py-2 text-xs font-medium text-muted-foreground border-b mb-2">
            <div>BROWSER</div>
            <div className="text-right">VISITORS</div>
            <div className="text-right">PAGEVIEWS</div>
            <div className="text-right">SHARE</div>
          </div>
          {sortedData.map((item, index) => {
            const BrowserIcon = getBrowserIcon(item.name);
            const share = getShare(item.value, total);
            const isHighlighted = isFirstRow(index);
            
            return (
              <div
                key={item.name}
                className={`grid grid-cols-[1fr_80px_80px_80px] gap-4 items-center px-2 py-3 rounded-lg transition-colors ${
                  isHighlighted 
                    ? "bg-blue-50/50 dark:bg-blue-950/30" 
                    : ""
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <BrowserIcon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium truncate">{item.name}</span>
                </div>
                <div className="text-sm font-medium text-right">
                  {item.value.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-right">
                  {formatNumber(item.value)}
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${
                    isHighlighted 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-500 text-white"
                  }`}>
                    {share}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

