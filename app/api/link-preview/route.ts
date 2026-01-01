import { NextResponse } from "next/server";
import { getFallbackPreviewImage } from "@/lib/utils/link-preview-image";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  let validUrl: string;
  try {
    const urlObj = new URL(url);
    validUrl = urlObj.toString();
  } catch {
    try {
      validUrl = new URL(`https://${url}`).toString();
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/preview?url=${encodeURIComponent(validUrl)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 403 || response.status === 408 || response.status === 404) {
        const fallback = await getFallbackPreviewImage();
        return NextResponse.json({
          title: null,
          description: null,
          image: fallback,
          logo: null,
          url: validUrl,
        });
      }

      throw new Error(errorData.error || `Backend returned ${response.status}`);
    }

    const result = await response.json();
    const metadata = result.data;

    let image = metadata.image;
    if (!image) {
      image = await getFallbackPreviewImage();
    }

    return NextResponse.json({
      title: metadata.title,
      description: metadata.description,
      image,
      logo: metadata.logo,
      url: metadata.url,
    });
  } catch (error) {
    console.error("Error fetching link preview:", error);
    const fallback = await getFallbackPreviewImage();
    return NextResponse.json({
      title: null,
      description: null,
      image: fallback,
      logo: null,
      url: validUrl,
    });
  }
}

