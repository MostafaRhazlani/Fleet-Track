import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalOpen: false,
  modalMode: 'add',
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModalOpen(state, action) {
      state.modalOpen = !!action.payload;
    },
    setModalMode(state, action) {
      state.modalMode = action.payload || 'add';
    },
    toggleModal(state) {
      state.modalOpen = !state.modalOpen;
    },
  },
});

export const { setModalOpen, setModalMode, toggleModal } = modalSlice.actions;
export default modalSlice.reducer;
