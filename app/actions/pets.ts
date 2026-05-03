// 'use server'
// import { createClient } from '@supabase/supabase-js'
// import { auth } from '@clerk/nextjs/server'

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// )

// export async function addPet(formData: FormData) {
//   const { userId } = await auth()
//   if (!userId) throw new Error('Not logged in')

//   const { error } = await supabase.from('pets').insert({
//     owner_id: userId,
//     name: formData.get('name'),
//     species: formData.get('species'),
//     breed: formData.get('breed') || '',
//     age: Number(formData.get('age')) || 0
//   })

//   if (error) throw new Error(error.message)
//   return { success: true }
// }

// export async function swipePet(targetPetId: string, direction: 'right' | 'left') {
//   const { userId } = await auth()
//   if (!userId) throw new Error('Not logged in')

//   // 1. Record the swipe
//   const { error } = await supabase.from('swipes').insert({
//     swiper_id: userId,
//     target_pet_id: targetPetId,
//     direction
//   })
//   if (error) throw new Error(error.message)

//   // 2. Check for mutual match (only on right swipe)
//   if (direction !== 'right') return { success: true, isMatch: false }

//   // Get the owner of the pet you just swiped on
//   const {  targetPet } = await supabase
//     .from('pets')
//     .select('owner_id, id')
//     .eq('id', targetPetId)
//     .single()

//   if (!targetPet) return { success: true, isMatch: false }

//   // Check if they already swiped right on ANY of your pets
//   const { data: mutualSwipe } = await supabase
//     .from('swipes')
//     .select('*')
//     .eq('swiper_id', targetPet.owner_id)
//     .eq('direction', 'right')
//     .limit(1)

//   // Find if they swiped on one of your pets
//   const yourPets = await supabase.from('pets').select('id').eq('owner_id', userId)
//   const swipedOnYourPet = mutualSwipe?.some(s => 
//     yourPets?.data?.some(p => p.id === s.target_pet_id)
//   )

//   if (swipedOnYourPet) {
//     // Create match
//     await supabase.from('matches').insert({
//       user_a_id: userId,
//       user_b_id: targetPet.owner_id,
//       pet_a_id: targetPet.id,
//       pet_b_id: yourPets?.data?.[0]?.id || targetPet.id
//     })
//     return { success: true, isMatch: true }
//   }

//   return { success: true, isMatch: false }
// }

'use server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function addPet(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('Not logged in')

  const { error } = await supabase.from('pets').insert({
    owner_id: userId,
    name: formData.get('name'),
    species: formData.get('species'),
    breed: formData.get('breed') || '',
    age: Number(formData.get('age')) || 0
  })

  if (error) throw new Error(error.message)
  return { success: true }
}

export async function swipePet(targetPetId: string, direction: 'right' | 'left') {
  const { userId } = await auth()
  if (!userId) throw new Error('Not logged in')

  // 1. Record the swipe
  const { error: swipeError } = await supabase.from('swipes').insert({
    swiper_id: userId,
    target_pet_id: targetPetId,
    direction
  })
  if (swipeError) throw new Error(swipeError.message)

  // 2. Only check for matches on right swipes
  if (direction !== 'right') return { success: true, isMatch: false }

  // Get owner of the pet you just liked
  const { data: targetPet } = await supabase
    .from('pets')
    .select('owner_id')
    .eq('id', targetPetId)
    .single()

  if (!targetPet) return { success: true, isMatch: false }

  // Get all your pet IDs
  const { data: yourPets } = await supabase
    .from('pets')
    .select('id')
    .eq('owner_id', userId)

  if (!yourPets || yourPets.length === 0) return { success: true, isMatch: false }

  const yourPetIds = yourPets.map(p => p.id)

  // Check if they already swiped right on ANY of your pets
  const { data: mutualSwipes } = await supabase
    .from('swipes')
    .select('id')
    .eq('swiper_id', targetPet.owner_id)
    .eq('direction', 'right')
    .in('target_pet_id', yourPetIds)

  // ✅ If mutual swipe found, create match
  if (mutualSwipes && mutualSwipes.length > 0) {
    console.log('💖 MATCH DETECTED:', userId, '<->', targetPet.owner_id)

    // Prevent duplicate matches
    const { data: existingMatch } = await supabase
      .from('matches')
      .select('id')
      .or(`and(user_a_id.eq.${userId},user_b_id.eq.${targetPet.owner_id}),and(user_a_id.eq.${targetPet.owner_id},user_b_id.eq.${userId})`)
      .limit(1)

    if (!existingMatch || existingMatch.length === 0) {
      await supabase.from('matches').insert({
        user_a_id: userId,
        user_b_id: targetPet.owner_id,
        pet_a_id: yourPetIds[0],
        pet_b_id: targetPetId
      })
      return { success: true, isMatch: true }
    }
  }

  return { success: true, isMatch: false }
}