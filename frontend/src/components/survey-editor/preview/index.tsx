import react, { useState, useEffect } from "react";
import { Divider, Layout } from 'antd';
import { SortingView } from "../customSurveyComponents/Sorting";
import { SortingCardBinData } from "../customSurveyComponents/Sorting/type";
import { TextInputView } from "../customSurveyComponents/TextInput";
import { RankView } from '../customSurveyComponents/Rank';
import { RadioInputView } from "../customSurveyComponents/RadioInput";
import { CheckboxView } from "../customSurveyComponents/Checkbox";
import { SurveyJson, ComponentData, Page } from "../type";
import "./index.css";

interface PreviewProps {
  surveyJson: SurveyJson;
};

export default function Preview(props:PreviewProps) {
  const [surveyJson, setSurveyJson] = useState<SurveyJson>(props.surveyJson || {});
  
  useEffect(() => {
    console.log('[Preview] surveyJson: ', props.surveyJson);
    setSurveyJson(props.surveyJson);
  }, [props.surveyJson])

  const parseComponent = (data: ComponentData) => {
    switch (data.type) {
      case 'text':
        return <TextInputView key={data.id} data={data} />;
      case 'radio':
        return <RadioInputView key={data.id} data={data} />;
      case 'sortcard':
        return <SortingView key={data.id} data={data as SortingCardBinData} />;
      case 'rank':
        return <RankView key={data.id} data={data} />;
      case 'checkbox':
        return <CheckboxView key={data.id} data={data} />;
      default:
        return null;
    }
  };

  const parsePage = (page: Page) => (
    <div key={page.id} className="page">
      <h2>{page.name}</h2>
      {page.description && <p>{page.description}</p>}
      {page.elements?.map((element) => parseComponent(element as ComponentData))}
    </div>
  );

  if(!surveyJson) {
    return (<Layout className="preview-web-panel">
      <h1 style={{"marginTop": "200px"}}>No Survey Data</h1>
    </Layout>);
  }

  return (<Layout className="preview-web-panel">
    <h1>{surveyJson.surveyName}</h1>
    <Divider style={{ backgroundColor: "#7afe90" }} />
    {surveyJson.pages.map(parsePage)}
    <div className='log'>
      {JSON.stringify(surveyJson)}
    </div>
  </Layout>)
}
/*
// mock data
const cardData = {
    cardList: [
      {
        id: '1',
        title: 'Card 1',
        description: 'Card 1',
        cardImage: 'https://www.google.com/logos/doodles/2023/st-patricks-day-2023-6753651837109680.2-s.png',
        isAvailable: true,
      }
    ],
    cardCount: 0,
    binList: [{
      id: '1',
      title: 'Bin 1',
    },
    {
      id: '2',
      title: 'Bin 2',
    }],
    binCount: 0,
    sorting: {}
  }
  const sortingProps = {
    label: "Sorting",
    data: cardData,
    syncData: (name: string, value: string) => {},
    name: 'sorting',
  }
 */