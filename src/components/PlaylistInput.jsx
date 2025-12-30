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

    // duplicate check
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

      const title = await fetchPlaylistTitle(playlistId, apiKey);
      const items = await fetchPlaylistItems(playlistId, apiKey);

      const durations = await fetchDurations(
        items.map((i) => i.videoId),
        apiKey
      );

      const videos = items.map((i) => {
        const d = durations.find((x) => x.id === i.videoId);
        return {
          id: i.videoId,
          title: i.title,
          duration: d?.duration || "00:00",
          done: false,
        };
      });

      const id = crypto.randomUUID();

      const course = {
        id,
        playlistId,
        title,
        videos,
        pace: 1,
        deadline: null,
        createdAt: new Date().toISOString(),
        lastChecked: new Date().toISOString(),
        streak: 0,
        lastActive: null,
        completedToday: 0,
        completedAt: null,
      };

      localStorage.setItem(`course_${id}`, JSON.stringify(course));
      navigate(`/course/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to load playlist");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 18 }}>
      <label style={{ fontSize: "0.9rem", opacity: 0.8 }}>
        Import playlist
      </label>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <input
          placeholder="Paste YouTube playlist link"
          value={url}
          disabled={loading}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Fetching…" : "Create"}
        </button>
      </div>
    </form>
  );
}
