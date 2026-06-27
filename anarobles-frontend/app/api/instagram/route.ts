import { NextResponse } from "next/server"

export const revalidate = 3600

export async function GET() {
  const feedId = process.env.BEHOLD_FEED_ID ?? "fiYMNWqudvk6xOc09oT7"

  const res = await fetch(`https://feeds.behold.so/${feedId}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    return NextResponse.json({ posts: [] }, { status: 502 })
  }

  const data = await res.json()

  const posts = (data.posts ?? []).slice(0, 6).map((p: any) => ({
    id: p.id,
    permalink: p.permalink,
    mediaUrl:
      p.mediaType === "VIDEO"
        ? p.thumbnailUrl
        : (p.sizes?.medium?.mediaUrl ?? p.mediaUrl),
    caption: p.prunedCaption || p.caption || "",
  }))

  return NextResponse.json({ posts })
}
