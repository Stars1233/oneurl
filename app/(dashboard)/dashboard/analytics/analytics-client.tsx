"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Globe, Monitor, Smartphone, Tablet } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088fe",
];

const PRIMARY_CHART_COLOR = "#8884d8";

interface ProfileStats {
  totalClicks: number;
  topLinks: Array<{ link_id: string; clicks: number }>;
  clicksOverTime: Array<{ date: string; clicks: number }>;
}

interface LinkStats {
  linkId: string;
  totalClicks: number;
  clicksOverTime: Array<{ date: string; clicks: number }>;
  clicksByCountry: Array<{ country: string; clicks: number }>;
  clicksByDevice: Array<{ device: string; clicks: number }>;
  clicksByBrowser: Array<{ browser: string; clicks: number }>;
  referrers: string[];
}

interface Link {
  id: string;
  title: string;
  url: string;
  isActive?: boolean;
}

interface AnalyticsClientProps {
  initialStats: ProfileStats;
  links: Link[];
}

export function AnalyticsClient({
  initialStats,
  links,
}: AnalyticsClientProps) {
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);

  const { data: stats = initialStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["analytics", selectedLinkId],
    queryFn: async () => {
      const url = selectedLinkId
        ? `/api/analytics?linkId=${selectedLinkId}`
        : "/api/analytics";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    initialData: selectedLinkId ? undefined : initialStats,
  });

  const selectedLink = selectedLinkId
    ? links.find((l) => l.id === selectedLinkId)
    : null;

  const topLinksWithDetails = stats.topLinks
    ? stats.topLinks
        .map((item: { link_id: string; clicks: number }) => {
          const link = links.find((l) => l.id === item.link_id);
          return {
            ...item,
            title: link?.title || "Unknown",
            url: link?.url || "",
          };
        })
        .slice(0, 10)
    : [];

  const clicksOverTimeData = stats.clicksOverTime
    ? stats.clicksOverTime.map((item: { date: string; clicks: number }) => ({
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        clicks: item.clicks,
      }))
    : [];

  const linkStats = stats as LinkStats;

  const deviceData = linkStats.clicksByDevice
    ? linkStats.clicksByDevice.map((item) => ({
        name: item.device,
        value: item.clicks,
      }))
    : [];

  const browserData = linkStats.clicksByBrowser
    ? linkStats.clicksByBrowser.map((item) => ({
        name: item.browser,
        value: item.clicks,
      }))
    : [];

  const countryData = linkStats.clicksByCountry
    ? linkStats.clicksByCountry.slice(0, 10).map((item) => ({
        name: item.country,
        value: item.clicks,
      }))
    : [];

  const getDeviceIcon = (device: string) => {
    const lower = device.toLowerCase();
    if (lower.includes("mobile") || lower.includes("phone")) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (lower.includes("tablet")) {
      return <Tablet className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {selectedLinkId && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Viewing analytics for
                </p>
                <p className="text-lg font-semibold">{selectedLink?.title}</p>
                <p className="text-sm text-muted-foreground truncate max-w-md">
                  {selectedLink?.url}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLinkId(null)}
              >
                <X className="h-4 w-4" />
                View All Links
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedLinkId && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalClicks || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {links.filter((l) => l.isActive !== false).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{links.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Clicks per Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {links.length > 0
                  ? Math.round(((stats.totalClicks || 0) / links.length) * 10) /
                    10
                  : 0}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedLinkId && (
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{linkStats.totalClicks || 0}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Clicks Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-[300px] w-full" />
            ) : clicksOverTimeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={clicksOverTimeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke={PRIMARY_CHART_COLOR}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Globe />
                  </EmptyMedia>
                  <EmptyTitle>No data yet</EmptyTitle>
                  <EmptyDescription>
                    Click data will appear here as visitors interact with your
                    links.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>

        {!selectedLinkId && (
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Links</CardTitle>
            </CardHeader>
            <CardContent>
              {topLinksWithDetails.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={topLinksWithDetails}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      type="number"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="title"
                      width={120}
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar
                      dataKey="clicks"
                      fill={PRIMARY_CHART_COLOR}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Globe />
                    </EmptyMedia>
                    <EmptyTitle>No data yet</EmptyTitle>
                    <EmptyDescription>
                      Start sharing your links to see analytics data here.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>
        )}

        {selectedLinkId && deviceData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {deviceData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(item.name)}
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedLinkId && browserData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Browsers</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={browserData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {browserData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {browserData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedLinkId && countryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={countryData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill={PRIMARY_CHART_COLOR}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {!selectedLinkId && topLinksWithDetails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Link Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLinksWithDetails.map((item: { link_id: string; title: string; url: string; clicks: number }, index: number) => (
                <div
                  key={item.link_id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedLinkId(item.link_id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                      <p className="text-sm font-medium truncate">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {item.url}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-bold">{item.clicks}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.clicks === 1 ? "click" : "clicks"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

