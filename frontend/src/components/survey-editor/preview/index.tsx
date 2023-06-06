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
import { RankSurveyView } from "../customSurveyComponents/RankSurvey";
import { SurveyJson, ComponentData, Page, SurveyComponentData } from "../type";
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import "./index.css";

interface PreviewProps {
  pageInd?: number;
}

export default function Preview({ pageInd }: PreviewProps) {
  const dispatch = useDispatch<AppDispatch>();
  const setSelectedPageId = useSelector((state: RootState) => state.editor.selectedPageId);
  const surveyJson = useSelector((state: RootState) => state.survey.surveyJson);
  const handleSetSurveyJson = (surveyJson: SurveyJson) => {
    dispatch(setSurveyJson(surveyJson));
  };
  const [activePage, setActivePage] = useState<string>(pageInd ? String(pageInd+1) : "1");

  const toNextPage = () => {
    setActivePage(String(Number(activePage) + 1));
  }

  const upadteSurveyJson = (
    componentId: string,
    data: SurveyComponentData | Page,
    isPage?: boolean
  ) => {
    let tmpSurveyJson = JSON.parse(JSON.stringify(surveyJson));
    // console.log(`[debug] update surveyJson: ${componentId}, ${data}, ${isPage}, ${tmpSurveyJson}`);
    if (!tmpSurveyJson || !tmpSurveyJson.pages || !Array.isArray(tmpSurveyJson.pages)) {
      console.log("[error] [designer/index.tsx] surveyJson is not valid")
      return;
    }
    if(isPage) {
      // find the target page and update the data
      let findTargetPage = false;
      for(let i = 0; i < tmpSurveyJson.pages.length; i++) {
        if(tmpSurveyJson.pages[i].id === componentId) {
          tmpSurveyJson.pages[i] = {...tmpSurveyJson.pages[i], ...data};
          findTargetPage = true;
          break;
        }
      }
      if(!findTargetPage) {
        console.log("[error] [designer/index.tsx] cannot find target page in surveyJson");
      }
      handleSetSurveyJson(tmpSurveyJson);
      return;
    }
    let findTargetElement = false;
    tmpSurveyJson?.pages?.forEach((page: Page) => {
      if (findTargetElement) {
        return;
      }
      // if page.elements is not an array, return
      if (!Array.isArray(page.elements) || page.elements?.length === 0) {
        return;
      }
      for (let i = 0; i < page.elements.length; i++) {
        if (page.elements[i].id === componentId) {
          page.elements[i] = {...page.elements[i], ...data};
          findTargetElement = true;
          break;
        }
      }
    });
    if (!findTargetElement) {
      console.log(
        "[error] [designer/index.tsx] cannot find target element in surveyJson"
      );
      return;
    }
    handleSetSurveyJson(tmpSurveyJson);
    // save to local storage
    localStorage.setItem("surveyJson", JSON.stringify(tmpSurveyJson));
  };

  const parseComponent = (data: ComponentData, pageInd: number) => {
    switch (data.type) {
      case "text":
        return <TextInputView key={data.id} data={data} updateData={upadteSurveyJson} />;
        break;
      case "radio":
        return <RadioInputView key={data.id} data={data} updateData={upadteSurveyJson}  />;
        break;
      case "ranksurvey":
        return <RankSurveyView key={data.id} data={data} updateData={upadteSurveyJson} toNextPage={toNextPage} />;
        break;
      case "sortcard":
        return <SortingView key={data.id} data={data} updateData={upadteSurveyJson} toNextPage={toNextPage} />;
        break;
      case "rank":
        return <RankView key={data.id} data={data} updateData={upadteSurveyJson}  toNextPage={toNextPage} />;
        break;
      case "checkbox":
        return <CheckboxView key={data.id} data={data} updateData={upadteSurveyJson} />;
        break;
      default:
        return null;
    }
  };
  // parse surveyJson to render the pages and components
  const parsePage = (page: Page, pageInd: number) => (
    <div key={page.id} className="page">
      <PageView data={{
        type: 'page',
        name: 'page',
        title: page.title,
        description: page.description,
        id: page.id
      } as SurveyComponentData} />
      {page.elements?.map((element) =>
        parseComponent(element as ComponentData, pageInd)
      )}
    </div>
  );

  const items: TabsProps['items'] = [];
  // generate tabs for each page
  surveyJson.pages && surveyJson.pages.forEach((page: Page, index) => {
    items.push({
      key: `${index + 1}`,
      label: `Page ${index + 1}`,
      children: parsePage(page, index),
    });
  })  

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
        <Tabs renderTabBar={(props)=>{return <></>}} tabPosition="bottom" defaultActiveKey="1" items={items} activeKey={activePage} onTabClick={(key)=>setActivePage(key)} />
      </div>
    </Layout>
  );
}
