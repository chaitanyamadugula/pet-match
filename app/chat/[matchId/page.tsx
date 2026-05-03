import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getMessages, sendMessage } from '@/app/actions/chat'

// Next.js 15/16: params is now a Promise
export default async function ChatPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params
  const { userId } = await auth()
  
  if (!userId) redirect('/')

  const messages = await getMessages(matchId)

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">💬 Chat</h1>
      
      <div className="bg-gray-50 p-4 rounded h-96 overflow-y-auto mb-4 space-y-3">
        {messages?.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender_id === userId ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {(!messages || messages.length === 0) && (
          <p className="text-gray-400 text-center mt-8">Say hello! 👋</p>
        )}
      </div>

      <form action={sendMessage} className="flex gap-2">
        <input type="hidden" name="matchId" value={matchId} />
        <input name="content" placeholder="Type a message..." className="flex-1 border p-3 rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-6 rounded hover:bg-blue-700">Send</button>
      </form>
    </main>
  )
}