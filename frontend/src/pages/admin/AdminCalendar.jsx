import { useEffect, useMemo, useState } from 'react';
import { addDays, addMonths, format, startOfMonth, startOfWeek, endOfWeek, endOfMonth, isSameDay, isSameMonth, addWeeks, subWeeks, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import AppointmentDialog from './AppointmentDialog.jsx';

const VIEWS = ['day', 'week', 'month'];

export default function AdminCalendar() {
  const [view, setView] = useState('week');
  const [cursor, setCursor] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [prefill, setPrefill] = useState(null);

  const range = useMemo(() => {
    if (view === 'day') return { from: new Date(cursor.setHours(0, 0, 0, 0)), to: addDays(cursor, 1) };
    if (view === 'week') {
      const from = startOfWeek(cursor, { weekStartsOn: 1 });
      return { from, to: addDays(from, 7) };
    }
    const from = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const to = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return { from, to };
  }, [view, cursor]);

  async function load() {
    const [a, b] = await Promise.all([
      api.get(`/appointments?from=${range.from.toISOString()}&to=${range.to.toISOString()}`, { auth: 'admin' }),
      api.get(`/blocked-times?from=${range.from.toISOString()}&to=${range.to.toISOString()}`, { auth: 'admin' }),
    ]);
    setAppointments(a.appointments);
    setBlocked(b.blocked);
  }

  useEffect(() => {
    load();
  }, [range.from.getTime(), range.to.getTime()]);

  function shift(dir) {
    if (view === 'day') setCursor((c) => addDays(c, dir));
    else if (view === 'week') setCursor((c) => (dir > 0 ? addWeeks(c, 1) : subWeeks(c, 1)));
    else setCursor((c) => (dir > 0 ? addMonths(c, 1) : subMonths(c, 1)));
  }

  function openCreate(slotStart) {
    setEditing(null);
    setPrefill(slotStart ? { start_at: slotStart.toISOString() } : null);
    setDialogOpen(true);
  }

  function openEdit(appt) {
    setEditing(appt);
    setPrefill(null);
    setDialogOpen(true);
  }

  async function afterSaved() {
    setDialogOpen(false);
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="display-serif text-3xl text-brand-900">Calendar</h1>
          <p className="text-sm text-muted-foreground">{format(cursor, 'MMMM yyyy')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border bg-white overflow-hidden">
            {VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-sm capitalize ${
                  view === v ? 'bg-brand-700 text-white' : 'text-brand-800 hover:bg-brand-50'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="outline" onClick={() => shift(-1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button size="sm" variant="outline" onClick={() => setCursor(new Date())}>Today</Button>
            <Button size="icon" variant="outline" onClick={() => shift(1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <Button onClick={() => openCreate(null)}>
            <Plus className="h-4 w-4" /> New
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        {view === 'month' && <MonthView cursor={cursor} appointments={appointments} blocked={blocked} onPickDay={(d) => { setCursor(d); setView('day'); }} />}
        {view === 'week' && <WeekView cursor={cursor} appointments={appointments} blocked={blocked} onCreate={openCreate} onEdit={openEdit} />}
        {view === 'day' && <DayView cursor={cursor} appointments={appointments} blocked={blocked} onCreate={openCreate} onEdit={openEdit} />}
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-brand-700" /> Scheduled</div>
        <div className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-orange-400 border border-dashed border-orange-500" /> Pending Review</div>
        <div className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-emerald-500" /> Completed</div>
        <div className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-slate-400" /> Blocked</div>
      </div>

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        prefill={prefill}
        onSaved={afterSaved}
      />
    </div>
  );
}

// ---- Month ----
function MonthView({ cursor, appointments, blocked, onPickDay }) {
  const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
  const days = [];
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) days.push(new Date(d));

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-border bg-brand-50 text-xs font-medium text-brand-900">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="p-2 text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d) => {
          const appts = appointments.filter((a) => isSameDay(new Date(a.start_at), d));
          const blk = blocked.filter((b) => isSameDay(new Date(b.start_at), d));
          return (
            <button
              key={d.toISOString()}
              onClick={() => onPickDay(d)}
              className={`min-h-[100px] border-b border-r border-border p-2 text-left text-sm transition-colors ${
                isSameMonth(d, cursor) ? 'bg-white' : 'bg-brand-50/50 text-muted-foreground'
              } hover:bg-brand-50`}
            >
              <div className={`font-semibold ${isSameDay(d, new Date()) ? 'text-brand-700' : ''}`}>
                {format(d, 'd')}
              </div>
              <div className="mt-1 space-y-0.5">
                {appts.slice(0, 3).map((a) => (
                  <div key={a.id} className="truncate text-[11px] bg-brand-100 text-brand-900 rounded px-1">
                    {format(new Date(a.start_at), 'HH:mm')} {a.client_name}
                  </div>
                ))}
                {blk.slice(0, 1).map((b) => (
                  <div key={b.id} className="truncate text-[11px] bg-slate-200 text-slate-700 rounded px-1">
                    {b.title}
                  </div>
                ))}
                {appts.length > 3 && (
                  <div className="text-[10px] text-muted-foreground">+{appts.length - 3} more</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Week ----
function WeekView({ cursor, appointments, blocked, onCreate, onEdit }) {
  const start = startOfWeek(cursor, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[780px] grid grid-cols-7 divide-x divide-border">
        {days.map((d) => (
          <DayColumn
            key={d.toISOString()}
            day={d}
            appointments={appointments.filter((a) => isSameDay(new Date(a.start_at), d))}
            blocked={blocked.filter((b) => isSameDay(new Date(b.start_at), d))}
            onCreate={onCreate}
            onEdit={onEdit}
            header
          />
        ))}
      </div>
    </div>
  );
}

// ---- Day ----
function DayView({ cursor, appointments, blocked, onCreate, onEdit }) {
  return (
    <div className="grid grid-cols-1">
      <DayColumn
        day={cursor}
        appointments={appointments.filter((a) => isSameDay(new Date(a.start_at), cursor))}
        blocked={blocked.filter((b) => isSameDay(new Date(b.start_at), cursor))}
        onCreate={onCreate}
        onEdit={onEdit}
        expanded
      />
    </div>
  );
}

function DayColumn({ day, appointments, blocked, onCreate, onEdit, header, expanded }) {
  // Hour grid from 8:00 to 19:00
  const startHour = 8;
  const endHour = 19;
  const totalMinutes = (endHour - startHour) * 60;
  const pxPerMinute = expanded ? 1.2 : 0.8;
  const heightPx = totalMinutes * pxPerMinute;

  function positionBlock(startIso, endIso) {
    const s = new Date(startIso);
    const e = new Date(endIso);
    const dayStart = new Date(day);
    dayStart.setHours(startHour, 0, 0, 0);
    const top = Math.max(0, ((s - dayStart) / 60000) * pxPerMinute);
    const height = Math.max(18, ((e - s) / 60000) * pxPerMinute);
    return { top, height };
  }

  return (
    <div className="relative">
      {header && (
        <div className={`text-center py-2 border-b border-border ${isSameDay(day, new Date()) ? 'bg-brand-50' : ''}`}>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{format(day, 'EEE')}</div>
          <div className="text-lg font-semibold text-brand-900">{format(day, 'd MMM')}</div>
        </div>
      )}
      <div className="relative" style={{ height: heightPx }}>
        {/* Hour lines */}
        {Array.from({ length: endHour - startHour + 1 }, (_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-border/70 text-[10px] text-muted-foreground pl-1"
            style={{ top: i * 60 * pxPerMinute }}
          >
            {String(startHour + i).padStart(2, '0')}:00
          </div>
        ))}
        {/* Click-to-create hit areas (each hour) */}
        {Array.from({ length: endHour - startHour }, (_, i) => {
          const d = new Date(day);
          d.setHours(startHour + i, 0, 0, 0);
          return (
            <button
              key={`slot-${i}`}
              onClick={() => onCreate(d)}
              className="absolute left-10 right-1 hover:bg-emerald-50/50"
              style={{ top: i * 60 * pxPerMinute, height: 60 * pxPerMinute - 2 }}
            />
          );
        })}
        {/* Blocked periods */}
        {blocked.map((b) => {
          const { top, height } = positionBlock(b.start_at, b.end_at);
          return (
            <div
              key={`blk-${b.id}`}
              className="absolute left-10 right-1 bg-slate-200/90 border-l-4 border-slate-500 rounded px-1 text-[11px] text-slate-700"
              style={{ top, height }}
              title={b.title}
            >
              {b.title}
            </div>
          );
        })}
        {/* Appointments */}
        {appointments.map((a) => {
          const { top, height } = positionBlock(a.start_at, a.end_at);
          const color =
            a.status === 'cancelled' ? 'bg-red-100 border-red-500 text-red-900' :
            a.status === 'no_show' ? 'bg-amber-100 border-amber-500 text-amber-900' :
            a.status === 'completed' ? 'bg-emerald-100 border-emerald-500 text-emerald-900' :
            a.status === 'pending_review' ? 'bg-orange-100 border-orange-400 text-orange-900 border-dashed' :
            a.status === 'rejected' ? 'bg-gray-100 border-gray-400 text-gray-500 line-through' :
            'bg-brand-100 border-brand-600 text-brand-900';
          return (
            <button
              key={a.id}
              onClick={() => onEdit(a)}
              className={`absolute left-10 right-1 ${color} border-l-4 rounded px-1 text-[11px] text-left overflow-hidden`}
              style={{ top, height }}
            >
              <div className="font-semibold truncate">{format(new Date(a.start_at), 'HH:mm')} {a.client_name}</div>
              <div className="truncate">{a.type_name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
