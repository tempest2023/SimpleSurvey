import React, { useState } from 'react';
import { Divider, List, Button, Form, Input, Upload, Switch, Space, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { SortingBin, SortingCard, SortingCardBinData, SortingConfigProps, SortingCardProps } from './type';
import Card from './sortingCard';
import Bin from './sortingBin';
import "./index.css";


export const SortingView = ({data}:{data: SortingCardBinData}) => {
  // console.log('[debug] SortingView props:', data);
  if(!data) {
    return <div>Error: Props is undefined in SortingView</div>;
  }
  const {
    cardList,
    cardCount,
    binList,
    binCount,
    sorting
  } = data;

  const addCardToBin = (
    cardId: string,
    cardShortTitle: string,
    binId: string
  ) => {
    // Implement addCardToBin logic here
  };

  // console.log('[debug] SortingView cardList:', cardList);
  return (
    <div className="container">
      <h1>{data.title}</h1>
      <div className="row mt-4">
        <div className="col-sm">
          <p className="lead">
            Cards
            <span id="available_cards_count">{data.cardCount || 0}</span>/
            <span id="total_cards_count">{data.cardCount || 0}</span>
          </p>
          <div className="progress" style={{ height: "5px" }}>
            <div
              className="progress-bar"
              id="cards_progress_bar"
              role="progressbar"
              style={{ width: "100%" }}
              aria-valuenow={10}
              aria-valuemin={0}
              aria-valuemax={data.cardCount}
              aria-label="Card Progress"
            ></div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-sm" id="card_container">
          {cardList && cardList.length>0 ? <Card {...cardList[0]} /> : <div>No cards</div>}
        </div>
      </div>
      <div className="row mt-3">
          <p className="lead">
            Bins
          </p>
        {binList && binList.map((bin: SortingBin) => (
          <Bin key={bin.id} {...bin} />
        ))}
      </div>
      <div className="row mt-3">
        <div className="col-md-12">
          <div className="float-right">
            <form action="/prioritize/2">
              <button
                type="submit"
                className="btn btn-primary"
                id="submit_clusters_btn"
                disabled
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


export const SortingConfig = (props: SortingConfigProps) => {
  if(!props || !props.data) return (<div>No data in SortingCard...</div>);
  const { data, updateData } = props;
  const { cardList:originCardList, binList:originBinList } = data;
  const [cardList, setCardList] = useState<SortingCard[]>(originCardList || []);
  const [binList, setBinList] = useState<SortingBin[]>(originBinList || []);
  const [title, setTitle] = useState<string>(data.title || '');
  const [cardForm] = Form.useForm();
  const [binForm] = Form.useForm();

  const syncData = (data:SortingCardBinData) => {
    updateData(data.id, data, false);
  }

  const onAddCard = (card: SortingCard) => {
    const tmp = [...cardList, card];
    setCardList(tmp);
    syncData({
      ...data,
      cardList: tmp,
    });
  }

  const onAddBin = (bin: SortingBin) => {
    const tmp = [...binList, bin];
    setBinList(tmp);
    syncData({
      ...data,
      binList: tmp,
    });
  }

  const confirmDeleteCard = (cardId: string) => {
    // delete the card with cardId from cardList
    const tmp = cardList.filter((card) => card.id !== cardId);
    setCardList(tmp);
    syncData({
      ...data,
      cardList: tmp,
    });
  };

  const confirmDeleteBin = (binId: string) => {
    // delete the bin with binId from binList
    const tmp = binList.filter((bin) => bin.id !== binId);
    setBinList(tmp);
    syncData({
      ...data,
      binList: tmp,
    });
  };

  const onFinishCard = (values: any) => {
    const card: SortingCard = {
      ...values,
      id: `${Date.now()}`,
      isAvailable: true,
    };
    // console.log('[debug] onFinishCard card:', card);
    onAddCard(card);
    cardForm.resetFields();
  };

  const onFinishBin = (values: any) => {
    const bin: SortingBin = {
      ...values,
      id: `${Date.now()}`,
    };
    // console.log('[debug] onFinishBin bin:', bin);
    onAddBin(bin);
    binForm.resetFields();
  };

  const handleTitleChange = (e: any) => {
    const title = e.target.value;
    setTitle(title);
    syncData({
      ...data,
      title,
    });
  };

  return (
    <div>
      <Form layout="inline">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Title is required' }]}
        >
          <Input onChange={handleTitleChange} value={title} placeholder="Title" />
      </Form.Item>
      </Form>
      <h3>Cards</h3>
      <List
        dataSource={cardList}
        renderItem={(card) => (
          <List.Item>
            <Space>
              <span>{card.title}</span>
              <Popconfirm
                title="Are you sure to delete this card?"
                onConfirm={() => confirmDeleteCard(card.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<DeleteOutlined />} size="small" />
              </Popconfirm>
            </Space>
          </List.Item>
        )}
      />

      <h3>Bins</h3>
      <List
        dataSource={binList}
        renderItem={(bin) => (
          <List.Item>
            <Space>
              <span>{bin.title}</span>
              <Popconfirm
                title="Are you sure to delete this bin?"
                onConfirm={() => confirmDeleteBin(bin.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<DeleteOutlined />} size="small" />
              </Popconfirm>
            </Space>
          </List.Item>
        )}
      />
    <h4>Add Cards</h4>
    <Form form={cardForm} title="Add Cards" onFinish={onFinishCard} layout="inline">
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input placeholder="Enter card title" />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <Input placeholder="Enter card description" />
      </Form.Item>
      <Form.Item name="cardImage" label="Image">
        <Input placeholder="Enter card image url" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Card
        </Button>
      </Form.Item>
    </Form>
    <Divider />
    <h4>Add Bins</h4>
    <Form form={binForm} title="Add Bins" onFinish={onFinishBin} layout="inline">
      <Form.Item name="title" label="Bin Title" rules={[{ required: true }]}>
        <Input placeholder="Enter bin title" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Bin
        </Button>
      </Form.Item>
    </Form>
  </div>
  );
}


