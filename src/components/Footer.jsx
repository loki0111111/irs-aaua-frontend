function Footer() {
  return (
    <footer className="text-white mt-16" style={{ background: 'linear-gradient(135deg, #1a2e4a 0%, #2E7D32 100%)' }}>
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <p className="font-bold text-base mb-1">AAUA</p>
          <p className="text-[#4CAF50] text-xs mb-3">Faculty of Computing</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Adekunle Ajasin University, Akungba-Akoko, Ondo State, Nigeria.
          </p>
        </div>
        <div>
          <p className="font-semibold text-sm mb-3">Quick Links</p>
          <ul className="flex flex-col gap-2 text-white/60 text-xs">
            <li><a href="https://aaua.edu.ng" target="_blank" rel="noreferrer" className="hover:text-white transition">AAUA Website</a></li>
            <li><a href="/" className="hover:text-white transition">Project Repository</a></li>
            <li><a href="/admin" className="hover:text-white transition">Admin Login</a></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-sm mb-3">About</p>
          <p className="text-white/60 text-xs leading-relaxed">
            This system was developed as a final year project to provide students and faculty with easy access to past research projects in the Faculty of Computing.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-white/40 text-xs">
        &copy; {new Date().getFullYear()} Faculty of Computing, AAUA. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer