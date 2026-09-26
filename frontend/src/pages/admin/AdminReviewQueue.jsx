import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ClipboardCheck, CheckCircle2, XCircle, Phone, Mail, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';
import { api } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

export default function AdminReviewQueue() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const { appointments: rows } = await api.get('/appointments/pending-review', { auth: 'admin' });
      setAppointments(rows);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openReview(appt) {
    setReviewing(appt);
    setReviewNotes('');
    setResult(null);
    setError(null);
  }

  async function submitReview(action) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.post(
        `/appointments/${reviewing.id}/review`,
        { action, review_notes: reviewNotes || null },
        { auth: 'admin' }
      );
      setResult({
        action,
        appointment: res.appointment,
        case_number: res.case_number,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  function closeDialog() {
    setReviewing(null);
    setResult(null);
    setReviewNotes('');
    if (result) load();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="display-serif text-3xl text-brand-900">Review Queue</h1>
        <p className="text-sm text-muted-foreground">
          Pending appointment requests from prospective clients.
        </p>
      </div>

      {error && !reviewing && (
        <div className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm border border-red-200">{error}</div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardCheck className="h-12 w-12 text-brand-300 mx-auto mb-3" />
            <p className="text-muted-foreground">No pending requests. All caught up.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => (
            <Card key={a.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-brand-900">{a.client_name}</span>
                      <Badge variant="warning">Pending Review</Badge>
                      <VerifyBadge verified={!!a.client_email_verified} icon={Mail} label="Email" />
                      <VerifyBadge verified={!!a.client_phone_verified} icon={Phone} label="Phone" />
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {a.client_phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> {a.client_email}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{a.type_name} ({a.type_duration} min)</span>
                      <span>{format(new Date(a.start_at), 'EEE, MMM d yyyy HH:mm')}</span>
                      <span className="capitalize">{a.modality === 'google_meet' ? 'Google Meet' : 'In-Person'}</span>
                    </div>
                    {(a.preferred_contact_time || a.client_preferred_contact_time) && (
                      <div className="flex items-center gap-1 text-sm text-brand-700">
                        <Clock className="h-3.5 w-3.5" />
                        Preferred contact: {a.preferred_contact_time || a.client_preferred_contact_time}
                      </div>
                    )}
                    {a.notes && (
                      <p className="text-sm text-muted-foreground italic mt-1">
                        &ldquo;{a.notes}&rdquo;
                      </p>
                    )}
                  </div>
                  <Button onClick={() => openReview(a)} className="shrink-0">
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Verification badge helper is defined below, see VerifyBadge. */}
      <Dialog open={!!reviewing} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {result ? (result.action === 'approve' ? 'Approved' : 'Rejected') : 'Review Appointment Request'}
            </DialogTitle>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm border border-red-200">
              {error}
            </div>
          )}

          {result ? (
            <div className="space-y-4">
              {result.action === 'approve' ? (
                <div className="rounded-md bg-emerald-50 border border-emerald-200 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-medium">
                    <CheckCircle2 className="h-5 w-5" /> Appointment approved
                  </div>
                  {result.case_number && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Case number assigned:</span>{' '}
                      <span className="font-mono font-semibold text-brand-900">{result.case_number}</span>
                    </div>
                  )}
                  {result.appointment?.google_meet_link && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Meet link:</span>{' '}
                      <a href={result.appointment.google_meet_link} target="_blank" rel="noreferrer" className="text-brand-700 underline">
                        {result.appointment.google_meet_link}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-md bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center gap-2 text-red-800 font-medium">
                    <XCircle className="h-5 w-5" /> Appointment rejected
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={closeDialog}>Close</Button>
              </div>
            </div>
          ) : reviewing && (
            <div className="space-y-4">
              <div className="rounded-md bg-brand-50 border border-brand-100 p-4 space-y-2 text-sm">
                <div><span className="text-muted-foreground">Client:</span> {reviewing.client_name}</div>
                <div><span className="text-muted-foreground">Phone:</span> {reviewing.client_phone}</div>
                <div><span className="text-muted-foreground">Email:</span> {reviewing.client_email}</div>
                <div><span className="text-muted-foreground">Service:</span> {reviewing.type_name} ({reviewing.type_duration} min)</div>
                <div><span className="text-muted-foreground">Requested:</span> {format(new Date(reviewing.start_at), 'EEE, MMM d yyyy HH:mm')}</div>
                <div><span className="text-muted-foreground">Format:</span> {reviewing.modality === 'google_meet' ? 'Google Meet' : 'In-Person'}</div>
                {(reviewing.preferred_contact_time || reviewing.client_preferred_contact_time) && (
                  <div><span className="text-muted-foreground">Preferred contact:</span> {reviewing.preferred_contact_time || reviewing.client_preferred_contact_time}</div>
                )}
                {reviewing.notes && (
                  <div className="italic text-muted-foreground">&ldquo;{reviewing.notes}&rdquo;</div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Review notes (internal, not shown to client)</Label>
                <Textarea
                  rows={4}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Screening outcome, case viability assessment..."
                />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="destructive"
                  onClick={() => submitReview('reject')}
                  disabled={submitting}
                >
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
                <Button
                  onClick={() => submitReview('approve')}
                  disabled={submitting}
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VerifyBadge({ verified, icon: Icon, label }) {
  return (
    <Badge variant={verified ? 'success' : 'muted'} className="gap-1 text-xs">
      {verified ? (
        <ShieldCheck className="h-3 w-3" />
      ) : (
        <ShieldAlert className="h-3 w-3" />
      )}
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
