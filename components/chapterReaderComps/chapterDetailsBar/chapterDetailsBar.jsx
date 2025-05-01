'use client'
import Link from "next/link";



const ChapterDetailsBar = ({ chapterData }) => {
    if (chapterData === null) { // if the data is null we show a loading ele
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
            <section className="w-[95%] h-10 mb-2 font-robotoCondensed flex justify-between">

                <div className="flex flex-col">
                    <Link href={`/manga/${data['manga'].id}`} className="text-rose-500">{data['manga'].attributes.title.en}</Link>
                    <h3 className="text-emerald-400">ch. {chapterNumber}</h3>
                </div>
                

                {/* If I make a user page the below h tags will need to be updated. */}
                <div className="flex flex-col items-end">
                    <h2 className="text-rose-500">{data['scanlation_group'].attributes.name}</h2>
                    <h3 className="text-sm text-emerald-400">{data['user'].attributes.username}</h3>
                </div>

            </section>
        )
    }
}

export default ChapterDetailsBar;