import CoreLayout from "@/Layouts/Core";
import Theaters from "@/Pages/Home/Partials/Theaters";
import SearchDiv from "@/Pages/Home/Partials/SearchDiv";
import PlatformContents from "@/Pages/Home/Partials/PlatformContents";
import MovieUpComing from "./Partials/MovieUpComing";
import { useAuth } from "@/Providers/Auth";

const Home = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <CoreLayout user={user || undefined} title="Anasayfa">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </CoreLayout>
    );
  }

  return (
    <CoreLayout user={user || undefined} title="Anasayfa">
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
