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

  useEffect(() => {
    loadCourses();
    window.addEventListener("storage", loadCourses);
    return () => window.removeEventListener("storage", loadCourses);
  }, []);

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
      <div className="container">
        <h2>Roadsmash</h2>
        <p>No courses yet.</p>

        <Link to="/new">
          <button className="btn-primary">Create new course</button>
        </Link>
      </div>
    );

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <h2>Your courses</h2>

        <Link to="/new">
          <button className="btn-primary">New</button>
        </Link>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {courses.map((c) => {
          const completed = c.videos.filter((v) => v.done).length;
          const percent = Math.round((completed / c.videos.length) * 100);

          return (
            <div key={c.id} className="card">
              <Link
                to={`/course/${c.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{ marginBottom: 8, fontWeight: 600 }}>
                  {c.title}
                </div>

                <div
                  style={{
                    width: "100%",
                    height: 8,
                    borderRadius: 999,
                    background: "#0F1012",
                    overflow: "hidden",
                    marginBottom: 8,
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background: "var(--accent)",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                    opacity: 0.85,
                  }}
                >
                  <span>
                    {completed}/{c.videos.length} done
                  </span>

                  {c.completedAt ? (
                    <span style={{ color: "#6EE7A8" }}>Completed</span>
                  ) : (
                    <span>Progress: {percent}%</span>
                  )}
                </div>
              </Link>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 10,
                }}
              >
                <button
                  className="btn"
                  style={{ color: "#ff6961" }}
                  onClick={() => handleDelete(c.id, c.title)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
