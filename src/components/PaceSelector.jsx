import { useState, useMemo, useEffect } from "react";

export default function PaceSelector({ videos, courseId, course, setCourse }) {
  const [perDay, setPerDay] = useState(course.pace || 1);

  const info = useMemo(() => {
    const total = videos.length;
    const completed = videos.filter(v => v.done).length;
    const remaining = total - completed;

    const daysNeeded = Math.ceil(remaining / perDay);

    const finish = new Date();
    finish.setDate(finish.getDate() + daysNeeded);

    return {
      remaining,
      daysNeeded,
      finishDate: finish.toISOString(),
      finishLabel: finish.toDateString(),
    };
  }, [videos, perDay]);

  // save whenever pacing changes
  useEffect(() => {
    const updated = {
      ...course,
      pace: perDay,
      deadline: info.finishDate,
      lastChecked: new Date().toISOString(),
    };

    setCourse(updated);
    localStorage.setItem(`course_${courseId}`, JSON.stringify(updated));
  }, [perDay, info.finishDate]);

  return (
    <div style={{ marginBottom: 16, opacity: course.deadline && course.completedAt ? 0.6 : 1 }}>
      <label>
        Videos per day:{" "}
        <input
          type="number"
          min={1}
          value={perDay}
          disabled={!!course.completedAt}
          onChange={(e) => setPerDay(Number(e.target.value))}
        />
      </label>

      <div style={{ marginTop: 8, fontSize: 14 }}>
        <div>Remaining: {info.remaining}</div>
        <div>Days needed: {info.daysNeeded}</div>
        <div>Finish by: {info.finishLabel}</div>
      </div>
    </div>
  );

}
