import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Mail, Phone, Send, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import CalendarModal from './CalendarModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const { t } = useLanguage();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value) => {
    setFormData(prev => ({ ...prev, service: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success(t.contact.form.success);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(t.contact.form.error);
    } finally {
      setIsLoading(false);
    }
  };

  const services = [
    { value: 'web', label: t.common.services.web },
    { value: 'mobile', label: t.common.services.mobile },
    { value: 'ecommerce', label: t.common.services.ecommerce },
    { value: 'ai', label: t.common.services.ai },
    { value: 'workflows', label: t.common.services.workflows },
    { value: 'consulting', label: t.common.services.consulting }
  ];

  return (
    <>
      <section
        id="contact"
        data-testid="contact-section"
        className="relative py-24 lg:py-32"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-muted/30 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-electric/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-violet/10 rounded-full blur-[150px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-6">
              <span className="text-sm font-medium text-muted-foreground">{t.contact.badge}</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
              {t.contact.title}{' '}
              <span className="text-gradient">{t.contact.titleHighlight}</span>
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <form
                onSubmit={handleSubmit}
                data-testid="contact-form"
                className="space-y-6 p-6 lg:p-8 rounded-2xl glass border border-border/50"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      name="name"
                      placeholder={t.contact.form.name}
                      value={formData.name}
                      onChange={handleChange}
                      required
                      data-testid="contact-name"
                      className="bg-muted/50 border-border focus:border-primary h-12"
                    />
                  </div>
                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder={t.contact.form.email}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      data-testid="contact-email"
                      className="bg-muted/50 border-border focus:border-primary h-12"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      name="phone"
                      placeholder={t.contact.form.phone}
                      value={formData.phone}
                      onChange={handleChange}
                      data-testid="contact-phone"
                      className="bg-muted/50 border-border focus:border-primary h-12"
                    />
                  </div>
                  <div>
                    <Input
                      name="company"
                      placeholder={t.contact.form.company}
                      value={formData.company}
                      onChange={handleChange}
                      data-testid="contact-company"
                      className="bg-muted/50 border-border focus:border-primary h-12"
                    />
                  </div>
                </div>

                <Select value={formData.service} onValueChange={handleServiceChange}>
                  <SelectTrigger
                    data-testid="contact-service"
                    className="bg-muted/50 border-border focus:border-primary h-12"
                  >
                    <SelectValue placeholder={t.contact.form.selectService} />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Textarea
                  name="message"
                  placeholder={t.contact.form.message}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  data-testid="contact-message"
                  className="bg-muted/50 border-border focus:border-primary min-h-[120px] resize-none"
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  data-testid="contact-submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 font-semibold shadow-[0_0_20px_rgba(0,220,130,0.3)] hover:shadow-[0_0_30px_rgba(0,220,130,0.5)] transition-all"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-pulse">{t.contact.form.sending}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t.contact.form.submit}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Email Card */}
              <div className="p-6 rounded-2xl border border-border/50 bg-card/30 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.contact.info.email}</h3>
                    <a
                      href="mailto:Douglas.vegas@vegsoftsolutions.com"
                      data-testid="contact-email-link"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm break-all"
                    >
                      Douglas.vegas@vegsoftsolutions.com
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="p-6 rounded-2xl border border-border/50 bg-card/30 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.contact.info.whatsapp}</h3>
                    <a
                      href="https://wa.me/56947127116"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="contact-whatsapp-link"
                      className="text-muted-foreground hover:text-green-500 transition-colors text-sm"
                    >
                      +56 947 127 116
                    </a>
                  </div>
                </div>
              </div>

              {/* Schedule CTA */}
              <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t.contact.info.schedule}</h3>
                  </div>
                </div>
                <Button
                  onClick={() => setIsCalendarOpen(true)}
                  data-testid="contact-schedule-btn"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold"
                >
                  {t.contact.info.scheduleBtn}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
    </>
  );
};

export default Contact;
