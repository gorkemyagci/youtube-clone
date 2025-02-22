import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils";


interface SubscribeButtonProps {
    onClick: ButtonProps["onClick"];
    disabled: boolean;
    isSubscribed: boolean;
    className?: string;
    size?: ButtonProps["size"];
}

const SubscribeButton = ({
    onClick,
    disabled,
    isSubscribed,
    className,
    size
}: SubscribeButtonProps) => {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            className={cn("rounded-full", className)}
            size={size}
            variant={isSubscribed ? "secondary" : "default"}
        >
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </Button>
    )
}

export default SubscribeButton;