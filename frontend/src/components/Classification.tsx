import { Button, Card, Collapse, Dropdown, List, Menu, Spin, Carousel, Image} from "antd";
import React, { useState, useRef, useEffect} from "react";
import { SurveyJsonSchema } from "./SurveySchemaType";
const { Meta } = Card;


interface Card {
  id: string;
  description: string;
  cardImage: string;
}

interface Category {
  id: string;
  title: string;
}

const Classification = (props) => {
  const formData: SurveyJsonSchema = props.formData;

  const categoryList = formData.categoryList;
  const [cardElementList, setCardElementList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [classification, setClassification] = useState<{
    [name: string]: Card[];
  }>({});

  const moveCard = (card, fromCategoryId: string, toCategoryId: string) => {
    setIsLoading(true);
    // simulate an async operation
    setTimeout(() => {
      const updatedClassification = { ...classification };
      const fromCategoryCards = classification[fromCategoryId];
      const toCategoryCards = classification[toCategoryId];
      updatedClassification[fromCategoryId] = fromCategoryCards.filter(
        (c) => c.id !== card.id
      );
      updatedClassification[toCategoryId] = [...toCategoryCards, card];
      setClassification(updatedClassification);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // console.log("[debug] preview-editor", formData);
    const tmp = [];

    for (let i = 0; i < formData.cardList.length; i++) {
      tmp.push(
        <Card
          className="preview-editor-card"
          key={`cardImage_${i}`}
          hoverable
          cover={
            <Image
              style={{ width: "100%", height: "100%" }}
              src={formData.cardList[i].cardImage}
            ></Image>
          }
        >
          <Meta title={formData.cardList[i].description} />
          {/* {formData.categoryList} */}
        </Card>
      );
    }
    setCardElementList(tmp);
  }, [formData]);


  
  const menu = (card, categoryId: string) => (
    <Menu>
      {categoryList.map((c) => (
        <Menu.Item key={c.id} onClick={() => moveCard(card, categoryId, c.id)}>
          {c.title}
        </Menu.Item>
      ))}
    </Menu>
  );
  const carouselRef = useRef(null);
//   const carouselRef = useRef(null);

  return (
    <div>
      <div>
        <Carousel
          ref={carouselRef}
          dots={false}
          infinite={false}
          className="preview-editor-images"
        >
          {cardElementList.length > 0 && cardElementList}
          {cardElementList.length <= 0 && (
            <div>
              <h3>Please upload some images</h3>
            </div>
          )}
        </Carousel>
        </div>
      <Spin spinning={isLoading}>
        <Collapse>
          {categoryList.map((category) => (
            <Collapse.Panel key={category.id} header={category.title}>
              <List
                dataSource={classification[category.id] || []}
                renderItem={(card) => (
                  <List.Item>
                    <Card
                      actions={[
                        <Dropdown
                          key={card.id}
                          overlay={menu(card, category.id)}
                        >
                          <Button>Move</Button>
                        </Dropdown>,
                      ]}
                    >
                      {card.description}
                    </Card>
                  </List.Item>
                )}
              />
            </Collapse.Panel>
          ))}
        </Collapse>
      </Spin>
    </div>
  );
};

export default Classification;
