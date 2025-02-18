import Image from "next/image";
import Navbar from "@/components/navbar/navbar";

import { getPopTitles } from "@/utils/getReq";
import { getCoverUrl } from "@/utils/mangaManipulation";
import Carousel from "@/components/carousel/carousel";



const Home = async () => {
  let popTitles = await getPopTitles();
  
  return (
    <div className="flex flex-col items-center">
      <Navbar/>

      {
        popTitles.length != 0 ?
          <Carousel mangas={popTitles}/>
        :
        <div>no data</div> // to be replaced with a loading component
      }

      <div style={{height: "800px"}}></div>
    </div>
  );
}


export default Home;