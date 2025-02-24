'use client'
import { getChapterNumber, getChapterLang, getChapterScansGroup, timeSince, getChapterUploader, getChapterUploaderUID } from "@/utils/dataManipulation";
import { getMangaChapters } from "@/utils/getReq";
import langToCountry from "@/utils/langToCountry";
import { useState, useEffect } from 'react';
import Flag from 'react-world-flags';
import Image from "next/image";
import Link from "next/link";

import userIcon from '@/public/icons/person.svg';
import groupIcon from '@/public/icons/group.svg';



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

    const genChapters = () => {
        let chaps = [];

        for (let i = 0; i < chapters.length; i++) {
            let chapter = chapters[i]
            chaps.push(
                <li key={i} className="p-1 bg-gray-800 mx-6 mb-3 rounded-md">
                    <div className="flex w-full justify-between">
                        <h3 className="flex items-center">
                            <Flag code={ langToCountry[getChapterLang(chapter)] } className="h-4 w-6 object-cover rounded mr-1"/>
                            Ch. {getChapterNumber(chapter)}
                        </h3>

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

    return(
        <>
            <div>
                <button className="px-1 w-12 bg-gray-800 hover:bg-gray-600 rounded capitalize" onClick={()=>toggleOrder()}>{order}</button>
            </div>

            {/* need to add loading circle while we wait for the chapters */}
            <ol className="w-3/5">
                {genChapters()}  
            </ol>
        </>
    )
};


export default ChapterList;