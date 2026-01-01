import { notFound } from "next/navigation";
import { Link2 } from "lucide-react";
import { profileService } from "@/lib/services/profile.service";
import type { Metadata } from "next";
import Image from "next/image";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import LinkClickTracker from "./link-click-tracker";
import { getAvatarUrl } from "@/lib/utils";
import { ProfileCardHeader } from "@/components/profile-card-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await profileService.getByUsername(username);

  if (!user || !user.profile?.isPublished) {
    return {
      title: "Profile Not Found",
    };
  }

  const avatarUrl = getAvatarUrl(user);
  const profileUrl = `https://oneurl-alpha.vercel.app/${username}`;
  const images = avatarUrl 
    ? [{ url: avatarUrl, width: 400, height: 400, alt: `${user.name}'s profile picture` }]
    : [{ url: "/og.png", width: 1200, height: 630, alt: "OneURL" }];

  return {
    title: `${user.name} | OneURL`,
    description: user.bio || `Visit ${user.name}'s profile on OneURL`,
    metadataBase: new URL("https://oneurl-alpha.vercel.app"),
    openGraph: {
      title: `${user.name} | OneURL`,
      description: user.bio || `Visit ${user.name}'s profile on OneURL`,
      url: profileUrl,
      siteName: "OneURL",
      images,
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.name} | OneURL`,
      description: user.bio || `Visit ${user.name}'s profile on OneURL`,
      images: images.map(img => img.url),
    },
    alternates: {
      canonical: profileUrl,
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const user = await profileService.getByUsername(username);

  if (!user || !user.profile?.isPublished) {
    notFound();
  }

  const links = user.profile.links.filter((link) => link.isActive);

  const avatarUrl = getAvatarUrl(user);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="w-full max-w-sm">
        {/* Simple Card */}
        <div className="rounded-2xl border bg-card p-8 shadow-lg">
          {/* Header with Logo and Share buttons */}
          <ProfileCardHeader
            name={user.name}
            username={user.username}
            avatarUrl={avatarUrl}
          />

          {/* Profile Content */}
          <div className="flex flex-col items-center space-y-4">
            {avatarUrl && (
              <Image
                src={avatarUrl}
                alt={user.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full border-2"
              />
            )}
            <div className="text-center">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              {user.username && (
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              )}
              {user.bio && (
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{user.bio}</p>
              )}
            </div>
          </div>

          {/* Links */}
          {links.length > 0 && (
            <div className="mt-8 space-y-3">
              {links.map((link) => (
                <LinkClickTracker
                  key={link.id}
                  linkId={link.id}
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border bg-background p-4 text-center font-medium transition-all hover:bg-accent hover:shadow-md active:scale-[0.98]"
                  >
                    {link.title}
                  </a>
                </LinkClickTracker>
              ))}
            </div>
          )}

          {links.length === 0 && (
            <div className="mt-8">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Link2 />
                  </EmptyMedia>
                  <EmptyTitle>No links available yet</EmptyTitle>
                  <EmptyDescription>
                    This profile doesn&apos;t have any links to display.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}

          {/* CTA Button at bottom */}
          <div className="mt-8 flex justify-center">
            <Link href="/signup">
              <Button
                variant="outline"
                className="rounded-full w-full max-w-xs"
              >
                Join {user.username || "OneURL"} on OneURL
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
