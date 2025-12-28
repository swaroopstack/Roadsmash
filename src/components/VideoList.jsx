export default function VideoList({ courseId, course, setCourse }) {
  function toggleDone(index) {
    const updated = { ...course };
    updated.videos[index].done = !updated.videos[index].done;

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
