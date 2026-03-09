import { useLanguage } from '../context/LanguageContext';
import { 
  Globe, 
  Smartphone, 
  ShoppingCart, 
  Bot, 
  Code2, 
  Users,
  TestTube,
  Cloud,
  Palette,
  BarChart3,
  Shield,
  Headphones
} from 'lucide-react';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Code2,
      title: t.services.software.title,
      description: t.services.software.description,
      color: 'from-electric to-emerald-500',
      span: 'md:col-span-2'
    },
    {
      icon: Globe,
      title: t.services.web.title,
      description: t.services.web.description,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Smartphone,
      title: t.services.mobile.title,
      description: t.services.mobile.description,
      color: 'from-violet to-purple-500'
    },
    {
      icon: Bot,
      title: t.services.ai.title,
      description: t.services.ai.description,
      color: 'from-electric to-teal-500',
      span: 'md:col-span-2'
    },
    {
      icon: ShoppingCart,
      title: t.services.ecommerce.title,
      description: t.services.ecommerce.description,
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Users,
      title: t.services.consulting.title,
      description: t.services.consulting.description,
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: TestTube,
      title: t.services.qa.title,
      description: t.services.qa.description,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Cloud,
      title: t.services.devops.title,
      description: t.services.devops.description,
      color: 'from-sky-500 to-blue-500',
      span: 'md:col-span-2'
    },
    {
      icon: Palette,
      title: t.services.uxui.title,
      description: t.services.uxui.description,
      color: 'from-fuchsia-500 to-pink-500'
    },
    {
      icon: BarChart3,
      title: t.services.data.title,
      description: t.services.data.description,
      color: 'from-indigo-500 to-violet'
    },
    {
      icon: Shield,
      title: t.services.security.title,
      description: t.services.security.description,
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Headphones,
      title: t.services.support.title,
      description: t.services.support.description,
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  return (
    <section
      id="services"
      data-testid="services-section"
      className="relative py-24 lg:py-32"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-6">
            <span className="text-sm font-medium text-muted-foreground">{t.services.badge}</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
            {t.services.title}{' '}
            <span className="text-gradient">{t.services.titleHighlight}</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground">
            {t.services.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                data-testid={`service-card-${index}`}
                className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 hover:border-primary/50 transition-all duration-300 hover-lift ${service.span || ''}`}
              >
                {/* Content */}
                <div className="relative p-6 lg:p-8 h-full flex flex-col min-h-[180px]">
                  {/* Icon with gradient background */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Text */}
                  <h3 className="font-heading font-semibold text-lg lg:text-xl mb-2 text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm flex-grow">
                    {service.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="mt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">{t.common.learnMore}</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-violet/5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-electric/10 via-violet/10 to-electric/10 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-heading font-bold text-xl lg:text-2xl text-foreground mb-2">
                ¿No encuentras lo que buscas?
              </h3>
              <p className="text-muted-foreground">
                Contáctanos y diseñamos una solución a tu medida
              </p>
            </div>
            <a
              href="#contact"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,220,130,0.3)]"
            >
              Hablemos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
