import { getChapterScansGroup, timeSince } from "@/utils/mangaManipulation";
import Image from "next/image";
import Link from "next/link";


const LateChapItem = ({chapter}) => {

    return (
        <li className="flex p-1 h-20 w-full mb-2 font-robotoCondensed items-center">
            <Link href="#" className="min-w-14 min-h-20 w-14 h-20 mr-2 bg-rose-700 rounded">
                <Image 
                    src={chapter.cover_art} 
                    width="56" 
                    height="80"
                    alt={`${chapter.title}'s Thumbnail`}
                    className="w-14 h-full object-cover object-center rounded"
                    style={{}}
                />
            </Link>
            <div className="" style={{width: '78%'}}>
                <Link href="#" className="w-full block"><h4 className="truncate w-full" title={chapter.title}>{chapter.title}</h4></Link>
                <p className="text-sm truncate w-full text-emerald-400">{
                `
                ${chapter.attributes.volume ? "Vol. " + chapter.attributes.volume +' ' : ''}
                ${chapter.attributes.chapter ? "Ch. " + chapter.attributes.chapter +' ' : ''}
                ${chapter.attributes.title ? '- '+chapter.attributes.title : ''}
                `}</p>
                {/* need to add a link to the chapter directly from above */}

                <div className="flex flex-between w-full text-sm items-end">
                    <div className="text-rose-500 truncate w-1/2 mt-3">SG: {getChapterScansGroup(chapter)}</div>
                    <div className="w-1/2 text-end text-nowrap">{timeSince(chapter.attributes.updatedAt)}</div>
                </div>
            </div>
        </li>
    )
}


const LatestChapters = ({ chapters }) => {



    const getXtoYChapters = (x, y) => {
        let olItems = [];
        for (let idx = x; idx <= y; idx++) {
            olItems.push(
                <LateChapItem
                    key={idx}
                    chapter={chapters[idx]}
                />
            )
        }
        return olItems;
    }

    const olClass = 'bg-gray-800 p-2 mx-2 rounded-md w-1/3';
    const olStyle = {minWidth: '18.75rem', maxWidth: "20rem"};
    return (
        <div className="flex flex-col items-center mt-14 w-4/5">
            <h2 className="w-full font-sigmarOne text-rose-500 text-2xl">Latest Chapters</h2>
            <section className="mt-2 w-full flex justify-center">
                <ol className={`${olClass}`} style={olStyle}>
                    {
                        getXtoYChapters(0, 5)
                    }
                </ol>

                <ol className={`${olClass} hidden md:block`} style={olStyle}>
                    {
                        getXtoYChapters(6, 11)
                    }
                </ol>

                <ol className={`${olClass} hidden lg:block`} style={olStyle}>
                    {
                        getXtoYChapters(12, 17)
                    }
                </ol>
                
                <ol className={`${olClass} hidden xl:block`} style={olStyle}>
                    {
                        getXtoYChapters(18, 23)
                    }
                </ol>

            </section>
        </div>
    )

};


export default LatestChapters;