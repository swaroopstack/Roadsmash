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

  return (
    <div style={{ padding: 24 }}>
      <h2>{course.title}</h2>

      <p>Streak: {course.streak || 0} days</p>

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
