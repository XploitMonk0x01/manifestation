import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import HomeContent from './HomeContent'

export default async function Home() {
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (err) {
    // Optionally log error or show a fallback UI
  }
  if (session) redirect('/wishlist')

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cosmic-purple/60 to-nebula-blue/60">
      {/* Optional: Add a background effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* You can use your ParticlesBg here if desired */}
      </div>
      <section className="z-10 flex flex-col items-center text-center px-6 py-16 rounded-2xl bg-black/60 shadow-2xl backdrop-blur-md max-w-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-starlight mb-4 drop-shadow-lg">
          Messages to the Universe
        </h1>
        <p className="text-lg md:text-xl text-starlight/80 mb-8">
          Whisper your wishes to the cosmos and see them shine among the stars.
        </p>
        <a
          href="/login"
          className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-cosmic-purple to-nebula-blue text-white font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Get Started
        </a>
      </section>
    </main>
  )
}
