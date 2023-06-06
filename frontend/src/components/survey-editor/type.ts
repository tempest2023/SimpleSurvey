import { TextInputData } from './customSurveyComponents/TextInput/type';
import { SortingCardBinData } from './customSurveyComponents/Sorting/type';
import { RankData } from './customSurveyComponents/Rank/type';
// type of components config props

export type updateDataFn = (componentId: string, data: SurveyComponentData|Page, isPage?: boolean) => void;
export interface SurveyCustomComponentProps {
  data?: SurveyComponentData;
  updateData: updateDataFn;
  toNextPage?: () => void;
}

// the data structure of a survey component, after instantiation the id will be generated
export interface SurveyComponentData {
  id: string;
  type: string;
  name: string;
  [key: string]: any;
}

interface RadioInputData extends SurveyComponentData {
  type: 'radio';
  options: string[];
}

interface CheckboxData extends SurveyComponentData {
  type: 'checkbox';
  options: string[];
}

interface RankSurveyData extends SurveyComponentData {
  type: 'ranksurvey';
}

export type ComponentData = TextInputData | RadioInputData | SortingCardBinData | CheckboxData | RankData | RankSurveyData;

export interface Page {
  id: string;
  title?: string;
  description?: string;
  elements: Array<SurveyComponentData> | null;
}

export interface SurveyJson {
  _surveyId: string;
  surveyName: string;
  pages: Array<Page>;
}

export type SurveyComponentProps = {
  data: SurveyComponentData;
}