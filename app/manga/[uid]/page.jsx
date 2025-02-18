import { notFound } from "next/navigation";
import Navbar from "@/components/navbar/navbar";
import { getManga } from "@/utils/getReq";



const Manga = async ({ params }) => {
    const UID = (await params).uid;
    const manga = await getManga(UID);

    // check if there is a manga with that UID or else redirect to 404 page
    if (manga === -1) {
        // got a bad request
        notFound();
    }

    return (
        <div className="flex flex-col items-center">
            <Navbar/>
            {UID}
        </div>
    )
};

export default Manga;