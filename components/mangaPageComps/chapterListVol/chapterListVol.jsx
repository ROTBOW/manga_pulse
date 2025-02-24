'use client'
import { useState } from "react";
import { getChapterNumber, getChapterLang, getChapterScansGroup, timeSince, getChapterUploader, getChapterUploaderUID, getChapterTitle } from "@/utils/dataManipulation";
import Link from "next/link";
import Flag from 'react-world-flags';
import Image from "next/image";
import langToCountry from "@/utils/langToCountry";

import userIcon from '@/public/icons/person.svg';
import groupIcon from '@/public/icons/group.svg';
import dropdownArrow from '@/public/icons/dropdownArrow.svg';


const ListVol = ({volume}) => {
    const [showChaps, setShowChaps] = useState(true);
    
    
    const getVolNum = () => {
        if (volume[0].attributes.volume) {
            return `Vol. ${volume[0].attributes.volume}`;
        }
        return 'No Volume'
    }

    const genChapters = () => {
        let chaps = [];
        for (let i = 0; i < volume.length; i++) {
            let chapter = volume[i]
            chaps.push(
                <li key={i} className="p-1 bg-gray-800 mx-6 mb-3 rounded-md">
                    <div className="flex w-full justify-between">
                        <Link href="#" className="flex items-center">
                            <Flag code={ langToCountry[getChapterLang(chapter)] } className="h-4 w-6 object-cover rounded mr-1"/>
                            Ch. {getChapterNumber(chapter)}
                            { (getChapterTitle(chapter)) ? (` - ${getChapterTitle(chapter)}`) : '' }
                        </Link>

                        <Link href={`/user/${getChapterUploaderUID(chapter)}`} className="flex text-sm items-center text-emerald-400">
                            <Image src={userIcon} alt="user-icon" width='50' height='50' className="size-5"/>
                            {getChapterUploader(chapter)}
                        </Link>
                    </div>

                    <div className="w-full flex justify-between">
                        <h2 className="text-rose-500 text-sm flex"><Image src={groupIcon} alt="group-icon" width='50' height='50' className="size-5 mr-1"/> {getChapterScansGroup(chapter)}</h2>
                        <h2>{timeSince(chapter.attributes.updatedAt)}</h2>
                    </div>
                </li>
            )
        }

        return chaps;
    }

    return (
        <>
            <div className="flex justify-between mx-4 text-2xl font-sigmarOne text-rose-500">
                <h2>{getVolNum()}</h2>
                <Image
                    src={dropdownArrow}
                    alt="button to toggle chapter collapse"
                    width="50"
                    heigh="50"
                    onClick={() => setShowChaps(toggle => !toggle)}
                    className={`transition-all ${showChaps ? '' : 'rotate-90'} cursor-pointer`}
                />
            </div>
            <ol
                className={`mx-4 border-b border-emerald-400 overflow-hidden transition-[max-height] duration-1000 ease-in-out`}
                style={{ maxHeight: showChaps ? '100%' : '0rem' }} 
            >
                {genChapters()}
            </ol>
        </>
    )
};

export default ListVol;