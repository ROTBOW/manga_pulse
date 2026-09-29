'use client'
import { getChapterCoverUrl, getChapterScansGroup, getMangaUID } from "@/utils/dataManipulation/chapter";
import { contentRatingArray, timeSince } from "@/utils/miscFuncs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import latestChaptersSkeleton from "@/skeletonData/latestChaptersSkeleton";
import { usePreferences } from "@/components/navbarComps/preferencesProvider";


const LateChapItem = ({chapter}) => {

    if (chapter === undefined) return <></>

    return (
        <li className="flex p-2 w-full rounded-md font-robotoCondensed items-center transition-colors hover:bg-gray-700/50">
            <Link
                href={`/manga/${getMangaUID(chapter)}`}
                className="shrink-0 w-14 h-20 mr-3 bg-rose-700 rounded-md overflow-hidden"
            >
                <Image 
                    src={getChapterCoverUrl(chapter)} 
                    width="56" 
                    height="80"
                    alt={`${chapter.title}'s Thumbnail`}
                    className="w-14 h-full object-cover object-center rounded-sm"
                />
            </Link>
            <div className="min-w-0 flex-1">
                <Link
                    href={`/manga/${getMangaUID(chapter)}`}
                    className="w-full block hover:text-rose-400"
                >
                    <h4 className="truncate w-full" title={chapter.title}>
                        {chapter.title}
                    </h4>
                </Link>
                <p className="text-sm truncate w-full text-emerald-400">{
                `
                ${chapter.attributes.volume ? "Vol. " + chapter.attributes.volume +' ' : ''}
                ${chapter.attributes.chapter ? "Ch. " + chapter.attributes.chapter +' ' : ''}
                ${chapter.attributes.title ? '- '+chapter.attributes.title : ''}
                `}</p>
                {/* need to add a link to the chapter directly from above */}

                <div className="flex justify-between gap-2 w-full text-xs items-end">
                    <div className="text-rose-500 truncate w-1/2 mt-3">SG: {getChapterScansGroup(chapter)}</div>
                    <div className="w-1/2 text-end text-nowrap">{timeSince(chapter.attributes.updatedAt)}</div>
                </div>
            </div>
        </li>
    )
}


const LatestChapters = () => {
    const [chapters, setChapters] = useState(latestChaptersSkeleton);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');
    const {contentPrefs, langs, preferencesReady} = usePreferences();

    useEffect(() => {
        if (!preferencesReady) return;

        const controller = new AbortController();

        const fetchChapters = async () => {
            setLoading(true);
            setError('');
            setChapters(latestChaptersSkeleton);

            try {
                const query = new URLSearchParams({
                    contentRating: JSON.stringify(contentRatingArray(contentPrefs)),
                    langs: JSON.stringify(langs)
                });
                const res = await fetch(`/api/getLatestChapters?${query}`, {
                    signal: controller.signal
                });

                if (!res.ok) throw new Error('Could not load chapters.');

                const data = await res.json();

                if (!Array.isArray(data)) throw new Error('Invalid chapter response.');
                if (controller.signal.aborted) return;

                setChapters(data);
            } catch (error) {
                if (!controller.signal.aborted) {
                    setChapters([]);
                    setError('Could not load chapters. Try changing your preferences again.');
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchChapters();

        return () => controller.abort();
    }, [contentPrefs, langs, preferencesReady]);

    const getXtoYChapters = (x, y) => {
        let olItems = [];
        for (let idx = x; idx <= y; idx++) {
            olItems.push(
                <LateChapItem
                    key={idx}
                    chapter={chapters[idx]}
                />
            )
        }
        return olItems;
    }

    const olClass = `min-w-0 bg-gray-800 p-1 rounded-lg ${loading ? 'animate-pulse' : ''}`;

    return (
        <div className="flex flex-col items-center mt-14 w-11/12 sm:w-4/5 max-w-7xl">
            <h2 className="w-full font-sigmarOne text-rose-500 text-2xl">Latest Chapters</h2>
            {!loading && (error || chapters.length === 0) && (
                <p className="mt-4 font-robotoCondensed" role="status">
                    {error || 'No chapters match your preferences.'}
                </p>
            )}
            <section className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <ol className={olClass}>
                    {
                        getXtoYChapters(0, 5)
                    }
                </ol>

                <ol className={`${olClass} hidden md:block`}>
                    {
                        getXtoYChapters(6, 11)
                    }
                </ol>

                <ol className={`${olClass} hidden lg:block`}>
                    {
                        getXtoYChapters(12, 17)
                    }
                </ol>
                
                <ol className={`${olClass} hidden xl:block`}>
                    {
                        getXtoYChapters(18, 23)
                    }
                </ol>

            </section>
        </div>
    )

};


export default LatestChapters;
