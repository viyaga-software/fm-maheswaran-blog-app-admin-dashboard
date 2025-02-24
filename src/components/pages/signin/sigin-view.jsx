import Link from 'next/link';
import UserAuthForm from './user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignInViewPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Sidebar (Only visible on large screens) */}
      <div className="relative hidden h-full flex-col bg-gray-100 dark:bg-zinc-900 p-10 text-gray-900 dark:text-white lg:flex dark:border-r">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 bg-white dark:bg-zinc-900">
          <img
            src="/images/login.png"
            alt="chess"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-100 dark:from-zinc-900 via-gray-100 dark:via-zinc-900 opacity-20" />
        </div>

        {/* Logo Section */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <span className="text-gray-900 dark:text-white">Logo</span>
        </div>

        {/* <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              &ldquo;This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before.&rdquo;
            </p>
            <footer className="text-sm text-gray-500 dark:text-gray-400">Sofia Davis</footer>
          </blockquote>
        </div> */}
      </div>

      {/* Login Form Section */}
      <div className="flex h-full items-center p-4 lg:p-8 bg-white dark:bg-zinc-900">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Login
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your email below to login to your account
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
