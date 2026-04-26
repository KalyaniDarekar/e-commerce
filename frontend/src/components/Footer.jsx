import { Link } from 'react-router-dom'
import { FiZap, FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi'

const footerLinks = {
  Shop: [
    { label: 'All Products', path: '/products' },
    { label: 'Mobiles', path: '/products?category=Mobiles' },
    { label: 'Laptops', path: '/products?category=Laptops' },
    { label: 'Accessories', path: '/products?category=Accessories' },
  ],
  Company: [
    { label: 'About Us', path: '/' },
    { label: 'Careers', path: '/' },
    { label: 'Blog', path: '/' },
    { label: 'Contact', path: '/' },
  ],
  Support: [
    { label: 'Help Center', path: '/' },
    { label: 'Returns', path: '/' },
    { label: 'Warranty', path: '/' },
    { label: 'Shipping', path: '/' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 mt-20">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(5,8,22,1) 0%, transparent 100%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600">
                <FiZap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-poppins gradient-text">ElectroStore</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Experience the future of technology with our curated collection of premium electronics.
            </p>
            <div className="flex items-center gap-3">
              {[FiGithub, FiTwitter, FiInstagram, FiMail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-xl text-slate-500 hover:text-primary-400 hover:bg-white/5 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4 font-poppins">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-slate-500 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © 2026 ElectroStore. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
