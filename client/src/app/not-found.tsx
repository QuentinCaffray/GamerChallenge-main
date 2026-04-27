import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className=" w-2xl h-57 bg-[url(/white-cloud.png)] bg-size-[400px] bg-no-repeat bg-center flex items-center flex-col justify-center text-2xl">
        <p>
          Error <span className="font-extrabold">404</span>
        </p>
        <p>A rat probably stole the page</p>
        <Link
          href={'/'}
          className="bg-(--button-select) hover:bg-(--button-game-challenge-hover) rounded-full p-1 pr-2 pl-2 foreground "
        >
          Back to home
        </Link>
      </div>
      <Image
        className=""
        src="/real-rat-thinking.png"
        height={250}
        width={250}
        alt="gamerchallenge mascot"
      ></Image>
    </main>
  );
}
