import { PropsWithChildren } from "react";
import classNames from "classnames";
import { User } from "@/types";
import Footer from "@/Components/Footer";
import ScrollToTopButton from "@/Components/ScrollToTop";
import Header from "@/Components/Header";

const CoreLayout = ({ user, title, big = false, children }: PropsWithChildren<{ user?: User; title: string; big?: boolean }>) => {
  return (
    <>
      <Header user={user} title={title} />
      <div
        className={classNames("w-full mb-8 mx-auto mt-16", "relative", {
          "xl:w-3/5 lg:w-3/4 sm:w-11/12": !big,
          "max-w-screen-xl": big,
        })}
      >
        <div className="w-full h-full">{children}</div>
      </div>
      <ScrollToTopButton />
      <Footer />
    </>
  );
};

export default CoreLayout;
