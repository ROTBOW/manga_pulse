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
          // <div>
          //   {popTitles[0].attributes.title.en}
          //   <Image src={getCoverUrl(popTitles[0])} width="400" height="100" alt='manga cover'/>
          // </div>
        :
        <div>no data</div> // to be replaced with a loading component
      }

    </div>
  );
}


export default Home;