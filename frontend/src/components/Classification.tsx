import {
  Button,
  Card,
  Collapse,
  Dropdown,
  List,
  Menu,
  Spin,
  Carousel,
  Image,
} from "antd";
import React, { useState, useRef, useEffect } from "react";
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
  const [categoryElementList, setCategoryElementList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  //   const [classification, setClassification] = useState<{
  //     [name: string]: Card[];
  //   }>({});

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

  const handleDeleteCard = (category) => {
    // const updatedClassification = {...classification };
    console.log("cardList" + JSON.stringify(formData.cardList));
    console.log(formData.cardList.length);
    const card = formData.cardList[formData.cardList.length - 1];
    console.log("card" + card);

    console.log("formData" + formData);
    console.log("classification" + formData.classification);
    const index = category.id;
    console.log(formData.classification[index]);
    console.log("category_ID" + category.id);
    formData.classification[category.id].push(card);
    // delete formData.cardList[formData.cardList.length - 1];
  };
  useEffect(() => {
    // console.log("[debug] preview-editor", formData);
    const tmp = [];
    for (let i = 0; i < formData.categoryList.length; i++) {
      tmp.push(
        <div key={`cardCategory_${i}`} className="preview-editor-category">
          {/* {formData.categoryList[i].title} */}
          <Card
            style={{
              width: 300,
              height: 150,
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            {formData.classification[categoryList[i].id].map((card) => {
              return <div>{card.description}</div>;
            })}
            <Button onClick={() => handleDeleteCard(formData.categoryList[i])}>
              {formData.categoryList[i].title}
              {/* <div>
                <text>{JSON.stringify(formData.classification[categoryList[i].id][0])}</text>
              </div> */}
            </Button>
            
            {/* {formData.classification[formData.categoryList[i].id]} */}
          </Card>
        </div>
      );
    }
    setCategoryElementList(tmp);
  }, [formData]);

  const carouselRef = useRef(null);
  //   const carouselRef = useRef(null);

  return (
    <div className="preview-editor-container">
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

      <br />
      <br />
      <br />

      <div className="preview-editor-category">
        {categoryElementList.length > 0 && categoryElementList}
        {categoryElementList.length <= 0 && (
          <div>
            <h3>Please upload some categories</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classification;
