import Navbar from "@/components/navbar/navbar";
import wut0 from '@/public/images/wut0.png';
import wut1 from '@/public/images/wut1.png';
import wut2 from '@/public/images/wut2.png';
import Image from "next/image";


const NotFoundPage = () => {

    const picIdx = Math.floor(Math.random() * 3);
    const pageContents = {
        0: ['No Letter, no manga here', wut0],
        1: ['What even is that, Letter?', wut1],
        2: ['Good try letter, but no...', wut2],
    }

    return (
        <div className="flex flex-col items-center">
            <Navbar/>
            <main className="mt-20 flex flex-col items-center">
                <div className="font-sigmarOne text-rose-500 text-2xl">{pageContents[picIdx][0]}</div>
                <Image
                    src={pageContents[picIdx][1]}
                    alt="Error img"
                    className="w-1/2 rounded-xl"
                />
                <h3 className="mt-3 font-robotoCondensed text-3xl">Not Found :(</h3>
            </main>
        </div>
    )
}


export default NotFoundPage;