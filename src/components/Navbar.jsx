function Navbar() {
  return (
    <nav className="bg-white border-b border-neutral-200 px-6 py-3 flex items-center gap-3">
      <img src="/aaua-logo.jpg" alt="AAUA Logo" className="h-10 w-10 object-contain grayscale" />
      <div>
        <p
          className="text-black text-base leading-tight"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
        >
          Adekunle Ajasin University
        </p>
        <p className="text-neutral-500 text-xs leading-tight">Faculty of Computing Project Repository</p>
      </div>
    </nav>
  )
}

export default Navbar