'use server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getMessages(matchId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Not logged in')

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function sendMessage(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('Not logged in')

  const matchId = formData.get('matchId') as string
  const content = formData.get('content') as string

  if (!matchId || !content.trim()) throw new Error('Missing data')

  const { error } = await supabase.from('messages').insert({
    match_id: matchId,
    sender_id: userId,
    content: content.trim()
  })

  if (error) throw new Error(error.message)
  return { success: true }
}