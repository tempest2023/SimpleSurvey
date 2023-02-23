export interface SurveyComponent {
  id: string;
  type: string;
  name: string;
  title?: string;
}

export interface TextInput extends SurveyComponent {
  type: "input";
}

export interface RadioGroupInput extends SurveyComponent {
  type: "radiogroup";
  choices: Array<string>;
}

export interface CheckBoxInput extends SurveyComponent {
  type: "checkbox";
  choices: Array<string>;
}

export interface RatingInput extends SurveyComponent {
  type: "rating";
  rateMin: number;
  rateMax: number;
}

export interface Page {
  id: string;
  name: string;
  description?: string;
  elements: Array<SurveyComponent> | null;
}

export interface SelectedData {
  componentId: string;
  componentType: string;
  data: SurveyComponent;
};

export interface SurveyJson {
  surveyId: string;
  surveyName: string;
  pages: Array<Page>;
}