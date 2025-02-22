import { getChapterNumber, getChapterLang, getChapterScansGroup, timeSince } from "@/utils/dataManipulation";




const ChapterList = ({chapters}) => {

    const genChapters = () => {
        let chaps = [];

        for (let i = 0; i < chapters.length; i++) {
            let chapter = chapters[i]
            chaps.push(
                <li key={i} className="p-1 bg-gray-800 mx-6 mb-3 rounded-md">
                    <h3>{getChapterLang(chapter)} Ch. {getChapterNumber(chapter)}</h3>

                    <div className="w-full flex justify-between">
                        <h2 className="text-rose-500 text-sm">SG: {getChapterScansGroup(chapter)}</h2>
                        <h2>{timeSince(chapter.attributes.updatedAt)}</h2>
                    </div>
                </li>
            )
        }

        return chaps;
    }

    return(
        <ol className="w-3/5">
            {genChapters()}
        </ol>
    )
};


export default ChapterList;