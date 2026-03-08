import { useLanguage } from '../context/LanguageContext';
import { Globe, Smartphone, ShoppingCart, Bot, Workflow, Users } from 'lucide-react';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Globe,
      title: t.services.web.title,
      description: t.services.web.description,
      image: 'https://images.unsplash.com/photo-1684127987312-43455fd95925?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwyfHxzb2Z0d2FyZSUyMGRldmVsb3BlciUyMHdyaXRpbmclMjBjb2RlJTIwb24lMjBsYXB0b3AlMjBkYXJrJTIwbW9kZXxlbnwwfHx8fDE3NzI5NDU2MjZ8MA&ixlib=rb-4.1.0&q=85',
      span: 'lg:col-span-2 lg:row-span-2',
      featured: true
    },
    {
      icon: Smartphone,
      title: t.services.mobile.title,
      description: t.services.mobile.description,
      image: 'https://images.unsplash.com/photo-1502201563651-826cbb30c3dd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwzfHxtb2JpbGUlMjBhcHAlMjBkZXZlbG9wbWVudCUyMHVpJTIwb24lMjBwaG9uZXxlbnwwfHx8fDE3NzI5NDU2Mjd8MA&ixlib=rb-4.1.0&q=85',
      span: ''
    },
    {
      icon: ShoppingCart,
      title: t.services.ecommerce.title,
      description: t.services.ecommerce.description,
      span: ''
    },
    {
      icon: Bot,
      title: t.services.ai.title,
      description: t.services.ai.description,
      image: 'https://images.pexels.com/photos/17485657/pexels-photo-17485657.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      span: 'lg:col-span-2'
    },
    {
      icon: Workflow,
      title: t.services.workflows.title,
      description: t.services.workflows.description,
      span: ''
    },
    {
      icon: Users,
      title: t.services.consulting.title,
      description: t.services.consulting.description,
      span: ''
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

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                data-testid={`service-card-${index}`}
                className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 hover:border-primary/50 transition-all duration-300 hover-lift ${service.span}`}
              >
                {/* Background Image */}
                {service.image && (
                  <div className="absolute inset-0">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className={`relative p-6 lg:p-8 h-full flex flex-col ${service.featured ? 'min-h-[300px] lg:min-h-[400px]' : 'min-h-[200px]'}`}>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Text */}
                  <h3 className="font-heading font-semibold text-xl lg:text-2xl mb-2 text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm lg:text-base flex-grow">
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
      </div>
    </section>
  );
};

export default Services;
