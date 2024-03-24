export default function TopicCard({ key, label, query }) {
  return (
    <div
      className="card w-32 h-32 bg-secondary relative shadow"
      onClick={() => console.log(query)}
      key={key}
    >
      <p className="font-serif prose font-bold absolute bottom-2.5 left-2.5">
        {label}
      </p>
    </div>
  );
}
