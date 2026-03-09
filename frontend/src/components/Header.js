import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import CalendarModal from './CalendarModal';

const Header = () => {
  const { language, changeLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'services', label: t.nav.services },
    { id: 'why-us', label: language === 'es' ? 'Nosotros' : 'About Us' },
    { id: 'clients', label: language === 'es' ? 'Clientes' : 'Clients' },
    { id: 'process', label: t.nav.process },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <>
      <header
        data-testid="main-header"
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a
              href="/"
              data-testid="logo-link"
              className="flex items-center gap-3 group"
            >
              <img 
                src="https://customer-assets.emergentagent.com/job_fbf5852c-f54f-4908-865d-ec707046f10b/artifacts/pek4g6i5_IMG_5954.png"
                alt="Vegsoft Solutions"
                className="h-10 w-auto transform group-hover:scale-105 transition-transform"
              />
              <div className="hidden sm:block">
                <span className="font-heading font-bold text-lg text-foreground">Vegsoft</span>
                <span className="font-heading font-medium text-lg text-electric ml-1">Solutions</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  data-testid={`nav-${item.id}`}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>

            {/* Right side - Language + CTA */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1">
                <button
                  onClick={() => changeLanguage('es')}
                  data-testid="lang-es"
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                    language === 'es'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="text-base">🇪🇸</span>
                  <span className="hidden sm:inline">ES</span>
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  data-testid="lang-en"
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                    language === 'en'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="text-base">🇺🇸</span>
                  <span className="hidden sm:inline">EN</span>
                </button>
              </div>

              {/* CTA Button - Desktop */}
              <Button
                onClick={() => setIsCalendarOpen(true)}
                data-testid="header-cta"
                className="hidden lg:flex bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-semibold shadow-[0_0_20px_rgba(0,220,130,0.3)] hover:shadow-[0_0_30px_rgba(0,220,130,0.5)] transition-all"
              >
                {t.nav.schedule}
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="mobile-menu-toggle"
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            data-testid="mobile-menu"
            className="lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border animate-fade-in"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  data-testid={`mobile-nav-${item.id}`}
                  className="text-left px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => {
                  setIsCalendarOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                data-testid="mobile-cta"
                className="mt-2 bg-primary text-primary-foreground rounded-full"
              >
                {t.nav.schedule}
              </Button>
            </nav>
          </div>
        )}
      </header>

      <CalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
    </>
  );
};

export default Header;
