'use client'
import { useEffect, useState } from "react";

import ContentPrefMenu from "./contentPrefMenu/contentPrefMenu";

const navComps = [
    ContentPrefMenu,
]


const ProfileModal = ({hideModal}) => {
    const [curSubModal, setCurSubModal] = useState(-1);

    const renderMenu = () => {

        if (curSubModal !== -1) {
            let Comp = navComps[curSubModal];
            return <Comp resetView={setCurSubModal} />
        }

        return (
            <>
                <h3 className="text-rose-500 text-xl border-b w-full text-center border-emerald-400 mb-2">Options</h3>

                <div
                    onClick={() => setCurSubModal(0)}
                    className="mb-2 border-b hover:text-rose-500 cursor-pointer"
                >Content Filter</div>

                <div className="mb-2 border-b hover:text-rose-500 cursor-pointer">Chapter Languages</div>
            </>

        )
    }

    return (
        <div className="absolute">
            <div
                className="fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-50 z-40"
                onClick={() => {hideModal(false)}}
            />

            <div 
                className="z-50 fixed bg-gray-800 p-2 w-80 rounded mt-4 flex flex-col items-center"
                style={{right: "17%"}}
            >
                {
                    renderMenu()
                }
            </div>
        </div>
    )
};

export default ProfileModal;