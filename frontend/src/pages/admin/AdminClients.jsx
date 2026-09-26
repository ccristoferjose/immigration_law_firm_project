import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, Copy, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';

const emptyForm = {
  full_name: '',
  email: '',
  phone: '',
  case_number: '',
  client_type: 'prospective',
  notes: '',
};

export default function AdminClients() {
  const { admin } = useAuth();
  const canDelete = admin?.role === 'admin';
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  // When we create an existing client with credentials, we show a share-this
  // card with the reset link the assistant hands to the client.
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  async function load() {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    const { clients } = await api.get(`/clients${q}`, { auth: 'admin' });
    setClients(clients);
  }

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [search]);

  async function save() {
    setError(null);
    setSaving(true);
    try {
      // Existing clients with a case number get a Firebase auth account + reset
      // link so the assistant can hand them login credentials.
      const isExistingWithCase = form.client_type === 'existing' && form.case_number.trim();
      if (isExistingWithCase) {
        const res = await api.post('/clients/with-auth', form, { auth: 'admin' });
        setOpen(false);
        setCreatedCredentials({
          client: res.client,
          resetLink: res.reset_link,
          firebaseError: res.firebase_error,
        });
      } else {
        await api.post('/clients', form, { auth: 'admin' });
        setOpen(false);
      }
      setForm(emptyForm);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  function copyResetLink() {
    if (!createdCredentials?.resetLink) return;
    navigator.clipboard.writeText(createdCredentials.resetLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function remove(id, name) {
    if (!confirm(`Delete ${name}? Their appointments will be removed too.`)) return;
    try {
      await api.del(`/clients/${id}`, { auth: 'admin' });
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="display-serif text-3xl text-brand-900">Clients</h1>
          <p className="text-sm text-muted-foreground">{clients.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 w-72"
              placeholder="Search name, email, case#…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> New
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-brand-900 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Case #</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-brand-50/40">
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/clients/${c.id}`}
                      className="font-medium text-brand-800 hover:underline"
                    >
                      {c.full_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.case_number || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.client_type === 'existing' ? 'success' : 'default'}>
                      {c.client_type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex gap-1">
                      <Badge variant={c.email_verified ? 'success' : 'muted'}>
                        email {c.email_verified ? '✓' : '✗'}
                      </Badge>
                      <Badge variant={c.phone_verified ? 'success' : 'muted'}>
                        phone {c.phone_verified ? '✓' : '✗'}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={c.created_by === 'public' ? 'success' : 'muted'}>
                      {c.created_by}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(c.id, c.full_name)}
                        title="Delete client"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                    No clients yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New client</DialogTitle>
          </DialogHeader>
          {error && (
            <div className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm border border-red-200 mb-2">
              {error}
            </div>
          )}
          <div className="space-y-3">
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
              <Label>Notes</Label>
              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          {form.client_type === 'existing' && form.case_number.trim() && (
            <div className="rounded-md bg-brand-50 border border-brand-100 px-3 py-2 text-xs text-brand-800">
              A Firebase login account will be created for <strong>{form.email || 'this client'}</strong>
              . A password-reset link will be generated for you to share with them.
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!createdCredentials}
        onOpenChange={(o) => { if (!o) setCreatedCredentials(null); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login credentials — share with client</DialogTitle>
          </DialogHeader>
          {createdCredentials && (
            <div className="space-y-3">
              {createdCredentials.firebaseError ? (
                <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-900">
                  Client record saved, but Firebase couldn&rsquo;t create the login account:{' '}
                  <code>{createdCredentials.firebaseError}</code>. You can retry by editing the client.
                </div>
              ) : (
                <div className="rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-900">
                  Firebase login account created.
                </div>
              )}
              <div className="rounded-md border border-border p-3 space-y-2 text-sm">
                <Row label="Name" value={createdCredentials.client.full_name} />
                <Row label="Email" value={createdCredentials.client.email} />
                <Row
                  label="Case #"
                  value={<span className="font-mono">{createdCredentials.client.case_number}</span>}
                />
              </div>
              {createdCredentials.resetLink && (
                <div className="space-y-1.5">
                  <Label>Password-reset link</Label>
                  <div className="flex items-center gap-2">
                    <Input readOnly value={createdCredentials.resetLink} className="font-mono text-xs" />
                    <Button variant="outline" size="icon" onClick={copyResetLink}>
                      {copied ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Send this link to the client (email, SMS, or in person). They click it to set
                    their password, then sign in at <code>/login</code> with email + password. On
                    first sign-in they&rsquo;ll enter their case number once to link the account.
                  </p>
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={() => setCreatedCredentials(null)}>Done</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
