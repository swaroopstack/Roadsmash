import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import VideoList from "../components/VideoList";
import ProgressBar from "../components/ProgressBar";
import PaceSelector from "../components/PaceSelector";

export default function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem(`course_${id}`);
    if (data) setCourse(JSON.parse(data));
  }, [id]);

  if (!course) return <p>Course not found.</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>{course.title}</h2>

      <ProgressBar videos={course.videos} />

      <PaceSelector />

      <VideoList courseId={id} course={course} setCourse={setCourse} />
    </div>
  );
}
