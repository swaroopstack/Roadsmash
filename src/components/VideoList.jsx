export default function VideoList({ courseId, course, setCourse }) {
  function toggleDone(index) {
    const updated = {
      ...course,
      videos: course.videos.map((v, i) =>
        i === index ? { ...v, done: !v.done } : v
      ),
    };

    setCourse(updated);
    localStorage.setItem(`course_${courseId}`, JSON.stringify(updated));
  }

  return (
    <ul>
      {course.videos.map((v, i) => (
        <li key={v.id}>
          <label>
            <input
              type="checkbox"
              checked={v.done}
              onChange={() => toggleDone(i)}
            />
            {v.title} — {v.duration}
          </label>
        </li>
      ))}
    </ul>
  );
}
