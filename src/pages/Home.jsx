import { useEffect, useState } from "react";
import { Zap, Target, TrendingUp, Trash2, Plus } from "lucide-react";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [playlistUrl, setPlaylistUrl] = useState("");

  function loadCourses() {
    const stored = sessionStorage.getItem("courses");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCourses(parsed);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  function handleDelete(id, title) {
    const ok = window.confirm(
      `Delete course:\n\n${title}\n\nThis cannot be undone.`
    );
    if (!ok) return;

    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    sessionStorage.setItem("courses", JSON.stringify(updated));
  }

  function handleCreateCourse() {
    if (!playlistUrl.trim()) return;

    const newCourse = {
      id: Date.now().toString(),
      title: "New Course " + (courses.length + 1),
      createdAt: new Date().toISOString(),
      videos: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        done: Math.random() > 0.7,
      })),
    };

    const updated = [newCourse, ...courses];
    setCourses(updated);
    sessionStorage.setItem("courses", JSON.stringify(updated));
    setPlaylistUrl("");
  }

  // -------- EMPTY STATE (FRONT PAGE) --------
  if (courses.length === 0)
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px),
              linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            animation: "gridMove 20s linear infinite",
          }}
        />

        {/* Glowing orbs */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            animation: "float 8s ease-in-out infinite",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: 350,
            height: 350,
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "80px 24px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* header stays empty on purpose */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 100,
            }}
          >
            <div />
          </div>

          {/* HERO */}
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "4rem",
                lineHeight: 1.1,
                marginBottom: 24,
                fontWeight: 800,
                background:
                  "linear-gradient(135deg, #ffffff 0%, #c7d2fe 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Turn playlists into discipline.
            </h1>

            <p
              style={{
                color: "#9ca3af",
                fontSize: "1.2rem",
                marginBottom: 48,
                lineHeight: 1.6,
              }}
            >
              No recommendations. No infinite scrolling.
              <br />
              Just progress — with a visible end.
            </p>

            {/* INPUT */}
            <div
              style={{
                maxWidth: 600,
                margin: "0 auto",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "relative",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  borderRadius: 16,
                  padding: 4,
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 0 40px rgba(99, 102, 241, 0.1)",
                }}
              >
                <input
                  type="text"
                  placeholder="Paste YouTube playlist URL..."
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleCreateCourse()
                  }
                  style={{
                    width: "100%",
                    padding: "18px 24px",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#fff",
                    fontSize: "1rem",
                  }}
                />

                <button
                  onClick={handleCreateCourse}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "12px 32px",
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    border: "none",
                    borderRadius: 12,
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
                  }}
                >
                  Create
                </button>
              </div>
            </div>

            {/* Features */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 32,
                marginTop: 80,
              }}
            >
              {[
                {
                  icon: Target,
                  title: "Focused",
                  desc: "Clear path. No clutter.",
                },
                {
                  icon: TrendingUp,
                  title: "Visible progress",
                  desc: "See exactly where you are.",
                },
                {
                  icon: Zap,
                  title: "Momentum",
                  desc: "Stay consistent — daily.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  style={{
                    padding: 32,
                    background: "rgba(15, 23, 42, 0.4)",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                    borderRadius: 20,
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <feature.icon
                    size={32}
                    style={{ color: "#6366f1", marginBottom: 16 }}
                  />

                  <h3
                    style={{
                      color: "#fff",
                      marginBottom: 8,
                      fontSize: "1.125rem",
                    }}
                  >
                    {feature.title}
                  </h3>

                  <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes gridMove {
            0% { transform: translateY(0); }
            100% { transform: translateY(80px); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-30px) scale(1.1); }
          }
        `}</style>
      </div>
    );

  // -------- DASHBOARD --------
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%)",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Your Courses
          </h2>

          <button
            onClick={() => {
              setCourses([]);
              sessionStorage.setItem("courses", JSON.stringify([]));
            }}
            style={{
              padding: "12px 28px",
              background:
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              border: "none",
              borderRadius: 12,
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
            }}
          >
            <Plus size={20} />
            New Course
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: 24,
          }}
        >
          {courses.map((c) => {
            const completed = c.videos.filter((v) => v.done).length;
            const percent = Math.round(
              (completed / c.videos.length) * 100
            );

            return (
              <div
                key={c.id}
                style={{
                  padding: 24,
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                  borderRadius: 20,
                  backdropFilter: "blur(20px)",
                }}
              >
                <div
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "#fff",
                    marginBottom: 16,
                  }}
                >
                  {c.title}
                </div>

                <div
                  style={{
                    width: "100%",
                    height: 8,
                    borderRadius: 999,
                    background: "rgba(15, 23, 42, 0.8)",
                    overflow: "hidden",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background:
                        "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.875rem",
                    color: "#94a3b8",
                    marginBottom: 16,
                  }}
                >
                  <span>
                    {completed}/{c.videos.length} completed
                  </span>

                  {percent === 100 ? (
                    <span style={{ color: "#6ee7a8", fontWeight: 600 }}>
                      ✓ Done
                    </span>
                  ) : (
                    <span>{percent}%</span>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(c.id, c.title)}
                  style={{
                    padding: "8px 16px",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: 8,
                    color: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
