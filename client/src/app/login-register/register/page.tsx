'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

type Register = {
  username: string;
  email: string;
  password: string;
};
type LoginData = {
  email: string;
  password: string;
};

// Règles de validation
const passwordRules = [
  { label: 'at least 8 characters', test: (pwd: string) => pwd.length >= 8 },
  { label: 'one uppercase', test: (pwd: string) => /[A-Z]/.test(pwd) },
  { label: 'one special character', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
];

export default function AuthRegister() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const registerUrl = process.env.NEXT_PUBLIC_API_URL || '';

  // Validation en temps réel
  const passwordValidation = useMemo(() => {
    return passwordRules.map((rule) => rule.test(userPassword));
  }, [userPassword]);

  async function postForm(url: string, values: Register) {
    try {
      const response = await fetch(`${url}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      if (response.status === 409) {
        return setErrorMessage('Email or username is already registered');
      }
      if (response.status >= 300) {
        setErrorMessage('An error happened, please try again later');
      } else {
        setSuccessMessage('Registration successful, time to challenge yourself!');
        const loginData: LoginData = {
          email: userEmail,
          password: userPassword
        };
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(loginData)
          });

          const data = await response.json();
          if (!response.ok) {
            // Gérer les erreurs du backend
            setErrorMessage(data.message || 'Invalid credentials');
            setIsLoading(false);

            return;
          }

          // Rediriger vers la page d'accueil (ou dashboard)
          router.replace('/');
          router.refresh();
        } catch (error) {
          setErrorMessage('Network error. Please try again later.');
          setIsLoading(false);
        }
      }
    } catch (e) {
      setErrorMessage(`An error happened, please try again later ${e}`);
    }
  }

  function handleAction() {
    if (userPassword !== passwordConfirm) {
      return setErrorMessage('Passwords do not match');
    }
    const formValues = {
      email: userEmail,
      username: userName,
      password: userPassword
    };
    postForm(registerUrl, formValues);
  }

  return (
    <main className="min-h-screen">
      <h2 className="text-4xl text-center mt-10 font-extrabold">Registration</h2>
      <form action={handleAction}>
        <h2 className="text-xl text-center lg:mt-40 mt-15">{successMessage}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:auto-rows-[80px] auto-rows-fr gap-4 mb-5 mt-5 ml-10 mr-10 lg:mr-60 lg:ml-60">
          <div className="flex flex-col p-3 pl-7 pr-7 bg-(--button-area) rounded-3xl focus-within:bg-(--button-select) lg:mr-10">
            <label htmlFor="userName">Your username</label>
            <input
              type="text"
              value={userName}
              placeholder="QuentinBG"
              onChange={(e) => setUserName(e.target.value)}
              id="userName"
              className="placeholder:text-foreground/40"
            />
          </div>

          <div className="flex flex-col p-3 pl-7 pr-7 bg-(--button-area) rounded-3xl focus-within:bg-(--button-select) lg:ml-10">
            <label htmlFor="email">Your email address</label>
            <input
              type="email"
              value={userEmail}
              placeholder="quentin@exemple.com"
              onChange={(e) => setUserEmail(e.target.value)}
              id="email"
              className="placeholder:text-foreground/40"
            />
          </div>

          <div className="flex flex-col p-3 pl-7 pr-7 lg:pb-20 bg-(--button-area) rounded-3xl focus-within:bg-(--button-select) lg:mr-10">
            <label htmlFor="password">Your password</label>
            <input
              type="password"
              value={userPassword}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              className="placeholder:text-foreground/40"
            />

            {/* Affichage des règles colorées */}
            {userPassword.length > 0 ? (
              <p className="text-sm mt-2">
                Must have:{' '}
                {passwordRules.map((rule, index) => (
                  <span
                    key={index}
                    className={`transition-colors ${
                      passwordValidation[index] ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {rule.label}
                    {index < passwordRules.length - 1 && ', '}
                  </span>
                ))}
              </p>
            ) : (
              <p className="text-sm mt-2 opacity-70">
                Must have: at least 8 characters, one uppercase, one special character
              </p>
            )}
          </div>

          <div className="flex flex-col p-3 pl-7 pr-7 bg-(--button-area) rounded-3xl focus-within:bg-(--button-select) lg:ml-10">
            <label htmlFor="passwordConfirmation">Confirm your password</label>
            <input
              type="password"
              value={passwordConfirm}
              placeholder="Re-enter your password"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              id="passwordConfirmation"
              className="placeholder:text-foreground/40"
            />
          </div>
        </div>

        <div className="flex justify-center flex-col items-center">
          <button
            type="submit"
            className="bg-(--button-area) p-3 pl-7 pr-7 mt-7 mb-10 cursor-pointer rounded-3xl flex justify-center hover:bg-(--button-select) lg:pr-10 lg:pl-10"
          >
            Submit
          </button>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      </form>
    </main>
  );
}
