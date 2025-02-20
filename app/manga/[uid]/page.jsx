import { getCoverUrl, getDesc, getENTitle, getPubStatus, getPubState, getPubYear, getTags, getContentRating } from "@/utils/mangaManipulation";
import { notFound } from "next/navigation";
import { getManga } from "@/utils/getReq";

import Navbar from "@/components/navbar/navbar";
import Image from "next/image";
import Link from "next/link";


const Manga = async ({ params }) => {
    const UID = (await params).uid;
    const manga = await getManga(UID);

    // check if there is a manga with that UID or else redirect to 404 page
    if (manga === -1) {
        // got a bad request
        notFound();
    }
    console.log(manga);
    // add a check here for erotica and porno to have them valid they are of age and they wanna see that content

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

    const contentRateingColor = {
        safe: 'bg-emerald-500 text-emerald-900',
        suggestive: 'bg-amber-400 text-amber-900',
        erotica: 'bg-rose-400 text-rose-900',
        pornographic: 'bg-red-600 text-red-950'
    };

    return (
        <div className="flex flex-col items-center h-full font-robotoCondensed">
            <Navbar/>
            
            <main className='flex mt-28 w-4/5 h-1/3 justify-around'>
                <div className="w-3/5 flex flex-col justify-center">
                    <h1 className="font-sigmarOne text-2xl text-rose-500">{getENTitle(manga)}</h1>
                    <div className={`p-1 ${contentRateingColor[getContentRating(manga)]} w-fit rounded-md text-sm`}>{getContentRating(manga)}</div>
                    <ul className="flex h-fit w-14">{genTags()}</ul>
                    <p className="text-xl">{(getDesc(manga) !== -1) ? getDesc(manga) : 'No description given'}</p>
                    <div className="mt-1 text-emerald-400 capitalize">{getPubYear(manga)} • {getPubState(manga)} • {getPubStatus(manga)}</div>
                </div>

                <Image
                    src={getCoverUrl(manga)}
                    width="260"
                    height="365"
                    alt={`${getENTitle(manga)}'s Cover art`}
                    className="shadow-md shadow-emerald-400 w-1/5 object-cover"
                />
            </main>

            <section className="w-full flex justify-center mt-14">
                this will be chapters
            </section>
        </div>
    )
};

export default Manga;