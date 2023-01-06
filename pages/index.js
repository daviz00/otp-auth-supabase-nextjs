import React from 'react';
import { supabase } from '../lib/supabase';

const Home = () => {
  // state to store user info
  const [user, setUser] = React.useState(null);

  // state to store the user input
  const [form, setForm] = React.useState({ phone: '', token: '' });

  //state to store page
  const [status, setStatus] = React.useState('loading');

  //handle otplogin
  const otpLogin = async (form) => {
    try {
      const { error } = await supabase.auth.signIn(form);
      if (error) {
        throw error;
      } else {
        setStatus('otp');
      }
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  //handle otp verify
  const otpVerify = async (form) => {
    try {
      const { error } = await supabase.auth.verifyOTP(form);
      if (!error) {
        setStatus('success');
      } else {
        throw error;
      }
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  React.useEffect(() => {
    setUser(supabase.auth.user());
  }, [status]);

  console.log(user);

  return (
    <main className='flex items-center h-screen max-w-md px-8 mx-auto'>
      {user ? (
        <div>
          <h1 className='text-3xl font-bold '>
            <span className='text-blue-500'>SMS</span> Authentication Module
            using{' '}
            <a className='text-emerald-400' href='https://supabase.com/'>
              Supabase
            </a>
          </h1>
          <p className='my-8 text-gray-500'>
            You are logged in with
            <span className='font-bold text-black'> +{user.phone}</span>
          </p>

          <button
            className='w-full py-3 font-medium text-white bg-blue-500 rounded-lg'
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
            }}>
            Logout
          </button>
        </div>
      ) : (
        <>
          {status === 'otp' ? (
            <div>
              <h1 className='text-4xl font-bold'>Verify your phone number</h1>
              <p className='my-8 text-gray-500'>Enter your OTP code here</p>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type='text'
                  className='w-full p-3 text-gray-800 bg-gray-200 rounded-lg focus:outline-none'
                  placeholder='123456'
                  value={form.token}
                  onChange={(e) => setForm({ ...form, token: e.target.value })}
                />
                <button
                  className='w-full py-3 my-8 font-medium text-white bg-blue-500 rounded-lg'
                  onClick={() => otpVerify(form)}
                  type='submit'>
                  Verify
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h1 className='text-3xl font-bold '>
                <span className='text-blue-500'>SMS</span> Authentication Module
                using{' '}
                <a className='text-emerald-400' href='https://supabase.com/'>
                  Supabase
                </a>
              </h1>
              <p className='my-8 text-gray-500'>
                Add your phone number. We will send you a verification code so
                we know you are real.
              </p>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type='tel'
                  className='w-full p-3 text-gray-800 bg-gray-200 rounded-lg focus:outline-none'
                  placeholder='+918862294774'
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <button
                  className='w-full py-3 my-8 font-medium text-white bg-blue-500 rounded-lg'
                  onClick={() => otpLogin(form)}
                  type='submit'>
                  Send OTP
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Home;
