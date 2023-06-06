import { SurveyCustomComponentProps, SurveyComponentData } from '../../type';

export type RadioItem = {
  id: string;
  text: string;
}

export interface RadioInputItem {
  id: string;
  title: string;
  radioItemList: Array<RadioItem>; // The options of this radio input
  choice: string|null; // The selected options value
}

export interface RadioInputData extends SurveyComponentData {
  type: "radio";
  // each radio input component contains many radio inputs, each radio input has RadioInputItem type
  radioInputList?: Array<RadioInputItem>;
}

export interface RadioInputConfigProps extends SurveyCustomComponentProps {
  data?: RadioInputData;
}
