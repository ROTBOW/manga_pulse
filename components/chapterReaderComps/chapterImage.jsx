import { useEffect, useState } from "react";

const retryDelays = [1000, 2000, 4000];

// The reader keys this component by page so each image gets its own retry budget.
const ChapterImage = ({ src, chapterId, pageNumber, onLoad, onError }) => {
    const [retryCount, setRetryCount] = useState(0);
    const [hasFailed, setHasFailed] = useState(false);
    const [imageSrc, setImageSrc] = useState(src);

    useEffect(() => {
        if (!hasFailed || retryCount >= retryDelays.length) return;

        const controller = new AbortController();
        const timeout = setTimeout(async () => {
            try {
                // Delivery URLs can expire or point to an unhealthy server.
                const response = await fetch(`/api/getChapterPages/${chapterId}`, {
                    cache: 'no-store',
                    signal: controller.signal
                });

                if (!response.ok) throw new Error('Could not refresh image delivery metadata.');

                const imageData = await response.json();
                if (controller.signal.aborted) return;

                const fileName = imageData.chapter?.data?.[pageNumber - 1];

                if (imageData.baseUrl && imageData.chapter?.hash && fileName) {
                    setImageSrc(`${imageData.baseUrl}/data/${imageData.chapter.hash}/${fileName}`);
                }
            } catch {
                // If metadata is unavailable, retry the last known image URL.
            }

            if (controller.signal.aborted) return;

            setHasFailed(false);
            setRetryCount(count => count + 1);
        }, retryDelays[retryCount]);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [hasFailed, retryCount, chapterId, pageNumber]);

    const handleError = () => {
        setHasFailed(true);

        if (retryCount >= retryDelays.length) {
            onError();
        }
    };

    if (hasFailed && retryCount >= retryDelays.length) {
        return <p role="alert">Could not load page {pageNumber} after three retries.</p>;
    }

    return (
        <img
            key={retryCount}
            src={imageSrc}
            referrerPolicy="no-referrer"
            width="1000"
            height="1500"
            alt={`Chapter page ${pageNumber}`}
            className="h-screen w-auto"
            onLoad={onLoad}
            onError={handleError}
        />
    );
};

export default ChapterImage;
