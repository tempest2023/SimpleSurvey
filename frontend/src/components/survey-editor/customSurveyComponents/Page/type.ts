import { Rule } from 'antd/lib/form';
import { ComponentConfigProps, SurveyComponentData } from '../../type';

export interface PageData extends SurveyComponentData {
  type: "page";
  title?: string;
  description?: string;
}

export interface PageComponentConfigProps extends ComponentConfigProps {}