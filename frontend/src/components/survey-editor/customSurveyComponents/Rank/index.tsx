import { ComponentConfigProps, SurveyComponentData } from "../../type";

export const RankView = ({ data }: { data: SurveyComponentData }) => {
  if (!data) {
    return <div>No data in Rank Component</div>;
  }
  return <div></div>;
};

export const RankConfig = ({ data }: { data: ComponentConfigProps }) => {
  if (!data) {
    return <div>No data in Rank Config</div>;
  }
  return <div></div>;
};
