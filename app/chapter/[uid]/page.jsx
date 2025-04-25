'use client'

import Navbar from "@/components/navbarComps/navbar/navbar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";





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

        // build urls and add them to pages array
        setPages(_ => {
            let pageUrls = [];

            for (let i = 0; i < data.chapter.data.length; i++) {
                let url = data.baseUrl;
                url += "/data/";
                url += data.chapter.hash;
                url += `/${data.chapter.data[i]}`;

                pageUrls.push(url);
            }

            return pageUrls;
        })

    }, [data]);

    return (
        <div className="flex flex-col items-center">
            <Navbar displayType='block'/>
            <div id="rdr" className="w-full h-screen">
                {
                    pages.map(page => (
                        <img
                            src={page}
                            key={page}
                            width="1500"
                            height="1500"
                        />
                    ))
                }
            </div>
        </div>
    )
}


export default Reader;