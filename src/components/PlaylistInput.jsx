import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  extractPlaylistId,
  fetchPlaylistItems,
  fetchDurations,
} from "../utils/yt";

export default function PlaylistInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;

    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
      alert("Invalid playlist link");
      return;
    }

    try {
      setLoading(true);

      const apiKey = import.meta.env.VITE_YT_API_KEY;
      if (!apiKey) {
        alert("API key missing");
        return;
      }

      // 1) fetch playlist videos
      const items = await fetchPlaylistItems(playlistId, apiKey);

      // 2) fetch durations
      const durations = await fetchDurations(
        items.map((i) => i.videoId),
        apiKey
      );

      // 3) combine data
      const courseVideos = items.map((i) => {
        const d = durations.find((x) => x.id === i.videoId);
        return {
          id: i.videoId,
          title: i.title,
          duration: d?.duration || "00:00",
          done: false,
        };
      });

      const id = crypto.randomUUID();

      const courseData = {
        id,
        title: "Imported Playlist",
        videos: courseVideos,
      };

      localStorage.setItem(`course_${id}`, JSON.stringify(courseData));

      navigate(`/course/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to load playlist");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Paste YouTube playlist link"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Importing..." : "Create"}
      </button>
    </form>
  );
}
