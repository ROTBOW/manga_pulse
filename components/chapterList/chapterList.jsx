



const ChapterList = ({chapters}) => {

    const genChapters = () => {
        let chaps = [];

        for (let i = 0; i < chapters.length; i++) {
            chaps.push(
                <li key={i}>
                    {chapters[i].id}
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