import react, { useState } from "react";
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Designer from "./designer";
import Preview from "./preview";
import LogicPanel from './logicPanel';
import JsonPanel from './jsonPanel';
import "./index.css";

function SurveyEditor() {
  const onChange = (key: string) => {
    console.log(`[debug] [survey-editor/index.tsx] tab changed to: [${key}]`);
  };
  
  const items: TabsProps['items'] = [
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
