'use client'
import Image from "next/image";
import { getCoverUrl, getDesc, getENTitle } from "@/utils/mangaManipulation";
import {useState} from 'react';


const Carousel = (props) => {
    let [curPage, setCurPage] = useState(0);

    // add a setinterval to move the idx along every 40 to 60 secs or so?
    
    const genPages = () => {
        let pages = [];

        for (let idx = 0; idx < props.mangas.length; idx++) {
            pages.push(
            <li
                key={idx}
                className={`mx-1 transition-all hover:animate-pulse hover:scale-105 hover:opacity-100 ${ idx === curPage ? '!opacity-100 animate-pulse scale-105' : 'opacity-30'}`}
                onClick={(e) => {setCurPage((idx))}}
            >
                <Image
                    src={getCoverUrl(props.mangas[idx])}
                    width={720}
                    height={1280}
                    alt="manga cover"
                    className="w-auto h-full"
                    style={{objectFit: 'cover'}}
                />
                <div className="bg-black relative">Manga Title</div>
            </li>)


        }

        return pages
    }

    return (
        <>
            <div className="relative"><h2 className="fixed top-16 left-40">Up & Coming</h2></div>
            <ol className="w-full h-1/4 flex overflow-hidden">
                
                {
                    genPages()
                }    
            </ol>
            {/* <div className="fixed"><div className="relative w-screen h-56 bg-gradient-to-b from-transparent to-gray-500"></div></div> */}
            <h3 className="font-sigmarOne rounded bg-zinc-700 sticky -mt-10 mb-2 p-2 text-xl text-rose-700">{getENTitle(props.mangas[curPage])}</h3>
            <div className="w-2/3 h-28 bg-gray-700 bg-opacity-40 rounded p-2 overflow-x-auto">{getDesc(props.mangas[curPage])}</div>
        </>
    );
};

export default Carousel;