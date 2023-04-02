import { ComponentConfigProps, SurveyComponentData } from "../../type";

export const CheckboxView = ({ data }: { data: SurveyComponentData }) => {
  if (!data) {
    return <div>No data in Checkbox Component</div>;
  }
  return <></>;
};

export const CheckboxConfig = ({ data, updateData }: ComponentConfigProps) => {
  if (!data || !updateData) {
    return <div>No data in Checkbox Config</div>;
  }
  return <></>;
};
