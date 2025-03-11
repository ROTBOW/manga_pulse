import letterBuild from "@/public/images/WIP.png";
import Navbar from "@/components/navbarComps/navbar/navbar";
import Image from "next/image";


const WIP = () => {

    return (
        <div className="flex flex-col items-center">
            <Navbar/>

            <div className="w-screen h-screen flex justify-center items-center flex-col">
                <Image 
                    src={letterBuild}
                    width='400'
                    height='400'
                    alt="Letter running to build this page!"
                    className="rounded-md mt-16"
                />
                <p className="mt-8 font-sigmarOne text-3xl text-rose-500">
                    Under construction!
                </p>
            </div>
        </div>
    )
}

export default WIP;