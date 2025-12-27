import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlaylistInput() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (!url.trim()) return;

    // 1) create unique course id
    const id = crypto.randomUUID();

    // 2) store mock playlist (temporary)
    const courseData = {
      id,
      title: "My Test Playlist",
      videos: [
        { id: "1", title: "Intro", duration: "10:00", done: false },
        { id: "2", title: "Part 1", duration: "08:30", done: false },
        { id: "3", title: "Part 2", duration: "12:10", done: false }
      ],
    };

    localStorage.setItem(`course_${id}`, JSON.stringify(courseData));

    // 3) go to course page
    navigate(`/course/${id}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Paste YouTube playlist link"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="submit">Create</button>
    </form>
  );
}
