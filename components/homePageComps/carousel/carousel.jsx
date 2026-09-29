'use client'
import { getCoverUrl, getDesc, getENTitle } from "@/utils/dataManipulation/manga";
import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";

import popTitlesSkeleton from "@/skeletonData/popTitlesSkeleton";
import { contentRatingArray } from "@/utils/miscFuncs";
import noDesc from '@/public/images/noDesc.png';
import { usePreferences } from '@/components/navbarComps/preferencesProvider';


const Carousel = () => {
    const [mangas, setMangas] = useState(popTitlesSkeleton);
    const [curPage, setCurPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const {contentPrefs, preferencesReady} = usePreferences();

    useEffect(() => {
        if (!preferencesReady) return;

        const controller = new AbortController();

        const fetchManga = async () => {
            setLoading(true);
            setError('');
            setMangas(popTitlesSkeleton);
            setCurPage(0);

            try {
                const query = new URLSearchParams({
                    contentRating: JSON.stringify(contentRatingArray(contentPrefs))
                });
                const res = await fetch(`/api/getTopTitles?${query}`, {
                    signal: controller.signal
                });

                if (!res.ok) throw new Error('Could not load titles.');

                const data = await res.json();

                if (!Array.isArray(data.data)) throw new Error('Invalid title response.');
                if (controller.signal.aborted) return;

                setMangas(data.data);
                setCurPage(0);
            } catch (error) {
                if (!controller.signal.aborted) {
                    setError('Could not load titles. Try changing your preferences again.');
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchManga();
        return () => controller.abort();
    }, [contentPrefs, preferencesReady]);

    useEffect(() => {
        if (loading || mangas.length === 0) return;

        const inter = setInterval(() => {
            setCurPage(idx => {
                if (mangas.length > idx + 1) {
                    return idx + 1
                } else {
                    return 0
                }
            })
        }, 10000);

        return () => {
            clearInterval(inter);
        }
    }, [curPage, mangas.length, loading]);
    
    const genTiles = () => {
        let tiles = [];

        for (let idx = 0; idx < mangas.length; idx++) {
            const isSelected = idx === curPage;

            tiles.push(
                <li
                    key={idx}
                    className={`relative mx-1 min-w-0 flex-1 bg-rose-200 transition-transform duration-300 ease-out motion-reduce:transition-none ${isSelected ? 'z-10 scale-105' : 'scale-100'}`}
                    style={{height: '17rem'}}
                >
                    <button
                        type="button"
                        onClick={() => setCurPage(idx)}
                        aria-label={`Show ${getENTitle(mangas[idx]) || 'manga preview'}`}
                        aria-pressed={isSelected}
                        className={`h-full w-full transition-opacity duration-300 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:-outline-offset-4 ${isSelected ? 'opacity-100' : 'opacity-40'} ${loading ? 'animate-pulse' : ''}`}
                    >
                        <Image
                            src={getCoverUrl(mangas[idx])}
                            width={720}
                            height={1280}
                            alt="manga cover"
                            className="w-full h-full object-cover"
                        />
                    </button>
                </li>
            );
        }

        return tiles
    }

    if (error || mangas.length === 0) {
        return (
            <div className="mt-24 p-6 font-robotoCondensed" role="status">
                {error || 'No titles match your content preferences.'}
            </div>
        );
    }

    return (
        <>
            <ol className="w-full h-1/4 py-2 flex overflow-hidden">
                
                {
                    genTiles()
                }    
            </ol>
            <h1 className="font-sigmarOne -mt-14 text-xl sm:text-2xl z-10 bg-gray-800 rounded-t-lg px-4 py-2">
                Up and Coming
            </h1>
            <article className="w-11/12 sm:w-4/5 max-w-5xl h-44 p-4 bg-gray-800 z-10 rounded-xl shadow-lg flex flex-col">
                <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-rose-500/40">
                    <Link
                        href={`/manga/${mangas[curPage].id}`}
                        className="min-w-0 flex-1"
                    >
                        <h3
                            className="font-sigmarOne text-rose-500 truncate"
                            title={getENTitle(mangas[curPage])}
                        >
                            {getENTitle(mangas[curPage])}
                        </h3>
                    </Link>
                    <Link
                        href={`/manga/${mangas[curPage].id}`}
                        className="hidden sm:block shrink-0 font-robotoCondensed text-sm text-emerald-400 hover:underline"
                    >
                        Go To Manga →
                    </Link>
                </div>

                {getDesc(mangas[curPage]) !== -1 ?
                <section className="font-robotoCondensed overflow-y-auto pr-2 leading-relaxed text-gray-200">
                    {getDesc(mangas[curPage])}
                </section> :
                <section className="font-robotoCondensed overflow-y-hidden flex justify-between items-center text-xl" >
                    (no desc) Oh no! the description! Letter Get it!
                    <Image
                        src={noDesc}
                        alt="Letter trying her best"
                        height="260"
                        className="rounded-full object-scale-down"
                        style={{imageRendering: "crisp-edges"}}
                        />
                </section>
                }

                {/* will need to update the desc box to accept markdown */}
            </article>
        </>
    );
};

export default Carousel;
