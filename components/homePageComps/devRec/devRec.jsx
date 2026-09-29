'use client'
import { getCoverUrl } from "@/utils/dataManipulation/manga";
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

import peek from "@/public/images/LetterPeek.png";


const DevRec = ({mangas}) => {
    const [showLetter, setShowLetter] = useState(false);

    const genTiles = () => {
        let tiles = [];
        for (let i = 0; i < mangas.length; i++) {
            tiles.push(
                <li
                    key={i}
                    className="h-80 w-48 shrink-0 bg-rose-700 rounded-lg overflow-hidden transition-opacity hover:opacity-80"
                >
                    <Link href={`/manga/${mangas[i].id}`}>
                        <Image
                            src={getCoverUrl(mangas[i])}
                            width="190"
                            height="320"
                            alt="manga cover"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </Link>
                </li> 
            )
        }
        return tiles;
    }
    
    return (
        <div className="mt-14 font-robotoCondensed w-11/12 sm:w-4/5 max-w-7xl flex flex-col">
            <h2 className="font-sigmarOne text-2xl text-rose-500">
                <button
                    type="button"
                    onClick={() => setShowLetter(state => !state)}
                    aria-label="Toggle Letter peeking"
                    aria-pressed={showLetter}
                    className="italic select-none hover:text-rose-400"
                >
                    Letter's
                </button>
                {' '}recommended - {mangas.length} great choices!
            </h2>
            <Image
                src={peek}
                width={300}
                height={300}
                alt="Letter peeking!"
                className="absolute transition-transform"
                style={{
                    transform: `translateX(${showLetter ? '-170px' : '-25px'}) translateY(4.5rem)`
                }}
            />
            <div className="overflow-x-auto w-full mt-4 p-3 bg-gray-800 rounded-lg z-10">
                <ol className="flex gap-3 items-center w-max flex-nowrap">
                    {genTiles()}
                </ol>
            </div>
        </div>
    )
}


export default DevRec;
