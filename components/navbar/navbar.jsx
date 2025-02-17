import Image from 'next/image';
import Link from 'next/link';

import profileIcon from '@/public/icons/account_circle.svg';
import menuButton from '@/public/icons/menu.svg';

const Navbar = () => {

    return (
        <>
            <div className="h-20"/>
            <header className="fixed top-2 flex justify-between w-2/3 font-sigmarOne">
                <div className='flex items-center'>
                    <div className='rounded-md bg-gray-700 mr-3'>
                        <Image
                            src={menuButton}
                            alt="button to open sidebar"
                            className='w-11'
                        />
                    </div>
                    <Link href='/'><h1 className='font-bold text-2xl'>MangaPulse</h1></Link>
                    
                </div>
        
                <div className='flex items-center'>
                    <input
                        placeholder="search"
                        type='text'
                        className="bg-gray-700 rounded-xl p-1 mr-2 h-1/2 text-sm"
                    />

                    <div className='rounded-full bg-gray-700'>
                        <Image
                            src={profileIcon}
                            alt="profile icon"
                            className='w-10'
                        />
                    </div>
                </div>
            </header>
        </>
    )
}

export default Navbar;

