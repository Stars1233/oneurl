"use client";

import Image from "next/image";
import Link from "next/link";
import { Share2 } from "lucide-react";
import { ShareDialog } from "@/components/share-dialog";
import { useState } from "react";

interface ProfileCardHeaderProps {
  name: string;
  username: string | null;
  avatarUrl: string | null;
}

/**
 * ProfileCardHeader component displays action buttons inside the profile card:
 * 1. Logo/Home button (top-left) - links to OneURL homepage
 * 2. Share button (top-right) - opens share dialog
 */
export function ProfileCardHeader({
  name,
  username,
  avatarUrl,
}: ProfileCardHeaderProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        {/* Logo/Home Button */}
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-background border shadow-sm hover:bg-accent transition-colors"
          aria-label="Go to OneURL homepage"
        >
          <Image
            src="/logo.png"
            alt="OneURL"
            width={24}
            height={24}
            className="h-6 w-6"
            priority
          />
        </Link>

        {/* Share Button */}
        <button
          onClick={() => setShareDialogOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-background border shadow-sm hover:bg-accent transition-colors"
          aria-label="Share profile"
        >
          <Share2 className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Share Dialog */}
      {username && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          name={name}
          username={username}
          avatarUrl={avatarUrl}
        />
      )}
    </>
  );
}

