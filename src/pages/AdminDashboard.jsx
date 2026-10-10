import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import useAuthStore from '../store/authStore'

function AdminDashboard() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const [activeTab, setActiveTab] = useState('projects')

  // Projects state
  const [uploadStage, setUploadStage] = useState('')
  const [projects, setProjects] = useState([])
  const [uploading, setUploading] = useState(false)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [addingSupervisor, setAddingSupervisor] = useState(false)
  const [deletingSupervisorId, setDeletingSupervisorId] = useState(null)
  const [addingDepartment, setAddingDepartment] = useState(false)
  const [deletingDepartmentId, setDeletingDepartmentId] = useState(null)
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

  const uploadToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'irs_aaua_uploads')
    formData.append('resource_type', 'raw')

    const res = await fetch('https://api.cloudinary.com/v1_1/dn83fy6fw/raw/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    return data.secure_url
  }

  const handleProjectSubmit = async () => {
    if (!projectForm.title || !projectForm.authors || !projectForm.department_id || !projectForm.year) {
      setFormError('Please fill in Title, Authors, Department and Year')
      return
    }
    setFormError('')
    setUploading(true)

    const formData = new FormData()
    formData.append('title', projectForm.title)
    formData.append('authors', projectForm.authors)
    formData.append('abstract', projectForm.abstract)
    formData.append('department_id', projectForm.department_id)
    formData.append('supervisor_id', projectForm.supervisor_id)
    formData.append('year', projectForm.year)

    if (file) {
            try {
        setUploadStage('pdf')
        const pdfUrl = await uploadToCloudinary(file)
        formData.append('pdf_url', pdfUrl)
        setUploadStage('saving')
      } catch (err) {
        setFormError('PDF upload failed. Try again.')
        setUploading(false)
        return
      }
    }

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
        } finally {
      setUploading(false)
      setUploadStage('')
    }
  }

  // Department handlers
  const handleAddDepartment = async () => {
    if (!newDepartment.trim() || addingDepartment) return
    setAddingDepartment(true)
    try {
      await API.post('/add_department.php', { name: newDepartment.trim() })
      setNewDepartment('')
      fetchDepartments()
    } catch (err) { console.error(err) }
    finally { setAddingDepartment(false) }
  }

  const handleDeleteDepartment = async (id) => {
    if (!confirm('Delete this department?')) return
    setDeletingDepartmentId(id)
    try {
      await API.delete(`/delete_department.php?id=${id}`)
      setDepartments(prev => prev.filter(d => d.id !== id))
      fetchDepartments()
    } catch (err) { console.error(err) }
    finally { setDeletingDepartmentId(null) }
  }

  // Supervisor handlers
  const handleAddSupervisor = async () => {
    if (!supervisorForm.name.trim() || addingSupervisor) return
    setAddingSupervisor(true)
    try {
      await API.post('/add_supervisor.php', { name: supervisorForm.name })
      setSupervisorForm({ name: '' })
      fetchSupervisors()
    } catch (err) {
      console.error('add supervisor error:', err.response?.data || err.message)
    } finally {
      setAddingSupervisor(false)
    }
  }

  const handleDeleteSupervisor = async (id) => {
    if (!confirm('Delete this supervisor?')) return
    setDeletingSupervisorId(id)
    try {
      await API.delete(`/delete_supervisor.php?id=${id}`)
      setSupervisors(prev => prev.filter(s => s.id !== id))
      fetchSupervisors()
    } catch (err) { console.error(err) }
    finally { setDeletingSupervisorId(null) }
  }

  // Filtered projects
  const filteredProjects = projects.filter(p => {
    if (projectFilter.department_id && String(p.department_id) !== String(projectFilter.department_id)) return false
    if (projectFilter.supervisor_id && String(p.supervisor_id) !== String(projectFilter.supervisor_id)) return false
    if (projectFilter.year && String(p.year) !== String(projectFilter.year)) return false
    return true
  })

  const filteredSupervisors = projectForm.department_id
    ? supervisors.filter(s => String(s.department_id) === String(projectForm.department_id))
    : supervisors

  const serif = { fontFamily: "'Fraunces', serif" }

  const inputClass = "border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:border-black transition-colors w-full bg-white text-black"
  const btnPrimary = "bg-black text-white text-xs font-medium uppercase px-4 py-2.5 rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-50"
  const btnSecondary = "border border-neutral-300 text-neutral-600 text-xs font-medium uppercase px-4 py-2.5 rounded-md hover:bg-neutral-100 transition-colors"
  const btnDanger = "text-red-700 border border-red-200 px-3 py-1 rounded-md text-[11px] font-medium uppercase hover:bg-red-50 transition-colors disabled:opacity-50"
  const btnEdit = "text-black border border-neutral-300 px-3 py-1 rounded-md text-[11px] font-medium uppercase hover:border-black transition-colors"

  const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 10 }, (_, i) => {
  const start = currentYear - i
  return `${start}/${start + 1}`
})

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div className="bg-white border-b shadow-sm border-neutral-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/aaua-logo.jpg" alt="AAUA" className="h-10 w-10 object-contain grayscale" />
          <div>
            <p className="font-semibold text-black text-base leading-tight" style={serif}>AAUA Faculty of Computing</p>
            <p className="text-neutral-500 text-xs leading-tight">Admin Dashboard</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-medium uppercase border border-neutral-300 text-black px-4 py-1.5 rounded-md hover:bg-neutral-100 transition-colors"
          style={{ letterSpacing: '0.06em' }}
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 bg-white px-6">
        <div className="flex gap-6">
          {['projects', 'supervisors', 'departments'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-xs font-medium uppercase border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
              style={{ letterSpacing: '0.06em' }}
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
              <h1 className="text-black font-semibold text-lg" style={serif}>All Projects</h1>
              <button onClick={() => { resetProjectForm(); setShowProjectForm(true) }} className={btnPrimary}>
                + Upload Project
              </button>
            </div>

            {!showProjectForm && (
              <div className="flex gap-3 mb-5 flex-wrap">
                <select
                  className={`${inputClass} w-auto`}
                  value={projectFilter.department_id}
                  onChange={e => setProjectFilter(prev => ({ ...prev, department_id: e.target.value }))}
                >
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                <select
                  className={`${inputClass} w-auto`}
                  value={projectFilter.supervisor_id}
                  onChange={e => setProjectFilter(prev => ({ ...prev, supervisor_id: e.target.value }))}
                >
                  <option value="">All Supervisors</option>
                  {supervisors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select
                  className={`${inputClass} w-auto`}
                  value={projectFilter.year}
                  onChange={e => setProjectFilter(prev => ({ ...prev, year: e.target.value }))}
                >
                  <option value="">All Years</option>
                  {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}

            {/* Project Form */}
            {showProjectForm && (
              <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6 mb-6">
                <h2 className="font-semibold text-black mb-4" style={serif}>
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
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <textarea placeholder="Abstract" value={projectForm.abstract}
                    onChange={e => setProjectForm({ ...projectForm, abstract: e.target.value })}
                    rows={4} className={`col-span-2 resize-none ${inputClass}`} />
                  <div className="col-span-2">
                    <label className="flex items-center gap-3 border-2 border-dashed border-neutral-300 rounded-md px-4 py-3 cursor-pointer hover:border-black transition-colors">
                      <span className="text-black text-sm font-medium">Upload PDF</span>
                      <span className="text-neutral-400 text-sm">{file ? file.name : 'Click to choose a PDF file'}</span>
                      <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} className="hidden" />
                    </label>
                  </div>
                </div>
                {formError && (
                  <p className="text-red-700 text-xs mb-3">{formError}</p>
                )}
                <div className="flex gap-3">
                  <button onClick={handleProjectSubmit} className={btnPrimary} disabled={uploading}>
                    {uploading ? (uploadStage === 'pdf' ? 'Uploading PDF...' : 'Saving...') : (editProject ? 'Update' : 'Upload')}
                  </button>
                  <button onClick={resetProjectForm} className={btnSecondary}>Cancel</button>
                </div>
              </div>
            )}

            {/* Projects Table */}
            {projectsLoading ? (
              <p className="text-center text-neutral-400 text-sm">Loading...</p>
            ) : filteredProjects.length === 0 ? (
              <p className="text-center text-neutral-400 text-sm py-10">No projects found.</p>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      {['Title', 'Authors', 'Department', 'Year', 'Actions'].map(h => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-neutral-500 font-medium text-[11px] uppercase"
                          style={{ letterSpacing: '0.08em' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((p, i) => (
                      <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                        <td className="px-4 py-3 text-black max-w-xs truncate">{p.title}</td>
                        <td className="px-4 py-3 text-neutral-600 max-w-xs truncate">{p.authors}</td>
                        <td className="px-4 py-3 text-neutral-600">{p.department}</td>
                        <td className="px-4 py-3 text-neutral-600">{p.year}</td>
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
            <h1 className="text-black font-semibold text-lg mb-6" style={serif}>Departments</h1>

            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-5 mb-6">
              <h2
                className="text-[11px] uppercase font-semibold text-neutral-500 mb-3"
                style={{ letterSpacing: '0.08em' }}
              >
                Add Department
              </h2>
              <div className="flex gap-3">
                <input placeholder="Department name" value={newDepartment}
                  onChange={e => setNewDepartment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddDepartment()}
                  className={inputClass} />
                <button onClick={handleAddDepartment} className={btnPrimary} disabled={addingDepartment}>
                  {addingDepartment ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>

            {departments.length === 0 ? (
              <p className="text-center text-neutral-400 text-sm py-10">No departments added yet.</p>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      {['Department', 'Actions'].map(h => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-neutral-500 font-medium text-[11px] uppercase"
                          style={{ letterSpacing: '0.08em' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((d, i) => (
                      <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                        <td className="px-4 py-3 text-black">{d.name}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteDepartment(d.id)} className={btnDanger} disabled={deletingDepartmentId === d.id}>
                            {deletingDepartmentId === d.id ? 'Deleting...' : 'Delete'}
                          </button>
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
            <h1 className="text-black font-semibold text-lg mb-6" style={serif}>Supervisors</h1>

            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-5 mb-6">
              <h2
                className="text-[11px] uppercase font-semibold text-neutral-500 mb-3"
                style={{ letterSpacing: '0.08em' }}
              >
                Add Supervisor
              </h2>
              <div className="flex gap-3">
                <input placeholder="Supervisor name" value={supervisorForm.name}
                  onChange={e => setSupervisorForm({ name: e.target.value })}
                  className={inputClass} />
                <button onClick={handleAddSupervisor} className={btnPrimary} disabled={addingSupervisor}>
                  {addingSupervisor ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>

            {supervisors.length === 0 ? (
              <p className="text-center text-neutral-400 text-sm py-10">No supervisors added yet.</p>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      {['Name', 'Actions'].map(h => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-neutral-500 font-medium text-[11px] uppercase"
                          style={{ letterSpacing: '0.08em' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {supervisors.map((s, i) => (
                      <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                        <td className="px-4 py-3 text-black">{s.name}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteSupervisor(s.id)} className={btnDanger} disabled={deletingSupervisorId === s.id}>
                            {deletingSupervisorId === s.id ? 'Deleting...' : 'Delete'}
                          </button>
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