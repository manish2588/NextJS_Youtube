
interface YouTubeAPIVideoItem {
  id: string;
  snippet: VideoSnippet;
  statistics: {
    viewCount: string;
    likeCount: string;
    [key: string]: string; 
  };
  contentDetails?: {
    duration: string;
    [key: string]: string; 
  };
}

interface YouTubeAPIResponse {
  items: YouTubeAPIVideoItem[];
  nextPageToken?: string;
}

interface YouTubeAPISearchItem {
  id: {
    videoId: string;
  };
  snippet: VideoSnippet;
}

interface YouTubeAPISearchResponse {
  items: YouTubeAPISearchItem[];
}

interface YouTubeAPIChannelItem {
  snippet: {
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
  statistics: {
    subscriberCount: string;
    [key: string]: string; 
  };
}

interface YouTubeAPIChannelResponse {
  items: YouTubeAPIChannelItem[];
}

interface YouTubeAPICommentItem {
  id: string;
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string;
        authorProfileImageUrl: string;
        textDisplay: string;
        publishedAt: string;
      };
    };
  };
}

interface YouTubeAPICommentResponse {
  items: YouTubeAPICommentItem[];
}

export interface VideoSnippet {
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnails: {
    high: {
      url: string;
      width: number;
      height: number;
    };
  };
  channelId: string;
}

export interface Video {
  id: string;
  snippet: VideoSnippet;
  statistics: {
    viewCount: string;
    likeCount: string;
  };
  contentDetails?: {
    duration: string;
  };
}

export interface Comment {
  id: string;
  authorName: string;
  authorProfileImageUrl: string;
  text: string;
  publishedAt: string;
}

const API_KEY = "AIzaSyA0G-xMxl48275WNxbjSu5cBnr6Pcv8dmg";

// YouTube category IDs (for reference)
export const CATEGORY_IDS: Record<string, string> = {
  All: "all",
  Music: "10",
  Gaming: "20",
  News: "25",
  Live: "live",
  Sports: "17",
  Learning: "27",
  Movies: "1",
  Fashion: "26",
  Tech: "28",
  Comedy: "23",
  Travel: "19",
  Education: "27",
  Podcasts: "0",
};

// Fetch trending videos (all categories)
export const fetchTrendingVideos = async (pageToken = ""): Promise<{ items: Video[]; nextPageToken?: string }> => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&videoDuration=long&maxResults=10&regionCode=US&pageToken=${pageToken}&key=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch videos");
  const data: YouTubeAPIResponse = await res.json();
  return { 
    items: data.items.map((item: YouTubeAPIVideoItem) => ({
      id: item.id,
      snippet: item.snippet,
      statistics: item.statistics,
    })), 
    nextPageToken: data.nextPageToken 
  };
};

export const fetchVideosByCategoryId = async (categoryId: string | string[], pageToken = ""): Promise<{ items: Video[]; nextPageToken?: string }> => {
  if (categoryId === "all") return fetchTrendingVideos(pageToken);

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&videoDuration=long&maxResults=10&regionCode=US&videoCategoryId=${categoryId}&pageToken=${pageToken}&key=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch category videos");

  const data: YouTubeAPIResponse = await res.json();
  return { 
    items: data.items.map((item: YouTubeAPIVideoItem) => ({
      id: item.id,
      snippet: item.snippet,
      statistics: item.statistics,
    })), 
    nextPageToken: data.nextPageToken 
  };
};

// Fetch single channel logo
export const fetchChannelLogo = async (channelId: string): Promise<string> => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch channel logo");

  const data: YouTubeAPIChannelResponse = await res.json();
  return data.items[0].snippet.thumbnails.default.url;
};

// Extended Video interface for fetchVideoById return
interface ExtendedVideo extends Video {
  channelThumbnail: string;
  subscriberCount: string;
}

// Fetch single video by ID
export const fetchVideoById = async (id: string | string[]): Promise<ExtendedVideo> => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch video");
  const data: YouTubeAPIResponse = await res.json();
  const video = data.items[0];

  // Fetch channel info including subscriber count
  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${video.snippet.channelId}&key=${API_KEY}`
  );
  if (!channelRes.ok) throw new Error("Failed to fetch channel info");
  const channelData: YouTubeAPIChannelResponse = await channelRes.json();
  const channel = channelData.items[0];

  return {
    ...video,
    channelThumbnail: channel.snippet.thumbnails.default.url,
    subscriberCount: channel.statistics.subscriberCount,
  };
};

// Fetch related videos 
export const fetchRelatedVideos = async (id: string): Promise<Video[]> => {
  try {
    // First try the search method with relatedToVideoId
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${id}&type=video&maxResults=10&key=${API_KEY}`
    );

    console.log("Search API response status:", searchRes.status);

    if (!searchRes.ok) {
      // If the relatedToVideoId method fails, fall back to search by same channel
      console.log("Falling back to channel search method");
      const videoRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${API_KEY}`
      );

      if (!videoRes.ok) throw new Error("Failed to fetch video details");

      const videoData: YouTubeAPIResponse = await videoRes.json();
      const channelId = videoData.items[0].snippet.channelId;

      // Search for videos from the same channel
      const channelSearchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&maxResults=30&order=date&key=${API_KEY}`
      );

      if (!channelSearchRes.ok)
        throw new Error("Failed to fetch channel videos");

      const channelSearchData: YouTubeAPISearchResponse = await channelSearchRes.json();

      // Extract video IDs
      const videoIdsArr = channelSearchData.items
        .map((item: YouTubeAPISearchItem) => item.id?.videoId)
        .filter((videoId): videoId is string => Boolean(videoId))
        .filter((videoId: string) => videoId !== id); 

      if (videoIdsArr.length === 0) return [];

      // Fetch details for these videos
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIdsArr.join(
          ","
        )}&key=${API_KEY}`
      );

      if (!videosRes.ok) throw new Error("Failed to fetch video details");

      const videosData: YouTubeAPIResponse = await videosRes.json();

      return videosData.items.map((item: YouTubeAPIVideoItem) => ({
        id: item.id,
        snippet: item.snippet,
        statistics: item.statistics,
      }));
    }

    const searchData: YouTubeAPISearchResponse = await searchRes.json();
    console.log("Search API data:", searchData);

    // Extract video IDs 
    const videoIdsArr = searchData.items
      .map((item: YouTubeAPISearchItem) => item.id?.videoId)
      .filter((videoId): videoId is string => Boolean(videoId));

    if (videoIdsArr.length === 0) return [];

    // Fetch details for these videos
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIdsArr.join(
        ","
      )}&key=${API_KEY}`
    );

    if (!videosRes.ok) throw new Error("Failed to fetch video details");

    const videosData: YouTubeAPIResponse = await videosRes.json();

    return videosData.items.map((item: YouTubeAPIVideoItem) => ({
      id: item.id,
      snippet: item.snippet,
      statistics: item.statistics,
    }));
  } catch (error) {
    console.error("Error fetching related videos:", error);
    throw error;
  }
};

// Fetch comments for a video
export const fetchCommentsByVideoId = async (videoId: string | string[]): Promise<Comment[]> => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=15&key=${API_KEY}`
  );

  if (!res.ok) throw new Error("Failed to fetch comments");

  const data: YouTubeAPICommentResponse = await res.json();

  return data.items.map((item: YouTubeAPICommentItem) => ({
    id: item.id,
    authorName: item.snippet.topLevelComment.snippet.authorDisplayName,
    authorProfileImageUrl: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
    text: item.snippet.topLevelComment.snippet.textDisplay,
    publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
  }));
};

// Fetch search results by query
export const fetchSearchResults = async (q: string): Promise<Video[]> => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&videoDuration=long&q=${encodeURIComponent(
      q
    )}&key=${API_KEY}`
  );

  if (!res.ok) throw new Error("Failed to fetch search results");

  const data: YouTubeAPISearchResponse = await res.json();

  // Extract video IDs 
  const videoIds = data.items
    .map((item: YouTubeAPISearchItem) => item.id.videoId)
    .filter((videoId): videoId is string => Boolean(videoId));

  if (videoIds.length === 0) return [];

  // Fetch full video details (with statistics)
  const detailsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(
      ","
    )}&key=${API_KEY}`
  );

  if (!detailsRes.ok) throw new Error("Failed to fetch video details");

  const detailsData: YouTubeAPIResponse = await detailsRes.json();

  return detailsData.items.map((item: YouTubeAPIVideoItem) => ({
    id: item.id,
    snippet: item.snippet,
    statistics: item.statistics,
    contentDetails: item.contentDetails, 
  }));
};