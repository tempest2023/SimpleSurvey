import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page, SurveyComponentData, ComponentConfigProps } from '../components/survey-editor/type';
interface EditorState {
  selectedPageId: string|null,
  selectedElementId: string|null,
  selectedElementData: SurveyComponentData | null,
  configForms: React.FC<ComponentConfigProps> | null
}

const initialState: EditorState = {
  selectedElementId: null,
  selectedElementData: null,
  selectedPageId: null,
  configForms: null
};

const editorSlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setSelectedElementId: (state, action: PayloadAction<string>) => {
      state.selectedElementId = action.payload;
    },
    setSelectedPageId: (state, action: PayloadAction<string>) => {
      state.selectedPageId = action.payload;
    },
    setSelectedElementData: (state, action: PayloadAction<SurveyComponentData>) => {
      state.selectedElementData = action.payload;
    },
    setConfigForms: (state, action: PayloadAction<React.FC<ComponentConfigProps>>) => {
      state.configForms = action.payload;
    },
    setEditorState: (state, action: PayloadAction<Partial<EditorState>>) => {
      state.selectedElementData = action.payload.selectedElementData || state.selectedElementData;
      state.selectedElementId = action.payload.selectedElementId || state.selectedElementId;
      state.selectedPageId = action.payload.selectedPageId || state.selectedPageId;
      state.configForms = action.payload.configForms || state.configForms
    }
  },
});

export const { setSelectedElementId, setSelectedPageId, setSelectedElementData, setEditorState, setConfigForms } = editorSlice.actions;

export default editorSlice.reducer;