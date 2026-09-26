import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Mail, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendClientEmailVerification } from '../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';

/**
 * Landing page after the user clicks the email-verify link. Reloads the Firebase
 * user so the `email_verified` claim refreshes and the dashboard banner updates.
 * Also usable as a self-initiated "check status" page with a resend button.
 */
export default function EmailVerificationPending() {
  const { client, verification, refreshClient } = useAuth();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      await refreshClient();
      setChecking(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function resend() {
    setResending(true);
    setMessage(null);
    try {
      await sendClientEmailVerification();
      setMessage('Verification email sent. Check your inbox (and spam folder).');
    } catch (err) {
      setMessage(err.message || 'Could not send verification email.');
    } finally {
      setResending(false);
    }
  }

  async function recheck() {
    setChecking(true);
    setMessage(null);
    await refreshClient();
    setChecking(false);
  }

  const verified = !!verification?.emailVerified;

  return (
    <div className="min-h-screen bg-brand-50/50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {verified ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Email verified
              </>
            ) : (
              <>
                <Mail className="h-5 w-5 text-brand-700" /> Verify your email
              </>
            )}
          </CardTitle>
          <CardDescription>
            {verified
              ? 'Your email address has been confirmed.'
              : `We sent a verification link to ${client?.email || 'your email address'}.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div className="rounded-md bg-brand-50 text-brand-900 px-3 py-2 text-sm border border-brand-100">
              {message}
            </div>
          )}

          {verified ? (
            <Button className="w-full" onClick={() => navigate('/dashboard')}>
              Go to dashboard
            </Button>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Click the link in that email to confirm this address. Once you have, return here
                and click &ldquo;I&rsquo;ve verified&rdquo; — or wait a moment, we check automatically.
              </p>
              <div className="flex flex-col gap-2">
                <Button onClick={recheck} disabled={checking} className="w-full">
                  <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
                  {checking ? 'Checking…' : "I've verified — check again"}
                </Button>
                <Button variant="outline" onClick={resend} disabled={resending} className="w-full">
                  {resending ? 'Sending…' : 'Resend verification email'}
                </Button>
                <Link
                  to="/dashboard"
                  className="text-sm text-muted-foreground hover:text-brand-700 text-center"
                >
                  Skip for now — I'll verify later
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
