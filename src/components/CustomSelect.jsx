import { useState, useRef, useEffect } from 'react'

function CustomSelect({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className={`relative ${open ? 'z-50' : 'z-10'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 rounded-lg text-white text-sm outline-none bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm flex items-center justify-between"
      >
        <span className={selected ? 'text-white' : 'text-white/70'}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="text-white/70 text-xs ml-2">▾</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg shadow-lg border border-white/20 max-h-60 overflow-y-auto scrollbar-none"
          style={{ background: 'linear-gradient(135deg, #1a2e4a 0%, #2E7D32 100%)' }}
        >
          {options.map((o) => (
            <div
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false) }}
              className={`px-4 py-2 text-sm cursor-pointer transition hover:bg-white/20 ${value === o.value ? 'text-[#4CAF50] font-medium' : 'text-white'}`}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomSelect