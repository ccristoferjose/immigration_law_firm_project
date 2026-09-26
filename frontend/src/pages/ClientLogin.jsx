import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, KeyRound } from 'lucide-react';
import { api } from '../lib/api';
import {
  clientLogin,
  firebaseConfigured,
  setupRecaptcha,
  sendPhoneVerification,
  confirmPhoneCode,
  sendPasswordResetEmail,
} from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function ClientLogin() {
  const { client, clientProfile, loading, refreshClient } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/dashboard';
  const [tab, setTab] = useState('email');

  // Three states once Firebase auth succeeds:
  //  - loading: waiting for AuthContext to resolve clientProfile
  //  - linked: clientProfile present → dashboard
  //  - unlinked: client but no profile → show case_number linking step
  const needsLinking = !loading && client && clientProfile === null;
  const linked = !loading && client && clientProfile;

  useEffect(() => {
    if (linked) navigate(redirectTo, { replace: true });
  }, [linked, navigate, redirectTo]);

  if (!firebaseConfigured()) {
    return <FirebaseNotConfigured />;
  }

  return (
    <div className="min-h-screen bg-brand-50/50">
      <header className="bg-white border-b border-border">
        <div className="container mx-auto h-16 px-4 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-brand-800 hover:text-brand-600">
            <ChevronLeft className="h-5 w-5" /> Back to site
          </Link>
        </div>
      </header>
      <div className="container mx-auto max-w-md px-4 py-10">
        {needsLinking ? (
          <LinkCaseNumberStep onLinked={refreshClient} />
        ) : (
          <>
            <h1 className="display-serif text-3xl text-brand-900 mb-2">Welcome back</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Sign in to manage your appointments. New here?{' '}
              <Link to="/book" className="text-brand-700 hover:underline">
                Request a consultation
              </Link>
              .
            </p>

            <div className="flex gap-2 mb-6 border-b border-border">
              <TabButton active={tab === 'email'} onClick={() => setTab('email')}>
                <Mail className="h-4 w-4" /> Email
              </TabButton>
              <TabButton active={tab === 'phone'} onClick={() => setTab('phone')}>
                <Phone className="h-4 w-4" /> Phone
              </TabButton>
            </div>

            {tab === 'email' ? <EmailLoginForm /> : <PhoneLoginForm />}
          </>
        )}
      </div>
    </div>
  );
}

function LinkCaseNumberStep({ onLinked }) {
  const { client, clientSignOut } = useAuth();
  const [caseNumber, setCaseNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/clients/self/link', { case_number: caseNumber.trim() }, { auth: 'client' });
      await onLinked();
      // On success, AuthContext picks up the new profile and the outer effect
      // above navigates to /dashboard on the next render.
    } catch (err) {
      setError(err.message || 'Could not link your case number.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-brand-700" /> Link your case
        </CardTitle>
        <CardDescription>
          You&rsquo;re signed in as <strong>{client?.email || client?.phoneNumber}</strong>.
          Enter the case number your assistant provided to finish setting up your account. This is a
          one-time step.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm border border-red-200 mb-3">
            {error}
          </div>
        )}
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Case number</Label>
            <Input
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              placeholder="e.g. CON-00000001"
              className="font-mono"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Verifying…' : 'Link account'}
          </Button>
        </form>
        <button
          type="button"
          onClick={clientSignOut}
          className="text-sm text-muted-foreground hover:text-brand-700 mt-4 mx-auto block"
        >
          Sign out and use a different account
        </button>
      </CardContent>
    </Card>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
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

function EmailLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetMessage, setResetMessage] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResetMessage(null);
    try {
      await clientLogin(email, password);
      // AuthContext picks up the Firebase user and the effect above redirects.
    } catch (err) {
      setError(humanizeFirebaseError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    setError(null);
    setResetMessage(null);
    if (!email) {
      setError('Enter your email above, then click "Forgot password".');
      return;
    }
    try {
      await sendPasswordResetEmail(email);
      setResetMessage(`If an account exists for ${email}, a reset link is on its way.`);
    } catch (err) {
      setError(humanizeFirebaseError(err));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in with email</CardTitle>
        <CardDescription>Use the email you registered with.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm border border-red-200 mb-3">
            {error}
          </div>
        )}
        {resetMessage && (
          <div className="rounded-md bg-emerald-50 text-emerald-800 px-3 py-2 text-sm border border-emerald-200 mb-3">
            {resetMessage}
          </div>
        )}
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
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-brand-700 hover:underline block mx-auto"
          >
            Forgot password?
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

function PhoneLoginForm() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const confirmationRef = useRef(null);
  const recaptchaRef = useRef(null);

  async function sendOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = setupRecaptcha('login-recaptcha');
      }
      confirmationRef.current = await sendPhoneVerification(phone, recaptchaRef.current);
      setOtpSent(true);
    } catch (err) {
      setError(humanizeFirebaseError(err));
      recaptchaRef.current = null;
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await confirmPhoneCode(confirmationRef.current, otp);
    } catch (err) {
      setError('Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in with phone</CardTitle>
        <CardDescription>
          {otpSent
            ? 'Enter the 6-digit code we sent you.'
            : 'We will send you a one-time code via SMS.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div id="login-recaptcha" />
        {error && (
          <div className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm border border-red-200 mb-3">
            {error}
          </div>
        )}
        {!otpSent ? (
          <form onSubmit={sendOtp} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Phone number</Label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
              />
              <p className="text-xs text-muted-foreground">Include country code.</p>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending…' : 'Send code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-3">
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
              {loading ? 'Verifying…' : 'Verify & sign in'}
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
              Use a different number
            </button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function FirebaseNotConfigured() {
  return (
    <div className="min-h-screen bg-brand-50/50 flex items-center justify-center p-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Sign-in unavailable</CardTitle>
          <CardDescription>Firebase Authentication is not configured.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Set the <code>VITE_FIREBASE_*</code> environment variables in the frontend build
            and reload this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function humanizeFirebaseError(err) {
  const code = err?.code || '';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
    return 'Email or password is incorrect.';
  }
  if (code.includes('too-many-requests')) {
    return 'Too many attempts. Please wait a minute and try again.';
  }
  if (code.includes('invalid-phone-number')) {
    return 'That phone number looks invalid. Include the country code.';
  }
  return err.message || 'Something went wrong.';
}
