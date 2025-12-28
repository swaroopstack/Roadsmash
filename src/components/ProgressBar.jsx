export default function ProgressBar({ videos }) {
  const completed = videos.filter(v => v.done).length;
  const percent = Math.round((completed / videos.length) * 100);

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
    </div>
  );
}
