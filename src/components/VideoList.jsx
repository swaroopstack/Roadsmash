export default function VideoList({
  courseId,
  course,
  setCourse,
  showToday,
}) {
  function toggleDone(videoId) {
    const today = new Date().toDateString();

    let updated = {
      ...course,
      videos: course.videos.map((v) =>
        v.id === videoId ? { ...v, done: !v.done } : v
      ),
    };

    const oldVideo = course.videos.find((v) => v.id === videoId);
    const turnedOn = !oldVideo.done;

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

    setCourse(updated);
    localStorage.setItem(`course_${courseId}`, JSON.stringify(updated));
  }

  let videosToShow = course.videos;

  if (showToday) {
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
              onChange={() => toggleDone(v.id)}
            />
            {v.title} — {v.duration}
          </label>
        </li>
      ))}
    </ul>
  );
}
