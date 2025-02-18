


const LateChapItem = ({chapter}) => {

    return (
        <li>
            {chapter.title}
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

    const olClass = 'bg-gray-800 p-2 rounded-md w-60';
    return (
        <>
        <h2 className="mt-8 w-4/5 font-sigmarOne text-rose-500 text-xl">Latest Chapters</h2>
        <section className="mt-2 flex w-4/5 justify-between">
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
        </>
    )

};


export default LatestChapters;