'use client'
import { getCoverUrl } from "@/utils/dataManipulation/manga";
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

import peek from "@/public/images/LetterPeek.png";
import { usePreferences } from "@/components/navbarComps/preferencesProvider";
import { contentRatingArray } from "@/utils/miscFuncs";


const DevRec = ({mangas}) => {
    const [showLetter, setShowLetter] = useState(false);
    const {contentPrefs, preferencesReady} = usePreferences();
    const contentRatings = contentRatingArray(contentPrefs);
    const filteredMangas = mangas.filter(manga => {
        return contentRatings.includes(manga.attributes.contentRating);
    });

    const genTiles = () => {
        let tiles = [];
        for (let i = 0; i < filteredMangas.length; i++) {
            const manga = filteredMangas[i];

            tiles.push(
                <li
                    key={manga.id}
                    className="h-80 w-48 shrink-0 bg-rose-700 rounded-lg overflow-hidden transition-opacity hover:opacity-80"
                >
                    <Link href={`/manga/${manga.id}`}>
                        <Image
                            src={getCoverUrl(manga)}
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
                {' '}recommended - {filteredMangas.length} great choices!
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
                {preferencesReady && filteredMangas.length > 0 ? (
                    <ol className="flex gap-3 items-center w-max flex-nowrap">
                        {genTiles()}
                    </ol>
                ) : (
                    <p className="p-4" role="status">
                        {preferencesReady ? 'No recommendations match your content preferences.' : 'Loading preferences...'}
                    </p>
                )}
            </div>
        </div>
    )
}


export default DevRec;
