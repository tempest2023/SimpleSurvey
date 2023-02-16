export type SortingCard = {
  id: string;
  title: string;
  description: string;
  cardImage: string; // base64 encoded string
  isAvailable: boolean;
};

export type SortingBin = {
  id: string;
  title: string;
};

export type SortingCardBinData = {
  cardCount: number;
  cardList: Array<SortingCard>;
  binCount: number;
  binList: Array<SortingBin>;
  sorting: {
    [name: string]: Array<SortingCard>;
  };
}
