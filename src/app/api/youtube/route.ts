import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = 'AIzaSyBjQn6CRPP_zhXFAE1RxGtmuG6h-vbjh10';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/videos';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  const response = await fetch(`${YOUTUBE_API_URL}?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`);
  const data = await response.json();

  if (data.error) {
    return NextResponse.json({ error: data.error.message }, { status: 400 });
  }

  const video = data.items[0];

  if (!video) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 });
  }

  const videoData = {
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails.high.url,
    publishedAt: video.snippet.publishedAt,
  };

  return NextResponse.json(videoData);
}