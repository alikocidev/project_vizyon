import { useState, useEffect } from "react";
import { iMovie } from "@/types/movie.type";
import CoreLayout from "@/Layouts/Core";
import Theaters from "@/Pages/Home/Partials/Theaters";
import SearchDiv from "@/Pages/Home/Partials/SearchDiv";
import PlatformContents from "@/Pages/Home/Partials/PlatformContents";
import MovieUpComing from "./Partials/MovieUpComing";
import { iPlatform } from "@/types/platform.type";
import { useAuth } from "@/Providers/Auth";
import apiClient from "@/Services";

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const [theaters, setTheaters] = useState<iMovie[]>([]);
  const [upComings, setUpComings] = useState<iMovie[]>([]);
  const [platform, setPlatform] = useState<iPlatform | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch theaters
        const theatersResponse = await apiClient.get("/movie/theaters");
        setTheaters(theatersResponse.data || []);

        // Fetch upcoming movies
        const upComingsResponse = await apiClient.get("/movie/upcomings");
        setUpComings(upComingsResponse.data || []);

        // Fetch platform data (you might need to adjust this endpoint)
        try {
          const platformResponse = await apiClient.get("/platform/netflix/popular");
          setPlatform(platformResponse.data);
        } catch (platformError) {
          console.log("Platform data not available");
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (authLoading || loading) {
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
        <Theaters theaters={theaters} />
      </section>
      <section id="up-coming">
        <MovieUpComing upComings={upComings} />
      </section>
      {platform && (
        <section id="platform-contents">
          <PlatformContents platform={platform} />
        </section>
      )}
    </CoreLayout>
  );
};

export default Home;
