'use client'

import ChapterDetailsBar from "@/components/chapterReaderComps/chapterDetailsBar/chapterDetailsBar";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loadingSpinner/loadingSpinner";
import { getMangaUID } from "@/utils/dataManipulation/chapter";
import Navbar from "@/components/navbarComps/navbar/navbar";
import { useEffect, useState } from "react";
import { LANGPREFS } from "@/utils/enums";




// const idxClamp = (idx) => { // going to use this to clamp the idx when reaching end of array

// }

// will have to make a request to the other chapters of the manga so we can go to their page at a chapter's end
// and be able to send the user back to the manga show page if they end the manga.

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
    const [ showMenu, setShowMenu ] = useState(true);
    const [ idx, setIdx ] = useState(0);

    
    useEffect(() => { // init load useEffect
        // scroll navbar out of view for the reader
        const rdr = document.getElementById("rdr");
        rdr.scrollIntoView({behavior: 'smooth'});

        // get page index - if "page" returns null we're on the first page so load that
        setIdx(searchParams.get('page') || 0);
        
        // get data
        let langs = localStorage.getItem(LANGPREFS) || JSON.stringify([]);

        const fetchData = async () => {
            const resPages = await fetch(`/api/getChapterPages/${params.uid}`);
            setImageData(await resPages.json());

            const resChapter = await fetch(`/api/getChapterData/${params.uid}`);
            const chapterData = (await resChapter.json()).data;
            setChapterData(chapterData);
            
            const resFeed = await fetch(`/api/getMangaFeed?uid=${getMangaUID(chapterData)}&order=asc&langs=${langs}`)
            setFeedData((await resFeed.json()).data);
            
        };
        
        fetchData();
        
    }, [])


    useEffect(() => {// url builder and cacher - runs when we update the imageData slice
        if (imageData === null) return; // if we don't have the data yet we ignore

        // build urls and add them to pages array
        setPages( _ => {
            let pageUrls = [];

            for (let i = 0; i < imageData.chapter.data.length; i++) {
                let url = imageData.baseUrl;
                url += "/data/";
                url += imageData.chapter.hash;
                url += `/${imageData.chapter.data[i]}`;

                // add url to the pages
                pageUrls.push(url);

                // preload image from url
                const img = new Image();
                img.src = url;
            }

            return pageUrls;
        });

    }, [imageData]);

    /**
     * updates the page number in the URL query parameters and updates the state index accordingly.
     */
    const nextPage = ( direction = 1 ) => {
        return () => {
            const param = new URLSearchParams(searchParams);
            let num = param.get('page');
            num = Number(num);
            
            // check if we've gone off the page count
            if ((num+direction) <= -1 || num+direction >= chapterData.attributes.pages)  {                
                router.push(genNextURL( (direction > 0) ? true : false ))
                return;
            }

            param.set('page', num+direction);

            router.replace(`?${param.toString()}`, {scroll: false})

            // set the new idx - thus changing the page and trigger the spinner again for loading
            setIdx(num+direction);
            setHideSpinner(true);
        }
    }

    /**
     * The `goToPage` function updates the URL query parameter 'page' with a new index value and
     * replaces the current URL without scrolling.
     */
    const goToPage = (idx) => {
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

        // based on direction we change the order that we loop over the chapters
        // thus, changing if the gen-ed url will go to the next or prev chapter
        const feed = (direction === true) ? feedData : [...feedData].reverse();

        // this will gen the url for the next chapter - or redirect to the manga showpage
        // if there is only one chapter / we're on the last chapter
        for (let i = 1; i < feed.length; i++) {
            if (feed[i-1].id === params.uid) {
                return `/chapter/${feed[i].id}${ (direction === false) ? `?page=${feed[i].attributes.pages-1}` : ''}`
                
            }
        }

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
            tiles.push(
                <li
                    key={i}
                    className={`h-3 w-full bg-rose-500 mx-1 rounded-sm cursor-pointer ${idx >= i ? '' : 'opacity-40'} ${idx === i ? '' : 'bg-rose-700'}`}
                    onClick={() => {goToPage(i)}}
                />
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
                    <div className="h-screen w-1/3 cursor-pointer" onClick={() => {setShowMenu(val => !val)}}/>
                    <div className={`${showMenu ? '' : 'opacity-0'} transition-opacity duration-500 h-screen w-1/3 flex items-center justify-center text-5xl select-none`} onClick={nextPage(1)}>&gt;</div>
                </div>

                <ol className={`bg-slate-800 w-screen h-4 fixed bottom-0 transition-opacity duration-500 ${showMenu ? '' : 'opacity-0'} flex justify-around items-center`}>
                    {
                        (imageData !== null) ? genPageIdxTiles() : ''
                    }
                </ol>

                {
                    <img
                        src={pages[idx]}
                        width="1000"
                        height="1500"
                        className="h-screen w-auto"
                        onLoad={() => {setHideSpinner(true)}}
                    />
                } 
                <div className={`${hideSpinner ? 'hidden' : ''} flex absolute h-full items-center justify-center`}><LoadingSpinner/></div>                
            </div>
            <div></div>
        </div>
    )
}


export default Reader;