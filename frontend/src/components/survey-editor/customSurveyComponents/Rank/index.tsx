import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../store/store";
import { SurveyCustomComponentProps, SurveyComponentData } from "../../type";
import { Divider, Button, Form, Input, Table, Checkbox, List, Typography } from "antd";
import { SortingCard } from "../Sorting/type";
import { RankConfigProps, RankData, SortingBinSelected } from "./type";
import ButtonModal from "../../../buttonModal";
import { querySelectedData, ellipseString } from "../../utils";
import "./index.css";

export const RankView = ({ data, updateData }: SurveyCustomComponentProps) => {
  if (!data) {
    return <div>No data in Rank Component</div>;
  }
  const sorting = data.sorting || {};
  const limit = data.limit || 10;
  const defaultRankList: SortingCard[] = [...Array(limit).keys()].map((i) => ({
    id: '',
    title: '',
    description: '',
    rank: i,
    cardImage: '',
    isAvailable: true,
  }));
  const [binList, setBinList] = useState<SortingBinSelected[]>(data.binList || []);  
  const [rankList, setRankList] = useState<SortingCard[]>(data.rankList || defaultRankList);

  const renderBins = () => {
    return (
      <div className="sorting-bin-container">
        {binList.map((bin) => {
          if(!bin.selected) return null;
          const binSorting = sorting[bin.id] || [];
          return (
            <div key={`bin_` + bin.id} className="sorting-bin-outter">
              <span className="sorting-bin-title">{bin.title}</span>
              <div className="sorting-bin-box">
                {binSorting.map((card: SortingCard) => (
                  <span
                    key={card.id}
                  >
                    <span className="sorting-card-item-title">{ellipseString(card.title, 5)}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return <div className="rank-panel">
    <div className="rank-bin-panel">
      {renderBins()}
    </div>
    <div className="rank-list-panel">
      <List
        header={<h3>My Priorities</h3>}
        bordered
        dataSource={rankList}
        renderItem={(item, ind: number) => (
          <List.Item>
            <div>
              <Typography.Text mark>No. {ind+1}</Typography.Text>
              <span className="sorting-card-item-title">{ellipseString(item.title, 5)}</span>
            </div>
          </List.Item>
        )}
      />
    </div>
  </div>;
};

export const RankConfig = ({ updateData }: RankConfigProps) => {
  const surveyJson = useSelector((state: RootState) => state.survey.surveyJson);
  const elementId = useSelector(
    (state: RootState) => state.editor.selectedElementId
  );
  const selectedPageId = useSelector(
    (state: RootState) => state.editor.selectedPageId
  );
  const data: RankData = querySelectedData(
    surveyJson,
    elementId
  ) as RankData;

  if (!data) {
    return <div>No data in Sorting Card...</div>;
  }

  const [binList, setBinList] = useState<SortingBinSelected[]>(data.binList || []);
  const [limit, setLimit] = useState<number>(data.limit || 10);
  
  if (!data) {
    return <div>No data in Rank Config</div>;
  }

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

  const syncData = (data: RankData) => {
    updateData(data.id, data, false);
  };

  useEffect(() => {
    // get increasing binList data from Sorting component(the component in the previous page
    for(let i=0;i<surveyJson.pages.length;i++) {
      if(i>0 &&  surveyJson.pages[i].id === selectedPageId) {
        if(surveyJson.pages[i-1] && surveyJson.pages[i-1].elements) {
          const prevElementsList: SurveyComponentData[] = surveyJson.pages[i-1].elements || [];
          prevElementsList.forEach((element) => {
            if(element.type === "sortcard") {
              const sortBinList = (Array.from(element.binList) as SortingBinSelected[]).filter(item => {
                // filter all bins already are in binList
                return !binList.find(bin => bin.id === item.id);
              }).map((bin) => ({
                ...bin,
                selected: false,
              }))
              const newBinList = [...binList, ...sortBinList];
              newBinList.sort((a: SortingBinSelected, b: SortingBinSelected) => a.title.length - b.title.length);
              console.log(`debug`, JSON.stringify(newBinList));
              setBinList(newBinList);
              syncData({
                ...data,
                binList: newBinList,
              })
            }
          })
        }
      }
    }  
    
  }, [])

  const handleUpdateLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLimit(parseInt(newValue));
    syncData({
      ...data,
      limit: parseInt(newValue),
    })
  }
  const debounceUpdateLimit = debounce(handleUpdateLimit, 500);

  const onSelectedBin = (binId: string) => {
    let bin = binList.find(bin => bin.id === binId);
    if(!bin) {
      return;
    }
    bin = {
      ...bin,
      selected: !bin.selected,
    }
    const otherBins = binList.filter(bin => bin.id !== binId);
    const newBinList = [...otherBins, bin]
    newBinList.sort((a: SortingBinSelected, b: SortingBinSelected) => a.title.length - b.title.length);
    // console.log(`debug`, JSON.stringify(newBinList))
    setBinList(newBinList);
    syncData({
      ...data,
      binList: newBinList,
    });
  }
  const binColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipse: true,
    },
    {
      title: "Select Data Sorce",
      key: "action",
      render: (text: string, record: SortingBinSelected) => (
          <Checkbox checked={record.selected} onChange={() => onSelectedBin(record.id)}>Selected</Checkbox>
      ),
    },
  ];
  return <div>
    <Form initialValues={{
      limit
    }}>
    <Form.Item name="limit" label="Rank Limit Number">
      <Input name="limit" onChange={debounceUpdateLimit} value={limit}/>
    </Form.Item>
    <Divider />
    </Form>
    <h3>Bins</h3>
      <Table
        rowKey={(record) => `bin_${record.id}`}
        size="small"
        pagination={{ pageSize: 5 }}
        dataSource={binList}
        columns={binColumns}
      />
  </div>;
};
