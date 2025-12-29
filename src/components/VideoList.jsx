export default function VideoList({ courseId, course, setCourse }) {
  function toggleDone(index) {
    const today = new Date().toDateString();

    // deep immutability
    let updated = {
      ...course,
      videos: course.videos.map((v, i) =>
        i === index ? { ...v, done: !v.done } : v
      ),
    };

    const turnedOn = !course.videos[index].done;

    // handle streak logic only when marking done
    if (turnedOn) {
      // new day?
      if (course.lastActive !== today) {
        updated.completedToday = 0;
      }

      updated.completedToday = (updated.completedToday || 0) + 1;
      updated.lastActive = today;

      if (updated.completedToday >= updated.pace) {
        updated.streak = (updated.streak || 0) + 1;
        updated.completedToday = 0; // reset after hitting daily goal
      }
    }

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
