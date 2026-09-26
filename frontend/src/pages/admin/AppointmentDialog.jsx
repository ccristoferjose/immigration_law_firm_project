import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { api } from '../../lib/api';
import { format } from 'date-fns';

function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(str) {
  if (!str) return null;
  return new Date(str).toISOString();
}

export default function AppointmentDialog({ open, onOpenChange, editing, prefill, onSaved }) {
  const [clients, setClients] = useState([]);
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    client_id: '',
    appointment_type_id: '',
    start_at: '',
    end_at: '',
    modality: 'in_person',
    status: 'scheduled',
    notes: '',
    staff_notes: '',
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    Promise.all([
      api.get('/clients', { auth: 'admin' }),
      api.get('/appointment-types', { auth: 'admin' }),
    ]).then(([c, t]) => {
      setClients(c.clients);
      setTypes(t.types);
    });
  }, [open]);

  useEffect(() => {
    if (editing) {
      setForm({
        client_id: editing.client_id,
        appointment_type_id: editing.appointment_type_id,
        start_at: toLocalInput(editing.start_at),
        end_at: toLocalInput(editing.end_at),
        modality: editing.modality,
        status: editing.status,
        notes: editing.notes || '',
        staff_notes: editing.staff_notes || '',
      });
    } else {
      setForm({
        client_id: '',
        appointment_type_id: '',
        start_at: prefill?.start_at ? toLocalInput(prefill.start_at) : '',
        end_at: '',
        modality: 'in_person',
        status: 'scheduled',
        notes: '',
        staff_notes: '',
      });
    }
  }, [editing, prefill, open]);

  // Auto compute end when start or type changes
  useEffect(() => {
    if (!form.start_at || !form.appointment_type_id) return;
    const type = types.find((t) => t.id === Number(form.appointment_type_id));
    if (!type) return;
    if (!form.end_at) {
      const end = new Date(new Date(form.start_at).getTime() + type.duration_minutes * 60 * 1000);
      const pad = (n) => String(n).padStart(2, '0');
      const str = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}`;
      setForm((f) => ({ ...f, end_at: str }));
    }
  }, [form.start_at, form.appointment_type_id, types]);

  async function save() {
    setError(null);
    setSaving(true);
    try {
      const payload = {
        client_id: Number(form.client_id),
        appointment_type_id: Number(form.appointment_type_id),
        start_at: fromLocalInput(form.start_at),
        end_at: fromLocalInput(form.end_at),
        modality: form.modality,
        notes: form.notes || null,
        staff_notes: form.staff_notes || null,
      };
      if (editing) {
        payload.status = form.status;
        await api.put(`/appointments/${editing.id}`, payload, { auth: 'admin' });
      } else {
        await api.post('/appointments', payload, { auth: 'admin' });
      }
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!editing) return;
    if (!confirm('Delete this appointment?')) return;
    setSaving(true);
    try {
      await api.del(`/appointments/${editing.id}`, { auth: 'admin' });
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit appointment' : 'New appointment'}</DialogTitle>
          <DialogDescription>
            {editing ? `Created ${format(new Date(editing.created_at), 'PP')}` : 'Schedule a new appointment'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm border border-red-200 mb-3">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <Label>Client</Label>
            <Select value={form.client_id} onChange={(e) => set('client_id', e.target.value)}>
              <option value="">— Select client —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Service / Type</Label>
            <Select value={form.appointment_type_id} onChange={(e) => set('appointment_type_id', e.target.value)}>
              <option value="">— Select type —</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.duration_minutes} min)</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start</Label>
              <Input type="datetime-local" value={form.start_at} onChange={(e) => set('start_at', e.target.value)} />
            </div>
            <div>
              <Label>End</Label>
              <Input type="datetime-local" value={form.end_at} onChange={(e) => set('end_at', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Modality</Label>
              <Select value={form.modality} onChange={(e) => set('modality', e.target.value)}>
                <option value="in_person">In-Person</option>
                <option value="google_meet">Google Meet</option>
              </Select>
            </div>
            {editing && (
              <div>
                <Label>Status</Label>
                <Select value={form.status} onChange={(e) => set('status', e.target.value)}>
                  <option value="pending_review">Pending Review</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No-show</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </div>
            )}
          </div>
          {editing?.google_meet_link && (
            <div className="text-sm">
              <Label>Meet link</Label>
              <a className="text-brand-700 underline break-all block" href={editing.google_meet_link} target="_blank" rel="noreferrer">
                {editing.google_meet_link}
              </a>
            </div>
          )}
          <div>
            <Label>Client request / notes</Label>
            <Textarea
              rows={3}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Notes the client provided when booking (read-only context)"
            />
          </div>
          <div>
            <Label>Staff notes (visible to the client)</Label>
            <Textarea
              rows={4}
              value={form.staff_notes}
              onChange={(e) => set('staff_notes', e.target.value)}
              placeholder="Recap, action items, documents required, next steps…"
            />
            <p className="text-xs text-muted-foreground mt-1">
              These notes appear on the client&rsquo;s &ldquo;My Appointments&rdquo; page.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5">
          {editing ? (
            <Button variant="destructive" onClick={remove} disabled={saving}>Delete</Button>
          ) : <span />}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
