'use client'
import Link from "next/link";



const ChapterDetailsBar = ({ chapterData, feedData, prevUrl, nextUrl }) => {
    if (chapterData === null || feedData === null) { // if the data is null we show a loading ele
        return (
            <section className='w-full h-10 bg-rose-700 animate-pulse' />
        )
    } else { // otherwise we have our data and can load the comp proper.
        let data = {};
        chapterData.relationships.forEach(rel => {
            data[rel.type] = rel
        });
        const chapterNumber = chapterData.attributes['chapter'];
        
        return (
            <>
            <section className="w-[95%] h-10 mb-1 font-robotoCondensed flex justify-between">

                <div className="flex flex-col">
                    <Link href={`/manga/${data['manga'].id}`} className="text-rose-500 text-lg">{data['manga'].attributes.title.en}</Link>
                    <h3 className="text-emerald-400">CH. {chapterNumber}</h3>
                </div>
                

                {/* If I make a user page the below h tags will need to be updated to Links. */}
                <div className="flex flex-col items-end">
                    <h2 className="text-rose-500">{data['scanlation_group'].attributes.name}</h2>
                    <h3 className="text-sm text-emerald-400">{data['user'].attributes.username}</h3>
                </div>

            </section>
            <section className="w-[95%] my-2 flex justify-between">
                <Link href={prevUrl} className="w-1/2 mr-3 bg-rose-500 rounded-md text-center text-black transition-opacity opacity-60 hover:opacity-100">⟵</Link>
                <Link href={nextUrl} className="w-1/2 ml-3 bg-rose-500 rounded-md text-center text-black transition-opacity opacity-60 hover:opacity-100">⟶</Link>
            </section>
            </>
        )
    }
}

export default ChapterDetailsBar;