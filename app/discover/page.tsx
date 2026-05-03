import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { swipePet } from '@/app/actions/pets'

export default async function Discover() {
  const { userId } = await auth()
  
  // ✅ Use Next.js native redirect for server components
  if (!userId) {
    redirect('/')
  }

  // Fetch pets owned by OTHER users
  const { data: otherPets } = await supabase
    .from('pets')
    .select('*')
    .neq('owner_id', userId)
    .limit(10)

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🔍 Discover Pets</h1>
      
      <div className="grid gap-4">
        {otherPets?.map((pet) => (
          <div key={pet.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">{pet.name}</p>
              <p className="text-gray-600">{pet.species} • {pet.breed || 'Mixed'} • Age {pet.age}</p>
            </div>
            <form action={swipePet.bind(null, pet.id, 'right')}>
              <button type="submit" className="text-3xl hover:scale-125 transition bg-gray-100 rounded-full p-2">
                ❤️
              </button>
            </form>
          </div>
        ))}
      </div>

      {(!otherPets || otherPets.length === 0) && (
        <p className="text-gray-500 mt-8 text-center">
          No pets available yet. Add yours in the Dashboard or invite more users!
        </p>
      )}
    </main>
  )
}