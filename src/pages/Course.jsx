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

  if (!course) return <p>Course not found.</p>;

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
    <div style={{ padding: 24 }}>
      <h2>{course.title}</h2>

      {course.completedAt && (
        <div
          style={{
            padding: 12,
            marginTop: 8,
            background: "#e6ffe6",
            border: "1px solid #9cd29c",
            borderRadius: 8,
          }}
        >
          <strong>Course completed!</strong>
          <br />
          Finished on: {new Date(course.completedAt).toDateString()}
        </div>
      )}

      <p>Streak: {course.streak || 0} days</p>

      {course.completedAt && (
        <button style={{ marginBottom: 12 }} onClick={handleRestart}>
          Restart course
        </button>
      )}

      <ProgressBar videos={course.videos} course={course} />

      <PaceSelector
        videos={course.videos}
        courseId={id}
        course={course}
        setCourse={setCourse}
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={() => setShowToday(false)} disabled={!showToday}>
          All
        </button>

        <button
          onClick={() => setShowToday(true)}
          disabled={showToday}
          style={{ marginLeft: 8 }}
        >
          Today
        </button>
      </div>

      <VideoList
        courseId={id}
        course={course}
        setCourse={setCourse}
        showToday={showToday}
      />
    </div>
  );
}
