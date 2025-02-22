import Link from "next/link";
import { VideoGetOneOutput } from "../../types";
import UserAvatar from "@/components/user-avatar";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import SubscribeButton from "@/modules/subscriptions/ui/components/subscription-button";
import UserInfo from "@/modules/users/ui/components/user-info";

interface VideoOwnerProps {
    user: VideoGetOneOutput["user"];
    videoId: string;
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
    const { userId: clerkUserId } = useAuth();
    return (
        <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
            <Link href={`/users/${user.id}`}>
                <div className="flex items-center gap-2 min-w-0">
                    <UserAvatar
                        name={user.name}
                        imageUrl={user.imageUrl}
                        size="lg"
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                        <UserInfo
                            name={user.name}
                            size="lg"
                        />
                        <span className="text-sm text-muted-foreground line-clamp-1">
                            {0} subscribers
                        </span>
                    </div>
                </div>
            </Link>
            {clerkUserId === user.clerkId ? (
                <Button variant="secondary" className="rounded-full" asChild>
                    <Link href={`/studio/videos/${videoId}`}>
                        Edit video</Link>
                </Button>
            ) : (
                <SubscribeButton
                    onClick={() => { }}
                    disabled={false}
                    isSubscribed={false}
                    className="rounded-full"
                    size="sm"
                />
            )}
        </div>
    )
}