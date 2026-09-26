import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

export default function AdminAppointmentTypes() {
  const [types, setTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', duration_minutes: 60, is_active: true, case_prefix: 'GEN' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    const { types } = await api.get('/appointment-types', { auth: 'admin' });
    setTypes(types);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm({ name: '', description: '', duration_minutes: 60, is_active: true, case_prefix: 'GEN' });
    setOpen(true);
  }
  function openEdit(t) {
    setEditing(t);
    setForm({
      name: t.name,
      description: t.description || '',
      duration_minutes: t.duration_minutes,
      is_active: !!t.is_active,
      case_prefix: t.case_prefix || 'GEN',
    });
    setOpen(true);
  }
  async function save() {
    setError(null);
    setSaving(true);
    try {
      const payload = { ...form, duration_minutes: Number(form.duration_minutes) };
      if (editing) await api.put(`/appointment-types/${editing.id}`, payload, { auth: 'admin' });
      else await api.post('/appointment-types', payload, { auth: 'admin' });
      setOpen(false);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }
  async function remove(t) {
    if (!confirm(`Delete "${t.name}"?`)) return;
    await api.del(`/appointment-types/${t.id}`, { auth: 'admin' });
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-serif text-3xl text-brand-900">Services</h1>
          <p className="text-sm text-muted-foreground">Appointment types visible to clients</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> New</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-brand-900 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Case Prefix</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <button className="font-medium text-brand-800 hover:underline" onClick={() => openEdit(t)}>{t.name}</button>
                    {t.description && <div className="text-muted-foreground text-xs">{t.description}</div>}
                  </td>
                  <td className="px-4 py-3">{t.duration_minutes} min</td>
                  <td className="px-4 py-3"><code className="text-xs font-mono bg-brand-50 px-1.5 py-0.5 rounded">{t.case_prefix || 'GEN'}</code></td>
                  <td className="px-4 py-3">
                    <Badge variant={t.is_active ? 'success' : 'muted'}>{t.is_active ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="icon" variant="ghost" onClick={() => remove(t)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit service' : 'New service'}</DialogTitle></DialogHeader>
          {error && (
            <div className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm border border-red-200 mb-2">{error}</div>
          )}
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Duration (minutes)</Label><Input type="number" min={5} max={480} value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} /></div>
              <div><Label>Case Prefix</Label><Input value={form.case_prefix} onChange={(e) => setForm({ ...form, case_prefix: e.target.value.toUpperCase().slice(0, 8) })} placeholder="e.g. CON, DOC, WRK" maxLength={8} /></div>
            </div>
            <label className="flex items-center gap-2 text-sm text-brand-800">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              Active (visible in booking flow)
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
