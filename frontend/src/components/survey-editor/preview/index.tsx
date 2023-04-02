import react, { useState, useEffect } from "react";
import { Divider, Layout } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { setSurveyJson } from "../../../store/surveySlice";
import { PageView } from "../customSurveyComponents/Page";
import { SortingView } from "../customSurveyComponents/Sorting";
import { TextInputView } from "../customSurveyComponents/TextInput";
import { RankView } from "../customSurveyComponents/Rank";
import { RadioInputView } from "../customSurveyComponents/RadioInput";
import { CheckboxView } from "../customSurveyComponents/Checkbox";
import { SurveyJson, ComponentData, Page, SurveyComponentData } from "../type";
import "./index.css";

export default function Preview() {
  const dispatch = useDispatch<AppDispatch>();
  const surveyJson = useSelector((state: RootState) => state.survey.surveyJson);
  const handleSetSurveyJson = (surveyJson: SurveyJson) => {
    dispatch(setSurveyJson(surveyJson));
  };

  const parseComponent = (data: ComponentData) => {
    switch (data.type) {
      case "text":
        return <TextInputView key={data.id} data={data} />;
      case "radio":
        return <RadioInputView key={data.id} data={data} />;
      case "sortcard":
        return <SortingView key={data.id} data={data} />;
      case "rank":
        return <RankView key={data.id} data={data} />;
      case "checkbox":
        return <CheckboxView key={data.id} data={data} />;
      default:
        return null;
    }
  };
  // parse surveyJson to render the pages and components
  const parsePage = (page: Page) => (
    <div key={page.id} className="page">
      <PageView data={{
        type: 'page',
        name: 'page',
        title: page.title,
        description: page.description,
        id: page.id
      } as SurveyComponentData} />
      {page.elements?.map((element) =>
        parseComponent(element as ComponentData)
      )}
    </div>
  );

  if (!surveyJson) {
    return (
      <Layout className="preview-web-panel">
        <h1 style={{ marginTop: "200px" }}>No Survey Data</h1>
      </Layout>
    );
  }

  return (
    <Layout className="preview-web-panel">
      <div className="container">
        <h3>{surveyJson.surveyName}</h3>
        <Divider />
        {surveyJson.pages.map(parsePage)}
      </div>
    </Layout>
  );
}
