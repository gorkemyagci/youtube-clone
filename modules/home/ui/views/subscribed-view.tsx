import SubscribedVideosSection from "../sections/subscribed-videos-section";

export default function TrendingView() {
    return <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
        <div>
            <h1 className="text-2xl font-bold">
                Subscribed
            </h1>
            <p className="text-sm text-muted-foreground">
                Videos from the channels you follow
            </p>
        </div>
        <SubscribedVideosSection />
    </div>;
}   