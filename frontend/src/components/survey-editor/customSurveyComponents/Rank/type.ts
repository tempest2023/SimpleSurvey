import { ComponentConfigProps, SurveyComponentData } from '../../type';
import { SortingCard, SortingBin } from '../Sorting/type';

export interface SortingBinSelected extends SortingBin {
  selected: boolean;
}

export interface RankData extends SurveyComponentData {
  type: "rank";
  binList: SortingBinSelected[];
  // sorting data from Sorting Component
  sorting: {
    [name: string]: SortingCard[];
  };
  rankList: SortingCard[];
  limit: number;
}

export interface RankConfigProps extends ComponentConfigProps {
  data?: RankData;
}