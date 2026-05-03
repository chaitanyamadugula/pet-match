import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { addPet } from '@/app/actions/pets'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function Dashboard() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // Fetch only this user's pets
  const { data: myPets } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🐾 Your Pets</h1>
   
<Link href="/discover" className="inline-block bg-purple-600 text-white px-4 py-2 rounded mb-4">🔍 Discover Pets</Link>
      {/* Add Pet Form */}
      <form action={addPet} className="bg-white p-4 rounded shadow space-y-3">
        <input name="name" placeholder="Pet name" required className="border p-2 w-full rounded" />
        <select name="species" required className="border p-2 w-full rounded">
          <option value="">Species</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
        </select>
        <input name="breed" placeholder="Breed (optional)" className="border p-2 w-full rounded" />
        <input name="age" type="number" placeholder="Age" className="border p-2 w-full rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Add Pet</button>
      </form>
      <div className="flex gap-4 mb-6">
  <Link href="/discover" className="bg-purple-600 text-white px-4 py-2 rounded">🔍 Discover</Link>
  <Link href="/matches" className="bg-pink-600 text-white px-4 py-2 rounded">💖 Matches</Link>
</div>

      {/* List Pets */}
      <div className="space-y-2">
        {myPets?.map(pet => (
          <div key={pet.id} className="bg-gray-100 p-3 rounded flex justify-between">
            <span>🐶 {pet.name} ({pet.species})</span>
            <span className="text-gray-500">Age: {pet.age}</span>
          </div>
        ))}
      </div>
    </main>
  )
}