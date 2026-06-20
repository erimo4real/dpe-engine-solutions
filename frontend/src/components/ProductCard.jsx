export default function ProductCard({ name, description, image, onClick }) {
  return (
    <article onClick={onClick} className="group cursor-pointer overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      {image && (
        <div className="aspect-[4/3] overflow-hidden bg-[var(--color-bg)]">
          <img src={image} alt={name} className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110" loading="lazy" />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-sm font-bold leading-tight">{name}</h3>
        {description && <p className="mt-1 text-xs text-[var(--color-muted)] line-clamp-2">{description}</p>}
      </div>
    </article>
  )
}
