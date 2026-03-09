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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 max-w-4xl mx-auto">
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

</div>
    </section>
  );
};

export default Clients;
