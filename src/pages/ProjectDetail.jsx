import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
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

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <p className="text-center text-gray-500 text-sm mt-20">Loading...</p>
    </div>
  )

  if (!project) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <p className="text-center text-gray-500 text-sm mt-20">Project not found.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-[#1B5E20] mb-6 inline-block hover:underline"
        >
          Back to results
        </button>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h1 className="text-[#1B5E20] text-xl font-bold mb-3">
            {project.title}
          </h1>

          <div className="grid grid-cols-2 gap-3 mb-5 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-800">Author:</span> {project.authors}
            </div>
            <div>
              <span className="font-medium text-gray-800">Supervisor:</span> {project.supervisor}
            </div>
            <div>
              <span className="font-medium text-gray-800">Department:</span> {project.department}
            </div>
            <div>
              <span className="font-medium text-gray-800">Year:</span> {project.year}
            </div>
          </div>

          <h2 className="text-gray-800 font-semibold mb-2">Abstract</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {project.abstract}
          </p>

          {project.pdf_path && (
             <div className="flex gap-3">
               <button
                  onClick={() => window.open(project.pdf_path, '_blank')}
                  className="bg-[#1B5E20] text-white text-sm px-5 py-2 rounded-md hover:bg-green-800 transition"
                >
                  View PDF
                </button>               
                <a
                  href={project.pdf_path + '?fl_attachment=true'}
                  className="border border-[#1B5E20] text-[#1B5E20] text-sm px-5 py-2 rounded-md hover:bg-green-50 transition"
                >
                  Download
                </a>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail