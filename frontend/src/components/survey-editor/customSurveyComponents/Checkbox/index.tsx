import { SurveyCustomComponentProps, SurveyComponentData, updateDataFn } from "../../type";

export const CheckboxView = ({ data, updateData }: { data: SurveyComponentData, updateData: updateDataFn }) => {
  if (!data) {
    return <div>No data in Checkbox Component</div>;
  }
  return <></>;
};

export const CheckboxConfig = ({ data, updateData }: SurveyCustomComponentProps) => {
  if (!data || !updateData) {
    return <div>No data in Checkbox Config</div>;
  }
  return <></>;
};
