import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import ProjectCard from '../components/ProjectCard'
import API from '../services/api'
import Footer from '../components/Footer'

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
    </div>
  )
}

function Home() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ department: '', year: '' })
  const [departments, setDepartments] = useState([])
  const debounceRef = useRef(null)

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await API.get('/get_departments.php')
        setDepartments(res.data.data || [])
      } catch (err) { console.error(err) }
    }
    fetchDepts()
  }, [])

  const search = async (q, f) => {
    if (!q && !f.department && !f.year) {
      setSearched(false)
      setResults([])
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const res = await API.get('/search.php', { params: { q, ...f } })
      setResults(res.data.data || [])
    } catch (err) {
      console.error(err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      search(query, filters)
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [query, filters])

  const handleSearch = (f) => {
    if (f.q !== undefined) setQuery(f.q)
    if (f.department !== undefined) setFilters(prev => ({ ...prev, department: f.department }))
    if (f.year !== undefined) setFilters(prev => ({ ...prev, year: f.year }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SearchBar
        onSearch={handleSearch}
        query={query}
        setQuery={setQuery}
        departments={departments}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-4xl mb-3">🔍</p>
            <p className="text-gray-600 font-medium">No projects found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different keyword or filter</p>
          </div>
        )}

        {!loading && !searched && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
                <p className="text-3xl font-bold text-[#2E7D32]">500+</p>
                <p className="text-gray-500 text-sm mt-1">Projects</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
                <p className="text-3xl font-bold text-[#1a2e4a]">6</p>
                <p className="text-gray-500 text-sm mt-1">Departments</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-[#1a2e4a] font-bold text-lg mb-5">How it works</h2>
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm">Search</p>
                    <p className="text-gray-400 text-xs mt-1">Enter a keyword, topic, supervisor, or department</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1a2e4a] text-white flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm">Browse</p>
                    <p className="text-gray-400 text-xs mt-1">Review ranked results and find the most relevant projects</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm">Access</p>
                    <p className="text-gray-400 text-xs mt-1">View the abstract or download the full project PDF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="flex flex-col gap-4">
            {results.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Home