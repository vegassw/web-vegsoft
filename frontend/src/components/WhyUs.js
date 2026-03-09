import { useLanguage } from '../context/LanguageContext';
import { CheckCircle, Users, Clock, Award, Zap, HeartHandshake } from 'lucide-react';

const WhyUs = () => {
  const { language } = useLanguage();

  const content = {
    es: {
      badge: '¿Por qué Vegsoft?',
      title: 'Tu Socio Tecnológico',
      titleHighlight: 'de Confianza',
      subtitle: 'Más de 14 años transformando empresas con tecnología. No somos solo proveedores, somos tu equipo extendido.',
      stats: [
        { number: '14+', label: 'Años de experiencia' },
        { number: '50+', label: 'Proyectos entregados' },
        { number: '30+', label: 'Clientes satisfechos' },
        { number: '98%', label: 'Tasa de retención' }
      ],
      features: [
        {
          icon: Users,
          title: 'Equipo Multidisciplinario',
          description: 'Project Managers, Desarrolladores Senior, QA Engineers y Diseñadores UX trabajando para ti.'
        },
        {
          icon: Zap,
          title: 'Metodología Ágil',
          description: 'Trabajamos con Scrum y sprints de 2 semanas. Entregas incrementales y feedback constante.'
        },
        {
          icon: Clock,
          title: 'Time-to-Market Rápido',
          description: 'Prototipos funcionales en días, no meses. MVP listo para validar tu idea rápidamente.'
        },
        {
          icon: HeartHandshake,
          title: 'Soporte Post-Lanzamiento',
          description: 'No te dejamos solo. Mantenimiento, actualizaciones y soporte continuo después del go-live.'
        },
        {
          icon: Award,
          title: 'Calidad Garantizada',
          description: 'Testing automatizado, code reviews y CI/CD. Código limpio y documentado.'
        },
        {
          icon: CheckCircle,
          title: 'Costos Competitivos',
          description: 'Calidad de Silicon Valley a precios de Latinoamérica. Transparencia total en cotizaciones.'
        }
      ],
      cta: 'Conoce nuestro proceso'
    },
    en: {
      badge: 'Why Vegsoft?',
      title: 'Your Trusted',
      titleHighlight: 'Technology Partner',
      subtitle: 'Over 14 years transforming companies with technology. We are not just vendors, we are your extended team.',
      stats: [
        { number: '14+', label: 'Years of experience' },
        { number: '50+', label: 'Projects delivered' },
        { number: '30+', label: 'Happy clients' },
        { number: '98%', label: 'Retention rate' }
      ],
      features: [
        {
          icon: Users,
          title: 'Multidisciplinary Team',
          description: 'Project Managers, Senior Developers, QA Engineers and UX Designers working for you.'
        },
        {
          icon: Zap,
          title: 'Agile Methodology',
          description: 'We work with Scrum and 2-week sprints. Incremental deliveries and constant feedback.'
        },
        {
          icon: Clock,
          title: 'Fast Time-to-Market',
          description: 'Functional prototypes in days, not months. MVP ready to validate your idea quickly.'
        },
        {
          icon: HeartHandshake,
          title: 'Post-Launch Support',
          description: 'We don\'t leave you alone. Maintenance, updates and continuous support after go-live.'
        },
        {
          icon: Award,
          title: 'Guaranteed Quality',
          description: 'Automated testing, code reviews and CI/CD. Clean and documented code.'
        },
        {
          icon: CheckCircle,
          title: 'Competitive Costs',
          description: 'Silicon Valley quality at Latin American prices. Total transparency in quotes.'
        }
      ],
      cta: 'Learn about our process'
    }
  };

  const t = content[language];

  return (
    <section
      id="why-us"
      data-testid="why-us-section"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <span className="text-sm font-medium text-primary">{t.badge}</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
            {t.title}{' '}
            <span className="text-gradient">{t.titleHighlight}</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground">
            {t.subtitle}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {t.stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-card/50 border border-border/50"
            >
              <div className="font-heading font-bold text-4xl lg:text-5xl text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                data-testid={`why-us-feature-${index}`}
                className="group p-6 lg:p-8 rounded-2xl bg-card/30 border border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
