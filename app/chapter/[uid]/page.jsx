'use client'

import Navbar from "@/components/navbarComps/navbar/navbar";
import { getChapterPages } from "@/utils/getReq";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";





const Reader = () => {
    const params = useParams();
    const [ data, setData ] = useState(null);
    const [ pages, setPages ] = useState([]);

    
    useEffect(() => {
        // scroll navbar out of view for the reader
        const rdr = document.getElementById("rdr");
        rdr.scrollIntoView({behavior: 'smooth'});
        
        // get data
        const fetchPages = async () => {
            const res = await fetch(`/api/getChapterPages/${params.uid}`);
            setData(await res.json());

        }
        
        fetchPages();
    }, [])

    useEffect(() => {
        if (data === null) return; // if we don't have the data yet we ignore
        console.log(data);
        // build urls and add them to pages array
    }, [data]);

    return (
        <div className="flex flex-col items-center">
            <Navbar displayType='block'/>
            <div id="rdr" className="w-full h-screen">
                reader boi
            </div>
        </div>
    )
}


export default Reader;