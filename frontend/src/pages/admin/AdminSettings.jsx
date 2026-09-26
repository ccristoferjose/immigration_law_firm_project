import { useEffect, useState } from 'react';
import { Plus, Trash2, CheckCircle2, Copy, RefreshCw, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { api } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { format } from 'date-fns';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const [google, setGoogle] = useState(null);
  const [googleGuideOpen, setGoogleGuideOpen] = useState(false);

  const [blocked, setBlocked] = useState([]);
  const [blkOpen, setBlkOpen] = useState(false);
  const [blkEditingId, setBlkEditingId] = useState(null);
  const [blkForm, setBlkForm] = useState({ title: '', start_at: '', end_at: '', reason: '' });

  const [staffPath, setStaffPath] = useState('');
  const [pathCopied, setPathCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  async function load() {
    const [s, g, b, sp] = await Promise.all([
      api.get('/settings', { auth: 'admin' }),
      api.get('/google/status', { auth: 'admin' }),
      api.get('/blocked-times', { auth: 'admin' }),
      api.get('/settings/staff-login-path', { auth: 'admin' }),
    ]);
    setSettings(s.settings);
    setGoogle(g);
    setBlocked(b.blocked);
    setStaffPath(sp.path);
  }
  useEffect(() => { load(); }, []);

  function set(k, v) {
    setSettings((s) => ({ ...s, [k]: v }));
  }
  function toggleDay(d) {
    const cur = (settings.working_days || '').split(',').map((x) => x.trim()).filter(Boolean);
    const idx = cur.indexOf(String(d));
    if (idx === -1) cur.push(String(d));
    else cur.splice(idx, 1);
    cur.sort();
    set('working_days', cur.join(','));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await api.put('/settings', settings, { auth: 'admin' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function connectGoogle() {
    try {
      const { url } = await api.get('/google/oauth/start', { auth: 'admin' });
      window.location.href = url;
    } catch (e) {
      setError(e.message);
    }
  }

  function openBlkNew() {
    setBlkEditingId(null);
    setBlkForm({ title: '', start_at: '', end_at: '', reason: '' });
    setBlkOpen(true);
  }

  function openBlkEdit(b) {
    setBlkEditingId(b.id);
    setBlkForm({
      title: b.title || '',
      // datetime-local expects YYYY-MM-DDTHH:mm — trim timezone/seconds.
      start_at: format(new Date(b.start_at), "yyyy-MM-dd'T'HH:mm"),
      end_at: format(new Date(b.end_at), "yyyy-MM-dd'T'HH:mm"),
      reason: b.reason || '',
    });
    setBlkOpen(true);
  }

  async function saveBlocked() {
    try {
      const payload = {
        title: blkForm.title,
        start_at: new Date(blkForm.start_at).toISOString(),
        end_at: new Date(blkForm.end_at).toISOString(),
        reason: blkForm.reason || null,
      };
      if (blkEditingId) {
        await api.put(`/blocked-times/${blkEditingId}`, payload, { auth: 'admin' });
      } else {
        await api.post('/blocked-times', payload, { auth: 'admin' });
      }
      setBlkOpen(false);
      setBlkEditingId(null);
      setBlkForm({ title: '', start_at: '', end_at: '', reason: '' });
      await load();
    } catch (e) {
      setError(e.message);
    }
  }
  async function deleteBlocked(id) {
    if (!confirm('Delete this blocked period?')) return;
    await api.del(`/blocked-times/${id}`, { auth: 'admin' });
    await load();
  }

  function copyStaffUrl() {
    const url = `${window.location.origin}/staff-portal/${staffPath}`;
    navigator.clipboard.writeText(url).then(() => {
      setPathCopied(true);
      setTimeout(() => setPathCopied(false), 2000);
    });
  }

  async function regeneratePath() {
    setRegenerating(true);
    try {
      const { path } = await api.post('/settings/regenerate-staff-path', {}, { auth: 'admin' });
      setStaffPath(path);
    } catch (e) {
      setError(e.message);
    } finally {
      setRegenerating(false);
    }
  }

  if (!settings) return <p className="text-muted-foreground">Loading...</p>;

  const workingDays = (settings.working_days || '').split(',').map((d) => parseInt(d, 10));

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="display-serif text-3xl text-brand-900">Settings</h1>
        <p className="text-sm text-muted-foreground">Business configuration and integrations.</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm border border-red-200">{error}</div>
      )}

      {/* Staff Login Path */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Login Access</CardTitle>
          <CardDescription>
            Share this private URL with staff members. It is not linked from the public site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={`${window.location.origin}/staff-portal/${staffPath}`}
              className="font-mono text-sm bg-muted"
            />
            <Button variant="outline" size="sm" onClick={copyStaffUrl}>
              {pathCopied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={regeneratePath} disabled={regenerating}>
              <RefreshCw className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`} />
              {regenerating ? 'Regenerating...' : 'Regenerate path'}
            </Button>
            <p className="text-xs text-muted-foreground">
              This will invalidate the current URL. Existing bookmarks will stop working.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business profile</CardTitle>
          <CardDescription>Shown on the public landing page</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div><Label>Business name</Label><Input value={settings.business_name || ''} onChange={(e) => set('business_name', e.target.value)} /></div>
          <div><Label>Tagline</Label><Input value={settings.business_tagline || ''} onChange={(e) => set('business_tagline', e.target.value)} /></div>
          <div>
            <Label>Timezone</Label>
            <Input value={settings.timezone || ''} onChange={(e) => set('timezone', e.target.value)} placeholder="e.g. America/New_York" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Working hours</CardTitle>
          <CardDescription>Availability is computed from these values</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Working days</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {DAY_LABELS.map((d, i) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`px-3 py-1.5 rounded-md border text-sm ${
                    workingDays.includes(i) ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-brand-800 border-border'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>Start time</Label>
              <Input type="time" value={settings.working_hours_start || ''} onChange={(e) => set('working_hours_start', e.target.value)} />
            </div>
            <div>
              <Label>End time</Label>
              <Input type="time" value={settings.working_hours_end || ''} onChange={(e) => set('working_hours_end', e.target.value)} />
            </div>
            <div>
              <Label>Slot duration</Label>
              <Select value={settings.slot_duration_minutes || '60'} onChange={(e) => set('slot_duration_minutes', e.target.value)}>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
              </Select>
            </div>
            <div>
              <Label>Buffer (min)</Label>
              <Input type="number" min={0} value={settings.buffer_minutes || '0'} onChange={(e) => set('buffer_minutes', e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Booking window (days ahead)</Label>
            <Input type="number" min={1} max={365} value={settings.booking_window_days || '30'} onChange={(e) => set('booking_window_days', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save settings'}</Button>
        {saved && <span className="text-sm text-emerald-700 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Saved</span>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Google Calendar / Meet</CardTitle>
          <CardDescription>Connect a Google account to auto-create Meet links on virtual appointments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!google?.configured ? (
            <p className="text-sm text-muted-foreground">
              Google OAuth not configured on the server. Set <code>GOOGLE_CLIENT_ID</code>, <code>GOOGLE_CLIENT_SECRET</code>, and <code>GOOGLE_REDIRECT_URI</code>.
            </p>
          ) : google.connected ? (
            <div className="flex items-center justify-between">
              <Badge variant="success">Connected</Badge>
              <Button variant="outline" onClick={connectGoogle}>Reconnect</Button>
            </div>
          ) : (
            <Button onClick={connectGoogle}>Connect Google Account</Button>
          )}

          <button
            onClick={() => setGoogleGuideOpen(!googleGuideOpen)}
            className="flex items-center gap-1 text-sm text-brand-700 hover:underline"
          >
            {googleGuideOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Setup Guide
          </button>

          {googleGuideOpen && (
            <div className="rounded-md bg-brand-50 border border-brand-100 p-4 text-sm space-y-2">
              <p className="font-medium text-brand-900">How to configure Google Calendar integration:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-brand-800">
                <li>Go to <strong>Google Cloud Console</strong> and create or select a project.</li>
                <li>Navigate to <strong>APIs & Services &gt; Library</strong> and enable the <strong>Google Calendar API</strong>.</li>
                <li>Go to <strong>APIs & Services &gt; Credentials</strong> and create an <strong>OAuth 2.0 Client ID</strong> (type: Web Application).</li>
                <li>
                  Under <strong>Authorized redirect URIs</strong>, add:<br />
                  <code className="bg-white px-2 py-0.5 rounded text-xs">
                    {window.location.origin.replace(':5173', ':4000')}/api/google/oauth/callback
                  </code>
                </li>
                <li>Copy the <strong>Client ID</strong> and <strong>Client Secret</strong> into your <code>.env</code> file as <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code>.</li>
                <li>Set <code>GOOGLE_REDIRECT_URI</code> in <code>.env</code> to match the redirect URI exactly (e.g., <code>http://localhost:4000/api/google/oauth/callback</code>).</li>
                <li>Go to <strong>APIs & Services &gt; OAuth consent screen</strong>. Configure as <strong>Internal</strong> (Google Workspace) or <strong>External</strong> (add test users during development).</li>
                <li>Restart the backend server, then click <strong>"Connect Google Account"</strong> above.</li>
              </ol>
              <p className="text-xs text-muted-foreground mt-2">
                For external user type: you may need to add your admin email as a test user until the app is verified by Google.
                The first admin to complete the OAuth flow becomes the Meet host for public bookings.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blocked times</CardTitle>
          <CardDescription>Holidays, breaks, or days off. These hide matching slots from the booking flow.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-3">
            <Button onClick={openBlkNew}><Plus className="h-4 w-4" /> Block time</Button>
          </div>
          <div className="space-y-2">
            {blocked.length === 0 && <p className="text-sm text-muted-foreground">No blocked periods.</p>}
            {blocked.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
                <div>
                  <div className="font-medium text-brand-900">{b.title}</div>
                  <div className="text-muted-foreground">
                    {format(new Date(b.start_at), 'PP HH:mm')} &rarr; {format(new Date(b.end_at), 'PP HH:mm')}
                  </div>
                  {b.reason && <div className="text-xs text-muted-foreground italic">{b.reason}</div>}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openBlkEdit(b)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteBlocked(b.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={blkOpen} onOpenChange={(o) => { setBlkOpen(o); if (!o) setBlkEditingId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{blkEditingId ? 'Edit blocked time' : 'Block time'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={blkForm.title} onChange={(e) => setBlkForm({ ...blkForm, title: e.target.value })} placeholder="Holiday, Lunch, OOO..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Start</Label><Input type="datetime-local" value={blkForm.start_at} onChange={(e) => setBlkForm({ ...blkForm, start_at: e.target.value })} /></div>
              <div><Label>End</Label><Input type="datetime-local" value={blkForm.end_at} onChange={(e) => setBlkForm({ ...blkForm, end_at: e.target.value })} /></div>
            </div>
            <div><Label>Reason (optional)</Label><Input value={blkForm.reason} onChange={(e) => setBlkForm({ ...blkForm, reason: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setBlkOpen(false)}>Cancel</Button>
            <Button onClick={saveBlocked}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
