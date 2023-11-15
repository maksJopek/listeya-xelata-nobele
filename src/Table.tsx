import { ReactNode, useEffect, useState } from "react";
import { nobelPrizes } from "./data";

export default function Table() {
  const year = location.pathname.split("/").pop();
  //@ts-expect-error Split exists on this type
  const lang = location.pathname.match(/\/nagrody\/.*\//g)[0].split("/")[2] as
    | "en"
    | "no"
    | "se";
  const cols = {
    awardYear: "Rok przyznania",
    category: "Kategoria",
    dateAwarded: "Data przyznania nagrody",
    prizeAmount: "Kwota nagrody",
  };
  const colsKeys = Object.keys(cols) as (keyof typeof cols)[];
  const [filterText, setFilterText] = useState("");
  const [sortCol, setSortCol] = useState("awardYear");
  //eslint-disable-next-line
  let [sortDir, setSortDir] = useState(true);
  const [trs, setTrs] = useState<ReactNode[]>([]);

  function updateTrs(col: string, inverseDir = true) {
    if (inverseDir && col === sortCol) sortDir = !sortDir;
    if (col !== sortCol) setSortCol(col);

    const npz = nobelPrizes.filter((np) => {
      if (np.awardYear !== year) return false;
      if (filterText === "") return true;

      const ft = filterText.toLowerCase();

      return (
        np.awardYear.toLowerCase().includes(ft) ||
        np.category[lang].toLowerCase().includes(ft) ||
        formatDate(np.dateAwarded)?.toLowerCase().includes(ft) ||
        np.prizeAmount.toString().toLowerCase().includes(ft)
      );
    });
    npz.sort((npA, npB) => {
      switch (col) {
        case "awardYear":
          return (
            (parseInt(npA.awardYear) - parseInt(npB.awardYear)) *
            (sortDir ? 1 : -1)
          );
        case "category":
          return sortDir
            ? npA.category[lang].localeCompare(npB.category[lang])
            : npB.category[lang].localeCompare(npA.category[lang]);
        case "dateAwarded":
          return (
            // @ts-expect-error Subtracting dates return the difference in their unix timestamps
            (new Date(npA.dateAwarded) - new Date(npB.dateAwarded)) *
            (sortDir ? 1 : -1)
          );
        case "prizeAmount":
          return (npA.prizeAmount - npB.prizeAmount) * (sortDir ? 1 : -1);
        default:
          return 1;
      }
    });
    let key = 0;
    setTrs(
      npz.map((np) => (
        <tr key={key++}>
          <td>{np.awardYear}</td>
          <td>{np.category[lang]}</td>
          <td>{formatDate(np.dateAwarded)}</td>
          <td>
            {np.prizeAmount
              .toString()
              .match(/.{1,3}/g)
              ?.join(" ")}
            &nbsp;kr
          </td>
        </tr>
      )),
    );
    if (inverseDir && col === sortCol) setSortDir(sortDir);
  }
  function formatDate(date: string) {
    return date ? new Date(date).toLocaleDateString("pl-PL") : "-";
  }
  useEffect(() => updateTrs(sortCol, false), [filterText]);

  return (
    <>
      <h1>Nagrody nobla w roku {year}</h1>
      <table>
        <thead>
          <tr>
            {colsKeys.map((col) => (
              <th key={col} onClick={() => updateTrs(col)}>
                {cols[col]} &nbsp;
                {sortCol === col && (sortDir ? <>🡅</> : <>🡇</>)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{trs}</tbody>
      </table>
      <br />
      <br />
      <label>
        Filtruj&nbsp;
        <input onChange={(e) => setFilterText(e.target.value)} />
      </label>
      <br />
      <br />
      <label>
        Sortuj po:&nbsp;
        <select onChange={(e) => updateTrs(e.target.value)}>
          {colsKeys.map((col) => (
            <option key={col} value={col}>
              {cols[col]}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
