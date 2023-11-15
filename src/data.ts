export let nobelPrizes: NobelPrize[] = [];
export async function setNobelPrizes() {
  nobelPrizes = (
    await fetch("https://api.nobelprize.org/2.1/nobelPrizes").then((res) =>
      res.json(),
    )
  ).nobelPrizes;
}

export interface NobelPrize {
  awardYear: string;
  category: { en: string; no: string; se: string };
  dateAwarded: string;
  prizeAmount: number;
  prizeAmountAdjusted: number;
}
