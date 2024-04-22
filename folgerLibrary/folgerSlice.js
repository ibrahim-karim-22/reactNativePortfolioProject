import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { aMidSummerNightsDream } from "../shared/folgerUrl";
import HTMLView from "react-native-htmlview";


export const fetchFolger = createAsyncThunk(
    'folger/fetchFolger',
    async (playName) => {
            const response = await fetch(`https://www.folgerdigitaltexts.org/${playName}/synopsis/`);
            if (!response.ok) {
                throw new Error('Fetch failed with status: ' + response.status);
            }
            const htmlText = await response.text(); 
            return htmlText;
        } 
);

const folgerSlice = createSlice({
    name: 'folger',
    initialState: { isLoading: true, errMess: null, htmlContent: {} },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFolger.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchFolger.fulfilled, (state, action) => {
                state.isLoading = false;
                state.errMess = null;
                state.htmlContent[action.meta.arg] = action.payload;
            })
            .addCase(fetchFolger.rejected, (state, action) => {
                state.isLoading = false;
                state.errMess = action.error ? action.error.message : 'Fetch failed';
            });
    }
});

export const folgerReducer = folgerSlice.reducer;
