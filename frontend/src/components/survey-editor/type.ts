import { TextInputData } from './customSurveyComponents/TextInput/type';
import { SortingCardBinData } from './customSurveyComponents/Sorting/type';
// type of components config props
export interface ComponentConfigProps {
  data: SurveyComponentData;
  updateData: (componentId: string, data: SurveyComponentData, isPage?: boolean) => void;
}

// the data structure of a survey component, after instantiation the id will be generated
export interface SurveyComponentData {
  id: string;
  type: string;
  name: string;
}

interface RadioInputData extends SurveyComponentData {
  type: 'radio';
  options: Array<string>;
}
interface RankData extends SurveyComponentData {
  type: 'rank';
  items: Array<string>;
}

interface CheckboxData extends SurveyComponentData {
  type: 'checkbox';
  options: Array<string>;
}


export type ComponentData = TextInputData | RadioInputData | SortingCardBinData | RankData | CheckboxData;

export interface Page {
  id: string;
  name: string;
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