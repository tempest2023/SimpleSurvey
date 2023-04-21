import { Rule } from 'antd/lib/form';
import { SurveyCustomComponentProps, SurveyComponentData } from '../../type';

export interface TextInputData extends SurveyComponentData {
  type: "text";
  title: string;
  value: string;
  [key: string]: string;
}

export interface TextInputConfigProps extends SurveyCustomComponentProps {
  data?: TextInputData;
}

export interface TextInputProps {
  label: string;
  data: Record<string, string>;
  syncData: (name: string, value: string) => void;
  name: string;
  rules?: Rule[];
}