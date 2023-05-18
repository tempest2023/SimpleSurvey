import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SurveyJson } from '../components/survey-editor/type'
import { createSurveyJson, createSortRankSurveyJson, loadSurveyJsonFromLocalStorage } from '../components/survey-editor/utils'

interface SurveyState {
  surveyJson: SurveyJson;
}

const initialState: SurveyState = {
  surveyJson: loadSurveyJsonFromLocalStorage() || createSortRankSurveyJson(),
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setSurveyJson: (state, action: PayloadAction<SurveyJson>) => {
      state.surveyJson = action.payload;
      localStorage.setItem("surveyJson", JSON.stringify(state.surveyJson));
    },
  },
});

export const { setSurveyJson } = surveySlice.actions;

export default surveySlice.reducer;