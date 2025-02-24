import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export const GET = async () => {
    const { userId } = await auth();
    if(!userId) {
        return redirect("/sign-in");
    }
    const [existingUser] = await db.select().from(users).where(eq(users.clerkId, userId));
    if(!existingUser) {
        return redirect("/sign-up");
    }
    return redirect(`/users/${existingUser.id}`);
}