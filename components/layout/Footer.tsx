'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Resources',
      links: ['Documentation', 'API Reference', 'Support Center', 'Status Page']
    },
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Contact', 'Privacy Policy']
    },
    {
      title: 'Connect',
      links: ['Twitter', 'LinkedIn', 'GitHub', 'Email']
    },
  ];

  return (
    <footer
      className="mt-auto border-t"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--surface)',
      }}
    >
      {/* Main Footer Content */}
      <div className="px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}
                >
                  🎓
                </div>
                <div>
                  <h3 className="font-display font-bold text-base" style={{ color: 'var(--primary)' }}>
                    JKKN COE
                  </h3>
                </div>
              </div>
              <p className="font-body text-xs leading-tight mb-3" style={{ color: 'var(--neutral-600)' }}>
                Controller of Examination - Streamlining examination management and administrative processes.
              </p>
              <div className="flex gap-3">
                {['🌐', '📧', '📱'].map((icon, idx) => (
                  <button
                    key={idx}
                    className="w-9 h-9 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                    style={{
                      background: 'var(--neutral-100)',
                      color: 'var(--primary)',
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="font-display font-bold text-sm mb-3 leading-tight" style={{ color: 'var(--primary)' }}>
                  {section.title}
                </h4>
                <ul className="space-y-1.5">
                  {section.links.map((link) => (
                    <li key={link}>
                      <button
                        className="font-body text-sm hover:translate-x-1 transition-transform inline-block"
                        style={{ color: 'var(--neutral-600)' }}
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="px-6 py-3 border-t"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--background)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs" style={{ color: 'var(--neutral-500)' }}>
              © {currentYear} JKKN Controller of Examination. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((item) => (
                <button
                  key={item}
                  className="font-body text-xs hover:underline"
                  style={{ color: 'var(--neutral-500)' }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Accent */}
      <div
        className="h-1"
        style={{
          background: 'linear-gradient(90deg, var(--primary), var(--secondary), var(--accent), var(--primary))',
        }}
      ></div>
    </footer>
  );
}
