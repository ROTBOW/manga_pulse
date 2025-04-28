'use client'

import Navbar from "@/components/navbarComps/navbar/navbar";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";



// const idxClamp = (idx) => { // going to use this to clamp the idx when reaching end of array

// }

const Reader = () => {
    // next nav consts
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    // reader state slice
    const [showMenu, setShowMenu] = useState(true);
    const [ pages, setPages ] = useState([]);
    const [ data, setData ] = useState(null);
    const [idx, setIdx] = useState(0);

    
    useEffect(() => {
        // scroll navbar out of view for the reader
        const rdr = document.getElementById("rdr");
        rdr.scrollIntoView({behavior: 'smooth'});

        // get page index
        setIdx(searchParams.get('page'));
        
        // get data
        const fetchPages = async () => {
            const res = await fetch(`/api/getChapterPages/${params.uid}`);
            setData(await res.json());

        }
        
        fetchPages();
    }, [])

    useEffect(() => {
        if (data === null) return; // if we don't have the data yet we ignore

        // build urls and add them to pages array
        setPages(_ => {
            let pageUrls = [];

            for (let i = 0; i < data.chapter.data.length; i++) {
                let url = data.baseUrl;
                url += "/data/";
                url += data.chapter.hash;
                url += `/${data.chapter.data[i]}`;

                pageUrls.push(url);
            }

            return pageUrls;
        })

    }, [data]);

    /**
     * updates the page number in the URL query parameters and updates the state index accordingly.
     */
    const nextPage = ( direction = 1 ) => {
        return () => {
            const param = new URLSearchParams(searchParams);
            let num = param.get('page');
            num = Number(num);
            
            param.set('page', num+direction);

            router.replace(`?${param.toString()}`, {scroll: false})
            setIdx(num+direction)
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
        setIdx(idx)
    }

    const genPageIdxTiles = () => {
        let tiles = new Array();
        let pageCount = data.chapter.data.length;

        for (let i = 0; i < pageCount; i++) {
            tiles.push(
                <li
                    key={i}
                    className={`h-3 w-full bg-rose-500 mx-1 rounded-sm cursor-pointer ${idx >= i ? '' : 'opacity-40'}`}
                    onClick={() => {goToPage(i)}}
                />
            )
        }

        return tiles;
    }

    return (
        <div className="flex flex-col items-center">
            <Navbar displayType='block'/>
            <div id="rdr" className="w-full h-screen flex flex-col items-center">
                <div className="absolute w-full flex justify-between">
                    <div className="h-screen w-1/3" onClick={nextPage(-1)}/>
                    <div className="h-screen w-1/3 cursor-pointer" onClick={() => {setShowMenu(val => !val)}}/>
                    <div className="h-screen w-1/3" onClick={nextPage(1)}/>
                </div>

                <ol className={`bg-slate-800 w-screen h-4 fixed bottom-0 transition-opacity duration-500 ${showMenu ? '' : 'opacity-0'} flex justify-around items-center`}>
                    {
                        genPageIdxTiles()
                    }
                </ol>

                {
                    <img
                        src={pages[idx]}
                        width="1500"
                        height="1500"
                        className="h-screen w-auto"
                    />
                } 
            </div>
        </div>
    )
}


export default Reader;