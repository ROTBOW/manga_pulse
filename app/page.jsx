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

      {
        popTitles.length != 0 ?
          <Carousel mangas={popTitles}/>
        :
        <div>no data</div> // to be replaced with a loading component
      }

      <Suspense>
        <LatestChapters chapters={latestChaps}/>
      </Suspense>

      <div style={{height: "800px"}}></div>
    </div>
  );
}


export default Home;