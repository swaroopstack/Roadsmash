export default function VideoList({
  courseId,
  course,
  setCourse,
  showToday,
}) {
  function toggleDone(videoId) {
    // if course already completed — do nothing
    if (course.completedAt) return;

    const today = new Date().toDateString();

    let updated = {
      ...course,
      videos: course.videos.map((v) =>
        v.id === videoId ? { ...v, done: !v.done } : v
      ),
    };

    const oldVideo = course.videos.find((v) => v.id === videoId);
    const turnedOn = !oldVideo.done;

    // streak logic only works if not completed and marking DONE
    if (turnedOn) {
      if (course.lastActive !== today) {
        updated.completedToday = 0;
      }

      updated.completedToday = (updated.completedToday || 0) + 1;
      updated.lastActive = today;

      if (updated.completedToday >= updated.pace) {
        updated.streak = (updated.streak || 0) + 1;
        updated.completedToday = 0;
      }
    }

    // check completion
    const allDone = updated.videos.every((v) => v.done);
    if (allDone) {
      updated.completedAt = new Date().toISOString();
    }

    setCourse(updated);
    localStorage.setItem(`course_${courseId}`, JSON.stringify(updated));
  }

  let videosToShow = course.videos;

  if (showToday && !course.completedAt) {
    const remaining = course.videos.filter((v) => !v.done);
    videosToShow = remaining.slice(0, course.pace || 1);
  }

  return (
    <ul>
      {videosToShow.map((v) => (
        <li key={v.id}>
          <label>
            <input
              type="checkbox"
              checked={v.done}
              disabled={!!course.completedAt}
              onChange={() => toggleDone(v.id)}
            />
            {v.title} — {v.duration}
          </label>
        </li>
      ))}
    </ul>
  );
}
