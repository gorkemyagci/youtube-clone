import FormSection from "../sections/form-section";

const VideoView = ({ videoId }: { videoId: string }) => {
    return (
        <div className="px-4 pt-2.5 max-w-screen-xl mx-auto">
            <FormSection videoId={videoId} />
        </div>
    )
}

export default VideoView;