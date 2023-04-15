import react, { useState } from "react";
import { Layout } from 'antd';
import ReactJson from 'react-json-view';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { setSurveyJson } from "../../../store/surveySlice";
import { SurveyJson, Page } from "../type";
import "./index.css";


export default function JsonPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const surveyJson = useSelector((state: RootState) => state.survey.surveyJson);
  const handleSetSurveyJson = (surveyJson: SurveyJson) => {
    dispatch(setSurveyJson(surveyJson));
  };
  return (<Layout className="json-panel">
    <ReactJson src={surveyJson} theme="apathy:inverted" name="SurveyData" collapsed={false} sortKeys={true} displayDataTypes={false} />
  </Layout>)
}