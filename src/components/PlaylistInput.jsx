import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  extractPlaylistId,
  fetchPlaylistItems,
  fetchDurations,
  fetchPlaylistTitle,
} from "../utils/yt";

export default function PlaylistInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;

    const playlistId = extractPlaylistId(url);
    // check if course already exists
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith("course_")) {
        const stored = JSON.parse(localStorage.getItem(key));

        if (stored.playlistId === playlistId) {
          navigate(`/course/${stored.id}`);
          return;
        }
      }
    }

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

      // 1) title
      const title = await fetchPlaylistTitle(playlistId, apiKey);

      // 2) videos
      const items = await fetchPlaylistItems(playlistId, apiKey);

      // 3) durations
      const durations = await fetchDurations(
        items.map((i) => i.videoId),
        apiKey
      );

      // merge
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
        playlistId,

        title,
        videos: courseVideos,

        pace: 1,
        deadline: null,

        createdAt: new Date().toISOString(),
        lastChecked: new Date().toISOString(),

        streak: 0,
        lastActive: null,
        completedToday: 0,

        completedAt: null,
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
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        placeholder="Paste YouTube playlist link"
        value={url}
        disabled={loading}
        onChange={(e) => setUrl(e.target.value)}
        style={{ flex: 1, padding: 8 }}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Fetching playlist…" : "Create"}
      </button>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: "2px solid #999",
              borderTopColor: "transparent",
              animation: "spin 1s linear infinite",
            }}
          />
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            Fetching playlist…
          </span>
        </div>
      )}

    </form>
  );

}
