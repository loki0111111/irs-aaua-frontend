import { useState, useRef, useEffect } from 'react'

function Chevron() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
      <path d="M1 1L5 5L9 1" stroke="#000000" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FieldDropdown({ label, value, options, onChange, borderRight = true }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (e, val) => {
    e.stopPropagation()
    onChange(val)
    setOpen(false)
  }

  return (
    <div
      ref={ref}
      className={`relative flex-1 min-w-0 px-4 sm:px-6 py-3.5 cursor-pointer ${borderRight ? 'border-r border-neutral-200' : ''}`}
      onClick={() => setOpen((o) => !o)}
    >
      <div
        className="text-neutral-500 text-[10px] uppercase font-medium"
        style={{ letterSpacing: '0.1em' }}
      >
        {label}
      </div>
      <div className="flex items-center justify-between gap-2 mt-0.5">
        <span className="text-black text-sm font-medium truncate">{value || `All ${label.toLowerCase()}`}</span>
        <Chevron />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-neutral-200 rounded-md shadow-lg z-10 max-h-56 overflow-y-auto">
          <div
            className="px-4 py-2.5 text-sm text-neutral-500 hover:bg-neutral-100 cursor-pointer"
            onClick={(e) => handleSelect(e, '')}
          >
            All {label.toLowerCase()}
          </div>
          {options.map((opt) => (
            <div
              key={opt}
              className="px-4 py-2.5 text-sm text-black hover:bg-neutral-100 cursor-pointer"
              onClick={(e) => handleSelect(e, opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchBar({ onSearch, query, setQuery, departments }) {
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')

const years = Array.from({ length: 10 }, (_, i) => {
  const start = 2025 - i
  return `${start}/${start + 1}`
})
  const deptNames = departments.map((d) => (typeof d === 'string' ? d : d.name)).filter(Boolean)

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    onSearch({ q: e.target.value })
  }

  const handleDeptChange = (val) => {
    setDepartment(val)
    onSearch({ department: val })
  }

  const handleYearChange = (val) => {
    setYear(val)
    onSearch({ year: val })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch({ q: query })
  }

  return (
    <section className="w-full max-w-3xl mx-auto px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-neutral-200 rounded-lg relative shadow-sm"
      >
        <div
          className="text-neutral-500 text-[10px] uppercase font-medium px-4 sm:px-6 pt-3.5"
          style={{ letterSpacing: '0.1em' }}
        >
          Search Request
        </div>

        <div className="flex items-stretch px-4 sm:px-6 pb-4 pt-1.5 gap-3">
          <input
            className="flex-1 min-w-0 outline-none text-black text-lg bg-transparent placeholder:text-neutral-400"
            style={{ fontFamily: "'Fraunces', serif" }}
            placeholder={`e.g. "online voting system" or a supervisor's name…`}
            value={query}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="bg-black text-white px-4 sm:px-6 py-2 rounded-md text-xs uppercase font-medium shrink-0 hover:bg-neutral-800 transition"
            style={{ letterSpacing: '0.08em' }}
          >
            Search &rarr;
          </button>
        </div>

        <div className="flex border-t border-neutral-200">
          <FieldDropdown
            label="Department"
            value={department}
            options={deptNames}
            onChange={handleDeptChange}
          />
          <FieldDropdown
            label="Year"
            value={year}
            options={years}
            onChange={handleYearChange}
            borderRight={false}
          />
        </div>
      </form>
    </section>
  )
}

export default SearchBar