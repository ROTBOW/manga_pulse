'use client'

import ListVol from "../chapterListVol/chapterListVol";
import { getMangaChapters } from "@/utils/getReq";
import { useState, useEffect } from 'react';

import LoadingSpinner from "@/components/loadingSpinner/loadingSpinner";


const ChapterList = ({mangaUID}) => {
    const [chapters, setChapters] = useState([]);
    const [order, setOrder] = useState('desc')

    useEffect(() => {
        let getData = async () => {
            setChapters(await getMangaChapters(mangaUID, order));
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