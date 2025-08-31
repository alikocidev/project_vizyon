import { PropsWithChildren } from "react";
import classNames from "classnames";
import { User } from "@/types";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTopButton from "@/components/ScrollToTop";

const CoreLayout = ({
  user,
  title,
  expand = false,
  loading = false,
  children,
}: PropsWithChildren<{ user: User | null; title: string; expand?: boolean; loading?: boolean }>) => {
  return (
    <>
      <Header user={user} title={title} loading={loading} />
      <div
        className={classNames("mx-auto my-16 relative", {
          "xl:w-3/5 lg:w-3/4 sm:w-11/12": !expand,
          "max-w-screen-xl": expand,
        })}
      >
        {children}
      </div>
      <ScrollToTopButton />
      <Footer />
    </>
  );
};

export default CoreLayout;
