function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 shadow-sm">
      <img src="/aaua-logo.jpg" alt="AAUA Logo" className="h-10 w-10 object-contain" />
      <div>
        <p className="font-bold text-[#1a2e4a] text-sm leading-tight">Adekunle Ajasin University</p>
        <p className="text-[#2E7D32] text-xs leading-tight">Faculty of Computing Project Repository</p>
      </div>
    </nav>
  )
}

export default Navbar