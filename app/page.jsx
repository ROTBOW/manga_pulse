import { getDevRec, getLatestChapters, getPopTitles } from "@/utils/getReq";
import { Suspense } from "react";

import LatestChapters from "@/components/homePageComps/latestChapters/latestChapters";
import Carousel from "@/components/homePageComps/carousel/carousel";
import DevRec from "@/components/homePageComps/devRec/devRec";
import Navbar from "@/components/navbarComps/navbar/navbar";



const Home = async () => {
  let popTitles = await getPopTitles();
  let latestChaps = await getLatestChapters();
  let devRec = await getDevRec();
  
  return (
    <div className="flex flex-col items-center">
      <Navbar/>

      
      <Carousel mangas={popTitles}/>

      <Suspense>
        <LatestChapters chapters={latestChaps}/>
      </Suspense>

      <Suspense>
        <DevRec mangas={devRec}/>
      </Suspense>

      <div style={{height: "100px"}}></div>

      <footer className="mb-2 flex w-full justify-around font-robotoCondensed text-sm text-emerald-400">
        <div>Create by Josiah L with the Mangadex API</div>
      </footer>
    </div>
  );
}


export default Home;