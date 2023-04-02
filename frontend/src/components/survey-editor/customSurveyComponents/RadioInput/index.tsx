import { ComponentConfigProps, SurveyComponentData } from "../../type";

export const RadioInputView = ({ data }: { data: SurveyComponentData }) => {
  if (!data) {
    return <div>No data in Rank Component</div>;
  }
  return <div></div>;
};

export const RadioInputConfig = ({ data }: { data: ComponentConfigProps }) => {
  if (!data) {
    return <div>No data in Rank Config</div>;
  }
  return <div></div>;
};
