import { useLanguage } from '../context/LanguageContext';

const TechStack = () => {
  const { language } = useLanguage();

  const content = {
    es: {
      badge: 'Tecnologías',
      title: 'Stack Tecnológico',
      titleHighlight: 'de Vanguardia',
      subtitle: 'Trabajamos con las tecnologías más demandadas del mercado para crear soluciones escalables y mantenibles.'
    },
    en: {
      badge: 'Technologies',
      title: 'Cutting-Edge',
      titleHighlight: 'Tech Stack',
      subtitle: 'We work with the most demanded technologies in the market to create scalable and maintainable solutions.'
    }
  };

  const t = content[language];

  const technologies = [
    { name: 'React', category: 'Frontend', color: '#61DAFB' },
    { name: 'Next.js', category: 'Frontend', color: '#ffffff' },
    { name: 'Vue.js', category: 'Frontend', color: '#4FC08D' },
    { name: 'React Native', category: 'Mobile', color: '#61DAFB' },
    { name: 'Flutter', category: 'Mobile', color: '#02569B' },
    { name: 'Node.js', category: 'Backend', color: '#339933' },
    { name: 'Python', category: 'Backend', color: '#3776AB' },
    { name: 'Django', category: 'Backend', color: '#092E20' },
    { name: 'FastAPI', category: 'Backend', color: '#009688' },
    { name: '.NET', category: 'Backend', color: '#512BD4' },
    { name: 'PostgreSQL', category: 'Database', color: '#4169E1' },
    { name: 'MongoDB', category: 'Database', color: '#47A248' },
    { name: 'AWS', category: 'Cloud', color: '#FF9900' },
    { name: 'Google Cloud', category: 'Cloud', color: '#4285F4' },
    { name: 'Azure', category: 'Cloud', color: '#0078D4' },
    { name: 'Docker', category: 'DevOps', color: '#2496ED' },
    { name: 'Kubernetes', category: 'DevOps', color: '#326CE5' },
    { name: 'OpenAI', category: 'AI', color: '#00DC82' },
  ];

  return (
    <section
      id="tech-stack"
      data-testid="tech-stack-section"
      className="relative py-16 lg:py-24 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-6">
            <span className="text-sm font-medium text-muted-foreground">{t.badge}</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
            {t.title}{' '}
            <span className="text-gradient">{t.titleHighlight}</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground">
            {t.subtitle}
          </p>
        </div>

        {/* Tech Grid */}
        <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="group px-4 py-2 lg:px-6 lg:py-3 rounded-full bg-card/50 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tech.color }}
                />
                <span className="text-sm lg:text-base font-medium text-foreground">
                  {tech.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Categories legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-muted-foreground">
          <span>Frontend</span>
          <span>•</span>
          <span>Backend</span>
          <span>•</span>
          <span>Mobile</span>
          <span>•</span>
          <span>Cloud</span>
          <span>•</span>
          <span>DevOps</span>
          <span>•</span>
          <span>AI</span>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
