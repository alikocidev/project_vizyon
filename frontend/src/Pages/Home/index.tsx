import CoreLayout from "@/Layouts/Core";
import Theaters from "@/Pages/Home/Partials/Theaters";
import SearchDiv from "@/Pages/Home/Partials/SearchDiv";
import PlatformContents from "@/Pages/Home/Partials/PlatformContents";
import MovieUpComing from "./Partials/MovieUpComing";
import { useAuth } from "@/Providers/Auth";

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
