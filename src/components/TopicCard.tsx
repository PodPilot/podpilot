export default function TopicCard({
  key,
  label,
  query,
  img,
}: {
  key: string | number;
  label: string;
  query: string;
  img: string | undefined;
}) {
  return (
    <div
      className={`card w-32 h-32 bg-secondary relative shadow ${
        img && 'image-full'
      }`}
      onClick={() => console.log(query)}
      key={key}
    >
      {img && (
        <figure>
          <img src={img} alt={label} />
        </figure>
      )}

      <p className="font-serif text-neutral-content prose font-bold absolute bottom-2.5 left-2.5">
        {label}
      </p>
    </div>
  );
}
