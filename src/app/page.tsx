'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [videoId, setVideoId] = useState<string>('');
  const [videoData, setVideoData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleVideoIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoId(event.target.value);
  };

  const fetchVideoData = async () => {
    if (!videoId) {
      setError('Please enter a Video ID.');
      return;
    }

    try {
      const res = await fetch(`/api/youtube?videoId=${videoId}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setVideoData(null);
      } else {
        setVideoData(data);
        setError('');
      }
    } catch (err) {
      setError('An error occurred while fetching the video data.');
      setVideoData(null);
    }
  };

  const handleGetSubtitles = async () => {
    if (!videoId) {
      setError('Please enter a Video ID.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/youtube/subtitles?videoId=${videoId}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Create a blob from the subtitle data and trigger a download
        const subtitleBlob = new Blob([data.subtitles], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(subtitleBlob);
        link.download = `${videoId}-subtitles.srt`; // Change extension if needed
        link.click();
      }
    } catch (err) {
      setError('An error occurred while fetching subtitles.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto py-8 px-4 md:px-0">
      <div className="flex justify-center mb-8"><img src="/logoo.png" alt='Converse Box' className="h-8" /></div>
      <div className="flex items-center">
        <input
          className="px-4 py-2 w-full border-t border-b border-l border-gray-200 rounded-l-full h-10 outline-none placeholder:text-gray-400"
          placeholder="Enter Video ID"
          value={videoId}
          onChange={handleVideoIdChange}
        />
        <button
          className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-r-full h-10"
          onClick={fetchVideoData}
        >
          Confirm
        </button>
      </div>

      {videoData && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8">
          <div className="relative">
            <img src={videoData.thumbnail} alt={videoData.title} className="w-full object-cover aspect-video" />
            <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white py-1 px-2 rounded-md w-fit">
              <h2 className="text-xl font-semibold line-clamp-2">{videoData.title}</h2>
            </div>
          </div>

          <div className="p-6">
          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

            <button
              className="mb-6 px-4 py-2 rounded-full bg-violet-50 text-violet-600 font-semibold w-full"
              onClick={handleGetSubtitles}
              disabled={isLoading}
            >
              {isLoading ? 'Downloading...' : 'Get subtitles for this video'}
            </button>
            <p className="text-gray-600 text-sm whitespace-pre-line max-h-32 overflow-y-auto">{videoData.description}</p>
            <div className="mt-4 text-gray-400 text-sm">
              <p>Published on {new Date(videoData.publishedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}