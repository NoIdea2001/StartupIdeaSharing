import Link from "next/link"
import Image from "next/image"
import { auth,signIn, signOut } from "@/auth"


const Navbar = async () => {
    const session = await auth()
  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
        <nav className="flex justify-between items-center">
            <Link href="/">
                <Image src="/logo.png" alt="logonxt" width={144} height={30}></Image>
            </Link>
            <div className="flex items-center  gap-5 text-black">
                {session && session?.user ? (
                    <>
                        <Link href="/startup/create">
                            <span>Create</span>
                        </Link>
                        <form action={async()=>{
                            "use server";
                            await signOut()}}>
                            <button type="submit">
                                <span>Logout</span>
                            </button>
                        </form>

                        <Link href={`/user/${session?.user?.name}`}>
                            <span>{session?.user?.name}</span>
                        </Link>
                    </>
                ):(
                    <form action={
                        async()=>{
                            "use server";
                            await signIn('github');
                            }}>
                        <button type="submit">
                            <span>Login</span>
                        </button>
                    </form>
                )}
            </div>
        </nav>
    </header>
  )
}

export default Navbar