import { ResponsiveModal } from "@/components/responsive-dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

interface BannerUploadModalProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const BannerUploadModal = ({ userId, open, onOpenChange }: BannerUploadModalProps) => {
    const utils = trpc.useUtils();
    const onUploadComplete = () => {
        utils.users.getOne.invalidate({ id: userId });
        onOpenChange(false);

    }
    return (
        <ResponsiveModal title="Upload Thumbnail" open={open} onOpenChange={onOpenChange}>
            <UploadDropzone
                endpoint="bannerUploader"
                onClientUploadComplete={onUploadComplete}
            />
        </ResponsiveModal>
    )
}
