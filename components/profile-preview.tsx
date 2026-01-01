"use client";

import { Link2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import type { Link } from "@/lib/hooks/use-links";

interface ProfilePreviewProps {
  name: string;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  links: Link[];
  className?: string;
}

export function ProfilePreview({
  name,
  username,
  bio,
  avatarUrl,
  links,
  className,
}: ProfilePreviewProps) {
  const activeLinks = links.filter((link) => link.isActive);

  return (
    <div className={`flex items-center justify-center ${className || ""}`}>
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border bg-card p-8 shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 border-2">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
              <AvatarFallback>
                <svg
                  className="h-12 w-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h1 className="text-2xl font-bold">{name}</h1>
              {username && (
                <p className="text-sm text-muted-foreground">@{username}</p>
              )}
              {bio && (
                <p className="mt-3 text-sm leading-relaxed">{bio}</p>
              )}
            </div>
          </div>

          {activeLinks.length > 0 ? (
            <div className="mt-8 space-y-3">
              {activeLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border bg-background p-4 text-center font-medium transition-all hover:bg-accent hover:shadow-md active:scale-[0.98]"
                >
                  {link.title}
                </a>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Link2 />
                  </EmptyMedia>
                  <EmptyTitle>No links available yet</EmptyTitle>
                  <EmptyDescription>
                    Add links to see them appear here.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

