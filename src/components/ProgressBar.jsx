export default function ProgressBar({ videos, course }) {
  const completed = videos.filter(v => v.done).length;
  const percent = Math.round((completed / videos.length) * 100);

  let status = "";

  if (course.deadline) {
    const today = new Date();
    const deadline = new Date(course.deadline);

    const daysLeft = Math.max(
      0,
      Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
    );

    const remaining = videos.length - completed;

    const expectedRemaining = Math.max(
      0,
      remaining - course.pace * daysLeft
    );

    if (expectedRemaining > 0) status = "Behind schedule";
    else if (expectedRemaining === 0) status = "On track";
    else status = "Ahead";
  }

  return (
    <div style={{ margin: "12px 0" }}>
      <div>
        Progress: {completed}/{videos.length} ({percent}%)
      </div>

      <div style={{ background: "#ddd", height: 12, borderRadius: 6 }}>
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "#4caf50",
            borderRadius: 6,
          }}
        />
      </div>

      {status && (
        <div style={{ marginTop: 6, fontSize: 13, opacity: 0.8 }}>
          Status: {status}
        </div>
      )}
    </div>
  );
}
