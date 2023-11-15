import { useEffect, useState } from "react";
import Search from "./Search";
import Table from "./Table";

const startPath =
  location.pathname.at(-1) === "/"
    ? location.pathname
    : location.pathname + "/";
export default function Router() {
  const [path, setPath] = useState("");
  useEffect(() => {
    setPath(location.pathname);
  }, []);
  window.addEventListener("popstate", () => {
    setPath(location.pathname);
  });

  function updatePath(newPath: string) {
    console.log({ newPath, startPath });
    const path = startPath + newPath;
    history.pushState({}, "", path);
    setPath(path);
  }

  if (path.includes("/nagrody/")) {
    return <Table />;
  } else {
    return <Search setPath={updatePath} />;
  }
}
