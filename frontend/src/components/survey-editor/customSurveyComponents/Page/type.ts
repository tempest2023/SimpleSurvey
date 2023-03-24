import { Rule } from 'antd/lib/form';
import { ComponentConfigProps, SurveyComponentData } from '../../type';

export interface PageData extends SurveyComponentData {
  type: "page";
  id: string;
  name: string;
  [key: string]: string;
}

export interface PageComponentConfigProps extends ComponentConfigProps {
  data: PageData;
}