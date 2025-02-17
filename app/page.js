import Image from "next/image";
import Navbar from "@/components/navbar/navbar";

import { getPopTitles } from "@/utils/getReq";
import { getCoverUrl } from "@/utils/mangaManipulation";



const Home = async () => {
  let popTitles = await getPopTitles();
  
  return (
    <div className="flex flex-col items-center">
      <Navbar/>

      {
        popTitles.length != 0 ?
          <div>
            {popTitles[0].attributes.title.en}
            <Image src={getCoverUrl(popTitles[0])} width="100" height="100" alt='manga cover'/>
          </div>
        :
        <div>no data</div> // to be replaced with a loading component
      }

    </div>
  );
}


export default Home;