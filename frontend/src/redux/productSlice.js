import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
const initialState = {
  productList: [],
  cartItem: [],
};
export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.productList = [...action.payload];
    },
    addCartItem: (state, action) => {
      const check = state.cartItem.some(
        (item) => item._id === action.payload._id
      );
      const index = state.productList.findIndex(
        (item) => item._id === action.payload._id
      );
      const qty = state.productList[index].quantity;
      if (qty === 0) {
        toast.error("สินค้าหมด");
        return;
      }
      if (check) {
        toast.error("มีสินค้านี้อยู่ในตะกร้าแล้ว");
        return;
      } else {
         if (action.payload.promotion === true) {
          const total = action.payload.priceSale;
          state.cartItem = [
            ...state.cartItem,
            { ...action.payload, qty: 1, total: total },
          ];
          toast.success("เพิ่มสินค้าลงตะกร้าแล้ว");
          return;
        } else {
        const total = action.payload.price;
        state.cartItem = [
          ...state.cartItem,
          { ...action.payload, qty: 1, total: total },
        ];
        toast.success("เพิ่มสินค้าลงตะกร้าแล้ว");
        return;
        }
      }
    },
    deleteCartItem: (state, action) => {
      toast.success("ลบสินค้าแล้ว");
      const index = state.cartItem.findIndex(
        (item) => item._id === action.payload
      );
      state.cartItem.splice(index, 1);
    },
    increaseQty: (state, action) => {
      const index = state.cartItem.findIndex(
        (item) => item._id === action.payload
      );
    
      const productIndex = state.productList.findIndex(
        (item) => item._id === action.payload
      );
      
      const qty = state.cartItem[index].qty;
      const availableQty = state.productList[productIndex].quantity;
    
      if (qty >= availableQty) {
        toast.error("สินค้าในสต๊อกไม่เพียงพอ");
        return;
      }
    
      let qtyInc = qty + 1;
      state.cartItem[index].qty = qtyInc;
    
      if (state.cartItem[index].promotion === true) {
        const price = state.cartItem[index].priceSale;
        const total = price * qtyInc;
        state.cartItem[index].total = total;
      } else {
        const price = state.cartItem[index].price;
        const total = price * qtyInc;
        state.cartItem[index].total = total;
      }
    }
    ,
    decreaseQty: (state, action) => {
      const index = state.cartItem.findIndex(
        (item) => item._id === action.payload
      );
      let qty = state.cartItem[index].qty;
      if (qty > 1) {
        state.cartItem[index].qty = --qty;
        if (state.cartItem[index].promotion === true) {
          const price = state.cartItem[index].priceSale;
          const total = price * qty;
          state.cartItem[index].total = total;
        } else {
        const price = state.cartItem[index].price;
        const total = price * qty;
        state.cartItem[index].total = total;
        }
      }
      if (qty < 1){
        state.cartItem[index].qty = 1;
      }
    },
    deleteAllProducts: (state) => {
      state.cartItem = [];
    },
  },
});

export const {
  addProduct,
  addCartItem,
  deleteCartItem,
  decreaseQty,
  increaseQty,
  deleteAllProducts,
} = productSlice.actions;

export default productSlice.reducer;
