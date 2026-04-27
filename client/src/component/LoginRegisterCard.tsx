import Link from 'next/link';

type LoginRegisterCardProps = {
  message: string;
};

export default function LoginRegisterCard({ message }: LoginRegisterCardProps) {
  return (
    <div className="text-center py-12 px-4">
      {/* Message personnalisable */}
      <p className="text-lg md:text-xl  max-w-2xl mx-auto mb-8">{message}</p>

      {/* Boutons CTA stylés */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/login-register/login"
          className="px-8 py-4 bg-transparent border-2 border-(--button-select) hover:bg-(--button-game-challenge-hover) rounded-lg font-semibold  hover:scale-105 transition-all shadow-lg hover:shadow-xl hover:shadow-[#7c39ed]/50 text-center"
        >
          Login
        </Link>
        <Link
          href="/login-register/register"
          className="px-8 py-4 bg-transparent border-2 border-(--button-select) hover:bg-(--button-game-challenge-hover) rounded-lg font-semibold  hover:scale-105 transition-all shadow-lg hover:shadow-xl hover:shadow-[#7c39ed]/50 text-center"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
