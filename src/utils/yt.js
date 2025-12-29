export function extractPlaylistId(url) {
  try {
    const u = new URL(url);
    return u.searchParams.get("list");
  } catch {
    return null;
  }
}

const API = "https://www.googleapis.com/youtube/v3";

// --- FETCH PLAYLIST TITLE ---
export async function fetchPlaylistTitle(playlistId, apiKey) {
  const res = await fetch(
    `${API}/playlists?part=snippet&id=${playlistId}&key=${apiKey}`
  );

  const data = await res.json();

  if (data.error) throw new Error(data.error.message);

  return data.items?.[0]?.snippet?.title || "Playlist";
}

// --- FETCH PLAYLIST ITEMS ---
export async function fetchPlaylistItems(playlistId, apiKey) {
  let items = [];
  let nextPageToken = "";

  while (true) {
    const res = await fetch(
      `${API}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`
    );

    const data = await res.json();

    if (data.error) throw new Error(data.error.message);

    const mapped = data.items.map((i) => ({
      videoId: i.snippet.resourceId.videoId,
      title: i.snippet.title,
    }));

    items.push(...mapped);

    if (!data.nextPageToken) break;
    nextPageToken = data.nextPageToken;
  }

  return items;
}

// --- FORMAT ISO DURATION ---
function formatDuration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  const h = parseInt(match?.[1] || 0);
  const m = parseInt(match?.[2] || 0);
  const s = parseInt(match?.[3] || 0);

  const total = h * 3600 + m * 60 + s;

  const mm = Math.floor(total / 60).toString().padStart(2, "0");
  const ss = (total % 60).toString().padStart(2, "0");

  return `${mm}:${ss}`;
}

// --- FETCH DURATIONS ---
export async function fetchDurations(videoIds, apiKey) {
  const chunks = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    chunks.push(videoIds.slice(i, i + 50));
  }

  const result = [];

  for (const chunk of chunks) {
    const res = await fetch(
      `${API}/videos?part=contentDetails&id=${chunk.join(",")}&key=${apiKey}`
    );

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    data.items.forEach((v) => {
      result.push({
        id: v.id,
        duration: formatDuration(v.contentDetails.duration),
      });
    });
  }

  return result;
}
