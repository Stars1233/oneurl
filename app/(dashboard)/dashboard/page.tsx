import { requireAuth } from "@/lib/auth-guard";
import { profileService } from "@/lib/services/profile.service";
import { db } from "@/lib/db";
import { getAvatarUrl } from "@/lib/utils";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await requireAuth();
  const profile = await profileService.getByUserId(session.user.id);
  
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  const avatarUrl = getAvatarUrl(user || { avatarUrl: null, image: null });

  return (
    <DashboardClient
      initialProfile={{
        name: user?.name || session.user.name || "User",
        username: user?.username || null,
        bio: user?.bio || null,
        avatarUrl,
      }}
    />
  );
}

