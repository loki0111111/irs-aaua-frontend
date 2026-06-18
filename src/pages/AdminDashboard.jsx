import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import useAuthStore from '../store/authStore'

function AdminDashboard() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const [activeTab, setActiveTab] = useState('projects')

  // Projects state
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [projectForm, setProjectForm] = useState({
    title: '', abstract: '', authors: '', supervisor_id: '', department_id: '', year: ''
  })
  const [file, setFile] = useState(null)
  const [formError, setFormError] = useState('')
  const [projectFilter, setProjectFilter] = useState({ department_id: '', supervisor_id: '', year: '' })

  // Departments state
  const [departments, setDepartments] = useState([])
  const [newDepartment, setNewDepartment] = useState('')

  // Supervisors state
  const [supervisors, setSupervisors] = useState([])
  const [supervisorForm, setSupervisorForm] = useState({ name: '' })

  // Fetch all data
  const fetchProjects = async () => {
    setProjectsLoading(true)
    try {
      const res = await API.get('/projects.php')
      setProjects(res.data.data || [])
    } catch (err) { console.error(err) }
    finally { setProjectsLoading(false) }
  }

  const fetchDepartments = async () => {
    try {
      const res = await API.get('/get_departments.php')
      setDepartments(res.data.data || [])
    } catch (err) { console.error(err) }
  }

  const fetchSupervisors = async () => {
    try {
      const res = await API.get('/get_supervisors.php')
      setSupervisors(res.data.data || [])
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    fetchProjects()
    fetchDepartments()
    fetchSupervisors()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  // Project handlers
  const resetProjectForm = () => {
    setProjectForm({ title: '', abstract: '', authors: '', supervisor_id: '', department_id: '', year: '' })
    setFile(null)
    setEditProject(null)
    setShowProjectForm(false)
  }

  const handleProjectEdit = (project) => {
    setProjectForm({
      title: project.title,
      abstract: project.abstract,
      authors: project.authors,
      supervisor_id: project.supervisor_id || '',
      department_id: project.department_id || '',
      year: project.year,
    })
    setEditProject(project)
    setShowProjectForm(true)
  }

  const handleProjectDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await API.delete(`/project.php?id=${id}`)
      fetchProjects()
    } catch (err) { console.error(err) }
  }

  const handleProjectSubmit = async () => {
    if (!projectForm.title || !projectForm.authors || !projectForm.department_id || !projectForm.year) {
      setFormError('Please fill in Title, Authors, Department and Year')
      return
    }
    setFormError('')
    const formData = new FormData()
    formData.append('title', projectForm.title)
    formData.append('authors', projectForm.authors)
    formData.append('abstract', projectForm.abstract)
    formData.append('department_id', projectForm.department_id)
    formData.append('supervisor_id', projectForm.supervisor_id)
    formData.append('year', projectForm.year)
    if (file) formData.append('pdf', file)

    try {
      if (editProject) {
        formData.append('id', editProject.id)
        await API.post('/update.php', formData)
      } else {
        await API.post('/upload.php', formData)
      }
      resetProjectForm()
      fetchProjects()
    } catch (err) {
      setFormError('Upload failed. Please try again.')
    }
  }

  // Department handlers
  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) return
    try {
      await API.post('/add_department.php', { name: newDepartment.trim() })
      setNewDepartment('')
      fetchDepartments()
    } catch (err) { console.error(err) }
  }

  const handleDeleteDepartment = async (id) => {
    if (!confirm('Delete this department? Supervisors in it will be unlinked.')) return
    try {
      await API.delete(`/delete_department.php?id=${id}`)
      fetchDepartments()
      fetchSupervisors()
    } catch (err) { console.error(err) }
  }

  // Supervisor handlers
  const handleAddSupervisor = async () => {
    if (!supervisorForm.name.trim()) return
    try {
      const res = await API.post('/add_supervisor.php', { name: supervisorForm.name })
      console.log('add supervisor response:', res.data)
      setSupervisorForm({ name: '' })
      fetchSupervisors()
    } catch (err) { 
      console.error('add supervisor error:', err.response?.data || err.message)
    }
  }

  const handleDeleteSupervisor = async (id) => {
    if (!confirm('Delete this supervisor?')) return
    try {
      await API.delete(`/delete_supervisor.php?id=${id}`)
      fetchSupervisors()
    } catch (err) { console.error(err) }
  }

  // Filtered projects
  const filteredProjects = projects.filter(p => {
    if (projectFilter.department_id && String(p.department_id) !== String(projectFilter.department_id)) return false
    if (projectFilter.supervisor_id && String(p.supervisor_id) !== String(projectFilter.supervisor_id)) return false
    if (projectFilter.year && String(p.year) !== String(projectFilter.year)) return false
    return true
  })

  // Supervisors filtered by selected department in project form
  const filteredSupervisors = projectForm.department_id
    ? supervisors.filter(s => String(s.department_id) === String(projectForm.department_id))
    : supervisors

  const inputClass = "border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#1B5E20] w-full"
  const btnPrimary = "bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-md hover:bg-green-800 transition"
  const btnSecondary = "border border-gray-300 text-gray-600 text-sm px-4 py-2 rounded-md hover:bg-gray-50 transition"
  const btnDanger = "text-red-500 border border-red-400 px-3 py-1 rounded text-xs hover:bg-red-50 transition"
  const btnEdit = "text-[#1B5E20] border border-[#1B5E20] px-3 py-1 rounded text-xs hover:bg-green-50 transition"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1B5E20] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/aaua-logo.jpg" alt="AAUA" className="h-9 w-9 object-contain" />
          <div>
            <p className="font-bold text-sm">AAUA Faculty of Computing</p>
            <p className="text-[#F9A825] text-xs">Admin Dashboard</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-sm border border-white/40 px-4 py-1.5 rounded-md hover:bg-white/10 transition">
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="flex gap-6">
          {['projects', 'supervisors', 'departments'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium border-b-2 transition capitalize ${
                activeTab === tab
                  ? 'border-[#1B5E20] text-[#1B5E20]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-gray-800 font-semibold text-lg">All Projects</h1>
              <button onClick={() => { resetProjectForm(); setShowProjectForm(true) }} className={btnPrimary}>
                + Upload Project
              </button>
            </div>

            {/* Filters */}
            {!showProjectForm && (
            <div className="flex gap-3 mb-5 flex-wrap">
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#1B5E20]"
                value={projectFilter.department_id}
                onChange={e => setProjectFilter(prev => ({ ...prev, department_id: e.target.value }))}>
                <option value="">All Departments</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#1B5E20]"
                value={projectFilter.supervisor_id}
                onChange={e => setProjectFilter(prev => ({ ...prev, supervisor_id: e.target.value }))}>
                <option value="">All Supervisors</option>
                {supervisors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#1B5E20]"
                value={projectFilter.year}
                onChange={e => setProjectFilter(prev => ({ ...prev, year: e.target.value }))}>
                <option value="">All Years</option>
                {Array.from({ length: 10 }, (_, i) => {
                    const start = 2025 - i
                    return `${start}/${start + 1}`
                }).map(y => (
                    <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            )}

            {/* Project Form */}
            {showProjectForm && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="font-semibold text-gray-800 mb-4">
                  {editProject ? 'Edit Project' : 'Upload New Project'}
                </h2>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input placeholder="Title" value={projectForm.title}
                    onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                    className={`col-span-2 ${inputClass}`} />
                  <input placeholder="Authors (comma separated)" value={projectForm.authors}
                    onChange={e => setProjectForm({ ...projectForm, authors: e.target.value })}
                    className={`col-span-2 ${inputClass}`} />
                  <select value={projectForm.department_id}
                    onChange={e => setProjectForm({ ...projectForm, department_id: e.target.value, supervisor_id: '' })}
                    className={inputClass}>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <select value={projectForm.supervisor_id}
                    onChange={e => setProjectForm({ ...projectForm, supervisor_id: e.target.value })}
                    className={inputClass}>
                    <option value="">Select Supervisor</option>
                    {supervisors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <select value={projectForm.year}
                      onChange={e => setProjectForm({ ...projectForm, year: e.target.value })}
                      className={inputClass}>
                      <option value="">Select Session Year</option>
                      {Array.from({ length: 10 }, (_, i) => {
                          const start = 2025 - i
                          return `${start}/${start + 1}`
                      }).map(y => (
                          <option key={y} value={y}>{y}</option>
                      ))}
                  </select>
                  <textarea placeholder="Abstract" value={projectForm.abstract}
                    onChange={e => setProjectForm({ ...projectForm, abstract: e.target.value })}
                    rows={4} className={`col-span-2 resize-none ${inputClass}`} />
                  <div className="col-span-2">
                    <label className="flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-md px-4 py-3 cursor-pointer hover:border-[#1B5E20] transition">
                      <span className="text-[#1B5E20] text-sm font-medium">📄 Upload PDF</span>
                      <span className="text-gray-400 text-sm">{file ? file.name : 'Click to choose a PDF file'}</span>
                      <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} className="hidden" />
                    </label>
                  </div>
                </div>
                {formError && (
                  <p className="text-red-500 text-xs mb-3">{formError}</p>
                )}
                <div className="flex gap-3">
                  <button onClick={handleProjectSubmit} className={btnPrimary}>
                    {editProject ? 'Update' : 'Upload'}
                  </button>
                  <button onClick={resetProjectForm} className={btnSecondary}>Cancel</button>
                </div>
              </div>
            )}

            {/* Projects Table */}
            {projectsLoading ? (
              <p className="text-center text-gray-500 text-sm">Loading...</p>
            ) : filteredProjects.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-10">No projects found.</p>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-600 font-medium">Title</th>
                      <th className="text-left px-4 py-3 text-gray-600 font-medium">Authors</th>
                      <th className="text-left px-4 py-3 text-gray-600 font-medium">Department</th>
                      <th className="text-left px-4 py-3 text-gray-600 font-medium">Year</th>
                      <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((p, i) => (
                      <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-gray-800 max-w-xs truncate">{p.title}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{p.authors}</td>
                        <td className="px-4 py-3 text-gray-600">{p.department}</td>
                        <td className="px-4 py-3 text-gray-600">{p.year}</td>
                        <td className="px-4 py-3 flex gap-2">
                          <button onClick={() => handleProjectEdit(p)} className={btnEdit}>Edit</button>
                          <button onClick={() => handleProjectDelete(p.id)} className={btnDanger}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* DEPARTMENTS TAB */}
        {activeTab === 'departments' && (
          <div>
            <h1 className="text-gray-800 font-semibold text-lg mb-6">Departments</h1>

            {/* Add Department */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Add Department</h2>
              <div className="flex gap-3">
                <input placeholder="Department name" value={newDepartment}
                  onChange={e => setNewDepartment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddDepartment()}
                  className={inputClass} />
                <button onClick={handleAddDepartment} className={btnPrimary}>Add</button>
              </div>
            </div>

            {/* Departments List */}
            {departments.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-10">No departments added yet.</p>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-600 font-medium">Department</th>
                      <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((d, i) => (
                      <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-gray-800">{d.name}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteDepartment(d.id)} className={btnDanger}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SUPERVISORS TAB */}
        {activeTab === 'supervisors' && (
          <div>
            <h1 className="text-gray-800 font-semibold text-lg mb-6">Supervisors</h1>

            {/* Add Supervisor */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Add Supervisor</h2>
              <div className="flex gap-3">
                <input placeholder="Supervisor name" value={supervisorForm.name}
                  onChange={e => setSupervisorForm({ name: e.target.value })}
                  className={inputClass} />
                <button onClick={handleAddSupervisor} className={btnPrimary}>Add</button>
              </div>
            </div>

            {/* Supervisors List */}
            {supervisors.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-10">No supervisors added yet.</p>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                      <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supervisors.map((s, i) => (
                      <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-gray-800">{s.name}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteSupervisor(s.id)} className={btnDanger}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard