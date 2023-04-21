import { Rule } from 'antd/lib/form';
import { SurveyCustomComponentProps, SurveyComponentData } from '../../type';

export interface PageData extends SurveyComponentData {
  type: "page";
  title?: string;
  description?: string;
}

export interface PageSurveyCustomComponentProps extends SurveyCustomComponentProps {}