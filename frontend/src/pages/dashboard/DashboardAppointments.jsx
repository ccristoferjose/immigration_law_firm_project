import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  StickyNote,
  CalendarPlus,
} from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const STATUS_VARIANT = {
  pending_review: 'warning',
  scheduled: 'default',
  completed: 'success',
  cancelled: 'destructive',
  no_show: 'warning',
  rejected: 'destructive',
};
const STATUS_LABEL = {
  pending_review: 'Pending Review',
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No-show',
  rejected: 'Rejected',
};

export default function DashboardAppointments() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/appointments/mine/list', { auth: 'client' })
      .then((r) => {
        setUpcoming(r.upcoming || []);
        setPast(r.past || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="display-serif text-3xl text-brand-900">Appointments</h1>
          <p className="text-sm text-muted-foreground">
            Track upcoming consultations and review your history.
          </p>
        </div>
        <Link to="/book">
          <Button>
            <CalendarPlus className="h-4 w-4" /> Book new appointment
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 text-red-800 px-4 py-3 text-sm border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
          <Section
            title="Upcoming"
            description="Your scheduled or pending meetings, soonest first."
            empty="You have no upcoming appointments."
            items={upcoming}
          />
          <Section
            title="Past"
            description="Completed, cancelled, or missed meetings."
            empty="No past appointments yet."
            items={past}
            isPast
          />
        </>
      )}
    </div>
  );
}

function Section({ title, description, empty, items, isPast }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold text-brand-900">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {empty}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <AppointmentCard key={a.id} appointment={a} isPast={isPast} />
          ))}
        </div>
      )}
    </section>
  );
}

function AppointmentCard({ appointment, isPast }) {
  const start = new Date(appointment.start_at);
  const end = new Date(appointment.end_at);
  const isVirtual = appointment.modality === 'google_meet';
  const isToday = isSameDay(start, new Date());

  return (
    <Card className={isPast ? 'opacity-90' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-base">{appointment.type_name}</CardTitle>
            <CardDescription className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(start, 'EEE, MMM d yyyy')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {format(start, 'HH:mm')}–{format(end, 'HH:mm')}
              </span>
              <span className="flex items-center gap-1">
                {isVirtual ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                {isVirtual ? 'Google Meet' : 'In-Person'}
              </span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {isToday && !isPast && <Badge variant="warning">Today</Badge>}
            <Badge variant={STATUS_VARIANT[appointment.status] || 'muted'}>
              {STATUS_LABEL[appointment.status] || appointment.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {isVirtual && appointment.google_meet_link && appointment.status === 'scheduled' && !isPast && (
          <a
            href={appointment.google_meet_link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-brand-700 text-white px-3 py-2 text-sm hover:bg-brand-800"
          >
            <Video className="h-4 w-4" /> Join Google Meet
          </a>
        )}

        {appointment.notes && (
          <div className="rounded-md bg-brand-50/60 border border-brand-100 p-3 text-sm">
            <div className="text-xs uppercase tracking-wider text-brand-700/80 font-medium mb-1">
              Your note at booking
            </div>
            <p className="text-brand-900 whitespace-pre-wrap">{appointment.notes}</p>
          </div>
        )}

        {appointment.staff_notes ? (
          <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-800 font-medium mb-1">
              <StickyNote className="h-3.5 w-3.5" />
              Notes from your lawyer / assistant
            </div>
            <p className="text-amber-950 whitespace-pre-wrap">{appointment.staff_notes}</p>
          </div>
        ) : (
          !isPast && (
            <p className="text-xs text-muted-foreground italic">
              Your lawyer will post any notes or instructions here.
            </p>
          )
        )}
      </CardContent>
    </Card>
  );
}
