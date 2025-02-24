"use client"
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PlaylistCreateModal } from "../components/playlist-create-modal";
import { useState } from "react";
import PlaylistsSection from "../sections/playlists-section";

export default function PlaylistView() {
    const [open, setOpen] = useState(false);
    return <div className="max-w-screen-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
        <PlaylistCreateModal
            open={open}
            onOpenChange={setOpen}
        />
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold">
                    Playlist
                </h1>
                <p className="text-sm text-muted-foreground">
                    Playlist you have created
                </p>
            </div>
            <Button
                variant="outline"
                size="icon"
                type="button"
                className="rounded-full"
                onClick={() => setOpen(true)}
            >
                <PlusIcon />
            </Button>
        </div>
        <PlaylistsSection />
    </div>;
}   