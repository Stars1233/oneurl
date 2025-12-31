"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@uploadthing/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Field, FieldLabel, FieldControl, FieldDescription } from "@/components/ui/field";
import { Fieldset } from "@/components/ui/fieldset";
import type { OurFileRouter } from "@/lib/uploadthing";
import { toastSuccess, toastError } from "@/lib/toast";

interface AvatarClientProps {
  initialImageUrl: string | null;
  initialName: string;
  initialBio: string;
}

export default function AvatarClient({
  initialImageUrl,
  initialName,
  initialBio,
}: AvatarClientProps) {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialImageUrl);
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleUploadComplete = async (res: { url: string }[]) => {
    if (res && res[0]?.url) {
      const newUrl = res[0].url;
      setAvatarUrl(newUrl);
      setUploadedUrl(newUrl);
      setIsUploading(false);
      
      try {
        await fetch("/api/profile/avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatarUrl: newUrl }),
        });
        toastSuccess("Avatar uploaded", "Your profile picture has been updated");
      } catch {
        toastError("Upload failed", "Failed to save your avatar");
      }
    }
  };

  const handleSkip = async () => {
    await saveProfileData();
    router.push("/onboarding/links");
  };

  const saveProfileData = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      });
      toastSuccess("Profile saved", "Your profile information has been updated");
    } catch {
      toastError("Save failed", "Failed to save your profile information");
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await saveProfileData();
    router.push("/onboarding/links");
  };

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Complete your profile</h2>
          <p className="text-muted-foreground">
            Add your profile picture, name, and bio to personalize your page
          </p>
        </div>

        <form onSubmit={handleContinue}>
          <Fieldset>
            <Field>
              <FieldLabel>Profile Picture</FieldLabel>
              <FieldDescription>
                Upload an image file (max 4MB). You can change this later.
              </FieldDescription>
              <FieldControl
                render={() => (
                  <div className="flex flex-col items-center space-y-4 w-full">
                    <Avatar className="h-32 w-32 border-2 border-dashed border-muted-foreground/30 transition-all duration-200">
                      {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar preview" />}
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

                    <UploadButton<OurFileRouter, "avatarUploader">
                      endpoint="avatarUploader"
                      onUploadBegin={() => setIsUploading(true)}
                      onClientUploadComplete={handleUploadComplete}
                      onUploadError={() => {
                        setIsUploading(false);
                        toastError("Upload failed", "Failed to upload your image");
                      }}
                      content={{
                        button: ({ ready }: { ready: boolean }) => (
                          <Button type="button" disabled={!ready || isUploading} className="w-full">
                            {isUploading ? "Uploading..." : uploadedUrl ? "Change File" : "Choose File"}
                          </Button>
                        ),
                      }}
                    />
                    <p className="text-xs text-muted-foreground">Image (4MB max)</p>
                  </div>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldDescription>
                Your display name that will be shown on your profile
              </FieldDescription>
              <FieldControl
                render={(props) => (
                  <Input
                    {...props}
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    disabled={isSaving}
                  />
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <FieldDescription>
                A short description about yourself (optional)
              </FieldDescription>
              <FieldControl
                render={(props) => (
                  <Textarea
                    {...props}
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    disabled={isSaving}
                  />
                )}
              />
            </Field>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleSkip}
                disabled={isSaving}
              >
                Skip
              </Button>
              <Button type="submit" className="flex-1" disabled={isSaving}>
                {isSaving ? "Saving..." : "Continue"}
              </Button>
            </div>
          </Fieldset>
        </form>
      </div>
    </div>
  );
}

