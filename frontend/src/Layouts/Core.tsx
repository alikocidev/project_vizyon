import { PropsWithChildren } from "react";
import classNames from "classnames";
import { User } from "@/types";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTopButton from "@/components/ScrollToTop";

const CoreLayout = ({
  user = null,
  title,
  loading = false,
  children,
}: PropsWithChildren<{ user: User | null; title: string; loading?: boolean }>) => {
  return (
    <>
      <Header user={user} title={title} loading={loading} />
      <div className={classNames("relative my-16")}>
        <>{children}</>
      </div>
      <ScrollToTopButton />
      <Footer />
    </>
  );
};

export default CoreLayout;
