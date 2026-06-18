import { useState } from 'react'
import CustomSelect from './CustomSelect'

function SearchBar({ onSearch, query, setQuery, departments = [] }) {
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const handleSearch = () => {
    onSearch({ q: query })
  }

  const handleDeptChange = (val) => {
    setSelectedDept(val)
    onSearch({ q: query, department: val })
  }

  const handleYearChange = (val) => {
    setSelectedYear(val)
    onSearch({ q: query, year: val })
  }

  return (
    <div
      className="relative py-16 md:py-28 px-6"
      style={{ backgroundImage: 'url(/faculty.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 opacity-85"
        style={{ background: 'linear-gradient(135deg, #1a2e4a 0%, #2E7D32 100%)' }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <h1 className="text-white text-4xl font-bold mb-3 leading-tight">
          Project Repository
        </h1>
        <p className="text-white text-base mb-10">
          Search and access past final year projects from the Faculty of Computing, AAUA
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by keyword, title, or topic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-3 rounded-lg text-white placeholder-white/70 text-sm outline-none bg-white/20 backdrop-blur-sm border border-white/30 shadow-md"
          />
          <button
            onClick={handleSearch}
            className="bg-white text-[#2E7D32] font-semibold px-6 py-3 rounded-lg text-sm transition shadow-md hover:bg-white/90"
          >
            Search
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center relative">
          <CustomSelect
            placeholder="All Departments"
            value={selectedDept}
            onChange={handleDeptChange}
            options={[
              { value: '', label: 'All Departments' },
              ...departments.map(d => ({ value: d.name, label: d.name }))
            ]}
          />
          <CustomSelect
            placeholder="All Years"
            value={selectedYear}
            onChange={handleYearChange}
            options={[
              { value: '', label: 'All Years' },
              ...Array.from({ length: 10 }, (_, i) => {
                const start = 2025 - i
                const y = `${start}/${start + 1}`
                return { value: y, label: y }
              })
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchBar