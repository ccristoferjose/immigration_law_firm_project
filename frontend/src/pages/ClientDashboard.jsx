import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  CalendarPlus,
  User,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { sendClientEmailVerification } from '../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const STATUS_LABEL = {
  pending_review: 'Pending Review',
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No-show',
  rejected: 'Rejected',
};
const STATUS_VARIANT = {
  pending_review: 'warning',
  scheduled: 'default',
  completed: 'success',
  cancelled: 'destructive',
  no_show: 'warning',
  rejected: 'destructive',
};

export default function ClientDashboard() {
  const { client, verification } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const payload = await api.dashboard();
      setData(payload);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading your dashboard…</p>;
  if (error) {
    return (
      <div className="rounded-md bg-red-50 text-red-800 px-4 py-3 text-sm border border-red-200">
        {error}
      </div>
    );
  }

  const profile = data?.client;
  const upcoming = data?.upcoming || [];
  const next = upcoming[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-serif text-3xl text-brand-900">
          {profile?.full_name
            ? `Hello, ${profile.full_name.split(' ')[0]}`
            : 'Welcome'}
        </h1>
        <p className="text-sm text-muted-foreground">
          This is your personal dashboard. From here you can track appointments, update your profile,
          and request new consultations.
        </p>
      </div>

      <VerificationBanner verification={verification} clientEmail={client?.email} onRefresh={load} />

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Name" value={profile?.full_name || '—'} />
            <Row label="Email" value={profile?.email || client?.email || '—'} />
            <Row label="Phone" value={profile?.phone || '—'} />
            <Row
              label="Case #"
              value={
                profile?.case_number ? (
                  <span className="font-mono text-brand-700">{profile.case_number}</span>
                ) : (
                  <span className="text-muted-foreground">Assigned after approval</span>
                )
              }
            />
            <Row
              label="Account type"
              value={
                <Badge variant={profile?.client_type === 'existing' ? 'success' : 'default'}>
                  {profile?.client_type === 'existing' ? 'Existing client' : 'Prospective client'}
                </Badge>
              }
            />
            <div className="pt-3">
              <Link to="/dashboard/profile">
                <Button variant="outline" size="sm">Edit profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Next appointment
            </CardTitle>
            <CardDescription>
              {next ? STATUS_LABEL[next.status] : 'Nothing on the books'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {next ? (
              <>
                <div className="font-medium text-brand-900">{next.type_name}</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(next.start_at), 'EEE, MMM d yyyy')}
                  <Clock className="h-3.5 w-3.5 ml-2" />
                  {format(new Date(next.start_at), 'HH:mm')}
                </div>
                <Badge variant={STATUS_VARIANT[next.status] || 'muted'}>
                  {STATUS_LABEL[next.status] || next.status}
                </Badge>
                {next.google_meet_link && next.status === 'scheduled' && (
                  <a
                    href={next.google_meet_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-brand-700 text-white px-3 py-1.5 text-sm hover:bg-brand-800 mt-2"
                  >
                    Join Google Meet
                  </a>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">
                You don&rsquo;t have any upcoming appointments.
              </p>
            )}
            <div className="pt-3 flex gap-2 flex-wrap">
              <Link to="/dashboard/appointments">
                <Button variant="outline" size="sm">View all</Button>
              </Link>
              <Link to="/book">
                <Button size="sm">
                  <CalendarPlus className="h-4 w-4" /> Book new
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function VerificationBanner({ verification, clientEmail, onRefresh }) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);

  if (!verification) return null;
  const { emailVerified, phoneVerified, atLeastOne } = verification;

  // Both verified — nothing to show.
  if (emailVerified && phoneVerified) return null;

  async function resendEmail() {
    setSending(true);
    setMessage(null);
    try {
      await sendClientEmailVerification();
      setMessage(`Verification email sent to ${clientEmail}. Check your inbox.`);
      if (onRefresh) await onRefresh();
    } catch (err) {
      setMessage(err.message || 'Could not send verification email.');
    } finally {
      setSending(false);
    }
  }

  const severity = atLeastOne ? 'warn' : 'alert';
  const styles =
    severity === 'alert'
      ? 'bg-red-50 border-red-200 text-red-900'
      : 'bg-amber-50 border-amber-200 text-amber-900';

  return (
    <div className={`rounded-md border p-4 ${styles}`}>
      <div className="flex items-start gap-3">
        {severity === 'alert' ? (
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        ) : (
          <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
        )}
        <div className="flex-1 space-y-2">
          <p className="font-medium">
            {severity === 'alert'
              ? 'Verify your identity to continue booking'
              : 'Strengthen your account by verifying both contact methods'}
          </p>
          <p className="text-sm">
            {severity === 'alert'
              ? 'You need to verify your email or phone before you can submit new appointment requests.'
              : `Your ${emailVerified ? 'email' : 'phone'} is verified. Adding the other gives our team a reliable backup channel.`}
          </p>
          {message && (
            <p className="text-sm bg-white/70 border border-current/20 rounded px-2 py-1">
              {message}
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            {!emailVerified && (
              <Button
                size="sm"
                variant="outline"
                onClick={resendEmail}
                disabled={sending || !clientEmail}
              >
                <Mail className="h-4 w-4" />
                {sending ? 'Sending…' : 'Verify email'}
              </Button>
            )}
            {!phoneVerified && (
              <Link to="/dashboard/profile">
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4" /> Verify phone
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
