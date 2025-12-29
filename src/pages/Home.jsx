import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [courses, setCourses] = useState([]);

  function loadCourses() {
    const list = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith("course_")) {
        const c = JSON.parse(localStorage.getItem(key));
        list.push(c);
      }
    }

    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setCourses(list);
  }

  // load + sync when storage changes
  useEffect(() => {
    loadCourses();

    window.addEventListener("storage", loadCourses);
    return () => window.removeEventListener("storage", loadCourses);
  }, []);

  // refresh when user returns to this page
  useEffect(() => {
    const onFocus = () => loadCourses();
    window.addEventListener("focus", onFocus);

    return () => window.removeEventListener("focus", onFocus);
  }, []);

  function handleDelete(id, title) {
    const ok = window.confirm(
      `Delete course:\n\n${title}\n\nThis cannot be undone.`
    );

    if (!ok) return;

    localStorage.removeItem(`course_${id}`);
    loadCourses();
  }

  if (courses.length === 0)
    return (
      <div style={{ padding: 24 }}>
        <h2>Roadsmash</h2>
        <p>No courses yet. Paste a playlist to begin.</p>

        <Link to="/new">
          <button>Create new course</button>
        </Link>
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
            <li
              key={c.id}
              style={{
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Link to={`/course/${c.id}`} style={{ flex: 1 }}>
                <strong>{c.title}</strong> — {percent}% complete
                {c.completedAt && (
                  <span style={{ marginLeft: 6, color: "green" }}>✔ done</span>
                )}
              </Link>

              <button
                style={{ color: "red" }}
                onClick={() => handleDelete(c.id, c.title)}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>

      <div style={{ marginTop: 16 }}>
        <Link to="/new">
          <button>Create new course</button>
        </Link>
      </div>
    </div>
  );
}
