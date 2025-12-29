import { useState, useMemo } from "react";

export default function PaceSelector({ videos }) {
  const [perDay, setPerDay] = useState(1);

  // compute values when videos or perDay change
  const info = useMemo(() => {
    const total = videos.length;
    const completed = videos.filter(v => v.done).length;
    const remaining = total - completed;

    const daysNeeded = Math.ceil(remaining / perDay);

    const finish = new Date();
    finish.setDate(finish.getDate() + daysNeeded);

    return {
      total,
      completed,
      remaining,
      daysNeeded,
      finishDate: finish.toDateString(),
    };
  }, [videos, perDay]);

  return (
    <div style={{ marginBottom: 16 }}>
      <label>
        Videos per day:{" "}
        <input
          type="number"
          min={1}
          value={perDay}
          onChange={(e) => setPerDay(Number(e.target.value))}
        />
      </label>

      <div style={{ marginTop: 8 }}>
        <div>Remaining: {info.remaining}</div>
        <div>Days needed: {info.daysNeeded}</div>
        <div>Estimated finish: {info.finishDate}</div>
      </div>
    </div>
  );
}
