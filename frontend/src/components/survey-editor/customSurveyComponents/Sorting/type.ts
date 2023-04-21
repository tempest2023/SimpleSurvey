import { Rule } from 'antd/lib/form';
import { SurveyCustomComponentProps, SurveyComponentData } from '../../type';

export type SortingCard = {
  id: string;
  title: string;
  description: string;
  rank: number,
  cardImage: string; // base64 encoded string
  isAvailable: boolean;
  isMoved?: boolean; // for rendering check if this card is moved to bin
};

export type SortingBin = {
  id: string;
  title: string;
};

export interface SortingCardBinData extends SurveyComponentData {
  type: "sortcard";
  cardList: Array<SortingCard>;
  binList: Array<SortingBin>;
  sorting: {
    [name: string]: Array<SortingCard>;
  };
}

export interface SortingConfigProps extends SurveyCustomComponentProps {
  data?: SortingCardBinData;
}

export interface SortingCardProps {
  label: string;
  data: Record<string, any>;
  syncData: (name: string, value: string) => void;
  name: string;
  rules?: Rule[];
}
