import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function Matches() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  // Get matches where this user is either A or B
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      id,
      pet_a_id,
      pet_b_id,
      pet_a:pets!pet_a_id(name, species, breed, owner_id),
      pet_b:pets!pet_b_id(name, species, breed, owner_id)
    `)
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">💖 Your Matches</h1>
      <div className="grid gap-4">
        {matches?.map(match => {
          const otherPet = match.pet_a?.owner_id === userId ? match.pet_b : match.pet_a
          return (
            <div key={match.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">🐾 {otherPet?.name || 'Unknown'}</p>
                <p className="text-gray-600">{otherPet?.species} • {otherPet?.breed || 'Mixed'}</p>
              </div>
              <Link href={`/chat/${match.id}`} className="bg-green-600 text-white px-4 py-2 rounded">
                💬 Message
              </Link>
            </div>
          )
        })}
        {(!matches || matches.length === 0) && (
          <p className="text-gray-500 mt-4 text-center">No matches yet. Keep swiping!</p>
        )}
      </div>
    </main>
  )
}