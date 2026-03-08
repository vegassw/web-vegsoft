import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { toast } from 'sonner';
import axios from 'axios';
import { format, addDays, isWeekend } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Clock, CalendarDays, Check } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CalendarModal = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    notes: ''
  });

  const locale = language === 'es' ? es : enUS;

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimes(format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate]);

  const fetchAvailableTimes = async (date) => {
    try {
      const response = await axios.get(`${API}/appointments/available-times?date=${date}`);
      setAvailableTimes(response.data.available_times || []);
    } catch (error) {
      console.error('Error fetching times:', error);
      setAvailableTimes([
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
      ]);
    }
  };

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
      await axios.post(`${API}/appointments`, {
        ...formData,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime
      });
      setIsSuccess(true);
      toast.success(t.calendar.form.success);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Appointment error:', error);
      toast.error(t.calendar.form.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setIsSuccess(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      notes: ''
    });
    onClose();
  };

  const services = [
    { value: 'web', label: t.common.services.web },
    { value: 'mobile', label: t.common.services.mobile },
    { value: 'ecommerce', label: t.common.services.ecommerce },
    { value: 'ai', label: t.common.services.ai },
    { value: 'workflows', label: t.common.services.workflows },
    { value: 'consulting', label: t.common.services.consulting }
  ];

  const disabledDays = (date) => {
    return date < new Date() || isWeekend(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        data-testid="calendar-modal"
        className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            {t.calendar.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{t.calendar.subtitle}</p>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-2">{t.calendar.form.success}</h3>
            <p className="text-muted-foreground">
              {format(selectedDate, 'PPP', { locale })} - {selectedTime}
            </p>
          </div>
        ) : (
          <>
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-1 rounded-full transition-colors ${
                    s <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {step === 1 && (
              <div data-testid="calendar-step-1" className="space-y-4">
                <label className="text-sm font-medium text-foreground">{t.calendar.selectDate}</label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      if (date) setStep(2);
                    }}
                    disabled={disabledDays}
                    locale={locale}
                    className="rounded-xl border border-border"
                    fromDate={new Date()}
                    toDate={addDays(new Date(), 60)}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div data-testid="calendar-step-2" className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">{t.calendar.selectTime}</label>
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-primary hover:underline"
                  >
                    {format(selectedDate, 'PPP', { locale })}
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableTimes.length > 0 ? (
                    availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time);
                          setStep(3);
                        }}
                        data-testid={`time-slot-${time}`}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          selectedTime === time
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:border-primary hover:bg-primary/10'
                        }`}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1" />
                        {time}
                      </button>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-muted-foreground py-8">
                      {t.calendar.noTimes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} data-testid="calendar-step-3" className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Fecha: </span>
                    <span className="font-medium">{format(selectedDate, 'PPP', { locale })}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Hora: </span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-primary hover:underline"
                  >
                    Cambiar
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    placeholder={t.calendar.form.name}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    data-testid="appointment-name"
                    className="bg-muted/50 border-border"
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder={t.calendar.form.email}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    data-testid="appointment-email"
                    className="bg-muted/50 border-border"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    name="phone"
                    placeholder={t.calendar.form.phone}
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    data-testid="appointment-phone"
                    className="bg-muted/50 border-border"
                  />
                  <Input
                    name="company"
                    placeholder={t.calendar.form.company}
                    value={formData.company}
                    onChange={handleChange}
                    data-testid="appointment-company"
                    className="bg-muted/50 border-border"
                  />
                </div>

                <Select value={formData.service} onValueChange={handleServiceChange} required>
                  <SelectTrigger data-testid="appointment-service" className="bg-muted/50 border-border">
                    <SelectValue placeholder={t.calendar.form.selectService} />
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
                  name="notes"
                  placeholder={t.calendar.form.notes}
                  value={formData.notes}
                  onChange={handleChange}
                  data-testid="appointment-notes"
                  className="bg-muted/50 border-border min-h-[80px] resize-none"
                />

                <Button
                  type="submit"
                  disabled={isLoading || !formData.service}
                  data-testid="appointment-submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold"
                >
                  {isLoading ? t.calendar.form.submitting : t.calendar.form.submit}
                </Button>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModal;
