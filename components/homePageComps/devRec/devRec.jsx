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
                <li className="h-80 w-48 bg-rose-700 mx-1 rounded-md hover:animate-pulse" key={i}>
                    <Link href={`manga/${mangas[i].id}`}>
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
        <div className="mt-14 rounded p-1 font-robotoCondensed w-4/5 flex flex-col" style={{height: '26rem', minWidth: "22.5rem"}}>
            <h2 className="font-sigmarOne text-2xl text-rose-500"><i className="select-none" onClick={() => setShowLetter(state => !state)}>Letter's</i> recommended - {mangas.length} great choices!</h2>
            <Image src={peek} width={300} height={300} alt="Letter peeking!" className="absolute transition-all" style={{transform: `translateX(${(showLetter) ? '-170px' : '-25px'}) translateY(4.5rem)`}}/>
            <div className="overflow-x-auto w-full h-full p-1 bg-gray-800 rounded z-10">
                <ol className="bg-gray-800 flex justify-around items-center w-max h-full p-1 flex-nowrap flex-shrink-0">
                    {genTiles()}
                </ol>
            </div>
        </div>
    )
}


export default DevRec;