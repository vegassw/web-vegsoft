import { useLanguage } from '../context/LanguageContext';
import { Search, Lightbulb, Code2, Rocket } from 'lucide-react';

const Process = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Search,
      number: '01',
      title: t.process.steps.discovery.title,
      description: t.process.steps.discovery.description,
      highlight: t.common.free
    },
    {
      icon: Lightbulb,
      number: '02',
      title: t.process.steps.prototype.title,
      description: t.process.steps.prototype.description,
      highlight: t.common.free
    },
    {
      icon: Code2,
      number: '03',
      title: t.process.steps.development.title,
      description: t.process.steps.development.description
    },
    {
      icon: Rocket,
      number: '04',
      title: t.process.steps.launch.title,
      description: t.process.steps.launch.description
    }
  ];

  return (
    <section
      id="process"
      data-testid="process-section"
      className="relative py-24 lg:py-32"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-6">
            <span className="text-sm font-medium text-muted-foreground">{t.process.badge}</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
            {t.process.title}{' '}
            <span className="text-gradient">{t.process.titleHighlight}</span>
          </h2>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                data-testid={`process-step-${index}`}
                className="relative group"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-border to-transparent" />
                )}

                <div className="relative p-6 lg:p-8 rounded-2xl border border-border/50 bg-card/30 hover:border-primary/50 hover:bg-card/50 transition-all duration-300 h-full">
                  {/* Free badge */}
                  {step.highlight && (
                    <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-electric text-primary-foreground text-xs font-bold">
                      {step.highlight}
                    </div>
                  )}

                  {/* Number */}
                  <div className="text-5xl font-heading font-bold text-muted/30 mb-4">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-heading font-semibold text-xl mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl glass border border-primary/30">
            <div className="text-center sm:text-left">
              <div className="font-heading font-semibold text-lg text-foreground">
                ¿Listo para empezar?
              </div>
              <div className="text-sm text-muted-foreground">
                Primeros 2 pasos sin costo
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-electric text-2xl">→</span>
              <span className="font-semibold text-electric">Agenda tu cita gratis</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
