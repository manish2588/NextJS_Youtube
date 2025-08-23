export interface VideoSnippet {
  title: string;
  description: string;
  channelTitle: string;
  thumbnails: {
    medium: {
      url: string;
      width: number;
      height: number;
    };
  };
}

export interface Video {
  id: string;
  snippet: VideoSnippet;
}

const API_KEY = 'YOUR_YOUTUBE_API_KEY';

export const fetchTrendingVideos = async (): Promise<Video[]> => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=50&regionCode=US&key=${API_KEY}`
  );

  if (!res.ok) throw new Error('Failed to fetch videos');

  const data = await res.json();
  return data.items.map((item: any) => ({
    id: item.id,
    snippet: item.snippet,
  }));
};
