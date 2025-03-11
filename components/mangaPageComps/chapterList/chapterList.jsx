'use client'

import ListVol from "../chapterListVol/chapterListVol";
import { useState, useEffect } from 'react';

import LoadingSpinner from "@/components/loadingSpinner/loadingSpinner";
import { LANGPREFS } from "@/utils/enums";


const ChapterList = ({mangaUID}) => {
    const [chapters, setChapters] = useState([]);
    const [order, setOrder] = useState('desc');
    
    useEffect(() => {
        const langs = localStorage.getItem(LANGPREFS) || [];
        let getData = async () => {
            // also need to take into account pagination in the future
            
            let res = await fetch(`/api/getMangaFeed?uid=${mangaUID}&order=${order}&langs=${langs}`)
            let data = await res.json()
            setChapters(data.data)
        }

        getData();
    }, [order])

    const toggleOrder = () => {
        setOrder(ord => {
            if (ord === 'asc') {
                return 'desc'
            } else {
                return 'asc'
            }
        })
    };

    const genVolumes = () => {
        let volumes = [];
        
        let vols = [];
        let vol = [chapters[0]];
        for (let i = 1; i < chapters.length; i++) {

            if (vol[0].attributes.volume === chapters[i].attributes.volume) {
                vol.push(chapters[i]);
            } else {
                vols.push(vol);
                vol = [chapters[i]];
            };
        }
        vols.push(vol);
        
        for (let i = 0; i < vols.length; i++) {
            let volume = vols[i]
            volumes.push(
                <ListVol volume={volume} key={i}/>
            )
        }

        return volumes;
    }

    if (chapters.length === 0) return <div className="flex w-3/5 h-full items-center justify-center"><LoadingSpinner/></div>;
    return(
        <>
            <div className="hidden md:block">
                <button className="px-1 w-12 bg-gray-800 hover:bg-gray-600 rounded capitalize" onClick={()=>toggleOrder()}>{order}</button>
            </div>

            <ol className="w-full md:w-3/5 mr-3">
                {genVolumes()}  
            </ol>
        </>
    )
};


export default ChapterList;