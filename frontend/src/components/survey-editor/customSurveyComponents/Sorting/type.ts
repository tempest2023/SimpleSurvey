import { Rule } from 'antd/lib/form';
import { ComponentConfigProps, SurveyComponentData, ComponentData } from '../../type';

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

export interface SortingCardBinData extends SurveyComponentData {
  type: "sortcard";
  title: string;
  cardCount: number;
  cardList: Array<SortingCard>;
  binCount: number;
  binList: Array<SortingBin>;
  sorting: {
    [name: string]: Array<SortingCard>;
  };
}

export interface SortingConfigProps extends ComponentConfigProps {
  data: SortingCardBinData;
}

export interface SortingCardProps {
  label: string;
  data: Record<string, any>;
  syncData: (name: string, value: string) => void;
  name: string;
  rules?: Rule[];
}
