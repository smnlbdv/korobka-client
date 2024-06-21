import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const deleteOrderItemAsync = createAsyncThunk(
    'liked/deleteOrderItemAsync',
    async (id) => {
      try {
        const response = await api.delete(`/api/profile/delete-order/${id}`)
        return {
            ...response.data,
            _id: id,
        }
      } catch (error) {
        console.log(error.message);
      }
    }
);

export const deleteConstructorItemAsync = createAsyncThunk(
  'liked/deleteConstructorItemAsync',
  async (id) => {
    try {
      const response = await api.delete(`/api/profile/delete-order/constructor/${id}`)
      return {
          ...response.data,
          _id: id,
      }
    } catch (error) {
      console.log(error.message);
    }
  }
);

export const updateInfoProfileAsync = createAsyncThunk(
    'liked/updateInfoProfileAsync',
    async (changedData) => {
      try {
        await api.patch("/api/profile/update", changedData)
        return {
            data: changedData,
        }
      } catch (error) {
        console.log(error.message);
      }
    }
);

export const placeOrderAsync = createAsyncThunk(
    'liked/placeOrderAsync',
    async (orderObj) => {
      try {
        const response = await api.post(`/api/profile/order`, {order: orderObj.values, cart: orderObj.order, totalAmount: orderObj.price})
        return {
            result: response.data.success,
            message: response.data.message,
            url: response.data.url,
            order: response.data.order,
            success: response.data.success
        }
      } catch (error) {
        console.log(error);
      }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profile: {},
        order: [],
        constructor: [],
        isAuth: false,
        role: null,
        userId: null
    },
    reducers: {
        addInfoProfile (state, action) {
            state.profile = { ...action.payload };
        },
        addProductProfile (state, action) {
          const existingItem = state.order.find(item => item._id === action.payload._id);
          if (!existingItem) {
              state.order.push(action.payload);
          } 
        },
        addConstructorProfile(state, action) {
          const existingItem = state.constructor.find(item => item._id === action.payload._id);
          if (!existingItem) {
              state.constructor.push(action.payload);
          }
        }, 
        setIsAuth(state, action) {
          state.isAuth = action.payload;
        },
        setRole(state, action) {
            state.role = action.payload;
        },
        setUserId(state, action) {
            state.userId = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(deleteOrderItemAsync.fulfilled, (state, action) => {
                if(action.payload && action.payload.success === true) {
                    state.order = state.order.filter(item => item._id !== action.payload._id);
                } 
            })
        builder
            .addCase(deleteConstructorItemAsync.fulfilled, (state, action) => {
                if(action.payload && action.payload.success === true) {
                    state.constructor = state.constructor.filter(item => item._id !== action.payload._id);
                } 
            })
        builder
            .addCase(updateInfoProfileAsync.fulfilled, (state, action) => {
                state.profile = {
                    ...state.profile,
                    ...action.payload.data
                };
            })
    }
})

export const {addInfoProfile, addProductProfile, updateInfoProfile, setIsAuth, setRole, setUserId, addConstructorProfile} = profileSlice.actions
export default profileSlice.reducer