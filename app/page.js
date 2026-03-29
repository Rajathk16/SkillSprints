"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registerComponent } from './core/authLogic';

export default function Register() {
  const router = useRouter();
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [role, setRole] = useState('student');

  return (
    <div className="min-h-screen flex bg-linear-to-br from-slate-100 via-gray-50 to-white text-slate-900"> 

      <div className="hidden md:flex md:w-1/2 lg:w-[45%] relative h-screen overflow-hidden">
        <Image
          src="https://static.vecteezy.com/system/resources/thumbnails/003/689/228/small_2x/online-registration-or-sign-up-login-for-account-on-smartphone-app-user-interface-with-secure-password-mobile-application-for-ui-web-banner-access-cartoon-people-illustration-vector.jpg"
          alt="Online registration illustration"
          className="absolute inset-0 w-full h-full object-cover"
          fill
        />
      </div>

      <div className="w-full md:w-1/2 lg:w-[55%] flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-8">

          <h1 className="text-3xl font-bold text-white mb-2">
            Create an account
          </h1>

          <p className="text-slate-300 mb-6">
            Start your gamified learning journey 🚀
          </p>

          <div className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full h-11 px-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
              onChange={(e) => setemail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full h-11 px-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
              onChange={(e) => setpassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full h-11 px-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
            />

            <button
              className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-slate-50 font-semibold transition"
              onClick={async () => {
                try {
                  await registerComponent(email, password, router);
                  router.push('/login');
                } catch (err) {
                  alert('Registration failed');
                  console.log(' ');
                }
              }}
            >
              Create account
            </button>
          </div>

          <div className="text-center mt-6 text-sm text-slate-300">
            Already have an account? {' '} 
            <span
              className="text-emerald-400 font-medium cursor-pointer hover:underline"
              onClick={() => router.push('/login')}
            >
              Login
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
