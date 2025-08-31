import CoreLayout from "@/layouts/Core";
import Theaters from "@/pages/home/partials/Theaters";
import SearchDiv from "@/pages/home/partials/SearchDiv";
import PlatformContents from "@/pages/home/partials/PlatformContents";
import MovieUpComing from "./partials/MovieUpComing";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const { user, loading } = useAuth();

  return (
    <CoreLayout user={user || null} title="Anasayfa" loading={loading}>
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
