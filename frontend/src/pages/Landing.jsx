import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Shield, Clock, Phone, Mail, MapPin, ChevronLeft, ChevronRight, Quote, CalendarCheck, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const services = [
  {
    icon: Scale,
    title: 'Immigration Law',
    body: 'Visas, green cards, citizenship, family petitions, and work permit consultations tailored to your case.',
  },
  {
    icon: Shield,
    title: 'Case Protection',
    body: 'Deportation defense, appeals, and humanitarian relief — we stand with you through every step.',
  },
  {
    icon: Clock,
    title: 'Document Review',
    body: 'Detailed review of forms, evidence, and filings before submission to reduce risk and delays.',
  },
];

const carouselSlides = [
  {
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600',
    caption: 'Our team, by your side.',
  },
  {
    img: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=1600',
    caption: 'A welcoming space for every client.',
  },
  {
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600',
    caption: 'Guidance you can trust.',
  },
];

const testimonials = [
  {
    name: 'Maria G.',
    quote: 'They handled my work permit case with patience and clarity. I always knew what was happening.',
  },
  {
    name: 'David K.',
    quote: 'Professional and human. They treated my case like it mattered — because to me, it does.',
  },
  {
    name: 'Aisha R.',
    quote: 'Booking, consultations, follow-ups — everything was easy. Highly recommend.',
  },
];

export default function Landing() {
  const { client } = useAuth();
  const [settings, setSettings] = useState({
    business_name: 'Immigration Law Office',
    business_tagline: 'Guiding your journey, protecting your future.',
  });
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    api.get('/settings/public').then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % carouselSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-md bg-brand-700 text-white flex items-center justify-center font-serif text-lg font-semibold">
              L
            </div>
            <div>
              <div className="font-serif text-lg leading-tight text-brand-900">
                {settings.business_name}
              </div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Attorneys at Law
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-brand-800">
            <a href="#services" className="hover:text-brand-600">Services</a>
            <a href="#about" className="hover:text-brand-600">About</a>
            <a href="#contact" className="hover:text-brand-600">Contact</a>
            {client ? (
              <Link to="/dashboard" className="hover:text-brand-600">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="hover:text-brand-600">
                Sign in
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2">
            {client ? (
              <Link to="/dashboard" className="hidden sm:inline-flex">
                <Button size="sm" variant="outline">
                  <CalendarCheck className="h-4 w-4" /> My dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex">
                <Button size="sm" variant="ghost">
                  <User className="h-4 w-4" /> Sign in
                </Button>
              </Link>
            )}
            <Link to="/book">
              <Button size="sm" className="hidden sm:inline-flex">Book Appointment</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center py-16 md:py-24 px-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-100 rounded-full px-3 py-1 mb-5">
              <Shield className="h-3.5 w-3.5" /> Trusted immigration counsel
            </div>
            <h1 className="display-serif text-4xl md:text-5xl lg:text-6xl text-brand-900 leading-tight">
              {settings.business_name}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-brand-800/80 max-w-xl">
              {settings.business_tagline}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/book">
                <Button size="lg" className="w-full sm:w-auto">Book an Appointment</Button>
              </Link>
              <a href="#services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Our Services
                </Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Mon-Fri, 10:00-17:00</div>
              <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> Confidential consultations</div>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl bg-brand-100">
            <img
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200"
              alt="Law office"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="display-serif text-3xl md:text-4xl text-brand-900">Services</h2>
            <p className="mt-3 text-muted-foreground">
              Comprehensive legal support across the full immigration journey.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-lg border border-border bg-white p-6 hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center mb-4">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-brand-900">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carousel */}
      <section className="py-16 md:py-24 bg-brand-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="display-serif text-3xl md:text-4xl text-brand-900">Our Space & Team</h2>
            <p className="mt-3 text-muted-foreground">
              A welcoming office and experienced attorneys ready to help.
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
            <div className="aspect-[16/9] relative bg-black">
              {carouselSlides.map((sl, i) => (
                <img
                  key={sl.img}
                  src={sl.img}
                  alt={sl.caption}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                    i === slide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
                <p className="font-serif text-xl">{carouselSlides[slide].caption}</p>
              </div>
            </div>
            <button
              aria-label="Previous"
              onClick={() => setSlide((s) => (s - 1 + carouselSlides.length) % carouselSlides.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5 text-brand-900" />
            </button>
            <button
              aria-label="Next"
              onClick={() => setSlide((s) => (s + 1) % carouselSlides.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
            >
              <ChevronRight className="h-5 w-5 text-brand-900" />
            </button>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-lg bg-white p-6 border border-border">
                <Quote className="h-6 w-6 text-brand-300 mb-3" />
                <p className="text-brand-800 italic">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-3 text-sm font-semibold text-brand-900">-- {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 md:py-24">
        <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center px-4">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200"
              alt="Our team"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="display-serif text-3xl md:text-4xl text-brand-900">About the Firm</h2>
            <p className="mt-4 text-brand-800/90">
              For over a decade, {settings.business_name} has helped individuals and families
              navigate complex immigration matters with compassion, precision, and tenacity.
              Every case is treated with the personal attention it deserves.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-brand-800">
              <li className="flex gap-2"><span className="text-brand-600">&#10003;</span> Bilingual attorneys (English / Spanish)</li>
              <li className="flex gap-2"><span className="text-brand-600">&#10003;</span> Transparent, flat-rate consultations</li>
              <li className="flex gap-2"><span className="text-brand-600">&#10003;</span> In-person and virtual meetings available</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 md:py-24 bg-brand-900 text-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="display-serif text-3xl md:text-4xl">Contact</h2>
            <p className="mt-3 text-brand-200">
              Ready to take the first step? Reach out or book directly below.
            </p>
            <div className="mt-8 space-y-4 text-brand-100">
              <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-brand-300" /> (555) 123-4567</div>
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-brand-300" /> hello@example.com</div>
              <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-brand-300" /> 123 Legal Ave, Suite 400, City, ST</div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Link to="/book">
              <Button size="lg" className="bg-white text-brand-900 hover:bg-brand-50 text-base">
                Book an Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-brand-950 text-brand-200 py-8 text-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>&copy; {new Date().getFullYear()} {settings.business_name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
