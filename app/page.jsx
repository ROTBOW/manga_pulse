import { getDevRec } from "@/utils/getReq";

import LatestChapters from "@/components/homePageComps/latestChapters/latestChapters";
import Carousel from "@/components/homePageComps/carousel/carousel";
import DevRec from "@/components/homePageComps/devRec/devRec";
import Navbar from "@/components/navbarComps/navbar/navbar";

const Home = async () => {
  let devRec = await getDevRec();
  
  return (
    <div className="flex flex-col items-center">
      <Navbar />

      <Carousel />
      <LatestChapters />
      <DevRec mangas={devRec} />

      <footer className="mt-20 mb-4 pt-4 border-t border-gray-700 flex w-11/12 sm:w-4/5 max-w-7xl justify-center font-robotoCondensed text-sm text-emerald-400">
        <div>Created by Josiah L • Powered by the Mangadex API</div>
      </footer>
    </div>
  );
}


export default Home;
