'use client'

import Navbar from "@/components/navbarComps/navbar/navbar";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";





const Reader = () => {
    // next nav consts
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    // reader state slice
    const [ data, setData ] = useState(null);
    const [ pages, setPages ] = useState([]);
    const [idx, setIdx] = useState(0);

    
    useEffect(() => {
        // scroll navbar out of view for the reader
        const rdr = document.getElementById("rdr");
        rdr.scrollIntoView({behavior: 'smooth'});

        // get page index
        setIdx(searchParams.get('page'));
        
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

    const nextPage = ( direction = 1 ) => {
        return () => {
            const param = new URLSearchParams(searchParams);
            let num = param.get('page');
            num = Number(num);
            
            param.set('page', num+direction);

            router.replace(`?${param.toString()}`, {scroll: false})
            setIdx(num+direction)
        }
    }

    return (
        <div className="flex flex-col items-center">
            <Navbar displayType='block'/>
            <div id="rdr" className="w-full h-screen flex flex-col items-center">
                <div className="absolute w-full flex justify-between">
                    <div className="bg-red-300 opacity-25 h-screen w-1/3" onClick={nextPage(-1)}/>
                    <div className="bg-amber-300 opacity-25 h-screen w-1/3"/>
                    <div className="bg-green-300 opacity-25 h-screen w-1/3" onClick={nextPage(1)}/>
                </div>
                {
                    <img
                        src={pages[idx]}
                        width="1500"
                        height="1500"
                        className="h-screen w-auto"
                    />
                } 
            </div>
        </div>
    )
}


export default Reader;