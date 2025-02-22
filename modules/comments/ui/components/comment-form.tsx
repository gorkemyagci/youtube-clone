import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/user-avatar";
import { useUser } from "@clerk/nextjs";

interface CommentFormProps {
    videoId: string;
    onSuccess?: () => void;
}

export const CommentForm = ({ videoId, onSuccess }: CommentFormProps) => {
    const { user } = useUser();
    return (
        <form className="flex gap-4 group">
            <UserAvatar size="lg" imageUrl={user?.imageUrl || "/assets/avatar-placeholder.png"} name={user?.username || ""} />
            <div className="flex-1">
                <div>
                    <Textarea
                        placeholder="Add a comment..."
                        className="resize-none bg-transparent overflow-hidden min-h-0"
                    />
                </div>
                <div className="justify-end gap-2 mt-2 flex">
                    <Button type="submit" size="sm">
                        Comment
                    </Button>
                </div>
            </div>
        </form>
    )
}