import type React from 'react';
import { ComponentType } from 'react';
import { SortingConfig } from '../customSurveyComponents/Sorting';
import { TextInputConfig } from '../customSurveyComponents/TextInput';
import { ComponentConfigProps, SurveyComponentData } from '../type';

// the common data type for all survey components
export type SurveyComponentType = {
  id?: string;
  name: string;
  type: string;
  config?: React.FC<ComponentConfigProps>;
  view?: (props: any) => JSX.Element | null;
}

// a HOC to wrap the config component to pass the SurveyComponentData
export const configWrapper = <P extends object>(
  WrappedComponent: ComponentType<P>,
  data: SurveyComponentData
): React.FC<P> => {
  const ConfiguredComponent: React.FC<P> = (props) => {
    const propsWithConfig = { ...props, ...data };
    return <WrappedComponent {...propsWithConfig} />;
  };
  return ConfiguredComponent;
};

// a survey component data list
export const surveyComponentData: SurveyComponentType[] = [
  {
    name: 'Sort Cards',
    type: 'sortcard',
    config: SortingConfig as React.FC<ComponentConfigProps>,
  },
  {
    name: 'Rank Cards',
    type: 'rankcard',
  },
  {
    name: 'Text Input',
    type: 'text',
    config: TextInputConfig as React.FC<ComponentConfigProps>,
  },
  {
    name: 'Radio Input',
    type: 'radio',
  },
  {
    name: 'Checkbox',
    type: 'checkbox',
  },
  {
    name: 'Rating',
    type: 'rating',
  },
  {
    name: 'Feedback Form',
    type: 'feedback',
  },
  {
    name: 'Description Text',
    type: 'description',
  },
  {
    name: 'Report & Summary',
    type: 'report',
  }
]


