import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../store/store";
import { SurveyCustomComponentProps, SurveyComponentData } from "../../type";
import { Divider, Button, Form, Input, Table, Checkbox, List, Typography, Popover, Space } from "antd";
import { SortingCard } from "../Sorting/type";
import { RankConfigProps, RankData, SortingBinSelected } from "./type";
import {
  PlusCircleOutlined,
  UpOutlined,
  DownOutlined,
  RightOutlined,
  LeftOutlined } from "@ant-design/icons";
import { querySelectedData, ellipseString } from "../../utils";
import "./index.css";

type RankCard = SortingCard & {
  isRanked: boolean;
}

export const RankView = ({ data, updateData, toNextPage }: SurveyCustomComponentProps) => {
  if (!data) {
    return <div>No data in Rank Component</div>;
  }
  const [sorting, setSorting] = useState(JSON.parse(JSON.stringify(data.sorting|| {})));
  const limit = data.limit || 10;
  const [binList, setBinList] = useState<SortingBinSelected[]>(data.binList || []);  
  const [rankList, setRankList] = useState<RankCard[]>([]);
  const fillEmpty = (rankList: RankCard[], limit: number) => {
    return [...rankList, ...Array(limit - rankList.length).fill({id: "", title: "", isRanked: false})];
  }
  const handleRankCard = (card: RankCard, binId: string) => {
    if(rankList.length === limit) {
      return;
    }
    const tmpList = [...rankList];
    tmpList.push(card);
    // set the card to be ranked
    for(let i=0;i<sorting[binId].length;i++) {
      if(sorting[binId][i].id === card.id) {
        sorting[binId][i].isRanked = true;
        break;
      }
    }
    setRankList(tmpList);
    setSorting(sorting);
  }
  const moveFromRankList = (cardId: string) => {
    const tmpList = rankList.filter((card) => card.id !== cardId);
    for(let binId in sorting) {
      for(let i=0;i<sorting[binId].length;i++) {
        if(sorting[binId][i].id === cardId) {
          sorting[binId][i].isRanked = false;
          break;
        }
      }
    }
    setSorting(sorting);
    setRankList(tmpList);
  }
  const moveCardUp = (cardId: string) => {
    const tmpList = [...rankList];
    for(let i=0;i<tmpList.length;i++) {
      if(tmpList[i].id === cardId && i > 0) {
        const tmp = tmpList[i-1];
        tmpList[i-1] = tmpList[i];
        tmpList[i] = tmp;
        break;
      }
    }
    setRankList(tmpList);
  }

  const moveCardDown = (cardId: string) => {
    const tmpList = [...rankList];
    for(let i=0;i<tmpList.length;i++) {
      if(tmpList[i].id === cardId && i < tmpList.length - 1) {
        const tmp = tmpList[i+1];
        tmpList[i+1] = tmpList[i];
        tmpList[i] = tmp;
        break;
      }
    }
    setRankList(tmpList);
  }

  const checkAllRanked = () => {
    let allRanked = true;
    // if the rankList is full
    if(rankList.length === limit) {
      return true;
    }
    // if the rankList is not full, check if all cards are ranked
    for(let binId in sorting) {
      for(let i=0;i<sorting[binId].length;i++) {
        if(!sorting[binId][i].isRanked) {
          allRanked = false;
          break;
        }
      }
    }
    return allRanked;
  }

  const onFinish = () => {
    // save changes in this page and go to next page
    updateData(data.id, { ...data, sorting, rankList }, false);
    toNextPage && toNextPage();
  }

  const renderBins = () => {
    return (
      <div className="sorting-bin-container">
        {binList.map((bin) => {
          if(!bin.selected) {
            return null;
          }
          const binSorting = sorting[bin.id] || [];
          return (
            <div key={`bin_` + bin.id} className="sorting-bin-outter">
              <span className="sorting-bin-title">{bin.title}</span>
              <div className="sorting-bin-box">
                {binSorting.map((card: RankCard) => {
                  if(card.isRanked) {
                    // skip this card because it is ranked
                    return null;
                  }
                  return (
                  <span
                    key={card.id}
                  >
                    <span className="sorting-card-item-title">{card.title}</span>
                    <Popover content='Rank It'><Button type="ghost" icon={<RightOutlined />} onClick={() => handleRankCard(card, bin.id)}></Button></Popover>
                  </span>
                )})}
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
        style={{width: '100%'}}
        header={<h3>My Priorities</h3>}
        bordered
        dataSource={fillEmpty(rankList, limit)}
        renderItem={(item, ind: number) => (
          <List.Item>
            <div className="ranking-item">
              <Typography.Text mark>No. {ind+1}</Typography.Text>
              <div className="ranking-card-item">
                <span className="ranking-card-item-title">{item.title}</span>
                <div>
                
                  <Popover content="move up">
                    <Button
                      shape="circle"
                      onClick={() => moveCardUp(item.id)}
                      icon={<UpOutlined />}
                      size="small"
                      disabled={ind === 0 || !item.id}
                    />
                  </Popover>
                  <Popover content="move down">
                    <Button
                      shape="circle"
                      onClick={() => moveCardDown(item.id)}
                      icon={<DownOutlined />}
                      size="small"
                      disabled={ind === limit - 1 || !item.id}
                    />
                  </Popover>
                  <Popover content="move to orignal list">
                    <Button
                      shape="circle"
                      onClick={() => moveFromRankList(item.id)}
                      icon={<LeftOutlined />}
                      size="small"
                      disabled={!item.id}
                      />
                  </Popover>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
    <div className="page-footer">
        {checkAllRanked() && (
          <Button type="primary" onClick={onFinish}>Continue</Button>
        )}
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

  const [binList, setBinList] = useState<SortingBinSelected[]>(data?.binList || []);
  const [limit, setLimit] = useState<number>(data?.limit || 10);

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
              const sortBinList = (Array.from(element.binList || []) as SortingBinSelected[]).filter(item => {
                // filter all bins already are in binList
                return !binList.find(bin => bin.id === item.id);
              }).map((bin) => ({
                ...bin,
                selected: false,
              }))
              const newBinList = [...binList, ...sortBinList];
              newBinList.sort((a: SortingBinSelected, b: SortingBinSelected) => a.title.length - b.title.length);
              // console.log(`debug`, JSON.stringify(newBinList));
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
  if (!data) {
    return <div>No data in Rank Config</div>;
  }
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
