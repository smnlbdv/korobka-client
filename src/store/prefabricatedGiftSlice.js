import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const placeOrderConstructorAsync = createAsyncThunk(
    'prefabricatedGift/placeOrderConstructorAsync',
    async (orderObj) => {
      try {
        const response = await api.post(`/api/profile/order/constructor`, {order: orderObj.values, cart: orderObj.order, totalAmount: orderObj.price})
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

export const addTypesAsync = createAsyncThunk(
  'prefabricatedGift/addTypesAsync',
  async (orderObj) => {
    try {
      const response = await api.post(`/api/constructor/add/types`, orderObj)
      return {
        _id: orderObj._id,
        photo: orderObj.photo,
        title: orderObj.title,
        price: orderObj.price,
        count: orderObj.count
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const incBoxTypeGiftAsync = createAsyncThunk(
  'prefabricatedGift/incBoxTypeGiftAsync',
  async (orderObj) => {
    try {
      const response = await api.post(`/api/constructor/inc/types`, {_id: orderObj._id, count: orderObj.count})
      console.log(response);
      return {
        _id: orderObj._id,
      }
    } catch (error) {
      return
    }
  }
);

export const addProductAsync = createAsyncThunk(
  'prefabricatedGift/addProductAsync',
  async (orderObj) => {
    try {
      const response = await api.post(`/api/constructor/add/product`, orderObj)
      return {
        _id: orderObj._id,
        photo: orderObj.photo,
        title: orderObj.title,
        price: orderObj.price,
        count: orderObj.count
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const incProductAsync = createAsyncThunk(
  'prefabricatedGift/incProductAsync',
  async (orderObj) => {
    try {
      const response = await api.post(`/api/constructor/inc/product`, {_id: orderObj._id, count: orderObj.count})
      return {
        _id: orderObj._id,
      }
    } catch (error) {
      return
    }
  }
);

export const addPostCardAsync = createAsyncThunk(
  'prefabricatedGift/addPostCardAsync',
  async (orderObj) => {
    try {
      const response = await api.post(`/api/constructor/add/post-card`, orderObj)
      return {
        _id: orderObj._id,
        photo: orderObj.photo,
        title: orderObj.title,
        price: orderObj.price,
        count: orderObj.count
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const incPostCardAsync = createAsyncThunk(
  'prefabricatedGift/incPostCardAsync',
  async (orderObj) => {
    try {
      const response = await api.post(`/api/constructor/inc/post-card`, {_id: orderObj._id, count: orderObj.count})
      return {
        _id: orderObj._id,
      }
    } catch (error) {
      return
    }
  }
);

const prefabricatedGiftSlice = createSlice({
  name: "prefabricatedGift",
  initialState: {
    product: [],
    postcards: [],
    typesBox: [],
    titlaGifts: "",
    simpleBox: false,
    imageUrl: "",
    itemsPrice: 0,
    totalPrice: 0,
    price: 0,
    promo: null,
    title: "Сборный подарок",
    orderObj: [],
  },
  reducers: {
    isSimpleBox (state, action) {
      state.simpleBox = action.payload
    },
    setImgUrl (state, action) {
      state.imageUrl = action.payload
    },
    setOrderObj (state, action) {
      state.orderObj = []
      state.orderObj.push(action.payload);
    },
    resetOrderObj(state, action) {
      state.orderObj = []
      state.title = ""
    },
    setTitleOrder (state, action) {
      state.title = action.payload
    },
    setPromoConstructor(state, action) {
      state.promo = {...action.payload}
    },
    setTotalPrice (state, action) {
      state.totalPrice = action.payload;
    },
    calculatePrice (state, action) {
      const productsTotal = state.product.reduce((accumulator, product) => accumulator + (product.count * product.price), 0);
      const postcardsTotal = state.postcards.reduce((accumulator, postcard) => accumulator + (postcard.count * postcard.price), 0);
      const typesBoxTotal = state.typesBox.reduce((accumulator, box) => accumulator + (box.count * box.price), 0);

      let itemsPrice = productsTotal + postcardsTotal + typesBoxTotal;
      state.itemsPrice = parseFloat(itemsPrice.toFixed(1));
    },
    decBoxTypeGift(state, action) {
      const index = state.typesBox.findIndex(
        (item) => item._id === action.payload
      );
      if (index !== -1) {
        state.typesBox[index]["count"] -= 1;
        if (state.typesBox[index]["count"] === 0) {
          state.typesBox.splice(index, 1);
        }
      }
    },
    decProductGift(state, action) {
      const index = state.product.findIndex(
        (item) => item._id === action.payload
      );
      if (index !== -1) {
        state.product[index]["count"] -= 1;
        if (state.product[index]["count"] === 0) {
          state.product.splice(index, 1);
        }
      }
    },
    decPostCardGift(state, action) {
      const index = state.postcards.findIndex(
        (item) => item._id === action.payload
      );
      if (index !== -1) {
        state.postcards[index]["count"] -= 1;
        if (state.postcards[index]["count"] === 0) {
          state.postcards.splice(index, 1);
        }
      }
    },
    delBoxTypeGift(state, action) {
        state.typesBox = state.typesBox.filter(item => item._id !== action.payload);
    },
    delProductGift(state, action) {
        state.product = state.product.filter(item => item._id !== action.payload);
    },
    delPostCardGift(state, action) {
        state.postcards = state.postcards.filter(item => item._id !== action.payload);   
    },
    fullDeleteItemConstructor(state, action) {
      state.product = [];
      state.postcards = [];
      state.typesBox = [];
      state.orderObj = [];
    },
    deleteItemConstructor (state, action) {
      const itemToDelete = action.payload;
      state.product = state.product.filter(item => item._id !== itemToDelete);
      state.postcards = state.postcards.filter(item => item._id !== itemToDelete);
      state.typesBox =  state.typesBox.filter(item => item._id !== itemToDelete);
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(addTypesAsync.fulfilled, (state, action) => {
            state.typesBox.push(action.payload);
        })
    builder
        .addCase(incBoxTypeGiftAsync.fulfilled, (state, action) => {
          const index = state.typesBox.findIndex((item) => item._id === action.payload._id);
          if (index !== -1) {
            state.typesBox[index]["count"] = state.typesBox[index]["count"] + 1;
          }
        })
    builder
        .addCase(addProductAsync.fulfilled, (state, action) => {
            state.product.push(action.payload);
        })
    builder
        .addCase(incProductAsync.fulfilled, (state, action) => {
          const index = state.product.findIndex((item) => item._id === action.payload._id);
          if (index !== -1) {
            state.product[index]["count"] = state.product[index]["count"] + 1;
          }
        })
    builder
        .addCase(addPostCardAsync.fulfilled, (state, action) => {
            state.postcards.push(action.payload);
        })
    builder
        .addCase(incPostCardAsync.fulfilled, (state, action) => {
          const index = state.postcards.findIndex((item) => item._id === action.payload._id);
          if (index !== -1) {
            state.postcards[index]["count"] = state.postcards[index]["count"] + 1;
          }
        })
        
  },
});

export const {
  addBoxTypeGift,
  addProductGift,
  addPostCardGift,
  incProductGift,
  incPostCardGift,
  decBoxTypeGift,
  decProductGift,
  setImgUrl,
  isSimpleBox,
  decPostCardGift,
  delBoxTypeGift,
  delProductGift,
  delPostCardGift,
  setPromoConstructor,
  setTotalPrice,
  calculatePrice,
  setStyleBox,
  delStyleBox,
  deleteItemConstructor,
  setTitleOrder,
  resetOrderObj,
  setOrderObj,
  fullDeleteItemConstructor

} = prefabricatedGiftSlice.actions;
export default prefabricatedGiftSlice.reducer;
