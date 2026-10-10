import { Link } from 'react-router-dom'

function ProjectCard({ project }) {
  const {
    id,
    title,
    authors,
    department,
    supervisor,
    year,
    abstract,
  } = project

  return (
    <Link
      to={`/project/${id}`}
      className="block bg-white border border-neutral-200 rounded-lg px-5 py-4 shadow-sm hover:border-black transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-1.5">
        <h3
          className="text-black text-[16px] font-semibold leading-snug"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {title}
        </h3>
        <span className="shrink-0 text-neutral-500 text-xs font-medium">
          {year}
        </span>
      </div>

      <div className="text-neutral-500 text-xs mb-2">
        {department}
        {supervisor && <> &middot; {supervisor}</>}
        {authors && <> &middot; {authors}</>}
      </div>

      {abstract && (
        <p className="text-neutral-600 text-[13.5px] leading-relaxed line-clamp-2">
          {abstract}
        </p>
      )}
    </Link>
  )
}

export default ProjectCard