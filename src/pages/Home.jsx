import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import ProjectCard from '../components/ProjectCard'
import API from '../services/api'

function SkeletonCard() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 flex gap-4 animate-pulse">
      <div className="w-9 shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-3" />
        <div className="h-3 bg-neutral-200 rounded w-1/2 mb-3" />
        <div className="h-3 bg-neutral-200 rounded w-full mb-2" />
        <div className="h-3 bg-neutral-200 rounded w-5/6" />
      </div>
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
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <Navbar />

      <main className={`flex-1 flex flex-col ${searched ? 'justify-start' : 'justify-center pb-20'}`}>
        <section className={`w-full max-w-3xl mx-auto px-4 pb-2 text-center ${searched ? 'pt-10 sm:pt-12' : ''}`}>
          <div
            className="inline-flex items-center gap-3 text-neutral-500 text-[11px] sm:text-xs font-medium uppercase mb-5 sm:mb-6"
            style={{ letterSpacing: '0.14em' }}
          >
            <span className="hidden sm:block w-6 h-px bg-neutral-300" />
            Faculty of Computing &middot; Project Archive
            <span className="hidden sm:block w-6 h-px bg-neutral-300" />
          </div>
          <h1
            className="text-black text-3xl sm:text-5xl leading-tight mb-4"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, letterSpacing: '-0.01em' }}
          >
            Every project this faculty{' '}<br className="hidden sm:block" />
            has produced, <em className="italic font-medium">in one place.</em>
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Search final year projects by title, keyword, supervisor, department, or year.
          </p>
        </section>

        <SearchBar
          onSearch={handleSearch}
          query={query}
          setQuery={setQuery}
          departments={departments}
        />

        {searched && (
          <div className="w-full max-w-3xl mx-auto px-4 py-10">
            {loading && (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="text-center py-20">
                <div
                  className="w-16 h-16 rounded-full border-2 border-neutral-200 mx-auto mb-5 flex items-center justify-center text-neutral-400 font-medium"
                  style={{ fontSize: '11px' }}
                >
                  N/A
                </div>
                <p className="text-black font-semibold text-base" style={{ fontFamily: "'Fraunces', serif" }}>
                  No matching records
                </p>
                <p className="text-neutral-600 text-sm mt-2">Try a different keyword or adjust your filters</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div>
                <p
                  className="text-neutral-500 text-xs font-medium mb-4 uppercase"
                  style={{ letterSpacing: '0.08em' }}
                >
                  {results.length} record{results.length !== 1 ? 's' : ''} found
                </p>
                <div className="flex flex-col gap-3">
                  {results.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Home