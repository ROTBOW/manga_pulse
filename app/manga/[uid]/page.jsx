import { getCoverUrl, getDesc, getENTitle, getTags } from "@/utils/mangaManipulation";
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

    return (
        <div className="flex flex-col items-center h-full font-robotoCondensed">
            <Navbar/>
            
            <main className='flex mt-28 w-4/5 h-1/3 justify-around'>
                <div className="w-3/5 flex flex-col justify-center">
                    <h1 className="font-sigmarOne text-2xl text-rose-500">{getENTitle(manga)}</h1>
                    <ul className="flex h-fit w-14">{genTags()}</ul>
                    <p className="text-xl">{getDesc(manga)}</p>
                </div>

                <Image
                    src={getCoverUrl(manga)}
                    width="260"
                    height="365"
                    alt={`${getENTitle(manga)}'s Cover art`}
                    className="shadow-md shadow-emerald-400 w-40 w-1/5"
                />
            </main>

            <section className="w-full flex justify-center mt-14">
                this will be chapters
            </section>
        </div>
    )
};

export default Manga;