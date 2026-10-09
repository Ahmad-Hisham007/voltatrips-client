import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return handleRevalidate(request);
}

export async function GET(request: NextRequest) {
  return handleRevalidate(request);
}

async function handleRevalidate(request: NextRequest) {
  const url = request.nextUrl;
  const secret = url.searchParams.get("secret");
  const path = url.searchParams.get("path");
  const tag = url.searchParams.get("tag");

  console.log("--------------------------------------------------");
  console.log(
    `[Revalidate Webhook Received] Time: ${new Date().toISOString()}`,
  );
  console.log(
    `[Query Params] secret: ${secret ? "PROVIDED" : "MISSING"}, path: ${path}, tag: ${tag}`,
  );

  // Secret token validation
  if (secret !== process.env.NEXTCache_REVALIDATE_SECRET) {
    console.error("[Revalidate Error] Invalid or missing secret token!");
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    if (path) {
      console.log(
        `[Revalidation Triggered] Revalidating specific path: ${path}`,
      );
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        type: "path",
        path,
        now: Date.now(),
      });
    }

    if (tag) {
      console.log(`[Revalidation Triggered] Revalidating tag: ${tag}`);
      revalidateTag(tag, "max");
      return NextResponse.json({
        revalidated: true,
        type: "tag",
        tag,
        now: Date.now(),
      });
    }

    // Default: WP Webhooks specific query parameter na pathale full app layout revalidate korbe
    console.log(
      "[Revalidation Triggered] Revalidating entire app via layout...",
    );
    revalidatePath("/", "layout");

    return NextResponse.json({
      revalidated: true,
      type: "global_layout",
      message: "Full site cache purged successfully",
      now: Date.now(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[Revalidate Exception]:", err);

    return NextResponse.json(
      { message: "Error revalidating", error: errorMessage },
      { status: 500 },
    );
  }
}
