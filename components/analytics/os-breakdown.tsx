"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getOSIcon } from "./analytics-icons";

interface OSItem {
  name: string;
  value: number;
}

interface OSBreakdownProps {
  data: OSItem[];
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const getOSColor = (osName: string, index: number) => {
  const lower = osName.toLowerCase();
  if (index === 0) {
    return { bg: "bg-blue-50/50 dark:bg-blue-950/30", badge: "bg-blue-500" };
  }
  if (lower.includes("macos") || lower.includes("mac") || lower.includes("ios")) {
    return { bg: "", badge: "bg-orange-500" };
  }
  return { bg: "", badge: "bg-gray-500" };
};

export function OSBreakdown({ data }: OSBreakdownProps) {
  if (data.length === 0) {
    return null;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;

  const getShare = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(2) : "0";
  };

  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Operating Systems</CardTitle>
        <CardDescription>OS breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          <div className="grid grid-cols-[1fr_80px_80px_80px] gap-4 px-2 py-2 text-xs font-medium text-muted-foreground border-b mb-2">
            <div>OPERATING SYSTEM</div>
            <div className="text-right">VISITORS</div>
            <div className="text-right">PAGEVIEWS</div>
            <div className="text-right">SHARE</div>
          </div>
          {sortedData.map((item, index) => {
            const OSIcon = getOSIcon(item.name);
            const share = getShare(item.value, total);
            const colors = getOSColor(item.name, index);
            const isHighlighted = index === 0;
            
            return (
              <div
                key={item.name}
                className={`grid grid-cols-[1fr_80px_80px_80px] gap-4 items-center px-2 py-3 rounded-lg transition-colors ${
                  isHighlighted ? colors.bg : ""
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <OSIcon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium truncate">{item.name}</span>
                </div>
                <div className="text-sm font-medium text-right">
                  {item.value.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-right">
                  {formatNumber(item.value)}
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium text-white ${colors.badge}`}>
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

