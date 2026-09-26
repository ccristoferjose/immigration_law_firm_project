import { useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { admin, adminLogin } = useAuth();
  const { pathToken } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (admin) return <Navigate to="/admin/calendar" replace />;

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminLogin(email, password, pathToken);
      navigate('/admin/calendar');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-brand-700 text-white flex items-center justify-center font-serif text-lg">L</div>
            <div>
              <CardTitle>Staff Sign In</CardTitle>
              <CardDescription>Admin / lawyer / assistant access</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm border border-red-200">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw">Password</Label>
              <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
