import { useLanguage } from '../context/LanguageContext';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const { language } = useLanguage();

  const content = {
    es: {
      badge: 'Testimonios',
      title: 'Lo que Dicen',
      titleHighlight: 'Nuestros Clientes',
      testimonials: [
        {
          quote: 'Vegsoft transformó completamente nuestra operación logística. El sistema que desarrollaron nos permitió reducir tiempos de entrega en un 40% y tener visibilidad total de nuestra cadena de suministro.',
          author: 'Carlos Mendoza',
          role: 'CEO',
          company: 'VoyCargo',
          image: 'CM'
        },
        {
          quote: 'Profesionales de primer nivel. Entregaron nuestro ERP en tiempo y forma, con una calidad que superó nuestras expectativas. El soporte post-lanzamiento ha sido excepcional.',
          author: 'María Fernández',
          role: 'Gerente de Operaciones',
          company: 'Imperial',
          image: 'MF'
        },
        {
          quote: 'Trabajar con Douglas y su equipo fue una experiencia excelente. Entendieron nuestras necesidades técnicas y propusieron soluciones innovadoras que no habíamos considerado.',
          author: 'Roberto Silva',
          role: 'Director de Tecnología',
          company: 'SF Ingeniería',
          image: 'RS'
        }
      ]
    },
    en: {
      badge: 'Testimonials',
      title: 'What Our',
      titleHighlight: 'Clients Say',
      testimonials: [
        {
          quote: 'Vegsoft completely transformed our logistics operation. The system they developed allowed us to reduce delivery times by 40% and have total visibility of our supply chain.',
          author: 'Carlos Mendoza',
          role: 'CEO',
          company: 'VoyCargo',
          image: 'CM'
        },
        {
          quote: 'Top-tier professionals. They delivered our ERP on time, with quality that exceeded our expectations. Post-launch support has been exceptional.',
          author: 'María Fernández',
          role: 'Operations Manager',
          company: 'Imperial',
          image: 'MF'
        },
        {
          quote: 'Working with Douglas and his team was an excellent experience. They understood our technical needs and proposed innovative solutions we hadn\'t considered.',
          author: 'Roberto Silva',
          role: 'Technology Director',
          company: 'SF Ingeniería',
          image: 'RS'
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      className="relative py-24 lg:py-32"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-6">
            <span className="text-sm font-medium text-muted-foreground">{t.badge}</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
            {t.title}{' '}
            <span className="text-gradient">{t.titleHighlight}</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {t.testimonials.map((testimonial, index) => (
            <div
              key={index}
              data-testid={`testimonial-${index}`}
              className="group relative p-6 lg:p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Quote className="w-5 h-5 text-primary" />
              </div>

              {/* Quote text */}
              <p className="text-muted-foreground text-sm lg:text-base mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric to-violet flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {testimonial.image}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
