import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../store/store";
import { setSurveyJson } from "../../../../store/surveySlice";
import { Divider, List, Button, Form, Input } from "antd";
import { PageData, PageSurveyCustomComponentProps } from "./type";
import { queryPageById } from "../../utils";
import { SurveyComponentData, SurveyJson} from "../../type";
import "./index.css";


// View component for Page
export const PageView = ({ data }: { data: SurveyComponentData }) => {
  const { title, description } = data as PageData;
  if (!data) {
    return <div>No data in Page</div>;
  }
  return (
    <div id={`page_${data.id}`} className="surveyPage">
      <h3>{title}</h3>
      <span>{description}</span>
    </div>
  );
};

// Config component for Page
export function PageComponentConfig({ updateData }: PageSurveyCustomComponentProps) {
  const dispatch = useDispatch<AppDispatch>();
  const handleSetSurveyJson = (surveyJson: SurveyJson) => {
    dispatch(setSurveyJson(surveyJson));
  };
  const surveyJson = useSelector((state: RootState) => state.survey.surveyJson);
  const pageId = useSelector((state: RootState) => state.editor.selectedPageId);
  const data = queryPageById(surveyJson, pageId);

  const [pageForm] = Form.useForm();

  const debounce = useCallback(
    (func: Function, wait: number) => {
      let timeout: NodeJS.Timeout;

      return function (this: any, ...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(this, args);
        }, wait);
      };
    },
    []
  );
  
  const onFinishedForm = (values: any) => {
    const page: PageData = {
      ...values,
    };
    if(!data) {
      console.log(`[error] [Page/index.tsx] onFinishedForm: data is null`)
      return;
    }
    // this is a page data update
    updateData(data.id, page, true);
  };

  const handleSurveyNameUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    // setSuveryName(newValue);
    let tmpSurveyJson = {
      ...surveyJson,
      surveyName: newValue,
    };
    handleSetSurveyJson(tmpSurveyJson);
  }

  const debounceUpdateSurveyName = debounce(handleSurveyNameUpdate, 500);

  useEffect(() => {
    // if pageForm is connected to the DOM, set the form values
    pageForm.setFieldsValue(JSON.parse(JSON.stringify(data)));
  }, [data]);
  if (!data) {
    return <div>No data in Page Config</div>;
  }
  return (
    <>
    <Form initialValues={{
      survey_name: surveyJson.surveyName
    }}>
    <Form.Item name="survey_name" label="Survey Name">
      <Input name="survey_name" onChange={debounceUpdateSurveyName} value={surveyJson.surveyName}/>
    </Form.Item>
    <Divider />
    </Form>
    <Form
      id={"pageConfigForm_" + pageId}
      form={pageForm}
      title="Page Config"
      onFinish={onFinishedForm}
      initialValues={data}
      layout="horizontal"
    >
      <Form.Item name="title" label="Page Title">
        <Input placeholder="Enter page title" />
      </Form.Item>
      <Form.Item name="description" label="Page Description">
        <Input placeholder="Enter page description" />
      </Form.Item>
      <Form.Item className="flex-center">
        <Button type="primary" htmlType="submit">
          Update Page Info
        </Button>
      </Form.Item>
    </Form>
    </>
  );
}
