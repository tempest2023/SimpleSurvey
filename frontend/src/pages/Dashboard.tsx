import { React, useEffect } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { Row, Col, MenuProps, Checkbox, Space } from "antd";
import { Layout, Menu, theme, Avatar } from "antd";
import { Form, Input, Button, Image } from "antd";
import FormSide from "../components/FormSide";
import NewForm from "../components/NewForm";
import PreviewEditor from "../components/PreviewEditor";
import { ChildProcess } from "child_process";
import { SurveyJsonSchema, Card } from "../components/SurveySchemaType";
import Classification from "../components/Classification";
import { useState, useCallback } from "react";

const { Header, Content, Footer, Sider } = Layout;

const defaultFormData: SurveyJsonSchema = {
  cardList: [],
  categoryCount: 0,
  categoryList: [],
  classification: {}
};

const Dashboard: React.FC = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [preview, setPreview] = useState(false);
  return (
    <Layout style={{ marginTop: 20 }}>
      <Header>
        
        <h2 style={{ color: "white" }}>Add cards and categories</h2>
        <br/>
        <br />
        <br />
      </Header>
    
      {preview && (
        <Layout>
          <Content>
            <Button onClick={()=>setPreview(false)}>Editor</Button>
            <Classification formData={formData} />
          </Content>
        </Layout>
      )}
      {!preview && (
        <Layout>
          <Sider style={{ backgroundColor: "#fff", padding: 10 }}>
            
            <NewForm survey={formData} updateParentState={setFormData} />
          </Sider>
          <Layout>
            <Content>
              <Button onClick={()=>setPreview(true)}>Preview</Button>
              <PreviewEditor formData={formData} />
            </Content>
          </Layout>
        </Layout>
      )}
    </Layout>
  );
};

export default Dashboard;
