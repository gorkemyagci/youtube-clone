import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import SearchInput from "./search-input";
import AuthButton from "@/modules/auth/ui/components/auth-button";

const HomeNavbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50">
            <div className="flex items-center gap-4 w-full">
                <div className="flex items-center flex-shrink-0">
                    <SidebarTrigger />
                    <Link prefetch  href="/" className="hidden md:block">
                        <div className="flex items-center p-4 gap-1">
                            <Image src="/assets/logo.png" alt="Logo" width={32} height={32} />
                            <p className="text-xl font-semibold tracking-tight">YouTube</p>
                        </div>
                    </Link>
                </div>

                <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
                    <SearchInput />
                </div>

                <div className="flex-shrink-0 items-center flex gap-4">
                    <AuthButton />
                </div>

            </div>
        </nav>
    )
}

export default HomeNavbar;