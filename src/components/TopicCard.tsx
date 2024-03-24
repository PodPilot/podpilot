export default function TopicCard({
  className,
  key,
  label,
  query,
  img,
  onClick = () => console.log('not implemented'),
}: {
  className?: string;
  key: string | number;
  label: string;
  query: string;
  img?: string;
  onClick?: Function;
}) {
  return (
    <div
      className={`card glass size-32 bg-secondary relative shadow ${className} ${
        img && 'image-full'
      }`}
      onClick={() => onClick(query)}
      key={key}
    >
      {img && (
        <figure>
          <img src={img} alt={label} />
        </figure>
      )}

      <div className="card-body">
        <p className="font-serif text-secondary-content prose font-bold absolute bottom-2.5 left-2.5">
          {label}
        </p>
      </div>
    </div>
  );
}
