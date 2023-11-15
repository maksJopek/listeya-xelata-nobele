import { useEffect, useState } from "react";
import Router from "./Router";
import { setNobelPrizes } from "./data";

let loadOnce = false;
function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      if (loadOnce === false) {
        loadOnce = true;
        await setNobelPrizes();
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <>Loading nobel prizes</>;
  } else {
    return <Router />;
  }
}

export default App;
