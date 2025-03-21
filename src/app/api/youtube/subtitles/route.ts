import { NextResponse } from 'next/server';
import axios from 'axios';
import { getSubtitles } from 'youtube-captions-scraper'; // youtube-captions-scraper をインポート

const YOUTUBE_API_KEY = 'AIzaSyBjQn6CRPP_zhXFAE1RxGtmuG6h-vbjh10'; // YouTube APIキー

// Helper function to fetch video data from YouTube Data API
async function fetchVideoDataFromAPI(videoId: string) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`;
  const response = await axios.get(url);

  if (response.data.items.length === 0) {
    return { error: 'Video not found' };
  }

  const video = response.data.items[0];
  return {
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails.high.url,
    publishedAt: video.snippet.publishedAt,
  };
}

// Fetch subtitles using youtube-captions-scraper
async function fetchSubtitlesFromAPI(videoId: string) {
  try {
    const subtitles = await getSubtitles({
      videoID: videoId, // 動画IDを渡す
      lang: 'en', // English字幕を優先して取得
    });

    if (subtitles.length === 0) {
      return null; // 字幕がない場合はnullを返す
    }

    // 字幕がある場合、その内容を返す
    return subtitles.map(subtitle => subtitle.text).join('\n');
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    return null; // エラー発生時はnull
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    // YouTubeの動画データを取得
    const videoData = await fetchVideoDataFromAPI(videoId);

    if (videoData.error) {
      return NextResponse.json(videoData, { status: 404 });
    }

    // 字幕を取得
    const subtitles = await fetchSubtitlesFromAPI(videoId);

    return NextResponse.json({ videoData, subtitles }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 });
  }
}