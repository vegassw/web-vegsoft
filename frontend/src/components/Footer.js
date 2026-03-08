import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  const currentYear = new Date().getFullYear();

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      data-testid="footer"
      className="relative border-t border-border/50 bg-card/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_fbf5852c-f54f-4908-865d-ec707046f10b/artifacts/pek4g6i5_IMG_5954.png"
                alt="Vegsoft Solutions"
                className="h-10 w-auto"
              />
              <div>
                <span className="font-heading font-bold text-lg text-foreground">Vegsoft</span>
                <span className="font-heading font-medium text-lg text-electric ml-1">Solutions</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/56947127116"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-green-500/20 hover:text-green-500 transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href="mailto:Douglas.vegas@vegsoftsolutions.com"
                className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">{t.footer.services}</h3>
            <ul className="space-y-3">
              {Object.values(t.common.services).map((service, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollTo('services')}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">{t.footer.contact}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:Douglas.vegas@vegsoftsolutions.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                >
                  Douglas.vegas@vegsoftsolutions.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href="https://wa.me/56947127116"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +56 947 127 116
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Chile & Latinoamérica
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Vegsoft Solutions. {t.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ↑ Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
