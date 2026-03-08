import { useLanguage } from '../context/LanguageContext';

const Clients = () => {
  const { t } = useLanguage();

  const clients = [
    {
      name: 'SF Ingeniería',
      logo: 'https://customer-assets.emergentagent.com/job_fbf5852c-f54f-4908-865d-ec707046f10b/artifacts/wvw7cbvj_IMG_5952.png'
    },
    {
      name: 'VoyCargo',
      logo: 'https://customer-assets.emergentagent.com/job_fbf5852c-f54f-4908-865d-ec707046f10b/artifacts/288sy5ct_IMG_5953.png'
    },
    {
      name: 'Imperial',
      logo: 'https://customer-assets.emergentagent.com/job_fbf5852c-f54f-4908-865d-ec707046f10b/artifacts/548jxudi_IMG_5955.jpeg'
    },
    {
      name: 'Vegsoft',
      logo: 'https://customer-assets.emergentagent.com/job_fbf5852c-f54f-4908-865d-ec707046f10b/artifacts/pek4g6i5_IMG_5954.png'
    }
  ];

  return (
    <section
      id="clients"
      data-testid="clients-section"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-6">
            <span className="text-sm font-medium text-muted-foreground">{t.clients.badge}</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
            {t.clients.title}{' '}
            <span className="text-gradient">{t.clients.titleHighlight}</span>
          </h2>
        </div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {clients.map((client, index) => (
            <div
              key={index}
              data-testid={`client-logo-${index}`}
              className="group flex items-center justify-center p-6 lg:p-8 rounded-2xl bg-card/30 border border-border/30 hover:border-primary/30 transition-all duration-300"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-16 lg:max-h-20 w-auto object-contain client-logo"
              />
            </div>
          ))}
        </div>

        {/* Testimonial teaser */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl glass border border-border/50">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-electric to-violet flex items-center justify-center border-2 border-background"
                >
                  <span className="text-xs font-bold text-white">
                    {['DV', 'MC', 'JL'][i - 1]}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-foreground">+30 empresas satisfechas</div>
              <div className="text-xs text-muted-foreground">en Chile y Latinoamérica</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
