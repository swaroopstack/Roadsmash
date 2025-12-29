import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const list = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith("course_")) {
        const c = JSON.parse(localStorage.getItem(key));
        list.push(c);
      }
    }

    // newest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setCourses(list);
  }, []);

  if (courses.length === 0)
    return (
      <div style={{ padding: 24 }}>
        <h2>Roadsmash</h2>
        <p>No courses yet. Paste a playlist to begin.</p>
        <Link to="/new">Create course</Link>
      </div>
    );

  return (
    <div style={{ padding: 24 }}>
      <h2>Your Courses</h2>

      <ul style={{ marginTop: 12 }}>
        {courses.map((c) => {
          const completed = c.videos.filter((v) => v.done).length;
          const percent = Math.round((completed / c.videos.length) * 100);

          return (
            <li key={c.id} style={{ marginBottom: 10 }}>
              <Link to={`/course/${c.id}`}>
                <strong>{c.title}</strong> — {percent}% complete
              </Link>

              {c.completedAt && (
                <span style={{ marginLeft: 6, color: "green" }}>✔ done</span>
              )}
            </li>
          );
        })}
      </ul>

      <Link to="/new">Add new course</Link>
    </div>
  );
}
