import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AuthPage() {
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all required fields');
      }

      if (!isLoginMode && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const endpoint = isLoginMode ? '/api/user/auth' : '/api/user/user';
      const payload = {
        email: formData.email,
        password: formData.password,
        lastLogin: new Date().toISOString(),
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Response data:', data, response, payload);
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setAuth(data.token, data.user);

      toast({
        title: 'Success!',
        description: isLoginMode
          ? 'You have been signed in.'
          : 'Account created successfully!',
      });

      setShouldNavigate(true);
    } catch (err) {
      console.log('Authentication error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      toast({
        title: 'Authentication Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shouldNavigate) {
      navigate('/');
    }
  }, [shouldNavigate, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h2>
          <p className="text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>

        <Card className="shadow-lg border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                isLoginMode
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                !isLoginMode
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                />
              </div>

              {!isLoginMode && (
                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading
                  ? 'Please wait...'
                  : isLoginMode
                    ? 'Login'
                    : 'Register'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
