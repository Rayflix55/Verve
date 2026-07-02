import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'motion/react';
import { SectionHeaderReveal } from './UI/SectionHeaderReveal';
import { MapPin, Mail, Phone, Clock, Twitter, Github, Linkedin, Instagram, Send, CheckCircle2 } from 'lucide-react';
import { Button } from './UI/Button';

interface IFormInput {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

interface ContactInfo {
  address: string;
  email: string;
  phone: string;
  hours: string;
}

interface SocialLinks {
  twitter: string;
  github: string;
  linkedin: string;
  instagram: string;
}

interface ContactData {
  title: string;
  subtitle: string;
  info: ContactInfo;
  socials: SocialLinks;
}

interface ContactProps {
  data: ContactData;
}

export function Contact({ data }: ContactProps) {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (formData) => {
    setIsSubmittingForm(true);

    // Simulate standard server latency
    setTimeout(() => {
      setIsSubmittingForm(false);
      setSubmitSuccess(true);
      reset();

      // Reset success message after 5s
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1800);
  };

  return (
    <motion.section
      id="contact"
      className="py-24 relative max-w-7xl mx-auto px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Background radial glow */}
      <div className="absolute bottom-1/4 -right-48 -z-10 w-96 h-96 rounded-full bg-magenta/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <SectionHeaderReveal>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-5">
          {data.title}
        </h2>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed">
          {data.subtitle}
        </p>
      </SectionHeaderReveal>

      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        id="contact-container"
      >
        {/* Left Column: Premium Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 rounded-3xl border border-neutral-200/50 bg-white/75 dark:border-neutral-800/80 dark:bg-neutral-900/40 backdrop-blur-md p-6 sm:p-8 shadow-xl"
          id="contact-form-card"
        >
          {submitSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-5"
              id="contact-success-block"
            >
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                Message Sent Successfully!
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-sm text-sm sm:text-base leading-relaxed">
                Thank you for reaching out to Verve. One of our solution engineers will verify your message and respond within the next 2 hours.
              </p>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSubmitSuccess(false)}
                id="contact-success-reset"
              >
                Send another message
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="contact-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Full Name <span className="text-magenta">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Jessica Evans"
                    {...register('name', { required: 'Full name is required' })}
                    className={`px-4 py-3 rounded-xl border bg-white dark:bg-neutral-900/60 text-sm focus:outline-none focus:ring-1 transition-all ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-neutral-200 dark:border-neutral-800 focus:border-magenta focus:ring-magenta'
                    }`}
                  />
                  {errors.name && <span className="text-[11px] text-red-500 font-medium">{errors.name.message}</span>}
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Email Address <span className="text-magenta">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="jessica@nexus.co"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address format',
                      },
                    })}
                    className={`px-4 py-3 rounded-xl border bg-white dark:bg-neutral-900/60 text-sm focus:outline-none focus:ring-1 transition-all ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-neutral-200 dark:border-neutral-800 focus:border-magenta focus:ring-magenta'
                    }`}
                  />
                  {errors.email && <span className="text-[11px] text-red-500 font-medium">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Company */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="company" className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Company Name <span className="text-neutral-400 text-[10px] font-normal tracking-normal">(Optional)</span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Nexus Corp"
                    {...register('company')}
                    className="px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 text-sm focus:outline-none focus:border-magenta focus:ring-1 focus:ring-magenta transition-all"
                  />
                </div>

                {/* Subject dropdown */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Subject / Topic <span className="text-magenta">*</span>
                  </label>
                  <select
                    id="subject"
                    {...register('subject', { required: 'Please select a subject' })}
                    className={`px-4 py-3 rounded-xl border bg-white dark:bg-neutral-900/60 text-sm focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer ${
                      errors.subject
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-neutral-200 dark:border-neutral-800 focus:border-magenta focus:ring-magenta'
                    }`}
                  >
                    <option value="">Select an option...</option>
                    <option value="Demo Request">Request Custom Demo</option>
                    <option value="Enterprise Solution">Enterprise Pricing & SLAs</option>
                    <option value="General Query">General Question</option>
                    <option value="Partnership">Partnerships & Press</option>
                  </select>
                  {errors.subject && <span className="text-[11px] text-red-500 font-medium">{errors.subject.message}</span>}
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="message" className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  How can we help your team? <span className="text-magenta">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us about your team size, workflow bottlenecks, and what tools you sync..."
                  {...register('message', { required: 'Message body cannot be empty' })}
                  className={`px-4 py-3 rounded-xl border bg-white dark:bg-neutral-900/60 text-sm focus:outline-none focus:ring-1 transition-all ${
                    errors.message
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-neutral-200 dark:border-neutral-800 focus:border-magenta focus:ring-magenta'
                  }`}
                />
                {errors.message && <span className="text-[11px] text-red-500 font-medium">{errors.message.message}</span>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmittingForm}
                className="w-full justify-center text-sm py-3"
                icon={<Send className="h-4 w-4" />}
                id="contact-submit-btn"
              >
                Send Secure Message
              </Button>
            </form>
          )}
        </motion.div>

        {/* Right Column: Company Coordinates Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 space-y-8"
          id="contact-info-column"
        >
          {/* Coordinates Block */}
          <div className="rounded-3xl border border-neutral-200/50 bg-white/70 dark:border-neutral-800/80 dark:bg-neutral-900/40 backdrop-blur-md p-7 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Corporate Office Coordinates
            </h3>

            <div className="space-y-4.5 text-sm">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/20 dark:border-neutral-700/50 flex items-center justify-center text-magenta">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 text-xs uppercase tracking-wider mb-0.5">Headquarters</h4>
                  <p className="text-neutral-500 dark:text-neutral-400 font-normal leading-normal">{data.info.address}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/20 dark:border-neutral-700/50 flex items-center justify-center text-cyan">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 text-xs uppercase tracking-wider mb-0.5">Secure Email</h4>
                  <a href={`mailto:${data.info.email}`} className="text-neutral-500 dark:text-neutral-400 font-normal hover:text-magenta transition-colors">{data.info.email}</a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/20 dark:border-neutral-700/50 flex items-center justify-center text-purple-400">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 text-xs uppercase tracking-wider mb-0.5">Secure Voice Line</h4>
                  <a href={`tel:${data.info.phone}`} className="text-neutral-500 dark:text-neutral-400 font-normal hover:text-magenta transition-colors">{data.info.phone}</a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/20 dark:border-neutral-700/50 flex items-center justify-center text-magenta">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 text-xs uppercase tracking-wider mb-0.5">Operating Hours</h4>
                  <p className="text-neutral-500 dark:text-neutral-400 font-normal leading-normal">{data.info.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Socials Connection */}
          <div className="rounded-3xl border border-neutral-200/50 bg-white/70 dark:border-neutral-800/80 dark:bg-neutral-900/40 backdrop-blur-md p-7 space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Connect on secure socials
            </h3>
            <div className="flex space-x-3.5" id="contact-socials">
              <a
                href={data.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 w-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/20 dark:border-neutral-700/50 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-magenta dark:hover:text-magenta transition-colors hover:scale-105"
                aria-label="Twitter connection"
              >
                <Twitter className="h-5 w-5 fill-current text-current" />
              </a>
              <a
                href={data.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 w-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/20 dark:border-neutral-700/50 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-magenta dark:hover:text-magenta transition-colors hover:scale-105"
                aria-label="GitHub connection"
              >
                <Github className="h-5 w-5 fill-current text-current" />
              </a>
              <a
                href={data.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 w-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/20 dark:border-neutral-700/50 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-magenta dark:hover:text-magenta transition-colors hover:scale-105"
                aria-label="LinkedIn connection"
              >
                <Linkedin className="h-5 w-5 fill-current text-current" />
              </a>
              <a
                href={data.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 w-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/20 dark:border-neutral-700/50 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-magenta dark:hover:text-magenta transition-colors hover:scale-105"
                aria-label="Instagram connection"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
