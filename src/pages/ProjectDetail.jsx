import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../services/api'

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await API.get(`/project.php?id=${id}`)
        setProject(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [id])

  const serif = { fontFamily: "'Fraunces', serif" }

  const Shell = ({ children }) => (
    <div className="flex-1 bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  )

  if (loading) return (
    <Shell>
      <p className="text-center text-neutral-400 text-sm mt-20">Loading…</p>
    </Shell>
  )

  if (!project) return (
    <Shell>
      <p className="text-center text-neutral-400 text-sm mt-20">Project not found.</p>
    </Shell>
  )

  return (
    <Shell>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="text-xs uppercase font-medium text-neutral-500 mb-6 inline-flex items-center gap-2 hover:text-black transition-colors"
          style={{ letterSpacing: '0.06em' }}
        >
          &larr; Back to results
        </button>

        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm px-6 py-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <h1 className="text-black text-xl font-semibold leading-snug" style={serif}>
              {project.title}
            </h1>
            <span className="shrink-0 text-neutral-500 text-sm font-medium">
              {project.year}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-6 pb-6 border-b border-neutral-200">
            {[
              { label: 'Authors', value: project.authors },
              { label: 'Supervisor', value: project.supervisor },
              { label: 'Department', value: project.department },
            ].map((f) => (
              <div key={f.label}>
                <div className="text-neutral-500 text-[10px] uppercase font-medium mb-0.5" style={{ letterSpacing: '0.08em' }}>
                  {f.label}
                </div>
                <div className="text-black text-sm">{f.value}</div>
              </div>
            ))}
          </div>

          <div className="text-neutral-500 text-[10px] uppercase font-medium mb-2" style={{ letterSpacing: '0.08em' }}>
            Abstract
          </div>
          <p className="text-sm text-neutral-700 leading-relaxed mb-7">
            {project.abstract}
          </p>

          {project.pdf_path && (
            <div className="flex gap-3">
              <button
                onClick={() => window.open(project.pdf_path, '_blank')}
                className="bg-black text-white text-xs uppercase font-medium px-5 py-2.5 rounded-md hover:bg-neutral-800 transition-colors"
                style={{ letterSpacing: '0.08em' }}
              >
                View PDF
              </button>
              <a
                href={project.pdf_path.replace('/upload/', `/upload/fl_attachment:${project.title.replace(/[^a-zA-Z0-9]+/g, '_')}_${project.year.replace('/', '-')}/`)}
                className="border border-neutral-300 text-black text-xs uppercase font-medium px-5 py-2.5 rounded-md hover:border-black transition-colors"
                style={{ letterSpacing: '0.08em' }}
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </Shell>
  )
}

export default ProjectDetail