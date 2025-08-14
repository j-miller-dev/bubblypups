import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Container } from '@/Components/Container';
import { Gradient } from '@/Components/Gradient';
import { Button } from '@/Components/Button';
import { Link } from '@/Components/Link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would submit to a Laravel endpoint
    console.log('Login submitted', { email, password, rememberMe });
  };

  return (
    <MainLayout title="Login - Radiant" description="Log in to your Radiant account">
      <div className="overflow-hidden">
        <div className="relative">
          <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
          <Container className="relative py-24 sm:py-32">
            <div className="mx-auto max-w-md">
              <h1 className="text-center text-4xl font-medium tracking-tighter text-pretty text-gray-950">
                Log in to Radiant
              </h1>
              <p className="mt-4 text-center text-lg text-gray-600">
                Welcome back! Please enter your credentials to access your account.
              </p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-fuchsia-500 focus:outline-none focus:ring-fuchsia-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-fuchsia-500 focus:outline-none focus:ring-fuchsia-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="#" className="font-medium text-fuchsia-600">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full justify-center"
                  >
                    Sign in
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Don't have an account?</span>{' '}
                <Link href="#" className="font-medium text-fuchsia-600">
                  Sign up
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </MainLayout>
  );
}
