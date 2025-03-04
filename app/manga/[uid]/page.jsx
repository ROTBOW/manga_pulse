import { getCoverUrl, getDesc, getENTitle, getPubStatus, getPubState, getPubYear, getTags, getContentRating, getAuthor, getArtist, getDemographic, getAltTitles, getMangaLinks } from "@/utils/dataManipulation/manga";
import { getManga } from "@/utils/getReq";
import { notFound } from "next/navigation";

import ChapterList from "@/components/mangaPageComps/chapterList/chapterList";
import langToCountry from "@/utils/langToCountry";
import Navbar from "@/components/navbarComps/navbar/navbar";
import Flag from 'react-world-flags';
import Image from "next/image";
import Link from "next/link";
import LinksSection from "@/components/mangaPageComps/linksSection/linksSection";


const MangaPage = async ({ params }) => {
    const UID = (await params).uid;
    const manga = await getManga(UID);

    // check if there is a manga with that UID or else redirect to 404 page
    if (manga === -1) {
        // got a bad request
        notFound();
    }
    
    // add a check here for erotica and porno to have them valid they are of age and they wanna see that content
    // gonna wait on this ^ since I want it to check the cookies/localstorage if they have saved settings


    const genTags = () => {
        let tags = [];
        let tagData = getTags(manga);

        for (let i = 0; i < tagData.length; i++) {
            tags.push(
                <Link key={i} href="#" className="p-1 w-fit text-nowrap text-xs md:text-sm bg-opacity-30 my-1 md:my-2 mr-1 md:mr-2 bg-emerald-400 rounded-md hover:bg-opacity-80 transition-opacity">
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
                <li key={res.length} className="border-b border-rose-500 text-md flex items-center opacity-70">
                    <Flag code={langToCountry[lang]} title={lang.toLocaleUpperCase()} className="w-5 h-4 object-cover rounded-md mr-1" /> • {name}
                </li>
            )
        }

        return res;
    }

    // the two following objects are used to colorize the content rating and publication status
    // based on what they are, respectively.
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
        cancelled: 'text-red-500 uppercase',
    }

    return (
        <div className="flex flex-col items-center h-full font-robotoCondensed">
            <Navbar/>
            
            <main className='flex mt-20 md:mt-28 w-4/5 h-1/3 flex-col-reverse md:flex-row md:justify-around items-center md:items-start'>
                <div className="w-full md:w-3/5 flex flex-col justify-center items-center md:items-start">
                    <h1 className="font-sigmarOne text-2xl text-rose-500 text-center md:text-start">{getENTitle(manga)}</h1>
                    <div className={`px-1 ${contentRateingColor[getContentRating(manga)]} w-fit rounded-md text-sm`}>{getContentRating(manga)}</div>
                    <ul className="flex h-fit w-full md:w-14 flex-wrap md:flex-nowrap justify-center md:justify-start">{genTags()}</ul>
                    <p className="text-xl text-center md:text-start">{(getDesc(manga) !== -1) ? getDesc(manga) : ''}</p>
                    <div className="mt-1 text-emerald-400 capitalize text-center md:text-start">{getPubYear(manga)} • {getPubState(manga)} • <i className={pubStatusColor[getPubStatus(manga)]}>{getPubStatus(manga)}</i></div>
                </div> 

                <Image
                    src={getCoverUrl(manga)}
                    width="260"
                    height="365"
                    alt={`${getENTitle(manga)}'s Cover art`}
                    className="shadow-md shadow-emerald-400 w-full md:w-1/5 object-cover"
                />
            </main>

            <div className="flex w-4/5 justify-center mt-14 flex-col-reverse md:flex-row items-center md:items-start">
                
                <ChapterList mangaUID={UID}/>
                

                <section className="w-full md:w-2/5 md:mr-10">
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

                    <LinksSection links={getMangaLinks(manga)}/>

                    <div className="mb-8 md:mb-0">
                        <h2 className="underline text-md">Alt Titles</h2>
                        <ol>
                            {genAltTitles()}
                        </ol>
                    </div>
                </section>
            </div>
        </div>
    )
};

export default MangaPage;