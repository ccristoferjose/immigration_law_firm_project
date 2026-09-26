import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { format } from 'date-fns';

const statusVariant = {
  pending_review: 'warning',
  scheduled: 'default',
  completed: 'success',
  cancelled: 'destructive',
  no_show: 'warning',
  rejected: 'destructive',
};

export default function AdminClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { admin } = useAuth();
  const canDelete = admin?.role === 'admin';
  const [client, setClient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    const data = await api.get(`/clients/${id}`, { auth: 'admin' });
    setClient(data.client);
    setAppointments(data.appointments);
    setForm({
      full_name: data.client.full_name,
      email: data.client.email,
      phone: data.client.phone,
      case_number: data.client.case_number || '',
      client_type: data.client.client_type || 'prospective',
      preferred_contact_time: data.client.preferred_contact_time || '',
      notes: data.client.notes || '',
    });
  }

  useEffect(() => {
    load();
  }, [id]);

  async function save() {
    setError(null);
    setSaving(true);
    try {
      await api.put(`/clients/${id}`, form, { auth: 'admin' });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete ${client.full_name}? Their appointments will be removed too.`)) return;
    try {
      await api.del(`/clients/${id}`, { auth: 'admin' });
      navigate('/admin/clients');
    } catch (e) {
      setError(e.message);
    }
  }

  if (!client || !form) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4">
      <Link
        to="/admin/clients"
        className="inline-flex items-center gap-1 text-brand-700 hover:underline text-sm"
      >
        <ChevronLeft className="h-4 w-4" /> Back to clients
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="display-serif text-3xl text-brand-900">{client.full_name}</h1>
        <div className="flex items-center gap-2">
          <VerificationBadge verified={!!client.email_verified} label="Email" />
          <VerificationBadge verified={!!client.phone_verified} label="Phone" />
          {canDelete && (
            <Button variant="destructive" size="sm" onClick={remove}>
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {error && (
              <div className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm border border-red-200">
                {error}
              </div>
            )}
            <div>
              <Label>Full name</Label>
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Case #</Label>
                <Input
                  value={form.case_number}
                  onChange={(e) => setForm({ ...form, case_number: e.target.value })}
                />
              </div>
              <div>
                <Label>Client type</Label>
                <Select
                  value={form.client_type}
                  onChange={(e) => setForm({ ...form, client_type: e.target.value })}
                >
                  <option value="prospective">Prospective</option>
                  <option value="existing">Existing</option>
                </Select>
              </div>
            </div>
            <div>
              <Label>Preferred contact time</Label>
              <Input
                value={form.preferred_contact_time}
                onChange={(e) => setForm({ ...form, preferred_contact_time: e.target.value })}
                placeholder="e.g. 10:00-17:00"
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {appointments.length === 0 && (
              <p className="text-sm text-muted-foreground">No appointments yet.</p>
            )}
            {appointments.map((a) => (
              <div key={a.id} className="rounded-md border border-border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-brand-900">
                    {format(new Date(a.start_at), 'EEE PP HH:mm')}
                  </div>
                  <Badge variant={statusVariant[a.status] || 'muted'}>{a.status}</Badge>
                </div>
                <div className="text-muted-foreground">
                  {a.type_name} · {a.modality === 'google_meet' ? 'Google Meet' : 'In-Person'}
                </div>
                {a.google_meet_link && (
                  <a
                    className="text-brand-700 text-xs underline break-all"
                    href={a.google_meet_link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {a.google_meet_link}
                  </a>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function VerificationBadge({ verified, label }) {
  return (
    <Badge variant={verified ? 'success' : 'muted'} className="gap-1">
      {verified ? (
        <ShieldCheck className="h-3.5 w-3.5" />
      ) : (
        <ShieldAlert className="h-3.5 w-3.5" />
      )}
      {label} {verified ? 'verified' : 'unverified'}
    </Badge>
  );
}
