# Legal Appointment Scheduling & Client Management

A full-stack, client-centric appointment scheduling and client management platform for
a legal services business (e.g., immigration law office). The application itself is the
single source of truth for availability — appointments, blocked time, business hours,
and booking window rules are all stored in MySQL and evaluated at the API layer.

## Stack

| Layer       | Tech                                                   |
|-------------|--------------------------------------------------------|
| Frontend    | React 18 + Vite, Tailwind CSS, ShadCN-style primitives |
| Backend     | Node.js 20, Express, Zod validation                    |
| Database    | MySQL 8                                                |
| Admin auth  | JWT (bcrypt password hashing)                          |
| Client auth | Firebase Authentication (form-based)                   |
| Meet links  | Google Calendar API with `conferenceData` (real Meet)  |
| Container   | Docker Compose (MySQL + backend + frontend + volume)   |

## Features

### Public landing page
- Hero with business name & tagline
- Services section, About, Contact, image carousel, testimonials
- Strong "Book an Appointment" CTA
- Fully responsive, mobile-first

### Client booking flow (no dashboard in MVP)
1. Pick service + modality (In-Person / Google Meet)
2. Register / sign in with Firebase (email + password)
3. Pick a date & time from live-computed availability
4. Fill in structured details (name, phone, email, case number, notes)
5. Review & confirm
6. Confirmation screen with Meet link if applicable

### Admin dashboard
- Calendar with **Day / Week / Month** views
- Click-to-create / click-to-edit appointments
- Visual status: scheduled / completed / cancelled / no-show
- Full client CRUD with search and per-client appointment history
- Appointment types (CRUD, activate/deactivate)
- Business settings: working days, hours, slot size, buffer, booking window, tz
- Blocked times (holidays, breaks)
- Google account connect (OAuth) for auto-creating Meet links

### Availability engine
Computes slots dynamically from:
- Business working days & hours
- Slot duration (configurable)
- Optional buffer between appointments
- Existing appointments
- Blocked time periods
- Booking window (next N days)
- Past time exclusion

Overlap enforcement and all rules are enforced **server-side** on every write.

### Appointment record
Each appointment carries: client reference, start/end (UTC), status, modality,
type, Google Meet link + event id, notes, created-by (admin or public), and
the user id of the admin that hosts the Meet event.

## Project layout

```
appointment_prjct/
├── docker-compose.yml
├── .env.example
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/{env,db}.js
│       ├── db/{schema.sql,seed.sql,bootstrap.js}
│       ├── middleware/{auth,error,validate}.js
│       ├── utils/{jwt,firebase}.js
│       ├── services/{availability,google}.service.js
│       └── routes/
│           ├── auth.routes.js
│           ├── clients.routes.js
│           ├── appointmentTypes.routes.js
│           ├── appointments.routes.js
│           ├── availability.routes.js
│           ├── blockedTimes.routes.js
│           ├── google.routes.js
│           └── settings.routes.js
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── lib/{api,firebase,utils}.js
        ├── context/AuthContext.jsx
        ├── components/ui/          (ShadCN-style primitives)
        └── pages/
            ├── Landing.jsx
            ├── Booking.jsx
            ├── AdminLogin.jsx
            └── admin/
                ├── AdminLayout.jsx
                ├── AdminCalendar.jsx
                ├── AppointmentDialog.jsx
                ├── AdminClients.jsx
                ├── AdminClientDetail.jsx
                ├── AdminAppointmentTypes.jsx
                └── AdminSettings.jsx
```

## Running with Docker Compose

1. Copy the env template and fill in secrets you want to customize:

   ```bash
   cp .env.example .env
   ```

2. Start everything:

   ```bash
   docker compose up --build
   ```

3. Open the apps:

   - Frontend / public site: http://localhost:5173
   - Backend API:            http://localhost:4000/api/health
   - MySQL:                  `localhost:3307` (inside the network: `mysql:3306`)

4. Default admin credentials (auto-seeded on first boot):

   ```
   email:    admin@example.com
   password: admin123
   ```

   Override via `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD`.

5. Appointment types are seeded automatically:
   - Initial Consultation (60 min)
   - Document Review (45 min)
   - Case Follow-Up (30 min)
   - Work Permit Consultation (60 min)

The MySQL data directory is persisted in the named Docker volume `mysql_data`.

## Firebase setup (client auth)

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Frontend config (set in `.env` before `docker compose build`):
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_APP_ID=1:xxxxx:web:xxxxx
   ```
4. Backend config (for verifying ID tokens):
   - Generate a service account: **Project Settings → Service accounts → Generate new private key**.
   - Paste the full JSON as a single line into `FIREBASE_SERVICE_ACCOUNT` in `.env`.
   - Set `FIREBASE_PROJECT_ID` to the same project id.

Until both of the above are configured, the booking flow's sign-in step will
surface a "Firebase not configured" message.

## Google Calendar / Meet setup

To automatically create real Google Meet links on virtual appointments:

1. Google Cloud Console → **APIs & Services → Credentials**.
2. Enable the **Google Calendar API**.
3. Create an **OAuth 2.0 Client ID** (Web application) with authorized redirect URI:
   ```
   http://localhost:4000/api/google/oauth/callback
   ```
4. Put the values in `.env`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REDIRECT_URI=http://localhost:4000/api/google/oauth/callback
   ```
5. After starting the stack, sign in as an admin and go to **Settings → Google Calendar / Meet → Connect Google Account**. This stores a refresh token for that admin user.

When a public client books a `google_meet` appointment, the backend creates a
Calendar event on the first connected admin's primary calendar with
`conferenceData.createRequest`, and stores the resulting Meet link on the
appointment row.

## Local development (without Docker)

Backend:
```bash
cd backend
npm install
DB_HOST=localhost DB_PORT=3307 npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Make sure MySQL is running (either via `docker compose up mysql` or a local install)
with the schema in `backend/src/db/schema.sql` applied.

## API surface (selected)

| Method | Path                               | Auth      | Purpose                          |
|--------|------------------------------------|-----------|----------------------------------|
| POST   | `/api/admin/login`                 | none      | Admin JWT login                  |
| GET    | `/api/admin/me`                    | admin     | Current admin profile            |
| GET    | `/api/settings/public`             | none      | Public settings for landing page |
| GET    | `/api/appointment-types/public`    | none      | Active services for booking      |
| GET    | `/api/availability?date=YYYY-MM-DD`| none      | Dynamic slot list                |
| POST   | `/api/clients/self`                | client    | Create/update client profile     |
| POST   | `/api/appointments/book`           | client    | Public booking                   |
| GET    | `/api/appointments?from&to`        | admin     | Appointments in a window         |
| POST   | `/api/appointments`                | admin     | Admin-created appointment        |
| PUT    | `/api/appointments/:id`            | admin     | Edit / reschedule                |
| DELETE | `/api/appointments/:id`            | admin     | Cancel & remove                  |
| GET    | `/api/google/oauth/start`          | admin     | Start Google OAuth flow          |
| GET    | `/api/google/oauth/callback`       | none      | OAuth callback → token store     |
| GET    | `/api/clients`                     | admin     | Search & list clients            |
| POST/PUT/DELETE `/api/appointment-types` | admin | CRUD services              |
| GET/POST/PUT/DELETE `/api/blocked-times` | admin | CRUD blocked periods       |
| PUT    | `/api/settings`                    | admin     | Update business settings         |

All write operations are validated with Zod. Overlap and availability rules
are enforced server-side via `services/availability.service.js`.

## Notes & trade-offs

- Time is stored in UTC in MySQL; business-hour rules are evaluated in the
  configured business timezone (`settings.timezone`, e.g. `America/New_York`)
  via `date-fns-tz`. The frontend renders times in the browser local tz; the
  availability endpoint also sends a pre-formatted `local_label` for each slot.
- The public booking endpoint assigns the Meet-hosting admin as the first
  admin with a connected Google account. A production deployment might want
  round-robin or per-service routing.
- Admin-created appointments optionally generate Meet links using the
  *creating admin's* tokens (they must have connected Google from Settings).
- The server container waits for MySQL health before starting and bootstraps
  a default admin if no users exist yet.
