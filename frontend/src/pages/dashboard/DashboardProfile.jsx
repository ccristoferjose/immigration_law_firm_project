import { useEffect, useRef, useState } from 'react';
import { Lock, CheckCircle2, ShieldCheck, ShieldAlert, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { sendClientEmailVerification, setupRecaptcha } from '../../lib/firebase';
import { getAuth, updatePhoneNumber, PhoneAuthProvider } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

export default function DashboardProfile() {
  const { client, clientProfile, verification, refreshClient } = useAuth();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState(null);

  useEffect(() => {
    if (clientProfile) {
      setForm({
        full_name: clientProfile.full_name || '',
        email: clientProfile.email || '',
        phone: clientProfile.phone || '',
      });
    }
  }, [clientProfile]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put('/clients/self/profile', form, { auth: 'client' });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await refreshClient();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function sendVerifyEmail() {
    setEmailMessage(null);
    try {
      await sendClientEmailVerification();
      setEmailMessage(`Verification link sent to ${client?.email}.`);
    } catch (err) {
      setEmailMessage(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-serif text-3xl text-brand-900">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your contact information and verification status.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 text-red-800 px-4 py-3 text-sm border border-red-200">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Verification</CardTitle>
          <CardDescription>
            At least one verification method is required before you can submit appointment requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <VerifyRow
            icon={Mail}
            label="Email"
            value={client?.email}
            verified={!!verification?.emailVerified}
            action={
              !verification?.emailVerified && (
                <Button size="sm" variant="outline" onClick={sendVerifyEmail}>
                  Send verification link
                </Button>
              )
            }
            message={emailMessage}
          />
          <VerifyRow
            icon={Phone}
            label="Phone"
            value={client?.phoneNumber || clientProfile?.phone || '—'}
            verified={!!verification?.phoneVerified}
            action={
              !verification?.phoneVerified && (
                <Button size="sm" variant="outline" onClick={() => setPhoneDialogOpen(true)}>
                  Verify phone
                </Button>
              )
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>
            Changing your email or phone will reset the matching verification until you confirm again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input value={form.full_name} onChange={(e) => set('full_name', e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
              </div>
            </div>

            {clientProfile?.case_number && (
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5" /> Case number
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={clientProfile.case_number}
                    disabled
                    className="bg-muted font-mono"
                  />
                  <Badge variant="muted">Read-only</Badge>
                </div>
              </div>
            )}

            {clientProfile?.client_type && (
              <div className="space-y-1.5">
                <Label>Account type</Label>
                <div>
                  <Badge variant={clientProfile.client_type === 'existing' ? 'success' : 'default'}>
                    {clientProfile.client_type === 'existing' ? 'Existing client' : 'Prospective client'}
                  </Badge>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
              {saved && (
                <span className="text-sm text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Saved
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <PhoneVerifyDialog
        open={phoneDialogOpen}
        onClose={() => setPhoneDialogOpen(false)}
        onVerified={async () => {
          setPhoneDialogOpen(false);
          await refreshClient();
        }}
      />
    </div>
  );
}

function VerifyRow({ icon: Icon, label, value, verified, action, message }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-border rounded-md p-3 flex-wrap">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-brand-700" />
        <div>
          <div className="text-sm font-medium text-brand-900">{label}</div>
          <div className="text-xs text-muted-foreground">{value || '—'}</div>
          {message && (
            <div className="text-xs text-emerald-700 mt-1">{message}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {verified ? (
          <Badge variant="success" className="gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified
          </Badge>
        ) : (
          <Badge variant="warning" className="gap-1">
            <ShieldAlert className="h-3.5 w-3.5" /> Unverified
          </Badge>
        )}
        {action}
      </div>
    </div>
  );
}

function PhoneVerifyDialog({ open, onClose, onVerified }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const recaptchaRef = useRef(null);

  async function send(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = setupRecaptcha('profile-recaptcha');
      }
      const auth = getAuth();
      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber(phone, recaptchaRef.current);
      setVerificationId(id);
    } catch (err) {
      setError(err.message);
      recaptchaRef.current = null;
    } finally {
      setLoading(false);
    }
  }

  async function verify(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      const cred = PhoneAuthProvider.credential(verificationId, otp);
      await updatePhoneNumber(auth.currentUser, cred);
      onVerified();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify phone number</DialogTitle>
        </DialogHeader>
        <div id="profile-recaptcha" />
        {error && (
          <div className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm border border-red-200">
            {error}
          </div>
        )}
        {!verificationId ? (
          <form onSubmit={send} className="space-y-3">
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
          <form onSubmit={verify} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Verification code</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Verifying…' : 'Confirm'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
