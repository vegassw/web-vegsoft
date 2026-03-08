import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import CalendarModal from './CalendarModal';

const Hero = () => {
  const { t } = useLanguage();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section
        id="hero"
        data-testid="hero-section"
        className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute inset-0 noise-overlay" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-electric/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 animate-slide-up">
                <Sparkles className="w-4 h-4 text-electric" />
                <span className="text-sm font-medium text-muted-foreground">{t.hero.badge}</span>
              </div>

              {/* Title */}
              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight animate-slide-up stagger-1">
                {t.hero.title}{' '}
                <span className="text-gradient">{t.hero.titleHighlight}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base lg:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-slide-up stagger-2">
                {t.hero.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up stagger-3">
                <Button
                  onClick={() => setIsCalendarOpen(true)}
                  data-testid="hero-cta-primary"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-semibold shadow-[0_0_30px_rgba(0,220,130,0.4)] hover:shadow-[0_0_40px_rgba(0,220,130,0.6)] hover:scale-105 transition-all"
                >
                  {t.hero.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  onClick={scrollToServices}
                  data-testid="hero-cta-secondary"
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-semibold border-border hover:bg-muted transition-all"
                >
                  {t.hero.ctaSecondary}
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50 animate-slide-up stagger-4">
                <div className="text-center lg:text-left">
                  <div className="font-heading font-bold text-3xl lg:text-4xl text-foreground">50+</div>
                  <div className="text-sm text-muted-foreground">{t.hero.stats.projects}</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-heading font-bold text-3xl lg:text-4xl text-foreground">30+</div>
                  <div className="text-sm text-muted-foreground">{t.hero.stats.clients}</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-heading font-bold text-3xl lg:text-4xl text-foreground">14+</div>
                  <div className="text-sm text-muted-foreground">{t.hero.stats.years}</div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative hidden lg:block animate-slide-up stagger-2">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Main image container */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden border border-border/50 glass">
                  <img
                    src="https://images.unsplash.com/photo-1767727239153-8bf7f6be90e6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBwYXJ0aWNsZXMlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzI5NDU2MjV8MA&ixlib=rb-4.1.0&q=85"
                    alt="Technology Abstract"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </div>

                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 p-4 rounded-xl glass border border-electric/30 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-electric/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-electric" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">AI Powered</div>
                      <div className="text-xs text-muted-foreground">Automatización</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 p-4 rounded-xl glass border border-violet/30 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet/20 flex items-center justify-center">
                      <span className="text-xl">🚀</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Prototipos</div>
                      <div className="text-xs text-electric">{t.common.free}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <CalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
    </>
  );
};

export default Hero;
