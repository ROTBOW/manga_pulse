import { getCoverUrl, getDesc, getENTitle, getPubStatus, getPubState, getPubYear, getTags, getContentRating, getAuthor, getArtist, getDemographic, getAltTitles } from "@/utils/dataManipulation";
import { getManga, getMangaChapters } from "@/utils/getReq";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import ChapterList from "@/components/chapterList/chapterList";
import Navbar from "@/components/navbar/navbar";
import Flag from 'react-world-flags';
import Image from "next/image";
import Link from "next/link";
import langToCountry from "@/utils/langToCountry";


const Manga = async ({ params }) => {
    const UID = (await params).uid;
    const manga = await getManga(UID);

    // check if there is a manga with that UID or else redirect to 404 page
    if (manga === -1) {
        // got a bad request
        notFound();
    }
    
    // add a check here for erotica and porno to have them valid they are of age and they wanna see that content
    
    const chapters = await getMangaChapters(UID);
    // get manga chapters separately here - we also don't even try unless we know its a real manga that exists


    const genTags = () => {
        let tags = [];
        let tagData = getTags(manga);

        for (let i = 0; i < tagData.length; i++) {
            tags.push(
                <Link key={i} href="#" className="p-1 w-fit text-nowrap text-sm bg-opacity-30 my-2 mr-2 bg-emerald-400 rounded-md hover:bg-opacity-80 transition-opacity">
                    {tagData[i].name}
                </Link>
            )
        }
        
        return tags;
    }

    const genAltTitles = () => {
        let titles = getAltTitles(manga);
        let res = [];

        for (let title of titles) {
            let lang = Object.keys(title)[0];
            let name = Object.values(title)[0];
            
            res.push(
                <li key={res.length} className="border-b border-rose-500 text-md flex items-center">
                    <Flag code={langToCountry[lang]} title={lang.toLocaleUpperCase()} className="w-5 h-4 object-cover rounded-md mr-1" /> • {name}
                </li>
            )
        }

        return res;
    }

    const contentRateingColor = {
        safe: 'bg-emerald-500 text-emerald-900',
        suggestive: 'bg-amber-400 text-amber-900',
        erotica: 'bg-rose-400 text-rose-900',
        pornographic: 'bg-red-600 text-red-950'
    };

    const pubStatusColor = {
        ongoing: '',
        hiatus: 'text-yellow-500',
        completed: 'text-white uppercase',
    }

    return (
        <div className="flex flex-col items-center h-full font-robotoCondensed">
            <Navbar/>
            
            <main className='flex mt-28 w-4/5 h-1/3 justify-around'>
                <div className="w-3/5 flex flex-col justify-center">
                    <h1 className="font-sigmarOne text-2xl text-rose-500">{getENTitle(manga)}</h1>
                    <div className={`px-1 ${contentRateingColor[getContentRating(manga)]} w-fit rounded-md text-sm`}>{getContentRating(manga)}</div>
                    <ul className="flex h-fit w-14">{genTags()}</ul>
                    <p className="text-xl">{(getDesc(manga) !== -1) ? getDesc(manga) : ''}</p>
                    <div className="mt-1 text-emerald-400 capitalize">{getPubYear(manga)} • {getPubState(manga)} • <i className={pubStatusColor[getPubStatus(manga)]}>{getPubStatus(manga)}</i></div>
                </div> 

                <Image
                    src={getCoverUrl(manga)}
                    width="260"
                    height="365"
                    alt={`${getENTitle(manga)}'s Cover art`}
                    className="shadow-md shadow-emerald-400 w-1/5 object-cover"
                />
            </main>

            <secondary className="flex w-4/5 justify-center mt-14">
                <Suspense>
                    <ChapterList chapters={chapters}/>
                </Suspense>

                <section className="w-2/5 mr-10">
                    <div className="flex w-full mb-8">
                        <h3 className="mr-5">
                            Author<br/>
                            <p className="px-1 w-fit text-rose-500 rounded bg-gray-800 text-center mt-1">{getAuthor(manga)}</p>
                        </h3>
                        <h3 className="mr-10">
                            Artist<br/>
                            <p className="px-1 w-fit text-rose-500 rounded bg-gray-800 text-center mt-1">{getArtist(manga)}</p>
                        </h3>

                        <h2 className={`${getDemographic(manga) !== null ? '' : 'opacity-0'}`}>
                            Demographic<br/>
                            <p className="px-1 w-fit text-rose-500 rounded bg-gray-800 text-center mt-1">{getDemographic(manga)}</p>
                        </h2>
                    </div>

                    <div>
                        <h2 className="underline text-md">Alt Titles</h2>
                        <ol>
                            {genAltTitles()}
                        </ol>
                    </div>
                </section>
            </secondary>
        </div>
    )
};

export default Manga;