import { useAuth } from "@/hooks/useAuth";
import CoreLayout from "@/layouts/Core";
import Theaters from "@/pages/home/partials/Theaters";
import SearchDiv from "@/pages/home/partials/SearchDiv";
import PlatformContents from "@/pages/home/partials/PlatformContents";
import MovieUpComing from "@/pages/home/partials/MovieUpComing";
import { MetaHead, StructuredData } from "@/components/SEO";

const Home = () => {
  const { user, loading } = useAuth();

  return (
    <>
      <MetaHead
        title="Project Vizyon - Film ve Dizi Keşif Platformu"
        description="En yeni filmler, vizyondaki filmler, popüler diziler ve platform içerikleri ile film dünyasını keşfedin. Netflix, Disney+, Amazon Prime ve HBO'daki en iyi içerikleri bulun."
        url="/"
        keywords="film, dizi, sinema, vizyon, netflix, disney+, amazon prime, hbo, tmdb, imdb, popüler filmler, yeni çıkan filmler, film önerileri"
        type="website"
      />
      
      <StructuredData
        type="Organization"
        data={{}}
      />
      
      <StructuredData
        type="WebPage"
        data={{
          title: "Project Vizyon - Film ve Dizi Keşif Platformu",
          description: "En yeni filmler, vizyondaki filmler, popüler diziler ve platform içerikleri ile film dünyasını keşfedin.",
          url: "/"
        }}
      />

      <CoreLayout user={user} title="Anasayfa" loading={loading}>
        <section
          id="search-article"
          className="xl:w-3/5 lg:w-3/4 sm:w-11/12 mx-auto"
        >
          <SearchDiv />
        </section>
        <section id="theaters" className="xl:w-3/5 lg:w-3/4 sm:w-11/12 mx-auto">
          <Theaters />
        </section>
        <section id="up-coming" className="xl:w-3/5 lg:w-3/4 sm:w-11/12 mx-auto">
          <MovieUpComing />
        </section>
        <section id="platform-contents">
          <PlatformContents />
        </section>
      </CoreLayout>
    </>
  );
};

export default Home;
