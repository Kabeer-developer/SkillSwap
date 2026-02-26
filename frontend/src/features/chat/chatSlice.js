import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, setMessages, clearChat } = chatSlice.actions;
export default chatSlice.reducer;