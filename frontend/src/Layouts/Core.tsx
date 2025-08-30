import { PropsWithChildren } from "react";
import classNames from "classnames";
import { User } from "@/types";
import Footer from "@/Components/Footer";
import ScrollToTopButton from "@/Components/ScrollToTop";
import Header from "@/Components/Header";

const CoreLayout = ({
  user,
  title,
  expand = false,
  loading = false,
  children,
}: PropsWithChildren<{ user?: User; title: string; expand?: boolean; loading?: boolean }>) => {
  return (
    <>
      <Header user={user} title={title} loading={loading} />
      <div
        className={classNames("w-full mx-auto my-16 relative", {
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
