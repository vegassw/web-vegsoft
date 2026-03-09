import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  es: {
    // Navigation
    nav: {
      services: 'Servicios',
      clients: 'Clientes',
      process: 'Proceso',
      contact: 'Contacto',
      schedule: 'Agendar Cita'
    },
    // Hero
    hero: {
      badge: 'Innovación Digital & IA',
      title: 'Transformamos tu negocio con',
      titleHighlight: 'Software e IA',
      subtitle: 'Creamos sitios web, apps móviles, ecommerce y flujos de trabajo optimizados. Asesoría gratuita y prototipos rápidos sin costo.',
      cta: 'Agendar Asesoría Gratuita',
      ctaSecondary: 'Ver Servicios',
      stats: {
        projects: 'Proyectos',
        clients: 'Clientes Satisfechos',
        years: 'Años de Experiencia'
      }
    },
    // Services
    services: {
      badge: 'Nuestras Soluciones',
      title: 'Soluciones Tecnológicas',
      titleHighlight: 'de Alto Impacto',
      subtitle: 'Desde la idea hasta la implementación, te acompañamos en cada paso de tu transformación digital.',
      web: {
        title: 'Sitios Web',
        description: 'Diseño y desarrollo de sitios web modernos, responsivos y optimizados para SEO.'
      },
      mobile: {
        title: 'Apps Móviles',
        description: 'Aplicaciones nativas y multiplataforma para iOS y Android.'
      },
      ecommerce: {
        title: 'E-commerce',
        description: 'Tiendas online completas con pasarelas de pago y gestión de inventario.'
      },
      ai: {
        title: 'IA & Automatización',
        description: 'Integración de inteligencia artificial para optimizar procesos empresariales.'
      },
      software: {
        title: 'Desarrollo de Software',
        description: 'Software a medida, sistemas empresariales, ERPs y CRMs personalizados.'
      },
      consulting: {
        title: 'Consultoría Tech',
        description: 'Asesoramiento estratégico para la transformación digital de tu empresa.'
      },
      qa: {
        title: 'QA & Testing',
        description: 'Pruebas de calidad, testing automatizado y aseguramiento de software.'
      },
      devops: {
        title: 'DevOps & Cloud',
        description: 'Infraestructura cloud, CI/CD, contenedores y despliegue continuo.'
      },
      uxui: {
        title: 'Diseño UX/UI',
        description: 'Interfaces intuitivas y experiencias de usuario centradas en conversión.'
      },
      data: {
        title: 'Data & Analytics',
        description: 'Business Intelligence, dashboards y análisis de datos para decisiones.'
      },
      security: {
        title: 'Ciberseguridad',
        description: 'Auditorías de seguridad, pentesting y protección de datos.'
      },
      support: {
        title: 'Soporte & Mantenimiento',
        description: 'Soporte técnico 24/7, mantenimiento preventivo y actualizaciones.'
      }
    },
    // Clients
    clients: {
      badge: 'Confían en Nosotros',
      title: 'Empresas que han',
      titleHighlight: 'Crecido con Nosotros'
    },
    // Process
    process: {
      badge: 'Cómo Trabajamos',
      title: 'Proceso Simple,',
      titleHighlight: 'Resultados Extraordinarios',
      steps: {
        discovery: {
          title: 'Descubrimiento',
          description: 'Analizamos tus necesidades y objetivos de negocio sin costo.'
        },
        prototype: {
          title: 'Prototipo',
          description: 'Creamos un prototipo rápido para visualizar la solución.'
        },
        development: {
          title: 'Desarrollo',
          description: 'Construimos tu producto con las mejores tecnologías.'
        },
        launch: {
          title: 'Lanzamiento',
          description: 'Desplegamos y te acompañamos en el crecimiento.'
        }
      }
    },
    // Contact
    contact: {
      badge: 'Contáctanos',
      title: 'Hablemos de tu',
      titleHighlight: 'Próximo Proyecto',
      subtitle: 'Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.',
      form: {
        name: 'Nombre completo',
        email: 'Correo electrónico',
        phone: 'Teléfono (opcional)',
        company: 'Empresa (opcional)',
        service: 'Servicio de interés',
        selectService: 'Selecciona un servicio',
        message: 'Cuéntanos sobre tu proyecto',
        submit: 'Enviar Mensaje',
        sending: 'Enviando...',
        success: '¡Mensaje enviado correctamente!',
        error: 'Error al enviar. Intenta nuevamente.'
      },
      info: {
        email: 'Email',
        whatsapp: 'WhatsApp',
        schedule: '¿Prefieres agendar una cita?',
        scheduleBtn: 'Agendar Asesoría Gratuita'
      }
    },
    // Calendar Modal
    calendar: {
      title: 'Agendar Asesoría Gratuita',
      subtitle: 'Selecciona fecha y hora para tu reunión',
      selectDate: 'Selecciona una fecha',
      selectTime: 'Selecciona una hora',
      noTimes: 'No hay horarios disponibles',
      form: {
        name: 'Nombre completo',
        email: 'Correo electrónico',
        phone: 'Teléfono',
        company: 'Empresa (opcional)',
        service: 'Servicio de interés',
        selectService: 'Selecciona un servicio',
        notes: 'Notas adicionales (opcional)',
        submit: 'Confirmar Cita',
        submitting: 'Agendando...',
        success: '¡Cita agendada correctamente!',
        error: 'Error al agendar. Intenta nuevamente.'
      }
    },
    // Footer
    footer: {
      description: 'Transformamos empresas con tecnología e inteligencia artificial. Costos eficientes y resultados extraordinarios.',
      services: 'Servicios',
      contact: 'Contacto',
      rights: 'Todos los derechos reservados.'
    },
    // Common
    common: {
      learnMore: 'Saber más',
      free: 'GRATIS',
      services: {
        web: 'Sitios Web',
        mobile: 'Apps Móviles',
        ecommerce: 'E-commerce',
        ai: 'IA & Automatización',
        software: 'Desarrollo de Software',
        consulting: 'Consultoría Tech',
        qa: 'QA & Testing',
        devops: 'DevOps & Cloud',
        uxui: 'Diseño UX/UI',
        data: 'Data & Analytics',
        security: 'Ciberseguridad',
        support: 'Soporte & Mantenimiento'
      }
    }
  },
  en: {
    // Navigation
    nav: {
      services: 'Services',
      clients: 'Clients',
      process: 'Process',
      contact: 'Contact',
      schedule: 'Schedule Meeting'
    },
    // Hero
    hero: {
      badge: 'Digital Innovation & AI',
      title: 'We transform your business with',
      titleHighlight: 'Software & AI',
      subtitle: 'We create websites, mobile apps, e-commerce and optimized workflows. Free consulting and rapid prototypes at no cost.',
      cta: 'Schedule Free Consultation',
      ctaSecondary: 'View Services',
      stats: {
        projects: 'Projects',
        clients: 'Happy Clients',
        years: 'Years of Experience'
      }
    },
    // Services
    services: {
      badge: 'Our Solutions',
      title: 'High-Impact',
      titleHighlight: 'Technology Solutions',
      subtitle: 'From idea to implementation, we accompany you every step of your digital transformation.',
      web: {
        title: 'Websites',
        description: 'Design and development of modern, responsive, SEO-optimized websites.'
      },
      mobile: {
        title: 'Mobile Apps',
        description: 'Native and cross-platform applications for iOS and Android.'
      },
      ecommerce: {
        title: 'E-commerce',
        description: 'Complete online stores with payment gateways and inventory management.'
      },
      ai: {
        title: 'AI & Automation',
        description: 'Artificial intelligence integration to optimize business processes.'
      },
      software: {
        title: 'Software Development',
        description: 'Custom software, enterprise systems, ERPs and personalized CRMs.'
      },
      consulting: {
        title: 'Tech Consulting',
        description: 'Strategic advice for the digital transformation of your company.'
      },
      qa: {
        title: 'QA & Testing',
        description: 'Quality assurance, automated testing and software validation.'
      },
      devops: {
        title: 'DevOps & Cloud',
        description: 'Cloud infrastructure, CI/CD, containers and continuous deployment.'
      },
      uxui: {
        title: 'UX/UI Design',
        description: 'Intuitive interfaces and conversion-focused user experiences.'
      },
      data: {
        title: 'Data & Analytics',
        description: 'Business Intelligence, dashboards and data analysis for decisions.'
      },
      security: {
        title: 'Cybersecurity',
        description: 'Security audits, pentesting and data protection.'
      },
      support: {
        title: 'Support & Maintenance',
        description: '24/7 technical support, preventive maintenance and updates.'
      }
    },
    // Clients
    clients: {
      badge: 'They Trust Us',
      title: 'Companies that have',
      titleHighlight: 'Grown with Us'
    },
    // Process
    process: {
      badge: 'How We Work',
      title: 'Simple Process,',
      titleHighlight: 'Extraordinary Results',
      steps: {
        discovery: {
          title: 'Discovery',
          description: 'We analyze your needs and business objectives at no cost.'
        },
        prototype: {
          title: 'Prototype',
          description: 'We create a rapid prototype to visualize the solution.'
        },
        development: {
          title: 'Development',
          description: 'We build your product with the best technologies.'
        },
        launch: {
          title: 'Launch',
          description: 'We deploy and accompany you in growth.'
        }
      }
    },
    // Contact
    contact: {
      badge: 'Contact Us',
      title: "Let's talk about your",
      titleHighlight: 'Next Project',
      subtitle: 'Fill out the form and we will contact you in less than 24 hours.',
      form: {
        name: 'Full name',
        email: 'Email address',
        phone: 'Phone (optional)',
        company: 'Company (optional)',
        service: 'Service of interest',
        selectService: 'Select a service',
        message: 'Tell us about your project',
        submit: 'Send Message',
        sending: 'Sending...',
        success: 'Message sent successfully!',
        error: 'Error sending. Please try again.'
      },
      info: {
        email: 'Email',
        whatsapp: 'WhatsApp',
        schedule: 'Prefer to schedule a meeting?',
        scheduleBtn: 'Schedule Free Consultation'
      }
    },
    // Calendar Modal
    calendar: {
      title: 'Schedule Free Consultation',
      subtitle: 'Select date and time for your meeting',
      selectDate: 'Select a date',
      selectTime: 'Select a time',
      noTimes: 'No available times',
      form: {
        name: 'Full name',
        email: 'Email address',
        phone: 'Phone',
        company: 'Company (optional)',
        service: 'Service of interest',
        selectService: 'Select a service',
        notes: 'Additional notes (optional)',
        submit: 'Confirm Appointment',
        submitting: 'Scheduling...',
        success: 'Appointment scheduled successfully!',
        error: 'Error scheduling. Please try again.'
      }
    },
    // Footer
    footer: {
      description: 'We transform companies with technology and artificial intelligence. Efficient costs and extraordinary results.',
      services: 'Services',
      contact: 'Contact',
      rights: 'All rights reserved.'
    },
    // Common
    common: {
      learnMore: 'Learn more',
      free: 'FREE',
      services: {
        web: 'Websites',
        mobile: 'Mobile Apps',
        ecommerce: 'E-commerce',
        ai: 'AI & Automation',
        software: 'Software Development',
        consulting: 'Tech Consulting',
        qa: 'QA & Testing',
        devops: 'DevOps & Cloud',
        uxui: 'UX/UI Design',
        data: 'Data & Analytics',
        security: 'Cybersecurity',
        support: 'Support & Maintenance'
      }
    }
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    const saved = localStorage.getItem('vegsoft-language');
    if (saved && (saved === 'es' || saved === 'en')) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('vegsoft-language', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
