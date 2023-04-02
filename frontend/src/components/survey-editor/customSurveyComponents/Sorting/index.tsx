import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../store/store";
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
  SortingBin,
  SortingCard,
  SortingCardBinData,
  SortingConfigProps,
  SortingCardProps,
} from "./type";
import { querySelectedData } from "../../utils";
import { SurveyComponentData } from "../../type";
import ButtonModal from "../../../buttonModal";
import "./index.css";

export const SortingView = ({ data }: { data: SurveyComponentData }) => {
  if (!data) {
    return <div>No data in Sorting Card</div>;
  }
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [hoveredBinId, setHoveredBinId] = useState("");

  const {
    title = "Sorting Card",
    cardList = [],
    binList = [],
    sorting = {},
  } = data as SortingCardBinData;

  const binCount = binList.length;
  const cardCount = cardList.length;

  const handleBinClick = (binId: string) => {
    if (currentCardIndex + 1 >= cardCount) {
      setCurrentCardIndex(0);
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
    }
    if (!sorting[binId]) {
      sorting[binId] = [];
    }
    sorting[binId].push(cardList[currentCardIndex]);
  };

  const moveCardToBin = (cardId: string, binId: string) => {
    console.log(`[debug] moveCardToBin: cardId: ${cardId}, binId: ${binId}`);
    if (!cardId || !binId) {
      return;
    }
    const card = cardList.find((card) => card.id === cardId);
    if (!card) {
      return;
    }
    if (!sorting[binId]) {
      sorting[binId] = [];
    }
    sorting[binId].push(card);
    card.isMoved = true;
  };

  const handleMenuVisibleChange = (visible: boolean) => {
    if (!visible) {
      setHoveredBinId("");
    }
  };

  const handleRestoreClick = (cardId: string, binId: string) => {
    const index = sorting[binId].findIndex((card) => card.id === cardId);
    sorting[binId].splice(index, 1);
  };

  const handleBinMouseEnter = (binId: string) => {
    setHoveredBinId(binId);
  };

  const handleBinMouseLeave = () => {
    setHoveredBinId("");
  };

  const renderCard = () => {
    const { id, title, description, cardImage, isMoved } =
      cardList.length === 0
        ? {
            id: "",
            title: "",
            description: "",
            cardImage: "",
            isMoved: false,
          }
        : cardList[currentCardIndex];
    const items: MenuProps["items"] = binList.map((bin) => {
      return {
        label: (
          <Button onClick={() => moveCardToBin(id, bin.id)}>{bin.title}</Button>
        ),
        key: `dropdown-btn-${bin.id}`,
      };
    }) as MenuProps["items"];
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <AntCard id={`card_${id}`} size="default" hoverable>
          <div className="sorting-card-item-panel">
            <img
              className="sorting-card-image"
              alt={description}
              src={cardImage}
            />
            <div className="sorting-card-item-info">
              <span className="sorting-card-item-title">{title}</span>
              <span className="sorting-card-item-desc">{description}</span>
              <Divider />
              <Dropdown
                menu={{ items }}
                disabled={isMoved || binList.length === 0}
              >
                <Button onClick={(e) => e.preventDefault()}>
                  <Space>Move To</Space>
                </Button>
              </Dropdown>
            </div>
          </div>
        </AntCard>
      </div>
    );
  };

  const renderBins = () => {
    return (
      <div className="sorting-bin-container">
        {binList.map((bin) => {
          const binSorting = sorting[bin.id] || [];
          return (
            <div key={`bin_` + bin.id} className="sorting-bin-outter">
              <span>{bin.title}</span>
              <div className="sorting-each-bin">
                {binSorting.map((card) => (
                  <AntCard
                    key={card.id}
                    title={card.title}
                    extra={
                      <Button
                        type="link"
                        onClick={() => handleRestoreClick(card.id, bin.id)}
                        disabled={cardList[currentCardIndex].id !== card.id}
                      >
                        Remove
                      </Button>
                    }
                  >
                    <AntCard.Meta description={card.description} />
                  </AntCard>
                ))}
                {hoveredBinId === bin.id && (
                  <Dropdown
                    menu={{
                      items: binList
                        .filter((item) => item.id !== bin.id)
                        .map((item) => {
                          return {
                            label: (
                              <Button
                                key={item.id}
                                onClick={() => handleBinClick(item.id)}
                              >
                                {item.title}
                              </Button>
                            ),
                            key: item.id,
                          };
                        }) as MenuProps["items"],
                    }}
                    placement="bottomRight"
                    arrow
                  ></Dropdown>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <span className="sorting-card-progress-bar-info">{`Cards: ${
        cardCount > 0 ? currentCardIndex + 1 : 0
      }/${cardCount}`}</span>
      <Progress
        width={80}
        percent={(currentCardIndex / (cardCount === 0 ? 1 : cardCount)) * 100}
        showInfo={false}
      />
      {renderCard()}
      {/* <div className="sorting-progress-info">{`${cardCount > 0 ? currentCardIndex+1 : 0}/${cardCount}`}</div> */}
      {renderBins()}
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button
          disabled={currentCardIndex === 0}
          onClick={() => setCurrentCardIndex(currentCardIndex - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={currentCardIndex === cardCount - 1}
          onClick={() => setCurrentCardIndex(currentCardIndex + 1)}
        >
          Next
        </Button>
        {currentCardIndex === cardCount - 1 && (
          <Button type="primary">Continue</Button>
        )}
      </div>
    </div>
  );
};

export const SortingConfig = ({ updateData }: SortingConfigProps) => {
  const surveyJson = useSelector((state: RootState) => state.survey.surveyJson);
  const elementId = useSelector(
    (state: RootState) => state.editor.selectedElementId
  );
  const data: SortingCardBinData = querySelectedData(
    surveyJson,
    elementId
  ) as SortingCardBinData;

  if (!data) {
    return <div>No data in Sorting Card...</div>;
  }

  const { cardList: originCardList, binList: originBinList } = data;
  const [cardList, setCardList] = useState<SortingCard[]>(originCardList || []);
  const [binList, setBinList] = useState<SortingBin[]>(originBinList || []);
  const [cardForm] = Form.useForm();
  const [binForm] = Form.useForm();

  const syncData = (data: SortingCardBinData) => {
    updateData(data.id, data, false);
  };

  useEffect(() => {
    cardForm.resetFields();
    binForm.resetFields();
  });

  const onAddCard = (card: SortingCard) => {
    const tmp = [...cardList, card];
    setCardList(tmp);
    syncData({
      ...data,
      cardList: tmp,
      binList,
    });
  };

  const onEditCard = (card: SortingCard) => {
    const tmp = cardList.map((c) => {
      if (c.id === card.id) {
        return card;
      }
      return c;
    });
    setCardList(tmp);
    syncData({
      ...data,
      cardList: tmp,
      binList,
    });
  };

  const moveCardDown = (cardId: string) => {
    // switch the rank of this card and the card below it
    // if the card below it does not exist, do nothing
    let tmpCardList = Array.from(JSON.parse(JSON.stringify(cardList))).sort(
      (a: any, b: any) => a.rank - b.rank
    ) as SortingCard[];
    for (let i = 0; i < tmpCardList.length; i++) {
      if (tmpCardList[i].id === cardId) {
        if (i === tmpCardList.length - 1) {
          break;
        }
        // swap the rank of this card and the card below it
        const tmpRank = tmpCardList[i].rank;
        tmpCardList[i].rank = tmpCardList[i + 1].rank;
        tmpCardList[i + 1].rank = tmpRank;
        // swap this two cards in the array
        const tmpCard = tmpCardList[i];
        tmpCardList[i] = tmpCardList[i + 1];
        tmpCardList[i + 1] = tmpCard;
        break;
      }
    }
    setCardList(tmpCardList);
    syncData({
      ...data,
      cardList: tmpCardList,
      binList: binList,
    });
  };

  const moveCardUp = (cardId: string) => {
    // switch the rank of this card and the card above it
    // if the card above it does not exist, do nothing
    let tmpCardList = Array.from(JSON.parse(JSON.stringify(cardList))).sort(
      (a: any, b: any) => a.rank - b.rank
    ) as SortingCard[];
    for (let i = 0; i < tmpCardList.length; i++) {
      if (tmpCardList[i].id === cardId) {
        if (i === 0) {
          break;
        }
        // swap the rank of this card and the card above it
        const tmpRank = tmpCardList[i].rank;
        tmpCardList[i].rank = tmpCardList[i - 1].rank;
        tmpCardList[i - 1].rank = tmpRank;
        // swap this two cards in the array
        const tmpCard = tmpCardList[i];
        tmpCardList[i] = tmpCardList[i - 1];
        tmpCardList[i - 1] = tmpCard;
        break;
      }
    }
    setCardList(tmpCardList);
    syncData({
      ...data,
      cardList: tmpCardList,
      binList: binList,
    });
  };

  const onAddBin = (bin: SortingBin) => {
    const tmp = [...binList, bin];
    setBinList(tmp);
    syncData({
      ...data,
      cardList: cardList,
      binList: tmp,
    });
  };

  const confirmDeleteCard = (cardId: string) => {
    // delete the card with cardId from cardList
    const tmp = cardList.filter((card) => card.id !== cardId);
    setCardList(tmp);
    syncData({
      ...data,
      cardList: tmp,
      binList,
    });
  };

  const confirmDeleteBin = (binId: string) => {
    // delete the bin with binId from binList
    const tmp = binList.filter((bin) => bin.id !== binId);
    setBinList(tmp);
    syncData({
      ...data,
      cardList,
      binList: tmp,
    });
  };

  const onFinishCard = (values: any) => {
    const card: SortingCard = {
      ...values,
      id: `${Date.now()}`,
      isAvailable: true,
      rank: cardList.length,
    };
    // console.log('[debug] onFinishCard card:', card);
    onAddCard(card);
    cardForm.resetFields();
  };

  const onFinishEditCard = (values: any) => {
    const card: SortingCard = {
      ...values,
    };
    onEditCard(card);
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

  const CardEditForm = ({ card }: { card: SortingCard }) => {
    const [cardEditForm] = Form.useForm();
    useEffect(() => {
      cardEditForm.setFieldsValue(card);
    })
    return (
      <Form
        form={cardEditForm}
        title="Edit Cards"
        onFinish={onFinishEditCard}
        layout="horizontal"
      >
        <Form.Item name="id" label="Id">
          <Input placeholder="Enter card id" disabled />
        </Form.Item>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder="Enter card title" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter card description" />
        </Form.Item>
        <Form.Item name="cardImage" label="Image">
          <Input placeholder="Enter card image url" />
        </Form.Item>
        <Form.Item name="isAvailable" label="IsAvailable">
          <Radio.Group>
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item className="flex-center">
          <Button type="primary" htmlType="submit">
            Edit
          </Button>
        </Form.Item>
      </Form>
    );
  };
  const CardAddForm = (
    <Form
      form={cardForm}
      title="Add Cards"
      onFinish={onFinishCard}
      layout="horizontal"
    >
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input placeholder="Enter card title" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input placeholder="Enter card description" />
      </Form.Item>
      <Form.Item name="cardImage" label="Image">
        <Input placeholder="Enter card image url" />
      </Form.Item>
      <Form.Item className="flex-center">
        <Button type="primary" htmlType="submit">
          Add Card
        </Button>
      </Form.Item>
    </Form>
  );

  const BinAddForm = (
    <Form
      form={binForm}
      title="Add Bins"
      onFinish={onFinishBin}
      layout="horizontal"
    >
      <Form.Item name="title" label="Bin Title" rules={[{ required: true }]}>
        <Input placeholder="Enter bin title" />
      </Form.Item>
      <Form.Item className="flex-center">
        <Button type="primary" htmlType="submit">
          Add Bin
        </Button>
      </Form.Item>
    </Form>
  );
  const cardColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "25%",
      ellipsis: true,
      render: (text: string) => (
        <span>{text.length > 10 ? text.substring(0, 10) + "..." : text}</span>
      ),
    },
    {
      title: "Card Image",
      dataIndex: "cardImage",
      key: "cardImage",
      width: "25%",
      render: (text: string) => (
        <img className="small-card-image" src={text} alt="card image" />
      ),
    },
    {
      title: "Used",
      dataIndex: "isAvailable",
      key: "isAvailable",
      width: "15%",
      render: (text: boolean) => <span>{text ? "Yes" : "No"}</span>,
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (text: string, record: SortingCard) => (
        <>
          <Space>
            <ButtonModal
              buttonShape="circle"
              buttonSize="small"
              buttonIcon={<EditOutlined />}
              modalTitle={`Edit Card: ${record.title}`}
              cancelText="Close"
            >
              <CardEditForm card={record} />
            </ButtonModal>
          </Space>
          <Space size="middle">
            <Popconfirm
              title="Are you sure to delete this card?"
              onConfirm={() => confirmDeleteCard(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button shape="circle" icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Space>
          <br />
          <Space>
            <Popover content="move rank up">
              <Button
                shape="circle"
                onClick={() => moveCardUp(record.id)}
                icon={<UpOutlined />}
                size="small"
              />
            </Popover>
          </Space>
          <Space>
            <Popover content="move rank down">
              <Button
                shape="circle"
                onClick={() => moveCardDown(record.id)}
                icon={<DownOutlined />}
                size="small"
              />
            </Popover>
          </Space>
        </>
      ),
    },
  ];

  const binColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipse: true,
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: SortingBin) => (
        <>
          <Space>
            <Popconfirm
              title="Are you sure to delete this bin?"
              onConfirm={() => confirmDeleteBin(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button shape="circle" icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];

  return (
    <div>
      <h3>Cards</h3>
      <Table
        bordered
        rowKey={(record) => `card_${record.id}`}
        size="small"
        pagination={{ pageSize: 5 }}
        dataSource={cardList}
        columns={cardColumns}
      />
      <ButtonModal
        buttonText={
          <div className="flex-center">
            <PlusCircleOutlined />
            Add Cards
          </div>
        }
        modalTitle="Add Cards"
        cancelText="Close"
      >
        {CardAddForm}
      </ButtonModal>
      <Divider />
      <h3>Bins</h3>
      <Table
        rowKey={(record) => `bin_${record.id}`}
        size="small"
        pagination={{ pageSize: 5 }}
        dataSource={binList}
        columns={binColumns}
      />
      <ButtonModal
        buttonText="Add Bins"
        modalTitle="Add Bins"
        cancelText="Close"
      >
        {BinAddForm}
      </ButtonModal>
    </div>
  );
};