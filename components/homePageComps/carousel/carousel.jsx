'use client'
import Image from "next/image";
import { getCoverUrl, getDesc, getENTitle } from "@/utils/mangaManipulation";
import { useEffect, useState } from 'react';
import Link from "next/link";

import noDesc from '@/public/images/noDesc.png';


const Carousel = ({mangas}) => {
    let [curPage, setCurPage] = useState(0);

    useEffect(() => {
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
    }, [curPage])
    
    const genTiles = () => {
        let tiles = [];

        for (let idx = 0; idx < mangas.length; idx++) {
            tiles.push(
            <li
                key={idx}
                className={`bg-rose-700 mx-1 transition-all hover:animate-pulse hover:scale-105 hover:opacity-100 hover:cursor-pointer ${ idx === curPage ? '!opacity-100 animate-pulse scale-105' : 'opacity-30'}`}
                style={{width: '10%', height: '17rem'}}
                onClick={(e) => {setCurPage((idx))}}
            >
                <Image
                    src={getCoverUrl(mangas[idx])}
                    width={720}
                    height={1280}
                    alt="manga cover"
                    className="w-full h-full"
                    style={{objectFit: 'cover'}}
                />
            </li>)


        }

        return tiles
    }

    return (
        <>
            <ol className="w-full h-1/4 flex overflow-hidden">
                
                {
                    genTiles()
                }    
            </ol>
            <h1 className="font-sigmarOne -mt-14 text-2xl z-10 bg-gray-800 rounded-t px-2">Up and Coming</h1>
            <article className="w-5/6 sm:w-4/6 h-40 p-2 bg-gray-800 z-10 rounded-xl flex flex-col">
                <div className="flex justify-between mb-1 border-b border-rose-500">
                    <Link href={`/manga/${mangas[curPage].id}`} className="flex items-center" style={{width: "84%", height: "3rem"}}><h3 className="font-sigmarOne text-rose-500 truncate" title={getENTitle(mangas[curPage])}>{getENTitle(mangas[curPage])}</h3></Link>
                    <Link href={`/manga/${mangas[curPage].id}`} className="hidden sm:block font-robotoCondensed w-30 h-8 text-center underline p-1 hover:text-rose-500">Go To Manga</Link>
                </div>

                {getDesc(mangas[curPage]) !== -1 ?
                <section className="font-robotoCondensed overflow-y-auto p-1">{getDesc(mangas[curPage])}</section> :
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