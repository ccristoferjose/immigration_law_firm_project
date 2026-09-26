import { google } from 'googleapis';
import { env } from '../config/env.js';
import { callProc } from '../config/db.js';

export function getOAuthClient() {
  return new google.auth.OAuth2(
    env.google.clientId,
    env.google.clientSecret,
    env.google.redirectUri
  );
}

export function googleConfigured() {
  return !!(env.google.clientId && env.google.clientSecret);
}

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
];

export function getAuthUrl(state) {
  const oauth2 = getOAuthClient();
  return oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    state,
  });
}

export async function exchangeCode(code) {
  const oauth2 = getOAuthClient();
  const { tokens } = await oauth2.getToken(code);
  return tokens;
}

export async function saveTokensForUser(userId, tokens) {
  await callProc('sp_google_token_save', [
    userId,
    tokens.access_token || null,
    tokens.refresh_token || null,
    tokens.scope || null,
    tokens.token_type || null,
    tokens.expiry_date || null,
  ]);
}

export async function loadTokensForUser(userId) {
  const rows = await callProc('sp_google_token_get', [userId]);
  return rows[0] || null;
}

/**
 * Returns an authorized oauth2 client for the given user, or null if the user
 * hasn't connected Google yet.
 */
export async function getAuthorizedClientForUser(userId) {
  const row = await loadTokensForUser(userId);
  if (!row || !row.refresh_token) return null;
  const oauth2 = getOAuthClient();
  oauth2.setCredentials({
    access_token: row.access_token,
    refresh_token: row.refresh_token,
    scope: row.scope,
    token_type: row.token_type,
    expiry_date: row.expiry_date,
  });
  // Persist refreshed tokens
  oauth2.on('tokens', async (tokens) => {
    try {
      await saveTokensForUser(userId, tokens);
    } catch (err) {
      console.warn('[google] token refresh persist failed:', err.message);
    }
  });
  return oauth2;
}

/**
 * Creates a Calendar event with a Google Meet conference link.
 * Returns { eventId, meetLink } or null if no authorized admin is connected.
 */
export async function createMeetEvent({
  userId,
  summary,
  description,
  startIso,
  endIso,
  attendees = [],
}) {
  const auth = await getAuthorizedClientForUser(userId);
  if (!auth) return null;

  const row = await loadTokensForUser(userId);
  const calendarId = row?.calendar_id || 'primary';
  const calendar = google.calendar({ version: 'v3', auth });

  const res = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    sendUpdates: 'all',
    requestBody: {
      summary,
      description,
      start: { dateTime: startIso, timeZone: 'UTC' },
      end: { dateTime: endIso, timeZone: 'UTC' },
      attendees: attendees.map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `legal-appt-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    },
  });

  const meetLink =
    res.data.hangoutLink ||
    res.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')
      ?.uri ||
    null;

  return { eventId: res.data.id, meetLink };
}

export async function deleteMeetEvent({ userId, eventId }) {
  if (!eventId) return;
  const auth = await getAuthorizedClientForUser(userId);
  if (!auth) return;
  const row = await loadTokensForUser(userId);
  const calendarId = row?.calendar_id || 'primary';
  try {
    const calendar = google.calendar({ version: 'v3', auth });
    await calendar.events.delete({ calendarId, eventId, sendUpdates: 'all' });
  } catch (err) {
    console.warn('[google] deleteMeetEvent failed:', err.message);
  }
}
