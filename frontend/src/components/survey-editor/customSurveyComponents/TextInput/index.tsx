import react, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../store/store";
import { Form, Input } from "antd";
import { Divider, List, Button } from "antd";
import { TextInputData, TextInputConfigProps, TextInputProps } from "./type";
import { querySelectedData } from "../../utils";

import './index.css'

// A TextInput implemented by Ant Design form
export const TextInput: React.FC<TextInputProps> = ({
  label,
  data,
  syncData,
  name,
  rules,
}) => {
  const [value, setValue] = useState<string | undefined>(data[name]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    syncData(name, newValue);
  };

  return (
    <Form.Item
      label={label}
      name={name}
      initialValue={data[name]}
      rules={rules}
    >
      <Input value={value} onChange={handleChange} />
    </Form.Item>
  );
};

// View component for TextInput
export const TextInputView = ({ data }: { data: TextInputData }) => {
  console.log('text input data', data)
  if (!data) {
    return <div>No data in TextInput</div>;
  }
  return (
    <Form layout="vertical">
      <Form.Item label={<span className='survey-question-label'>{data.title || 'Question'}</span>} name="question">
        <Input placeholder="Enter Your Answer" />
      </Form.Item>
    </Form>
  );
};

// Config component for TextInput
export function TextInputConfig({ updateData }: TextInputConfigProps) {
  const surveyJson = useSelector((state: RootState) => state.survey.surveyJson);
  const elementId = useSelector((state: RootState) => state.editor.selectedElementId);
  const data: TextInputData = querySelectedData(surveyJson, elementId) as TextInputData;
  
  if (!data || !updateData) {
    return <div>No data in TextInput Config</div>;
  }
  const [textData, setTextData] = useState<TextInputData>(
    data as TextInputData
  );

  const handleUpdateData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    updateData(
      data.id,
      {
        ...textData,
        title: title,
      },
      false
    );
    setTextData({ ...textData, title: title});
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Question" name="title" rules={
        [
          { required: true, message: "Please input your question title" },
        ]
      }>
        <Input onChange={handleUpdateData} defaultValue={data.title} placeholder="Enter question title" />
      </Form.Item>
    </Form>
  );
}
