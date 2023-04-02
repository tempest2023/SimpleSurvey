import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SurveyJson } from '../components/survey-editor/type'
import { createSurveyJson, createSortRankSurveyJson } from '../components/survey-editor/utils'

interface SurveyState {
  surveyJson: SurveyJson;
}

const initialState: SurveyState = {
  surveyJson: createSortRankSurveyJson(),
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setSurveyJson: (state, action: PayloadAction<SurveyJson>) => {
      state.surveyJson = action.payload;
    },
  },
});

export const { setSurveyJson } = surveySlice.actions;

export default surveySlice.reducer;