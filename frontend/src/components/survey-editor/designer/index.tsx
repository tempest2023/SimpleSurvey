import type React from 'react';
import react, { useEffect, useState, ComponentType } from "react";
import { Layout, List, Button } from 'antd';
import { PlusCircleOutlined, BookOutlined } from '@ant-design/icons';
import { surveyComponentData } from './surveyComponentData';
import { TextInputConfig } from '../customSurveyComponents/TextInput';
import {SortingConfig, SortingView} from '../customSurveyComponents/Sorting';
import Preview from '../preview';
import { nanoid } from 'nanoid';
import { SurveyJson, SurveyComponentData, ComponentConfigProps } from '../type';
import { createSurveyJson } from '../utils';
import "./index.css";

// mock data
const surveyPageList = [
  ''
]

// iterate surveyJson to find selected element
const querySelectedData = (data: SurveyJson|null, elementId:string, selectedPageId?:string):(SurveyComponentData | null) => { 
  let res = null; 
  data?.pages?.forEach((page) => {
    // if there is no selectedPageId or the page id is equal to selectedPageId, then we will find the element
    if(!selectedPageId || page.id === selectedPageId) {
      page.elements?.forEach((element) => {
        if(element.id === elementId) {
          res = element
        }
      });
    }
  });
  return res;
}

export default function Designer() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null); // selected element id
  const [selectedElementData, setSelectedElementData] = useState<SurveyComponentData>({
    id: '',
    name: '',
    type: '',
  });
  const [configForms, setConfigForms] = useState<React.FC<ComponentConfigProps>>();
  const [surveyJson, setSurveyJson] = useState<SurveyJson | null>(null);

  // generate config forms by selected element
  useEffect(() => {
    if(!selectedElementId) {
      return;
    }
    // find and update selected data
    const element: SurveyComponentData | null = querySelectedData(surveyJson, selectedElementId);
    if(!element) {
      return;
    }
    const eleType = element.type
    const tmpSelectedElementData = { ...element };
    // update selected element data
    setSelectedElementData(tmpSelectedElementData);
    // find and render config forms based on selected element
    const config = surveyComponentData.filter((item) => item.type === eleType)[0].config;
    if(!config) {
      console.log('[error] [designer/index.tsx] no config for this component');
      return;
    }
    // console.log('[debug] generate config forms by selectedData:', config, tmpSelectedElementData);
    const tmpConfigForms : React.FC<ComponentConfigProps> = config;
    // update config forms and it will be rendered on the right panel
    setConfigForms(tmpConfigForms);
  }, [selectedElementId, selectedPage]);

  // add a new component to surveyJson
  const addComponent = (componentType: string) => () => {
    let tmpSurveyJson = surveyJson;
    // add component may add default page, so the selectedPage will be changed.
    let tmpSelectedPage = selectedPage;
    // add component will add new element, so the selectedElementtId will be changed.
    let tmpSelectedElementId = selectedElementId;
    if(!tmpSurveyJson) {
      // create a new survey data
      tmpSurveyJson = createSurveyJson(1);
    }
    // create a new component
    const newComponent : SurveyComponentData = {
      id: nanoid(9),
      name: componentType,
      type: componentType,
    }
    // update selectedElementId to the new component
    tmpSelectedElementId = newComponent.id;
    // if there is no selected page, add to the first page
    if(!selectedPage) {
      if(!tmpSurveyJson || !tmpSurveyJson.pages || tmpSurveyJson.pages.length === 0) {
        // create a new page
        const newPage = {
          id: nanoid(7),
          name: 'Page 1',
          elements: [newComponent],
        }
        tmpSurveyJson.pages = [newPage];
        tmpSelectedPage = newPage.id;
      } else {
        const page = tmpSurveyJson.pages[0];
        page.elements?.push(newComponent);
        tmpSelectedPage = page.id;
      }
    } else {
      // add to the selected page
      tmpSurveyJson?.pages?.forEach((page) => {
        if(page.id === selectedPage) {
          page.elements?.push(newComponent);
        }
      });
    }
    // update state
    setSurveyJson(tmpSurveyJson);
    setSelectedElementId(tmpSelectedElementId);
    setSelectedPage(tmpSelectedPage);
  }
  
  // according to componentId to find the component in surveyJson and update it
  const upadteSurveyJson = (componentId: string, data: SurveyComponentData, isPage?: boolean) => {
    let tmpSurveyJson = surveyJson;
    console.log('[debug] update surveyJson', componentId, data, isPage, tmpSurveyJson);
    if(!tmpSurveyJson) {
      return;
    }
    let findTargetElement = false;
    tmpSurveyJson?.pages?.forEach((page) => {
      if(findTargetElement) {
        return;
      }
      // if page.elements is not an array, return
      if(!Array.isArray(page.elements) || page.elements?.length === 0) {
        return;
      }
      for(let i=0; i<page.elements.length; i++) {
        if(page.elements[i].id === componentId) {
          page.elements[i] = data;
          console.log('[debug] update surveyJson for targetElement: ', page.elements[i], tmpSurveyJson)
          findTargetElement = true;
          break;
        }
      }
    });
    if(!findTargetElement) {
      console.log('[error] [designer/index.tsx] cannot find target element in surveyJson');
    } else {
      console.log('[debug] update surveyJson for targetElement: ', findTargetElement, tmpSurveyJson)
    }
    setSurveyJson(tmpSurveyJson);
  }
  
  console.log('[debug] surveyJson while in rendering', surveyJson);

  return (
    <Layout className="designer">
      <div className="menu-panel">
        <List
          itemLayout="horizontal"
          header={<div><h2>{surveyJson?.surveyName || "Untitled Survey"}</h2></div>}
          dataSource={surveyJson?.pages?.map((page) => page.name) || surveyPageList}
          renderItem={(item) => (
            <List.Item>
              <Button className="menu-item-button" type="ghost" block size="large" icon={<BookOutlined />}>{item}</Button>
            </List.Item>
          )}
        />
        <List
          itemLayout="horizontal"
          header={<div><h2>Components</h2></div>}
          dataSource={surveyComponentData}
          renderItem = {(item) => (<List.Item>
            <Button className="menu-item-button" type="ghost" block size="large" onClick={addComponent(item.type)} icon={<PlusCircleOutlined />}>{item.name}</Button>
          </List.Item>)} 
        />
      </div>
      <div className="preview-panel">
        <div className="empty-content">
          {surveyJson && <Preview surveyJson={surveyJson} />}
          {!surveyJson &&
          <Button type="default" size="large" icon={<PlusCircleOutlined />}>
            Add Components
          </Button>}
        </div>
      </div>
      <div className="config-panel">
        <div className="configForm">
          {/* {ConfigForms && selectedElementData && <ConfigForms data={selectedElementData} updateData={upadteSurveyJson} />} */}
          {selectedElementData.type === "text" && <TextInputConfig data={selectedElementData} updateData={upadteSurveyJson} />}
          {selectedElementData.type === "sortcard" && <SortingConfig data={selectedElementData} updateData={upadteSurveyJson} />}
        </div>
      </div>
    </Layout>
  );
}