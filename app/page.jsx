import Image from "next/image";
import Navbar from "@/components/navbar/navbar";

import { getLatestChapters, getPopTitles } from "@/utils/getReq";
import Carousel from "@/components/homePageComps/carousel/carousel";
import { Suspense } from "react";
import LatestChapters from "@/components/homePageComps/latestChapters/latestChapters";



const Home = async () => {
  let popTitles = await getPopTitles();
  let latestChaps = await getLatestChapters();
  
  return (
    <div className="flex flex-col items-center">
      <Navbar/>

      <Suspense>
        <Carousel mangas={popTitles}/>
      </Suspense>

      <Suspense>
        <LatestChapters chapters={latestChaps}/>
      </Suspense>

      <div style={{height: "800px"}}></div>
    </div>
  );
}


export default Home;