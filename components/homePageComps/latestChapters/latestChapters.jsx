import { getChapterScansGroup } from "@/utils/mangaManipulation";
import Image from "next/image";
import Link from "next/link";


const LateChapItem = ({chapter}) => {

    return (
        <li className="flex p-1 h-20 w-full mb-2 font-robotoCondensed items-center">
            <Link href="#" className="w-14 h-20 mr-2 bg-rose-700 rounded">
                <Image 
                    src={chapter.cover_art} 
                    width="56" 
                    height="80"
                    alt="mangaThumbnail"
                    className="w-full h-full object-cover object-center rounded"
                    style={{}}
                />
            </Link>
            <div className="" style={{width: '14rem'}}>
            <Link href="#"><h4 className="truncate w-full" title={chapter.title}>{chapter.title}</h4></Link>
                <p className="text-sm truncate">{
                `
                ${chapter.attributes.volume ? "Vol. " + chapter.attributes.volume +' ' : ''}
                ${chapter.attributes.chapter ? "Ch. " + chapter.attributes.chapter +' ' : ''}
                ${chapter.attributes.title ? '- '+chapter.attributes.title : ''}
                `}</p>
                {/* need to add a link to the chapter directly from above */}

                <div>
                    <div className="text-rose-500 text-sm truncate w-40 mt-3">SG: {getChapterScansGroup(chapter)}</div>
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

    const olClass = 'bg-gray-800 p-2 mx-2 rounded-md w-80';
    return (
        <div className="flex flex-col items-center mt-14">
            <h2 className="w-full font-sigmarOne text-rose-500 text-xl">Latest Chapters</h2>
            <section className="mt-2 flex w-4/5 justify-center">
                <ol className={`${olClass}`}>
                    {
                        getXtoYChapters(0, 5)
                    }
                </ol>

                <ol className={`${olClass}`}>
                    {
                        getXtoYChapters(6, 11)
                    }
                </ol>

                <ol className={`${olClass}`}>
                    {
                        getXtoYChapters(12, 17)
                    }
                </ol>

            </section>
        </div>
    )

};


export default LatestChapters;