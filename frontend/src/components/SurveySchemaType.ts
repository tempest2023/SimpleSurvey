export type Card = {
    id: string;
    description: string;
    cardImage: string; // base64 encoded string
}

export type Category = {
    id: string;
    title: string;
}

export type SurveyJsonSchema = {
    cardList: Array<Card>;
    categoryCount: number;
    categoryList: Array<Category>;
}
