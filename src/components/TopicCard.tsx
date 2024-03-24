export default function TopicCard({
  className,
  key,
  label,
  query,
  img,
}: {
  className?: string;
  key: string | number;
  label: string;
  query: string;
  img?: string;
}) {
  return (
    <div
      className={`card glass size-32 bg-secondary relative shadow ${className} ${
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

      <p className="font-serif text-secondary-content prose font-bold absolute bottom-2.5 left-2.5">
        {label}
      </p>
    </div>
  );
}
