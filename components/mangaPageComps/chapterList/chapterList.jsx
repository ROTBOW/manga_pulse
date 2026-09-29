'use client'

import ListVol from "../chapterListVol/chapterListVol";
import { useState, useEffect } from 'react';

import LoadingSpinner from "@/components/loadingSpinner/loadingSpinner";
import { usePreferences } from "@/components/navbarComps/preferencesProvider";


const ChapterList = ({mangaUID}) => {
    const [chapters, setChapters] = useState([]);
    const [order, setOrder] = useState('desc');
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const {langs, preferencesReady} = usePreferences();

    useEffect(() => {
        if (!preferencesReady) return;

        const controller = new AbortController();

        const getData = async () => {
            setLoading(true);
            setError('');
            setChapters([]);

            try {
                const query = new URLSearchParams({
                    uid: mangaUID,
                    order: order,
                    langs: JSON.stringify(langs),
                    offset: 0
                });
                const res = await fetch(`/api/getMangaFeed?${query}`, {
                    signal: controller.signal
                });

                if (!res.ok) throw new Error('Could not load chapters.');

                const data = await res.json();

                if (!Array.isArray(data.data)) throw new Error('Invalid chapter response.');
                if (controller.signal.aborted) return;

                setChapters(data.data);
            } catch (error) {
                if (!controller.signal.aborted) {
                    setError('Could not load chapters. Try changing your preferences again.');
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        getData();

        return () => controller.abort();
    }, [mangaUID, order, langs, preferencesReady]);

    const toggleOrder = () => {
        setOrder(ord => ((ord === 'asc') ? 'desc' : 'asc'));
    };

    const genVolumes = () => {
        let volumes = [];
        
        let vols = [];
        let vol = [chapters[0]];
        for (let i = 1; i < chapters.length; i++) {

            if (vol[0].attributes.volume === chapters[i].attributes.volume) {
                vol.push(chapters[i]);
            } else {
                vols.push(vol);
                vol = [chapters[i]];
            };
        }
        vols.push(vol);
        
        for (let i = 0; i < vols.length; i++) {
            let volume = vols[i]
            volumes.push(
                <ListVol volume={volume} key={i}/>
            )
        }

        return volumes;
    }

    if (loading) {
        return (
            <div className="flex w-full md:w-3/5 items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || chapters.length === 0) {
        return (
            <p className="w-full md:w-3/5 p-4" role="status">
                {error || 'No chapters available in your selected languages.'}
            </p>
        );
    }

    return(
        <>
            <div className="hidden md:block">
                <button className="px-1 w-12 bg-gray-800 hover:bg-gray-600 rounded-sm capitalize" onClick={()=>toggleOrder()}>{order}</button>
            </div>

            <ol className="w-full md:w-3/5 mr-3">
                {genVolumes()}  
            </ol>
        </>
    )
};


export default ChapterList;