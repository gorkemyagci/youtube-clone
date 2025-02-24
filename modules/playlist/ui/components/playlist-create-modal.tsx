"use client";
import { ResponsiveModal } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface PlaylistCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const PlaylistCreateModal = ({ open, onOpenChange }: PlaylistCreateModalProps) => {

    const formSchema = z.object({
        name: z.string().min(1)
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    const utils = trpc.useUtils();
    const createPlaylist = trpc.playlists.create.useMutation({
        onSuccess: () => {
            utils.playlists.getMany.invalidate();
            toast.success("Playlist created");
            form.reset();
            onOpenChange(false);
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        createPlaylist.mutate({
            name: values.name,
        })
    }
    return (
        <ResponsiveModal title="Create Playlist" open={open} onOpenChange={onOpenChange}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter a name for your playlist"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={createPlaylist.isPending}>
                            Create
                        </Button>
                    </div>
                </form>
            </Form>
        </ResponsiveModal>
    )
}
