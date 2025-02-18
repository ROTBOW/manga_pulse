'use client'
import Image from "next/image";
import { getCoverUrl, getDesc, getENTitle } from "@/utils/mangaManipulation";
import { useState } from 'react';
import Link from "next/link";


const Carousel = ({mangas}) => {
    let [curPage, setCurPage] = useState(0);

    // add a setinterval to move the idx along every 40 to 60 secs or so?
    
    const genPages = () => {
        let pages = [];

        for (let idx = 0; idx < mangas.length; idx++) {
            pages.push(
            <li
                key={idx}
                className={`mx-1 h-fill transition-all hover:animate-pulse hover:scale-105 hover:opacity-100 ${ idx === curPage ? '!opacity-100 animate-pulse scale-105' : 'opacity-30'}`}
                onClick={(e) => {setCurPage((idx))}}
            >
                <Image
                    src={getCoverUrl(mangas[idx])}
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
            {/* <div className="relative"><h2 className="fixed top-16 left-40">Up & Coming</h2></div> */}
            <ol className="w-full h-1/4 flex overflow-hidden">
                
                {
                    genPages()
                }    
            </ol>
            <h1 className="font-sigmarOne -mt-14 text-2xl z-10 bg-gray-800 rounded-t px-2">Up and Coming</h1>
            <article className="w-3/6 p-2  bg-gray-800 z-10 rounded-xl flex flex-col">
                <div className="flex justify-between mb-1 border-b border-rose-500">
                    <Link href="#" className="flex items-center" style={{width: "84%", height: "3rem"}}><h3 className="font-sigmarOne text-rose-500 text-ellipsis" title={getENTitle(mangas[curPage])}>{getENTitle(mangas[curPage])}</h3></Link>
                    <Link href="#" className="font-robotoCondensed w-30 h-8 text-center underline p-1 hover:text-rose-500">Go To Manga</Link>
                </div>
                <section className="font-robotoCondensed">{getDesc(mangas[curPage])}</section>
            </article>
        </>
    );
};

export default Carousel;