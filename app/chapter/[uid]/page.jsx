'use client'

import ChapterDetailsBar from "@/components/chapterReaderComps/chapterDetailsBar/chapterDetailsBar";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loadingSpinner/loadingSpinner";
import { getChapterNumber, getMangaUID } from "@/utils/dataManipulation/chapter";
import Navbar from "@/components/navbarComps/navbar/navbar";
import { useEffect, useState } from "react";
import { LANGPREFS } from "@/utils/enums";
import { useReaderMenu } from "@/components/chapterReaderComps/readerMenuProvider";
import { getResumePage, saveReadProgress } from "@/utils/readHistory.mjs";



/**
 * The function `chapterOffsetClamp` takes a chapter number as input and returns the offset value by
 * rounding down to the nearest hundred.
 * @returns The function `chapterOffsetClamp` returns the offset value calculated based on the input
 * chapter number.
 */
const chapterOffsetClamp = (chapNumber) => {
    const number = Number(chapNumber);
    const offset = Math.floor(number / 100) * 100;
    return offset;
}


const Reader = () => {
    // next nav consts
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    // reader state slices
    /// data slices
    const [ imageData, setImageData ] = useState(null);
    const [ chapterData, setChapterData ] = useState(null);
    const [ feedData, setFeedData ] = useState(null);
    const [ pages, setPages ] = useState([]);
    
    /// page control/ui slice
    const [ hideSpinner, setHideSpinner ] = useState(false);
    const {showMenu, showMenuPreview, toggleMenu} = useReaderMenu();
    const [ idx, setIdx ] = useState(0);
    const [readerError, setReaderError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        const pageParams = new URLSearchParams(window.location.search);

        setPages([]);
        setImageData(null);
        setChapterData(null);
        setFeedData(null);
        setHideSpinner(false);
        setReaderError('');
        document.getElementById('rdr')?.scrollIntoView({behavior: 'smooth'});

        const fetchData = async () => {
            try {
                const responses = await Promise.all([
                    fetch(`/api/getChapterPages/${params.uid}`, {signal: controller.signal}),
                    fetch(`/api/getChapterData/${params.uid}`, {signal: controller.signal})
                ]);

                if (responses.some(response => !response.ok)) {
                    throw new Error('Could not load the chapter.');
                }

                const [imageData, chapterResponse] = await Promise.all(
                    responses.map(response => response.json())
                );
                if (controller.signal.aborted) return;

                const chapterData = chapterResponse.data;
                const pageFiles = imageData.chapter?.data;

                if (!chapterData || !Array.isArray(pageFiles) || pageFiles.length === 0) {
                    throw new Error('This chapter has no readable pages.');
                }

                const resumePage = getResumePage(params.uid, pageParams.get('page'), pageFiles.length);
                const pageUrls = pageFiles.map(fileName => {
                    return `${imageData.baseUrl}/data/${imageData.chapter.hash}/${fileName}`;
                });

                // Metadata and resume position are ready before any page can report a load.
                setIdx(resumePage);
                setChapterData(chapterData);
                setImageData(imageData);
                setPages(pageUrls);
                pageParams.set('page', resumePage);
                router.replace(`?${pageParams.toString()}`, {scroll: false});

                let langs = '[]';

                try {
                    langs = localStorage.getItem(LANGPREFS) || '[]';
                } catch {
                    // Reading remains available when browser storage is blocked.
                }

                const query = new URLSearchParams({
                    uid: getMangaUID(chapterData),
                    order: 'asc',
                    langs,
                    offset: chapterOffsetClamp(getChapterNumber(chapterData))
                });
                const resFeed = await fetch(`/api/getMangaFeed?${query}`, {
                    signal: controller.signal
                });

                if (resFeed.ok) {
                    const feed = await resFeed.json();
                    if (!controller.signal.aborted) setFeedData(feed.data);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    setReaderError(error.message);
                    setHideSpinner(true);
                }
            }
        };

        fetchData();

        // Strict Mode, Back, and chapter changes must not leave old loads running.
        return () => controller.abort();
    }, [params.uid, router]);

    /**
     * Navigates to the next or previous chapter based on the provided direction.
     * If no direction is specified, it defaults to moving forward (next chapter).
     * Handles boundary conditions when reaching the first or last chapters.
     * @param {number} direction - The navigation direction; 1 for next, -1 for previous. Defaults to 1.
     */
    const nextPage = ( direction = 1 ) => {
        return () => {
            if (!chapterData || pages.length === 0) return;

            const param = new URLSearchParams(searchParams);
            const num = Number(idx);
            
            // check if we've gone off the page count
            if ((num+direction) <= -1 || num+direction >= chapterData.attributes.pages)  {                
                router.push(genNextURL( (direction > 0) ? true : false ))
                return;
            }

            param.set('page', num+direction);

            router.replace(`?${param.toString()}`, {scroll: false})

            // set the new idx - thus changing the page and trigger the spinner again for loading
            saveReadProgress(params.uid, getMangaUID(chapterData), num + direction);
            setIdx(num+direction);
            setHideSpinner(false);
        }
    }

    /**
     * The `goToPage` function updates the URL query parameter 'page' with a new index value and
     * replaces the current URL without scrolling.
     */
    const goToPage = (idx) => {
        if (!chapterData || !pages[idx]) return;

        saveReadProgress(params.uid, getMangaUID(chapterData), idx);
        const param = new URLSearchParams(searchParams);
        param.set('page', idx);
        router.replace(`?${param.toString()}`, {scroll: false})

        // set the new idx - thus changing the page and trigger the spinner again for loading
        setIdx(idx);
        setHideSpinner(false);
    }

    /**
     * The function `genNextURL` generates the URL for the next or previous chapter of a manga based on the
     * direction provided, considering the feed data and current chapter ID.
     * @returns The `genNextURL` function returns a URL string that either points to the next chapter in a
     * manga series or redirects to the manga showpage if there is only one chapter or if the current
     * chapter is the last one.
     */
    const genNextURL = (direction = true) => {
        if (feedData === null) return '#'; // if the feed isn't loaded we do nothing

        console.log(feedData);
        

        // // based on direction we change the order that we loop over the chapters
        // // thus, changing if the gen-ed url will go to the next or prev chapter
        // const feed = (direction === true) ? feedData : [...feedData].reverse();

        // // this will gen the url for the next chapter - or redirect to the manga showpage
        // // if there is only one chapter / we're on the last chapter
        // for (let i = 1; i < feed.length; i++) {
        //     if (feed[i-1].id === params.uid) {
        //         return `/chapter/${feed[i].id}${ (direction === false) ? `?page=${feed[i].attributes.pages-1}` : ''}`
                
        //     }
        // }

        // case for a manga with only one chapter or at end of chapters
        return `/manga/${getMangaUID(chapterData)}`
    }

    /**
     * 
     * builds the page idx tiles that populate the bottom chap nav
     * 
     * @returns array tiles
     */
    const genPageIdxTiles = () => {
        let tiles = new Array();
        let pageCount = imageData.chapter.data.length;

        for (let i = 0; i < pageCount; i++) {
            const isCurrentPage = Number(idx) === i;
            const tileColor = isCurrentPage ? 'bg-rose-500' : (
                Number(idx) >= i ? 'bg-rose-700' : 'bg-rose-700/40'
            );

            tiles.push(
                <li
                    key={i}
                    className="h-full min-w-0 flex-1 group-hover:min-w-8 group-focus-within:min-w-8"
                >
                    <button
                        type="button"
                        onClick={() => goToPage(i)}
                        aria-label={`Go to page ${i + 1}`}
                        aria-current={isCurrentPage ? 'page' : undefined}
                        title={`Page ${i + 1}`}
                        className={`h-full w-full rounded-sm text-white font-robotoCondensed text-sm transition-colors hover:bg-rose-400 focus-visible:bg-rose-400 focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:-outline-offset-2 ${tileColor}`}
                    >
                        <span className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity motion-reduce:transition-none">
                            {i + 1}
                        </span>
                    </button>
                </li>
            )
        }

        return tiles;
    }

    return (
        <div className="flex flex-col items-center">
            <Navbar displayType='block'/>
            <ChapterDetailsBar chapterData={chapterData} feedData={feedData} prevUrl={genNextURL(false)} nextUrl={genNextURL()}/>

            <div id="rdr" className="w-full h-screen flex flex-col items-center">
                <div className="absolute w-full flex justify-between">
                    <div className={`${showMenu ? '' : 'opacity-0'} transition-opacity duration-500 h-screen w-1/3 flex items-center justify-center text-5xl select-none`} onClick={nextPage(-1)}>&lt;</div>
                    <div
                        className="h-screen w-1/3 cursor-pointer"
                        onClick={toggleMenu}
                    />
                    <div className={`${showMenu ? '' : 'opacity-0'} transition-opacity duration-500 h-screen w-1/3 flex items-center justify-center text-5xl select-none`} onClick={nextPage(1)}>&gt;</div>
                </div>

                <div
                    inert={!showMenu}
                    className={`group fixed bottom-0 left-0 z-10 w-full h-20 flex items-end transition-opacity duration-300 motion-reduce:transition-none ${showMenu ? '' : 'opacity-0 pointer-events-none'}`}
                >
                    <ol
                        aria-label="Chapter pages"
                        className="bg-slate-800 w-full h-4 p-0.5 flex gap-1 overflow-x-auto overflow-y-hidden group-hover:h-13 group-hover:pb-3 group-focus-within:h-12 transition-[height] duration-300 ease-out motion-reduce:transition-none"
                    >
                        {
                            (imageData !== null) ? genPageIdxTiles() : ''
                        }
                    </ol>
                </div>

                {readerError && <p role="alert">{readerError}</p>}
                {pages[idx] && chapterData?.id === params.uid && (
                    <img
                        key={`${params.uid}:${idx}:${pages[idx]}`}
                        src={pages[idx]}
                        width="1000"
                        height="1500"
                        className="h-screen w-auto"
                        onLoad={() => {
                            setHideSpinner(true);
                            showMenuPreview();

                            saveReadProgress(params.uid, getMangaUID(chapterData), Number(idx));
                        }}
                    />
                )}
                <div className={`${hideSpinner ? 'hidden' : ''} flex absolute h-full items-center justify-center`}><LoadingSpinner/></div>                
            </div>
            <div></div>
        </div>
    )
}


export default Reader;
