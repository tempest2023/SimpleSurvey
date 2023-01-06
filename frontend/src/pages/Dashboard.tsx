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

import { useState, useCallback } from "react";

const { Header, Content, Footer, Sider } = Layout;

const defaultFormData: SurveyJsonSchema = {
  cardList: [{ id: "1", description: "", cardImage: "" }],
  categoryCount: 0,
  categoryList: [],
};

const Dashboard: React.FC = () => {
  const [formData, setFormData] = useState(defaultFormData);
  return (
    <Layout style={{ marginTop: 20 }}>
      <Header>
        <h2 style={{ color: "white" }}>Add cards and categories</h2>
      </Header>
      <Layout>
        <Sider style={{ backgroundColor: '#fff', padding: 20 }}>
          <NewForm survey={formData} updateParentState={setFormData} />
        </Sider>
        <Layout>
          <Content>
            <PreviewEditor formData={formData} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
