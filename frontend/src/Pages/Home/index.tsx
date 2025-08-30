import CoreLayout from "@/layouts/Core";
import Theaters from "@/Pages/home/partials/theaters";
import SearchDiv from "@/Pages/home/partials/searchDiv";
import PlatformContents from "@/Pages/home/partials/platformContents";
import MovieUpComing from "./partials/movieUpComing";
import { useAuth } from "@/providers/auth";

const Home = () => {
  const { user, loading } = useAuth();

  return (
    <CoreLayout user={user || undefined} title="Anasayfa" loading={loading}>
      <section id="search-article">
        <SearchDiv />
      </section>
      <section id="theaters">
        <Theaters />
      </section>
      <section id="up-coming">
        <MovieUpComing />
      </section>
      <section id="platform-contents">
        <PlatformContents />
      </section>
    </CoreLayout>
  );
};

export default Home;
