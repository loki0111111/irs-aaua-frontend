import { useNavigate } from 'react-router-dom'

function ProjectCard({ project }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/project/${project.id}`)}
      className="bg-white border border-gray-200 rounded-lg p-5 cursor-pointer hover:shadow-md hover:border-[#1B5E20] transition"
    >
      <h2 className="text-[#1B5E20] font-semibold text-base mb-1 line-clamp-2">
        {project.title}
      </h2>
      <p className="text-xs text-gray-500 mb-3">
        {project.authors} &middot; {project.supervisor} &middot; {project.department} &middot; {project.year}
      </p>
      <p className="text-sm text-gray-600 line-clamp-3">
        {project.abstract}
      </p>
      <p className="text-xs text-[#F9A825] font-medium mt-3">View details →</p>
    </div>
  )
}

export default ProjectCard