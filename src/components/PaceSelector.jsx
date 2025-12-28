import { useState } from "react";

export default function PaceSelector() {
  const [perDay, setPerDay] = useState(1);

  return (
    <div style={{ marginBottom: 16 }}>
      <label>
        Videos per day:{" "}
        <input
          type="number"
          value={perDay}
          min={1}
          onChange={(e) => setPerDay(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
