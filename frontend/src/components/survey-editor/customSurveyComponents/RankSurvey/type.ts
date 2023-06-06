import { SurveyCustomComponentProps, SurveyComponentData } from '../../type';
import { SortingCard } from '../Sorting/type';
export type RadioItem = {
  id: string;
  text: string;
}

export interface RadioInputItem {
  id: string;
  title: string;
  radioItemList: Array<RadioItem>; // The options of this radio input
  hidden?: boolean; // Whether this radio input is hidden by default
  choice: string|null; // The selected options value
}

export interface RadioInputData extends SurveyComponentData {
  type: "ranksurvey";
  title?: string; // The title of this radio input component
  // each radio input component contains many radio inputs, each radio input has RadioInputItem type
  radioInputList?: Array<RadioInputItem>;
  radioTaskList?: Array<RadioInputData>;
  rankList: SortingCard[];
}

export interface RadioInputConfigProps extends SurveyCustomComponentProps {
  data?: RadioInputData;
}
