import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  CheckCircle2,
  Calendar,
  Video,
  MapPin,
  Clock,
  Mail,
  Phone,
  RefreshCw,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  firebaseConfigured,
  setupRecaptcha,
  sendPhoneVerification,
  confirmPhoneCode,
  clientRegister,
  clientLogin,
  sendClientEmailVerification,
} from '../lib/firebase';
import { format, addDays } from 'date-fns';

// Prospective-only booking flow. Authenticated returning clients are redirected
// to /dashboard by the effect below and use the dashboard "Book new" entry point
// instead — which lands on this same page but skips the phone-OTP step because
// the auth context already has a verified user.
const STEPS = [
  { key: 'type', label: 'Service' },
  { key: 'verify', label: 'Verify phone' },
  { key: 'datetime', label: 'Date & time' },
  { key: 'details', label: 'Your details' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Confirmed' },
];

export default function Booking() {
  const { client, clientProfile, verification, upsertClientProfile, refreshClient } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('type');
  const [types, setTypes] = useState([]);
  const [publicSettings, setPublicSettings] = useState(null);

  const [selectedType, setSelectedType] = useState(null);
  const [modality, setModality] = useState('in_person');
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [preferredContactStart, setPreferredContactStart] = useState('10:00');
  const [preferredContactEnd, setPreferredContactEnd] = useState('17:00');

  const [profile, setProfile] = useState({ full_name: '', email: '', phone: '' });

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    api.get('/appointment-types/public').then((r) => setTypes(r.types)).catch(() => {});
    api.get('/settings/public').then(setPublicSettings).catch(() => {});
  }, []);

  // Returning clients who already have a verified session bypass the verify step.
  useEffect(() => {
    if (clientProfile) {
      setProfile({
        full_name: clientProfile.full_name || '',
        email: clientProfile.email || client?.email || '',
        phone: clientProfile.phone || client?.phoneNumber || '',
      });
    } else if (client) {
      setProfile((p) => ({
        ...p,
        email: client.email || p.email,
        phone: client.phoneNumber || p.phone,
      }));
    }
  }, [clientProfile, client]);

  useEffect(() => {
    if (step !== 'datetime' || !selectedType) return;
    setLoadingSlots(true);
    setError(null);
    api
      .get(`/availability?date=${selectedDate}&duration=${selectedType.duration_minutes}`)
      .then((r) => setSlots(r.slots))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, selectedType, step]);

  // If we're on the verify step and the user is already verified, jump ahead.
  useEffect(() => {
    if (step === 'verify' && verification?.atLeastOne) {
      setStep('datetime');
    }
  }, [step, verification]);

  useEffect(() => {
    if (publicSettings) {
      setPreferredContactStart(publicSettings.working_hours_start || '10:00');
      setPreferredContactEnd(publicSettings.working_hours_end || '17:00');
    }
  }, [publicSettings]);

  const canProceedFromType = !!selectedType;
  const canProceedFromDatetime = !!selectedSlot;
  const canProceedFromDetails =
    profile.full_name &&
    profile.email &&
    profile.phone &&
    preferredContactStart &&
    preferredContactEnd;

  function goToVerifyOrSkip() {
    if (verification?.atLeastOne) {
      setStep('datetime');
    } else {
      setStep('verify');
    }
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      await upsertClientProfile({
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        client_type: clientProfile?.client_type || 'prospective',
        case_number: clientProfile?.case_number || null,
      });

      const preferredContactTime = `${preferredContactStart}-${preferredContactEnd}`;

      const { appointment } = await api.post(
        '/appointments/book',
        {
          appointment_type_id: selectedType.id,
          start_at: selectedSlot.start,
          modality,
          notes: appointmentNotes || null,
          preferred_contact_time: preferredContactTime,
        },
        { auth: 'client' }
      );
      setConfirmed(appointment);
      setStep('done');
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  function startAnother() {
    setSelectedType(null);
    setSelectedSlot(null);
    setSlots([]);
    setAppointmentNotes('');
    setConfirmed(null);
    setError(null);
    setStep('type');
  }

  const idx = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-brand-50/50">
      <header className="bg-white border-b border-border">
        <div className="container mx-auto h-16 px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-brand-800 hover:text-brand-600">
            <ChevronLeft className="h-5 w-5" /> Back to site
          </Link>
          {client ? (
            <Link to="/dashboard" className="text-sm text-brand-700 hover:underline">
              Go to dashboard
            </Link>
          ) : (
            <Link to="/login" className="text-sm text-brand-700 hover:underline">
              Returning client? Sign in
            </Link>
          )}
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
          {STEPS.filter((s) => s.key !== 'done').map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={`h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-semibold ${
                  idx >= i
                    ? 'bg-brand-700 text-white'
                    : 'bg-white border border-border text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              <div
                className={`text-xs sm:text-sm truncate ${
                  idx >= i ? 'text-brand-900 font-medium' : 'text-muted-foreground'
                }`}
              >
                {s.label}
              </div>
              {i < STEPS.length - 2 && (
                <div className={`flex-1 h-px mx-1 ${idx > i ? 'bg-brand-500' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 text-red-800 px-4 py-3 text-sm border border-red-200">
            {error}
          </div>
        )}

        {step === 'type' && (
          <StepType
            types={types}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            modality={modality}
            setModality={setModality}
            onNext={goToVerifyOrSkip}
            canProceed={canProceedFromType}
          />
        )}

        {step === 'verify' && (
          <StepVerify onError={setError} refreshClient={refreshClient} />
        )}

        {step === 'datetime' && (
          <StepDateTime
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            slots={slots}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            loadingSlots={loadingSlots}
            onBack={() => setStep('type')}
            onNext={() => setStep('details')}
            canProceed={canProceedFromDatetime}
          />
        )}

        {step === 'details' && (
          <StepDetails
            profile={profile}
            setProfile={setProfile}
            appointmentNotes={appointmentNotes}
            setAppointmentNotes={setAppointmentNotes}
            preferredContactStart={preferredContactStart}
            setPreferredContactStart={setPreferredContactStart}
            preferredContactEnd={preferredContactEnd}
            setPreferredContactEnd={setPreferredContactEnd}
            publicSettings={publicSettings}
            onBack={() => setStep('datetime')}
            onNext={() => setStep('review')}
            canProceed={canProceedFromDetails}
          />
        )}

        {step === 'review' && (
          <StepReview
            type={selectedType}
            modality={modality}
            slot={selectedSlot}
            profile={profile}
            appointmentNotes={appointmentNotes}
            preferredContactStart={preferredContactStart}
            preferredContactEnd={preferredContactEnd}
            onBack={() => setStep('details')}
            onConfirm={submit}
            submitting={submitting}
          />
        )}

        {step === 'done' && confirmed && (
          <StepDone
            appointment={confirmed}
            type={selectedType}
            onHome={() => navigate('/')}
            onBookAnother={startAnother}
            onGoToDashboard={() => navigate('/dashboard')}
          />
        )}
      </div>
    </div>
  );
}

// ------------------ Step components ------------------

function StepType({ types, selectedType, setSelectedType, modality, setModality, onNext, canProceed }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose a service</CardTitle>
        <CardDescription>Tell us what kind of consultation you need.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-3">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t)}
              className={`text-left rounded-lg border p-4 transition-colors ${
                selectedType?.id === t.id
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-border bg-white hover:bg-brand-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-brand-900">{t.name}</span>
                <Badge variant="muted">{t.duration_minutes} min</Badge>
              </div>
              {t.description && (
                <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
              )}
            </button>
          ))}
        </div>

        <div>
          <Label>Meeting format</Label>
          <div className="grid sm:grid-cols-2 gap-3 mt-2">
            <button
              onClick={() => setModality('in_person')}
              className={`rounded-lg border p-4 flex items-center gap-3 text-left ${
                modality === 'in_person' ? 'border-brand-600 bg-brand-50' : 'border-border bg-white'
              }`}
            >
              <MapPin className="h-5 w-5 text-brand-700" />
              <div>
                <div className="font-medium text-brand-900">In-Person</div>
                <div className="text-xs text-muted-foreground">Visit our office</div>
              </div>
            </button>
            <button
              onClick={() => setModality('google_meet')}
              className={`rounded-lg border p-4 flex items-center gap-3 text-left ${
                modality === 'google_meet' ? 'border-brand-600 bg-brand-50' : 'border-border bg-white'
              }`}
            >
              <Video className="h-5 w-5 text-brand-700" />
              <div>
                <div className="font-medium text-brand-900">Google Meet</div>
                <div className="text-xs text-muted-foreground">Virtual meeting</div>
              </div>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button disabled={!canProceed} onClick={onNext}>Continue</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StepVerify({ onError, refreshClient }) {
  const [method, setMethod] = useState('phone');

  if (!firebaseConfigured()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verification unavailable</CardTitle>
          <CardDescription>Firebase Authentication is not configured.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Set <code>VITE_FIREBASE_*</code> environment variables in the frontend build and reload this page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify your identity</CardTitle>
        <CardDescription>
          Choose one method. Our team needs a verified contact point before confirming your request.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 border-b border-border">
          <VerifyTab active={method === 'phone'} onClick={() => setMethod('phone')}>
            <Phone className="h-4 w-4" /> Phone OTP
          </VerifyTab>
          <VerifyTab active={method === 'email'} onClick={() => setMethod('email')}>
            <Mail className="h-4 w-4" /> Email link
          </VerifyTab>
        </div>
        {method === 'phone' ? (
          <PhoneVerifyPanel onError={onError} />
        ) : (
          <EmailVerifyPanel onError={onError} refreshClient={refreshClient} />
        )}
      </CardContent>
    </Card>
  );
}

function VerifyTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
        active
          ? 'text-brand-900 border-brand-700'
          : 'text-muted-foreground border-transparent hover:text-brand-800'
      }`}
    >
      {children}
    </button>
  );
}

function PhoneVerifyPanel({ onError }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const confirmationRef = useRef(null);
  const recaptchaRef = useRef(null);

  async function send(e) {
    e.preventDefault();
    setLoading(true);
    onError(null);
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = setupRecaptcha('booking-recaptcha');
      }
      confirmationRef.current = await sendPhoneVerification(phoneNumber, recaptchaRef.current);
      setOtpSent(true);
    } catch (err) {
      onError(humanizePhoneError(err));
      recaptchaRef.current = null;
    } finally {
      setLoading(false);
    }
  }

  async function verify(e) {
    e.preventDefault();
    setLoading(true);
    onError(null);
    try {
      await confirmPhoneCode(confirmationRef.current, otp);
    } catch (err) {
      onError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div id="booking-recaptcha" />
      {!otpSent ? (
        <form onSubmit={send} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Phone number</Label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+15551234567"
              required
            />
            <p className="text-xs text-muted-foreground">
              E.164 format — start with + and country code, no spaces or dashes.
            </p>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending…' : 'Send verification code'}
          </Button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Verification code</Label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
              autoComplete="one-time-code"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Verifying…' : 'Verify'}
          </Button>
          <button
            type="button"
            onClick={() => {
              setOtpSent(false);
              setOtp('');
              recaptchaRef.current = null;
            }}
            className="text-sm text-brand-700 hover:underline block mx-auto"
          >
            Use a different phone number
          </button>
        </form>
      )}
    </div>
  );
}

function EmailVerifyPanel({ onError, refreshClient }) {
  const { client, verification } = useAuth();
  const [mode, setMode] = useState('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [info, setInfo] = useState(null);

  // Once the user is authenticated but email is not yet verified, switch to the
  // "waiting for link click" state. The parent's effect auto-advances the wizard
  // when verification.emailVerified flips true.
  const waiting = !!client && !verification?.emailVerified;

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    onError(null);
    setInfo(null);
    try {
      if (mode === 'register') {
        await clientRegister(email, password);
        await sendClientEmailVerification();
        setInfo(`Verification link sent to ${email}. Click it, then come back and press "I clicked the link".`);
      } else {
        await clientLogin(email, password);
        // If the user is already verified we're done — the parent effect advances.
        // Otherwise resend the link and let them verify.
        await sendClientEmailVerification().catch(() => {});
      }
    } catch (err) {
      onError(humanizeEmailError(err));
    } finally {
      setLoading(false);
    }
  }

  async function recheck() {
    setChecking(true);
    onError(null);
    await refreshClient();
    setChecking(false);
  }

  async function resend() {
    try {
      await sendClientEmailVerification();
      setInfo('Verification email resent. Check your inbox (and spam).');
    } catch (err) {
      onError(humanizeEmailError(err));
    }
  }

  if (waiting) {
    return (
      <div className="space-y-3">
        <div className="rounded-md bg-brand-50 border border-brand-100 p-3 text-sm">
          <p className="font-medium text-brand-900">Waiting for you to click the link</p>
          <p className="text-muted-foreground mt-1">
            We sent a verification email to <strong>{client.email}</strong>. Click the link inside,
            then return to this tab and press the button below. We&rsquo;ll take it from there.
          </p>
          {info && <p className="text-emerald-700 mt-2">{info}</p>}
        </div>
        <Button onClick={recheck} disabled={checking} className="w-full">
          <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
          {checking ? 'Checking…' : "I've clicked the link"}
        </Button>
        <Button variant="outline" onClick={resend} className="w-full">
          Resend verification email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
        />
        <p className="text-xs text-muted-foreground">
          Minimum 6 characters. You&rsquo;ll use this to sign in later at{' '}
          <Link to="/login" className="text-brand-700 hover:underline">/login</Link>.
        </p>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading
          ? 'Please wait…'
          : mode === 'register'
          ? 'Create account & send verification email'
          : 'Sign in'}
      </Button>
      <button
        type="button"
        onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
        className="text-sm text-brand-700 hover:underline block mx-auto"
      >
        {mode === 'register'
          ? 'Already have an account? Sign in'
          : 'New here? Create an account'}
      </button>
    </form>
  );
}

function humanizePhoneError(err) {
  const code = err?.code || '';
  if (code.includes('invalid-phone-number')) {
    return 'That phone number looks invalid. Use E.164 format (e.g. +15551234567).';
  }
  if (code.includes('too-many-requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (code.includes('billing-not-enabled') || code.includes('OPERATION_NOT_ALLOWED')) {
    return 'Phone sign-in is not enabled for this Firebase project. Use the Email option or enable Phone auth in Firebase Console.';
  }
  if (code.includes('captcha-check-failed') || code.includes('missing-client-identifier')) {
    return 'reCAPTCHA check failed. Refresh the page and try again.';
  }
  return err.message || 'Could not send verification code.';
}

function humanizeEmailError(err) {
  const code = err?.code || '';
  if (code.includes('email-already-in-use')) {
    return 'That email is already registered. Switch to "Sign in" below.';
  }
  if (code.includes('invalid-email')) {
    return 'That email address is invalid.';
  }
  if (code.includes('weak-password')) {
    return 'Password must be at least 6 characters.';
  }
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
    return 'Email or password is incorrect.';
  }
  if (code.includes('operation-not-allowed')) {
    return 'Email/Password sign-in is disabled for this Firebase project. Enable it in Firebase Console → Authentication → Sign-in method → Email/Password.';
  }
  if (code.includes('unauthorized-continue-uri') || code.includes('invalid-continue-uri')) {
    return 'This origin is not in the Authorized domains list. Add your dev domain in Firebase Console → Authentication → Settings → Authorized domains.';
  }
  if (code.includes('too-many-requests')) {
    return 'Too many attempts. Please wait a minute and try again.';
  }
  // Surface the raw code so we can diagnose unfamiliar 400s.
  return `${err.message || 'Email verification failed.'}${code ? ` (${code})` : ''}`;
}

function StepDateTime({
  selectedDate,
  setSelectedDate,
  slots,
  selectedSlot,
  setSelectedSlot,
  loadingSlots,
  onBack,
  onNext,
  canProceed,
}) {
  const days = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      const d = addDays(new Date(), i);
      arr.push({
        iso: format(d, 'yyyy-MM-dd'),
        day: format(d, 'EEE'),
        num: format(d, 'd'),
        month: format(d, 'MMM'),
      });
    }
    return arr;
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a date and time</CardTitle>
        <CardDescription>Available slots are based on our live calendar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {days.map((d) => (
            <button
              key={d.iso}
              onClick={() => {
                setSelectedDate(d.iso);
                setSelectedSlot(null);
              }}
              className={`flex-shrink-0 w-16 rounded-lg border py-2 text-center transition-colors ${
                selectedDate === d.iso
                  ? 'border-brand-600 bg-brand-700 text-white'
                  : 'border-border bg-white hover:bg-brand-50'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider">{d.day}</div>
              <div className="text-lg font-bold">{d.num}</div>
              <div className="text-[10px]">{d.month}</div>
            </button>
          ))}
        </div>

        <div>
          <div className="text-sm font-medium text-brand-900 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Available times
          </div>
          {loadingSlots ? (
            <p className="text-sm text-muted-foreground">Loading availability…</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No available slots on this day. Try another date.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {slots.map((s) => (
                <button
                  key={s.start}
                  onClick={() => setSelectedSlot(s)}
                  className={`rounded-md border py-2 text-sm ${
                    selectedSlot?.start === s.start
                      ? 'border-brand-600 bg-brand-700 text-white'
                      : 'border-border bg-white hover:bg-brand-50'
                  }`}
                >
                  {s.local_label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={onBack}>Back</Button>
          <Button disabled={!canProceed} onClick={onNext}>Continue</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StepDetails({
  profile,
  setProfile,
  appointmentNotes,
  setAppointmentNotes,
  preferredContactStart,
  setPreferredContactStart,
  preferredContactEnd,
  setPreferredContactEnd,
  publicSettings,
  onBack,
  onNext,
  canProceed,
}) {
  const set = (k, v) => setProfile((p) => ({ ...p, [k]: v }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your details</CardTitle>
        <CardDescription>So our team can prepare for your appointment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Full name *</Label>
            <Input value={profile.full_name} onChange={(e) => set('full_name', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Email *</Label>
            <Input type="email" value={profile.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone *</Label>
            <Input value={profile.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Preferred contact time *
          </Label>
          <p className="text-xs text-muted-foreground">
            Our assistant will reach out within this window to confirm your appointment.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">From</Label>
              <Input
                type="time"
                value={preferredContactStart}
                min={publicSettings?.working_hours_start || '09:00'}
                max={publicSettings?.working_hours_end || '17:00'}
                onChange={(e) => setPreferredContactStart(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">To</Label>
              <Input
                type="time"
                value={preferredContactEnd}
                min={publicSettings?.working_hours_start || '09:00'}
                max={publicSettings?.working_hours_end || '17:00'}
                onChange={(e) => setPreferredContactEnd(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Notes for this appointment (optional)</Label>
          <Textarea
            rows={4}
            value={appointmentNotes}
            onChange={(e) => setAppointmentNotes(e.target.value)}
            placeholder="Briefly describe your situation or what you'd like to discuss."
          />
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={onBack}>Back</Button>
          <Button disabled={!canProceed} onClick={onNext}>Continue</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StepReview({
  type,
  modality,
  slot,
  profile,
  appointmentNotes,
  preferredContactStart,
  preferredContactEnd,
  onBack,
  onConfirm,
  submitting,
}) {
  const date = new Date(slot.start);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review &amp; confirm</CardTitle>
        <CardDescription>Please check everything looks right.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-brand-50 border border-brand-100 p-4 space-y-2 text-sm">
          <div><span className="text-muted-foreground">Service:</span> <span className="font-medium">{type.name}</span></div>
          <div><span className="text-muted-foreground">Format:</span> <span className="font-medium">{modality === 'google_meet' ? 'Google Meet' : 'In-Person'}</span></div>
          <div><span className="text-muted-foreground">Date:</span> <span className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</span></div>
          <div><span className="text-muted-foreground">Time:</span> <span className="font-medium">{format(date, 'HH:mm')} ({type.duration_minutes} min)</span></div>
        </div>
        <div className="rounded-md bg-white border border-border p-4 space-y-2 text-sm">
          <div><span className="text-muted-foreground">Name:</span> {profile.full_name}</div>
          <div><span className="text-muted-foreground">Email:</span> {profile.email}</div>
          <div><span className="text-muted-foreground">Phone:</span> {profile.phone}</div>
          <div><span className="text-muted-foreground">Preferred contact:</span> {preferredContactStart} – {preferredContactEnd}</div>
          {appointmentNotes && (
            <div className="text-muted-foreground italic">&ldquo;{appointmentNotes}&rdquo;</div>
          )}
        </div>

        <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          Your request will be reviewed by our assistant, who will contact you during your preferred
          time window to confirm the appointment and walk through next steps.
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={onBack} disabled={submitting}>Back</Button>
          <Button onClick={onConfirm} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit request'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StepDone({ appointment, type, onHome, onBookAnother, onGoToDashboard }) {
  const isPending = appointment.status === 'pending_review';
  return (
    <Card>
      <CardContent className="py-12 text-center space-y-4">
        <CheckCircle2
          className={`h-14 w-14 mx-auto ${isPending ? 'text-amber-500' : 'text-emerald-500'}`}
        />
        <h2 className="display-serif text-3xl text-brand-900">
          {isPending ? 'Request submitted' : 'Appointment confirmed'}
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {isPending
            ? 'Our assistant will contact you during your preferred time window to confirm the appointment. Once approved, you will receive a case number.'
            : 'A confirmation has been saved. We look forward to seeing you.'}
        </p>
        <div className="rounded-md bg-brand-50 border border-brand-100 p-4 text-left text-sm inline-block">
          <div><span className="text-muted-foreground">Service:</span> {type.name}</div>
          <div>
            <span className="text-muted-foreground">When:</span>{' '}
            {format(new Date(appointment.start_at), 'EEE, MMM d yyyy HH:mm')}
          </div>
          <div>
            <span className="text-muted-foreground">Status:</span>{' '}
            <Badge variant={isPending ? 'warning' : 'success'}>
              {isPending ? 'Pending Review' : 'Scheduled'}
            </Badge>
          </div>
          {appointment.google_meet_link && (
            <div className="mt-2">
              <a
                href={appointment.google_meet_link}
                target="_blank"
                rel="noreferrer"
                className="text-brand-700 underline"
              >
                Join Google Meet
              </a>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={onGoToDashboard}>Go to dashboard</Button>
          <Button variant="outline" onClick={onBookAnother}>Book another</Button>
          <Button variant="ghost" onClick={onHome}>Back to home</Button>
        </div>
      </CardContent>
    </Card>
  );
}
