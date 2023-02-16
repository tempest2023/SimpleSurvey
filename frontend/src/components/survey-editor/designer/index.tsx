import type React from 'react';
import react, { useEffect, useState } from "react";
import { Layout, Divider, List, Button, Form, Input } from 'antd';
import { PlusCircleOutlined, BookOutlined } from '@ant-design/icons';
import { SortingCardBinData, SortingBin, SortingCard } from '../customSurveyComponents/sortingComponent/type';
import { nanoid } from 'nanoid';
import { SurveyJson, SelectedData, SurveyComponent } from '../type';
import { createSurveyJson } from '../utils';
import "./index.css";
import {nullable} from 'zod';

// mock data
const surveyPageList = [
  'Page 1',
  'Page 2',
  'Page 3',
  'Page 4',
]
// survey component data
const surveyComponentData = [
  {
    name: 'Text Input',
    key: 'TextInput',
  },
  {
    name: 'Radio Input',
    key: 'RadioInput',
  },
  {
    name: 'Checkbox',
    key: 'CheckboxInput',
  },
  {
    name: 'Rating',
    key: 'RatingInput',
  },
  {
    name: 'Sort Cards',
    key: 'Sorting',
  },
  {
    name: 'Rank Cards',
    key: 'Rank',
  },
  {
    name: 'Feedback Form',
    key: 'Feedback',
  },
  {
    name: 'Description Text',
    key: 'Description',
  },
  {
    name: 'Report & Summary',
    key: 'Report',
  }
]


const SortingComponentConfigs = ({ data }: { data : SortingCardBinData }) => {
  const { cardList, binList } = data;
  return (<Form>
    <Form.Item>Cards</Form.Item>
    {cardList && cardList.map((card: SortingCard) => {
      return (
        <Form.Item label={card.title}>
          <Form.Item name={card.title} label="Card Label">
            <Input />
          </Form.Item>
          <Form.Item name={card.title} label="Card Description">
            <Input />
          </Form.Item>
        </Form.Item>
      )
    })}
    <Form.Item>Bins</Form.Item>
    {binList && binList.map((bin: SortingBin) => {
      return (
        <Form.Item label={bin.title}>
          <Form.Item name={bin.title} label="Bin Label">
            <Input />
          </Form.Item>
          <Form.Item name={bin.title} label="Bin Description">
            <Input />
          </Form.Item>
        </Form.Item>
      )
    })}
  </Form>);
}

interface ElementConfigForms {
  [key: string]: (data: any) => React.ReactNode
}

const elementConfigForms: ElementConfigForms = {
  "Sorting Cards to Bins": (data: SortingCardBinData) => <SortingComponentConfigs data={data} />,
}

export default function Designer() {
  const [selectPage, setSelectPage] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<SelectedData | null>(null);
  const [configForms, setConfigForms] = useState<React.ReactNode>(null);
  const [surveyJson, setSurveyJson] = useState<SurveyJson | null>(null);
  
  // iterate surveyJson to find selected element
  const querySelectedData = (data: SurveyJson|null) => {  
    data?.pages?.forEach((page) => {
      if(page.id === selectPage) {
        page.elements?.forEach((element) => {
          if(element.id === selectedElement) {
            setSelectedData({
              componentId: element.id,
              componentType: element.type,
              data: {...element},
            });
          }
        });
      }
    });
  }
  useEffect(() => {
    // generate config forms by selected element
    if(!selectedElement) {
      return;
    }
    querySelectedData(surveyJson)
    const tmp = elementConfigForms[selectedElement](selectedData);
    setConfigForms(tmp);
  }, [selectedElement]);

  const addComponent = (componentType: string) => () => {
    let tmpSurveyJson = surveyJson;
    if(!tmpSurveyJson) {
      // create a new survey data
      tmpSurveyJson = createSurveyJson(1);
    }
    // create a new component
    const newComponent : SurveyComponent = {
      id: nanoid(9),
      name: componentType,
      type: componentType,
    }
    if(!selectPage) {
      // add to the first page
      if(!tmpSurveyJson || !tmpSurveyJson.pages) {
        // create a new page
        const newPage = {
          id: nanoid(7),
          name: 'Page 1',
          elements: [newComponent],
        }
        tmpSurveyJson.pages = [newPage];
      } 
    } else {
      // add to the selected page
      tmpSurveyJson?.pages?.forEach((page) => {
        if(page.id === selectPage) {
          page.elements?.push(newComponent);
        }
      });
    }
  }

  return (
    <Layout className="designer">
      <div className="menu-panel">
        <List
          itemLayout="horizontal"
          header={<div><h2>Pages</h2></div>}
          dataSource={surveyPageList}
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
            <Button className="menu-item-button" type="ghost" block size="large" onClick={addComponent(item.key)} icon={<PlusCircleOutlined />}>{item.name}</Button>
          </List.Item>)} 
        />
      </div>
      <div className="preview-panel">
        <div className="empty-content">
          <Button type="default" size="large" icon={<PlusCircleOutlined />}>
            Add Questions
          </Button>
        </div>
      </div>
      <div className="config-panel">
        <div className="configForm">
          {configForms}
        </div>
      </div>
    </Layout>
  );
}