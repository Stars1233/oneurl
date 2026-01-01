import { BarChart3 } from "lucide-react";
import { requireAuth } from "@/lib/auth-guard";
import { analyticsService } from "@/lib/services/analytics.service";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { AnalyticsClient } from "./analytics-client";

export default async function AnalyticsPage() {
  const session = await requireAuth();
  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
    include: { links: true },
  });

  if (!profile) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your link performance
          </p>
        </div>
        <Card>
          <CardContent className="p-12">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BarChart3 />
                </EmptyMedia>
                <EmptyTitle>No profile found</EmptyTitle>
                <EmptyDescription>
                  Create a profile to start tracking analytics.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = await analyticsService.getProfileStats(profile.id);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your link performance and understand your audience
        </p>
      </div>

      <AnalyticsClient
        initialStats={stats}
        links={profile.links.map((link) => ({
          id: link.id,
          title: link.title,
          url: link.url,
          isActive: link.isActive,
        }))}
      />
    </div>
  );
}

