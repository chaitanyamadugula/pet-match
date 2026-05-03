// import Image from "next/image";
// import { supabase } from "@/lib/supabase";
// import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
// import { auth } from "@clerk/nextjs/server";

// const templateUrl = "https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app";
// const learningUrl = "https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app";
// const deployUrl = "https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app";
// const docsUrl = "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app";

// export default async function Home() {
//   const { userId } = await auth();
//   const { data: pets } = await supabase.from("pets").select("*");

//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

//         <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={100} height={20} priority />

//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             PetMatch
//           </h1>

//           {userId ? (
//             <div className="flex flex-col gap-4">
//               <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">Welcome! You are logged in.</p>
//               <UserButton />
//             </div>
//           ) : (
//             <div className="flex flex-col gap-4">
//               <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//                 Looking for a starting point? Head over to{" "}
//                 <a href={templateUrl} className="font-medium text-zinc-950 dark:text-zinc-50">Templates</a>
//                 {" "}or the{" "}
//                 <a href={learningUrl} className="font-medium text-zinc-950 dark:text-zinc-50">Learning</a>
//                 {" "}center.
//               </p>
//               <div className="flex gap-4">
//                 <SignInButton mode="modal">
//                   <button className="bg-blue-600 text-white px-4 py-2 rounded">Sign In</button>
//                 </SignInButton>
//                 <SignUpButton mode="modal">
//                   <button className="bg-green-600 text-white px-4 py-2 rounded">Sign Up</button>
//                 </SignUpButton>
//               </div>
//             </div>
//           )}

//           {pets && pets.length > 0 && (
//             <div className="mt-4 p-4 bg-white rounded shadow">
//               <p className="font-semibold">Test Pets in DB:</p>
//               {pets.map((pet) => (
//                 <p key={pet.id}>🐶 {pet.name} ({pet.species})</p>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-zinc-700 md:w-[158px]">
//             <Image className="dark:invert" src="/vercel.svg" alt="Vercel logomark" width={16} height={16} />
//             Deploy Now
//           </a>
//           <a href={docsUrl} target="_blank" rel="noopener noreferrer" className="flex h-12 w-full items-center justify-center rounded-full border border-black/10 px-5 transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10 md:w-[158px]">
//             Documentation
//           </a>
//         </div>

//       </main>
//     </div>
//   );
// }

import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const templateUrl = "https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app";
const learningUrl = "https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app";
const deployUrl = "https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app";
const docsUrl = "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app";

export default async function Home() {
  const { userId } = await auth();
  const { data: pets } = await supabase.from("pets").select("*");

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

        <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={100} height={20} priority />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            PetMatch
          </h1>

          {userId ? (
            <div className="flex flex-col gap-4">
              <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">Welcome! You are logged in.</p>
              <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded text-lg text-center">
                Go to Dashboard
              </Link>
              <UserButton />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                Looking for a starting point? Head over to{" "}
                <a href={templateUrl} className="font-medium text-zinc-950 dark:text-zinc-50">Templates</a>
                {" "}or the{" "}
                <a href={learningUrl} className="font-medium text-zinc-950 dark:text-zinc-50">Learning</a>
                {" "}center.
              </p>
              <div className="flex gap-4">
                <SignInButton mode="modal">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-green-600 text-white px-4 py-2 rounded">Sign Up</button>
                </SignUpButton>
              </div>
            </div>
          )}

          {pets && pets.length > 0 && (
            <div className="mt-4 p-4 bg-white rounded shadow">
              <p className="font-semibold">Test Pets in DB:</p>
              {pets.map((pet) => (
                <p key={pet.id}>🐶 {pet.name} ({pet.species})</p>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-zinc-700 md:w-[158px]">
            <Image className="dark:invert" src="/vercel.svg" alt="Vercel logomark" width={16} height={16} />
            Deploy Now
          </a>
          <a href={docsUrl} target="_blank" rel="noopener noreferrer" className="flex h-12 w-full items-center justify-center rounded-full border border-black/10 px-5 transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10 md:w-[158px]">
            Documentation
          </a>
        </div>

      </main>
    </div>
  );
}