import { useEffect, useState } from "react";
import { nobelPrizes } from "./data";

export default function Search({ setPath }: { setPath: (a: string) => void }) {
  const languages = { Angielski: "en", Norweski: "no", Szwedzki: "se" };
  const languagesFlags = { Angielski: "🇬🇧", Norweski: "🇳🇴", Szwedzki: "🇸🇪" };
  const langs = Object.keys(languages) as (keyof typeof languages)[];

  const [language, setLanguage] = useState(langs[0]);
  const [years, setYears] = useState<number[]>([]);
  const [year, setYear] = useState<null | number>(null);

  function changeLanguage() {
    let i = langs.findIndex((l) => language === l) + 1;
    if (i >= langs.length) i = 0;
    setLanguage(langs[i]);
  }

  useEffect(() => {
    setYears([...new Set(nobelPrizes.map((np) => parseInt(np.awardYear)))]);
  }, []);

  return (
    <>
      <h2>Wybierz z którego roku nagrody Nobla chcesz zobaczyć</h2>
      <select
        className="year-select"
        onChange={(e) =>
          setYear(e.target.value ? parseInt(e.target.value) : null)
        }
      >
        <option value="">Wybierz rok</option>
        {years.map((y) => (
          <option value={y} key={y}>
            {y}
          </option>
        ))}
      </select>
      <br />
      <br />
      <button
        disabled={year === null}
        onClick={() => setPath(`nagrody/${languages[language]}/${year}`)}
      >
        Wyszukaj nagrody
      </button>
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <span onClick={changeLanguage}>
          Język: {language} {languagesFlags[language]}
        </span>
      </div>
    </>
  );
}
