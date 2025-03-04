'use client'
import { useEffect, useState, useCallback } from 'react';
import ProfileModal from '../profileModal/ProfileModal';
import Image from 'next/image';
import Link from 'next/link';

import profileIcon from '@/public/web-app-manifest-512x512.png';
import menuButton from '@/public/icons/menu.svg';


const Navbar = () => {
    const [showBg, setShowBg] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const onScroll = useCallback(e => {
        const {scrollY} = window;
        
        if (scrollY > 50) {
            setShowBg(true);
        } else {
            setShowBg(false);
        }
    });

    useEffect(() => {
        window.addEventListener('scroll', onScroll, {passive: true});

        return () => {
            window.removeEventListener('scroll', onScroll, {passive: true});
        }
    }, []);

    return (
        <>
        <div className={`w-screen z-20 h-16 fixed top-0 pointer-events-none ${showBg ? 'bg-gray-800 border-b border-rose-500' : ''}`}/>
        <header className="fixed top-2 flex justify-center sm:justify-between w-full sm:w-2/3 font-sigmarOne z-50">
            <div className='flex items-center'>
                <div className={`rounded-md mr-1 ${showBg ? 'bg-gray-700' : ''}`}>
                    <Image
                        src={menuButton}
                        alt="button to open sidebar"
                        className='w-10'
                    />
                </div>
                <Link href='/'><h1 className='font-bold bg-opacity-90 p-1 text-2xl text-rose-500 drop-shadow-xl'>MangaPulse</h1></Link>
                
            </div>
    
            <div className='flex items-center'>
                <input
                    placeholder="search"
                    type='text'
                    className="bg-gray-700 rounded-xl p-1 mr-2 h-1/2 text-sm opacity-0 hidden sm:block"
                />
                {/* Need to show this again when I have search functionality */}
                {/* ^ has opacity-0 class - need to remove that later */}

                <div className={`p-1 rounded-full ${showBg ? 'bg-gray-700' : ''}`}>
                    <Image
                        src={profileIcon}
                        alt="profile icon"
                        className='w-10 rounded-full cursor-pointer'
                        onClick={() => {setShowProfileModal(true)}}
                    />
                    {
                        showProfileModal ? 
                            <ProfileModal hideModal={setShowProfileModal} /> :
                            ''
                    }
                </div>
            </div>
        </header>
        </>
    )
}

export default Navbar;

