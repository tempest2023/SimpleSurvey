import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../store/store";
import { setSurveyJson } from "../../../../store/surveySlice";
import { querySelectedData, ellipseString } from "../../utils";
import {
  Divider,
  Button,
  Form,
  Input,
  Card as AntCard,
  Progress,
  Dropdown,
  Table,
  Space,
  Popconfirm,
  Popover,
  Radio,
  notification,
} from "antd";
import type { MenuProps } from "antd";
import {
  PlusCircleOutlined,
  UpOutlined,
  DownOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  SurveyCustomComponentProps,
  SurveyComponentData,
  updateDataFn,
} from "../../type";
import {
  RadioInputConfigProps,
  RadioInputItem,
  RadioItem,
  RadioInputData,
} from "./type";
import ButtonModal from "../../../buttonModal";
import { nanoid } from "nanoid";
import "./index.css";

export const RadioInputView = ({
  data,
  updateData,
}: {
  data: SurveyComponentData;
  updateData: updateDataFn;
}) => {
  if (!data) {
    return <div>No data in Rank Component</div>;
  }
  return <div></div>;
};

export const RadioInputConfig = ({ updateData }: RadioInputConfigProps) => {
  const surveyJson = useSelector((state: RootState) => state.survey.surveyJson);
  const elementId = useSelector(
    (state: RootState) => state.editor.selectedElementId
  );
  const data: RadioInputData = querySelectedData(
    surveyJson,
    elementId
  ) as RadioInputData;
  const { radioInputList } = data || {};

  const [inputList, setInputList] = useState<RadioInputItem[]>(
    radioInputList || []
  );

  const [radioForm] = Form.useForm();

  const onAddRadioInput = (radioInputItem: RadioInputItem) => {
    setInputList([...inputList, radioInputItem]);
    updateData(data.id, {
      ...data,
      radioInputList: [...inputList, radioInputItem],
    });
  };

  const onDeleteRadioInput = (radioInputId: string) => {
    const newInputList = inputList.filter(
      (radioInputItem) => radioInputItem.id !== radioInputId
    );
    setInputList(newInputList);
    updateData(data.id, {
      ...data,
      radioInputList: newInputList,
    });
  };

  const onFinishAddRadioQuestion = (values: any) => {
    const radioIputItem: RadioInputItem = {
      id: nanoid(11),
      title: values.title,
      radioItemList: [],
      choice: null,
    };
    // convert `option_{number}` to each options in radioItemList
    Object.keys(values).forEach((key) => {
      if (key.indexOf("option_") === 0) {
        // const optionIndex = parseInt(key.split('_')[1]);
        const radioItem: RadioItem = {
          id: nanoid(12),
          text: values[key],
          value: values[key],
        };
        radioIputItem.radioItemList.push(radioItem);
      }
    });
    onAddRadioInput(radioIputItem);
    notification.success({
      message: "Add Radio Question Successfully",
    });
    radioForm.resetFields();
  };

  const RadioAddForm = () => {
    const [optionsNumber, setOptionsNumber] = useState<number>(4);
    return (
      <Form
        form={radioForm}
        title="Add Radio Question"
        onFinish={onFinishAddRadioQuestion}
        layout="horizontal"
        initialValues={{ count: 4 }}
      >
        <Form.Item
          name="title"
          label="Radio Question"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter the question of your radio" />
        </Form.Item>
        <Form.Item
          name="count"
          label="Number of Your Options"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Enter the number of your options"
            type="number"
            value={optionsNumber}
            onChange={(e) => setOptionsNumber(parseInt(e.target.value))}
          />
        </Form.Item>
        {Array.from(Array(optionsNumber || 1).keys()).map((index) => (
          <Form.Item
            key={`option_formitem_${index}`}
            name={`option_${index}`}
            label={`Option ${index + 1}`}
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter the option of your radio" />
          </Form.Item>
        ))}
        <Form.Item className="flex-center">
          <Button type="primary" htmlType="submit">
            Add Radio Question
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const RadioInputDisplay = ({
    item,
    index,
  }: {
    item: RadioInputItem;
    index: number;
  }) => (
    <div className="radio-input-conofig-form-radioinput-item">
      <div className="radio-input-conofig-form-radioinput-item-title">
        <h4>Question: {item.title}</h4>
        <Popconfirm
          title="Are you sure to delete this radio question?"
          onConfirm={() => onDeleteRadioInput(item.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button shape="circle" icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      </div>
      <h5>Options:</h5>
      {item.radioItemList.map((radioItem, radioIndex) => {
        return (
          <span key={`radio_${index}_options_${radioIndex}`}>
            <Radio disabled={true} value={radioItem.value}>
              {radioItem.text}
            </Radio>
          </span>
        );
      })}
    </div>
  );
  return (
    <>
      <Form className={"radio-input-conofig-form"}>
        {inputList.map((item, index) => {
          return (
            <RadioInputDisplay
              key={`radio_input_${index}`}
              item={item}
              index={index}
            />
          );
        })}
      </Form>
      <ButtonModal
        buttonText={
          <div className="flex-center">
            <PlusCircleOutlined />
            Add a Radio Question
          </div>
        }
        modalTitle="Add Cards"
        cancelText="Close"
      >
        <RadioAddForm />
      </ButtonModal>
    </>
  );
};
