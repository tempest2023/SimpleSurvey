import { SurveyCustomComponentProps, SurveyComponentData, updateDataFn } from "../../type";

export const RadioInputView = ({ data, updateData }: { data: SurveyComponentData, updateData: updateDataFn }) => {
  if (!data) {
    return <div>No data in Rank Component</div>;
  }
  return <div></div>;
};

export const RadioInputConfig = ({ data }: { data: SurveyCustomComponentProps }) => {
  if (!data) {
    return <div>No data in Rank Config</div>;
  }
  return <div></div>;
};
