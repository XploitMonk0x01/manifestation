import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

// debbug here , sayad idhr error h kuch
export default async function Home() {
  const session = await getServerSession(authOptions) // Pass authOptions
  if (session) redirect('/wishlist')

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex items-center justify-center">
      <h1 className="text-4xl text-white font-mystical">
        Welcome to Messages to the Universe
      </h1>
    </div>
  )
}
