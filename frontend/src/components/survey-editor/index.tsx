import react, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { setSurveyJson } from "../../store/surveySlice";
import { createSortRankSurveyJson } from "./utils";
import { notification, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Designer from "./designer";
import Preview from "./preview";
import Publish from './publish';
import JsonPanel from './jsonPanel';
import { getSurveyBySurveyId } from '../../requests';
import { useHistory, Link } from "react-router-dom";
import "./index.css";

function SurveyEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const updateSurveyJson = (surveyJson: any) => {
    dispatch(setSurveyJson(surveyJson));
  };
  useEffect(()=>{
    // get surveyId from url parameter
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get('surveyId');
    // console.log(`[debug] [survey-editor/index.tsx] surveyId: ${surveyId}`)
    async function getSurveyData(surveyId: string){
      const res = await getSurveyBySurveyId(surveyId);
      if(!res || !res._id){
        console.log(`[error] [survey-editor/index.tsx] get survey data failed: ${res.message}`)
        notification.error({
          message: `Get survey data failed: ${res.message}`
        })
        setTimeout(()=>{
          history.push('/projects');
        }, 1000)
        return;
      }
      // console.log(`[debug] [survey-editor/index.tsx] get survey data success: ${JSON.stringify(res)}`)
      if(Object.prototype.toString.call(res.content) === '[object String]'){
        res.content = JSON.parse(res.content);
      }
      if(!res.content || Object.keys(res.content).length === 0) {
        // set the survey json to default
        const defaultSurveyJson = createSortRankSurveyJson();
        // inject surveyId and surveyName to surveyJson
        defaultSurveyJson._surveyId = surveyId;
        defaultSurveyJson.surveyName = res.title;
        updateSurveyJson(defaultSurveyJson);
        return;
      }
      // inject surveyId and surveyName to surveyJson
      res.content._surveyId = surveyId;
      res.content.surveyName = res.title;
      updateSurveyJson(res.content);
    }
    if(surveyId){
      // load survey data
      getSurveyData(surveyId);
    }
  },[])
  const onChange = (key: string) => {
    console.log(`[debug] [survey-editor/index.tsx] tab changed to: [${key}]`);
  };
  
  const items: TabsProps['items'] = [
    {
      key: '6',
      label: <Link to="/projects">Projects</Link>,
    },
    {
      key: '1',
      label: `Designer`,
      children: <Designer />,
    },
    {
      key: '2',
      label: `Preview`,
      children: <Preview />,
    },
    // {
    //   key: '3',
    //   label: `Logic`,
    //   children: <LogicPanel />,
    // },
    {
      key: '4',
      label: `JSON`,
      children: <JsonPanel />,
    },
    {
      key: '5',
      label: `Publish`,
      children: <Publish />
    }
  ];
  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <DefaultTabBar {...props} className="survey-tabbar" />
  );
  return (
    <div className="survey-editor">
      <Tabs className="survey-tabs" defaultActiveKey="1" renderTabBar={renderTabBar} items={items} onChange={onChange} />
    </div>
  );
}

export default SurveyEditor;
