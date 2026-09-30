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
    const [isPaused, setIsPaused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [hasFocus, setHasFocus] = useState(false);
    const { contentPrefs, preferencesReady } = usePreferences();

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
        if (loading || mangas.length === 0 || isPaused || isHovered) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
    }, [curPage, mangas.length, loading, isPaused, isHovered, hasFocus]);

    const changePage = (direction) => {
        setCurPage(idx => (idx + direction + mangas.length) % mangas.length);
    };

    const genTiles = () => {
        let tiles = [];

        for (let idx = 0; idx < mangas.length; idx++) {
            const manga = mangas[idx];
            const isSelected = idx === curPage;

            tiles.push(
                <li
                    key={manga.id}
                    className={`relative min-w-0 flex-1 transition-transform duration-300 ease-out motion-reduce:transition-none ${isSelected ? 'z-10 -translate-y-2' : 'scale-100'}`}
                >
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => setCurPage(idx)}
                        aria-label={`Show ${getENTitle(manga) || 'manga preview'}`}
                        aria-pressed={isSelected}
                        className={`relative h-full w-full overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:-outline-offset-4 motion-reduce:transition-none ${isSelected ? 'opacity-100 ring-2 ring-rose-400 shadow-xl shadow-rose-950/40' : 'opacity-45 hover:-translate-y-1'} ${loading ? 'animate-pulse motion-reduce:animate-none' : ''}`}
                    >
                        <Image
                            src={getCoverUrl(manga)}
                            width={720}
                            height={1280}
                            alt={loading ? '' : `${getENTitle(manga)} cover`}
                            className="w-full h-full object-cover"
                        />
                        <span className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent" aria-hidden="true" />
                        {!loading && (
                            <span className={`absolute bottom-15 left-1/2 -translate-x-1/2 rounded-full px-2 py-1 font-robotoCondensed text-xs sm:bottom-16 bg-rose-500 text-white transition duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
                                {String(idx + 1).padStart(2, '0')}
                            </span>
                        )}
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

    const selectedManga = mangas[curPage];
    const selectedTitle = getENTitle(selectedManga);
    const description = getDesc(selectedManga);
    const genres = (selectedManga.attributes.tags || [])
        .filter(tag => tag.attributes.group === 'genre')
        .slice(0, 3);

    return (
        <section
            aria-labelledby="up-and-coming-heading"
            aria-busy={loading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setHasFocus(true)}
            onBlur={event => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setHasFocus(false);
                }
            }}
            className="isolate flex w-full flex-col items-center"
        >
            <ol className="flex h-64 w-full gap-1.5 overflow-hidden px-2 pt-4 sm:h-72 sm:gap-3 sm:px-4">
                {genTiles()}
            </ol>
            <h1
                id="up-and-coming-heading"
                className="relative z-10 -mt-16 rounded-t-2xl border-t border-rose-400/30 bg-gray-800 px-5 py-3 font-sigmarOne text-xl sm:px-8 sm:text-2xl"
            >
                Up and Coming
            </h1>
            <article className="relative z-10 flex w-11/12 max-w-5xl flex-col rounded-2xl border border-gray-700/70 bg-gray-800 p-4 shadow-xl sm:w-4/5 sm:p-6">
                <div className="mb-1 flex items-center justify-end gap-3 font-robotoCondensed text-xs">
                    <div className="flex shrink-0 items-center gap-1">
                        <span className="mr-2 tabular-nums text-gray-400">{loading ? '—' : String(curPage + 1).padStart(2, '0')} / {String(mangas.length).padStart(2, '0')}</span>
                        <button
                            type="button"
                            onClick={() => changePage(-1)}
                            disabled={loading}
                            aria-label="Previous manga"
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-600 text-lg hover:border-rose-400 hover:text-rose-400 focus-visible:outline-2 focus-visible:outline-emerald-400"
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsPaused(value => !value)}
                            disabled={loading}
                            aria-label={isPaused ? 'Resume automatic rotation' : 'Pause automatic rotation'}
                            aria-pressed={isPaused}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-600 hover:border-rose-400 hover:text-rose-400 focus-visible:outline-2 focus-visible:outline-emerald-400"
                        >
                            {isPaused ? '▶' : '❚❚'}
                        </button>
                        <button
                            type="button"
                            onClick={() => changePage(1)}
                            disabled={loading}
                            aria-label="Next manga"
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-600 text-lg hover:border-rose-400 hover:text-rose-400 focus-visible:outline-2 focus-visible:outline-emerald-400"
                        >
                            ›
                        </button>
                    </div>
                </div>
                {loading ? (
                    <div className="h-40 animate-pulse space-y-4 motion-reduce:animate-none" role="status">
                        <span className="sr-only">Loading up and coming manga...</span>
                        <div className="h-6 w-2/3 rounded bg-gray-700" />
                        <div className="h-3 w-full rounded bg-gray-700" />
                        <div className="h-3 w-5/6 rounded bg-gray-700" />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-rose-500/25">
                            <Link
                                href={`/manga/${selectedManga.id}`}
                                className="min-w-0 flex-1 rounded focus-visible:outline-2 focus-visible:outline-emerald-400"
                            >
                                <h3
                                    className="font-sigmarOne text-rose-400 line-clamp-2 text-base sm:text-lg hover:text-rose-500"
                                    title={selectedTitle}
                                >
                                    {selectedTitle}
                                </h3>
                            </Link>
                        </div>

                        {description !== -1 && description.trim() ? (
                            <section
                                key={selectedManga.id}
                                tabIndex={0}
                                aria-label="Manga description"
                                className="h-24 font-robotoCondensed overflow-y-auto pr-3 text-sm sm:text-base leading-relaxed text-gray-200 focus-visible:outline-2 focus-visible:outline-emerald-400"
                            >
                                {description}
                            </section>
                        ) : (
                            <section className="h-24 gap-3 font-robotoCondensed overflow-y-hidden flex justify-between items-center text-sm sm:text-base">
                                (no desc) Oh no! the description! Letter Get it!
                                <Image
                                    src={noDesc}
                                    alt="Letter trying her best"
                                    height="260"
                                    className="h-24 w-24 rounded-full object-scale-down"
                                    style={{ imageRendering: "crisp-edges" }}
                                />
                            </section>
                        )}

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap gap-2 font-robotoCondensed text-xs text-gray-300">
                                {genres.map(tag => (
                                    <span key={tag.id} className="rounded-full border border-gray-600/70 px-2.5 py-1">
                                        {tag.attributes.name.en}
                                    </span>
                                ))}
                            </div>
                            <Link
                                href={`/manga/${selectedManga.id}`}
                                className="shrink-0 rounded-lg bg-emerald-400/10 px-3 py-2 font-robotoCondensed text-sm text-emerald-400 transition-colors hover:bg-emerald-400/20 focus-visible:outline-2 focus-visible:outline-emerald-400"
                            >
                                Explore manga <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </>
                )}

                {/* will need to update the desc box to accept markdown */}
            </article>
        </section>
    );
};

export default Carousel;
