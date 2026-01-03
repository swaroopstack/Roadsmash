import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import VideoList from "../components/VideoList";
import ProgressBar from "../components/ProgressBar";
import PaceSelector from "../components/PaceSelector";

export default function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [showToday, setShowToday] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(`course_${id}`);
    if (data) setCourse(JSON.parse(data));
  }, [id]);

  if (!course)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          background:
            "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%)",
        }}
      >
        Course not found.
      </div>
    );

  function handleRestart() {
    const confirmReset = window.confirm(
      "Restart this course? All progress will be cleared, but the playlist remains."
    );

    if (!confirmReset) return;

    const updated = {
      ...course,
      videos: course.videos.map((v) => ({ ...v, done: false })),
      completedAt: null,
      streak: 0,
      completedToday: 0,
      lastActive: null,
    };

    setCourse(updated);
    localStorage.setItem(`course_${id}`, JSON.stringify(updated));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%)",
        padding: "60px 24px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Title */}
        <h1
          style={{
            color: "#fff",
            marginBottom: 12,
            fontSize: "2.4rem",
            fontWeight: 800,
          }}
        >
          {course.title}
        </h1>

        <p style={{ color: "#9ca3af", marginBottom: 24 }}>
          Streak: <strong>{course.streak || 0}</strong> days
        </p>

        {/* Completion card */}
        {course.completedAt && (
          <div
            style={{
              padding: 16,
              marginBottom: 16,
              borderRadius: 14,
              background:
                "linear-gradient(135deg, rgba(16, 185, 129,0.15), rgba(16, 185, 129,0.05))",
              border: "1px solid rgba(16,185,129,0.4)",
              color: "#d1fae5",
            }}
          >
            <strong>Course completed!</strong>
            <br />
            Finished on {new Date(course.completedAt).toDateString()}
          </div>
        )}

        {/* Restart */}
        {course.completedAt && (
          <button
            onClick={handleRestart}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239,68,68,0.4)",
              color: "#fecaca",
              marginBottom: 16,
              cursor: "pointer",
            }}
          >
            Restart course
          </button>
        )}

        {/* Progress */}
        <div
          style={{
            padding: 16,
            borderRadius: 18,
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(99,102,241,0.2)",
            marginBottom: 16,
          }}
        >
          <ProgressBar videos={course.videos} course={course} />
        </div>

        {/* Pace */}
        <div
          style={{
            padding: 16,
            borderRadius: 18,
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(99,102,241,0.2)",
            marginBottom: 16,
          }}
        >
          <PaceSelector
            videos={course.videos}
            courseId={id}
            course={course}
            setCourse={setCourse}
          />
        </div>

        {/* Filter buttons */}
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => setShowToday(false)}
            disabled={!showToday}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "1px solid rgba(99,102,241,0.3)",
              background: !showToday
                ? "rgba(99,102,241,0.3)"
                : "transparent",
              color: "#fff",
              marginRight: 8,
              cursor: showToday ? "pointer" : "default",
            }}
          >
            All
          </button>

          <button
            onClick={() => setShowToday(true)}
            disabled={showToday}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "1px solid rgba(99,102,241,0.3)",
              background: showToday
                ? "rgba(99,102,241,0.3)"
                : "transparent",
              color: "#fff",
              cursor: showToday ? "default" : "pointer",
            }}
          >
            Today
          </button>
        </div>

        {/* Video List */}
        <div
          style={{
            padding: 16,
            borderRadius: 18,
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <VideoList
            courseId={id}
            course={course}
            setCourse={setCourse}
            showToday={showToday}
          />
        </div>
      </div>
    </div>
  );
}
