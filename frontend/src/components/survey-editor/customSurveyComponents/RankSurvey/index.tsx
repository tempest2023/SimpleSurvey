import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../store/store";
import { setSurveyJson } from "../../../../store/surveySlice";
import { querySelectedData, ellipseString } from "../../utils";
import {
  Divider,
  Form,
  Card as AntCard,
  Space,
  Popconfirm,
  Button,
  Popover,
  Radio,
  notification,
} from "antd";
import type { RadioChangeEvent } from "antd";
import { SortingCard } from "../Sorting/type";
import { FileDoneOutlined } from "@ant-design/icons";
import { SurveyCustomComponentProps } from "../../type";
import {
  RadioInputConfigProps,
  RadioInputItem,
  RadioItem,
  RadioInputData,
} from "./type";
import ButtonModal from "../../../buttonModal";
import { nanoid } from "nanoid";
import "./index.css";

// staticAnwser
const staticAnwser = {
  'question1-1': 'On my own without technology',
  'question1-2': 'On my own with technology',
  'question1-3': 'With assistance from another person',
  'question1-4': 'With assistance from another person and technology',
  'question1-5': 'Task not completed due to a lack of ability or resources',
}

// this radio questions are rendered by the Cards Data
const staticRadioInputData = {
  id: nanoid(),
  type: "ranksurvey",
  name: "ranksurvey",
  title: "Task #${index}: ${short_description}",
  radioInputList: [
    {
      id: "task${index}_question1",
      title: "How do you most commonly ${full_description}?",
      radioItemList: [
        {
          id: "task${index}_question1-1",
          text: "On my own without technology",
        },
        {
          id: "task${index}_question1-2",
          text: "On my own with technology",
        },
        {
          id: "task${index}_question1-3",
          text: "With assistance from another person",
        },
        {
          id: "task${index}_question1-4",
          text: "With assistance from another person and technology",
        },
        {
          id: "task${index}_question1-5",
          text: "Task not completed due to a lack of ability or resources",
        },
      ],
      choice: null,
    },
    {
      id: "task${index}_question2",
      title:
        "How much effort is most commonly required for you to complete the task?",
      radioItemList: [
        {
          id: "task${index}_question2-1",
          text: "Easy",
        },
        {
          id: "task${index}_question2-2",
          text: "Some effort",
        },
        {
          id: "task${index}_question2-3",
          text: "Hard",
        },
      ],
      hidden: true,
      choice: null,
    },
    {
      id: "task${index}_question3",
      title:
        "How much assistance do you most commonly require to complete the task?",
      radioItemList: [
        {
          id: "task${index}_question3-1",
          text: "Complete assistance",
        },
        {
          id: "task${index}_question3-2",
          text: "Partial assistance",
        },
      ],
      hidden: true,
      choice: null,
    },
    {
      id: "task${index}_question4",
      title: "How do you think you are doing with the task right now?",
      radioItemList: [
        {
          id: "task${index}_question4-1",
          text: "1 Not able to do it at all",
        },
        {
          id: "task${index}_question4-2",
          text: "2",
        },
        {
          id: "task${index}_question4-3",
          text: "3",
        },
        {
          id: "task${index}_question4-4",
          text: "4",
        },
        {
          id: "task${index}_question4-5",
          text: "5",
        },
        {
          id: "task${index}_question4-6",
          text: "6",
        },
        {
          id: "task${index}_question4-7",
          text: "7",
        },
        {
          id: "task${index}_question4-8",
          text: "8",
        },
        {
          id: "task${index}_question4-9",
          text: "9",
        },
        {
          id: "task${index}_question4-10",
          text: "10 Able to do it extremely well",
        },
      ],
      choice: null,
    },
    {
      id: "task${index}_question5",
      title: "How satisfied are you with how you complete the task?",
      radioItemList: [
        {
          id: "task${index}_question5-1",
          text: "1 Not able to do it at all",
        },
        {
          id: "task${index}_question5-2",
          text: "2",
        },
        {
          id: "task${index}_question5-3",
          text: "3",
        },
        {
          id: "task${index}_question5-4",
          text: "4",
        },
        {
          id: "task${index}_question5-5",
          text: "5",
        },
        {
          id: "task${index}_question5-6",
          text: "6",
        },
        {
          id: "task${index}_question5-7",
          text: "7",
        },
        {
          id: "task${index}_question5-8",
          text: "8",
        },
        {
          id: "task${index}_question5-9",
          text: "9",
        },
        {
          id: "task${index}_question5-10",
          text: "10 Able to do it extremely well",
        },
      ],
      choice: null,
    },
  ],
  rankList: [],
};

function fillStaticQuestions(
  index: number,
  short_description: string,
  full_description: string
) {
  const res = JSON.parse(JSON.stringify(staticRadioInputData));
  res.id = nanoid();
  res.title = staticRadioInputData.title.replace("${index}", String(index)).replace('${short_description}', short_description);
  res.radioInputList[0].title =
    staticRadioInputData.radioInputList[0].title.replace(
      "${full_description}",
      full_description
    );
  // for each item in radioInputList, replace the id by index
  res.radioInputList.forEach((item: any) => {
    item.id = item.id.replace("${index}", String(index));
    // for each item in radioItemList, replace the id by index
    item.radioItemList.forEach((subItem: any) => {
      subItem.id = subItem.id.replace("${index}", String(index));
    });
  });
  return res;
}

export const RankSurveyView = ({
  data,
  updateData,
  toNextPage,
}: SurveyCustomComponentProps) => {
  const [radioQuestionForm] = Form.useForm();
  const surveyJson = useSelector((state: RootState) => state.survey.surveyJson);
  const [tasks, setTasks] = useState<RadioInputData[] | null>([]);
  if (!data) {
    return <div>No data in Rank Component</div>;
  }
  const checkAllFinished = () => {
    return true;
  };
  // handle the logic of showing or hiding the radio questions
  const onRadioFormChange = () => {
    if(!tasks || tasks.length === 0) return;
    const radioFormValues = radioQuestionForm.getFieldsValue();
    const tmpTask = JSON.parse(JSON.stringify(tasks));
    for(let i = 0; i < tasks.length; i++) {
      const taskInd = i + 1;
      // according to values to hidden or show the radio question
      // for each task, if the question1 chooses 1st or 2nd choice, then show question2, if the question1 chooses 3rd or 4th choice, then show question3, otherwise, do nothing(quesiton2 and question3 are hidden by default)
      let key1 = `radio_input_task${taskInd}_question1`;
      let key2 = `radio_input_task${taskInd}_question2`;
      let key3 = `radio_input_task${taskInd}_question3`;
      if(radioFormValues[key1] === staticAnwser['question1-1'] || radioFormValues[key1] === staticAnwser['question1-2']) {
        tmpTask[i].radioInputList[1].hidden = false;
        tmpTask[i].radioInputList[2].hidden = true;
        radioQuestionForm.setFieldsValue({[key3]: null}); 
      } else if (radioFormValues[key1] === staticAnwser['question1-3'] || radioFormValues[key1] === staticAnwser['question1-4']) {
        tmpTask[i].radioInputList[2].hidden = false;
        tmpTask[i].radioInputList[1].hidden = true;
        radioQuestionForm.setFieldsValue({[key2]: null});
      } else {
        tmpTask[i].radioInputList[1].hidden = true;
        tmpTask[i].radioInputList[2].hidden = true;
        radioQuestionForm.setFieldsValue({[key2]: null});
        radioQuestionForm.setFieldsValue({[key3]: null});
      }
    }
    setTasks(tmpTask);
  }
  const onFinish = () => {
    // get all the data from form
    const radioFormValues = radioQuestionForm.getFieldsValue();
    console.log('[debug] values: ', radioFormValues);
    // set all choice of radioInputItem to the value from form
    const tmpTasks = JSON.parse(JSON.stringify(tasks));
    if(!tasks || tasks.length === 0) return;
    for(let i = 0; i < tasks.length; i++) {
      const taskInd = i + 1;
      for(let j = 0; j < (tasks[i].radioInputList as any[]).length; j++) {
        const key = `radio_input_task${taskInd}_question${j+1}`;
        tmpTasks[i].radioInputList[j].choice = radioFormValues[key];
      }
    }
    setTasks(tmpTasks);
    // save changes in this page and go to next page
    updateData(data.id, { ...data, radioTaskList: tmpTasks }, false);
    // toNextPage && toNextPage();
  };
  // get card data and rank data from page1 and page2, init the raido questions by these data
  useEffect(() => {
    // console.log("[debug] rankList from previous page: ", data.rankList);
    if (
      !data ||
      !data.rankList ||
      !Array.isArray(data.rankList) ||
      data.rankList.length === 0
    ) {
      return;
    }
    const tmpTasks: RadioInputData[] = [];
    (data.rankList as SortingCard[]).forEach((card, index) => {
      const item = fillStaticQuestions(
        index + 1,
        card.description,
        card.fullDescription
      ) as RadioInputData;
      tmpTasks.push(item);
    });
    setTasks(tmpTasks);
    // console.log("[debug] radioQuestions tasks; ", tmpTasks);
  }, [data]);

  return (
    <div className="ranksurvey-radio">
      <Form form={radioQuestionForm} layout='vertical' onChange={onRadioFormChange}>
        {tasks &&
          tasks.map((task) => (
            <div className='ranksurvey-task' key={`task_${task.id}`}>
              {task.title && <h3>{task.title}</h3>}
              {task &&
                task.radioInputList &&
                task.radioInputList.map((radioInputItem) => (
                 <div
                    className={radioInputItem.hidden ? "ranksurvey-radio ranksurvey-radio-hidden" : "ranksurvey-radio"}
                    key={`ranksurvey_radio_${radioInputItem.id}`}
                  >
                    <Form.Item label={`${radioInputItem.title}`} key={`radio_input_${radioInputItem.id}`} name={`radio_input_${radioInputItem.id}`}>
                      <Radio.Group
                        name={`radio_input_${radioInputItem.id}`}
                        options={[...radioInputItem.radioItemList.map((radioItem) => ({label: radioItem.text,value: radioItem.text}))]}
                      >
                      </Radio.Group>
                    </Form.Item>
                  </div>
                ))}
            </div>
          ))}
      </Form>
      <div className="page-footer">
        {checkAllFinished() && (
          <Button type="primary" onClick={onFinish}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export const RankSurveyConfig = ({ updateData }: RadioInputConfigProps) => {
  return (
    <>
      <Popover content="This component doesn't have any config. It is generated automatically by Rank Component.">
        <FileDoneOutlined />
      </Popover>
    </>
  );
};
