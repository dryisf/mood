import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center text-white">
      <div className="w-full max-w-[600px] mx-auto flex flex-col gap-4">
        <h1 className="text-6xl">Your own journal app</h1>
        <p className="text-2xl text-white/60">
          An app to track your mood throughout your life. All you have to do is
          to be honest.
        </p>
        <div>
          <Link href="/journal">
            <button className="bg-blue-600 p-4 rounded-lg text-xl">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
