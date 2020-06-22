import Vue from 'vue'
import Vuex from 'vuex'
import {_} from 'vue-underscore';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count : 1,
    cashier_id : 1,
    shop_id : 2,
    carts : [
        // cart,
    ],
    cart : {
      lines : [
        {
          qty_shangpin : 1,
          shangpin : {},
          // rmb_shangpin_sum : 1000, // 单个商品总价
        },
      ],
      customer_id : 110,
      user_id : 1,
      pos_id : 'abc',
    },
    shangpins : [{
      goods_id : 'abc',
      barcode : 'def',
      rmb_price : 111,
      title : '香蕉',
      rmb_ref : 115,
      thumb : '',
    }],
    shangpins_indexed : [],
    shangpins_grouped : [],
  },
  mutations: {
    increment (state) {
      state.count++
    },

    //将后台商品同步到前台
    shangpins_init (state,value) {
      state.shangpins = value;
    },

    //初始化shangpins [ goods_id => sp ]
    shangpins_indexed_init (state) {
      state.shangpins_indexed = _.indexBy(state.shangpins,function(item){
        return item.goods_id;
      });
    },

    //初始化shangpins [ barcode => sp ] , 同一条吗商品可能有多个
    shangpins_grouped_init (state) {
      state.shangpins_grouped = _.groupBy(state.shangpins,function(item){
        return item.barcode;
      });
    },

    //修改shangpins后，shangpins_keyed 和 shangpins_grouped 也会自动修改
    shangpins_modify (state) {
      state.shangpins[0].price = 9999;
    }
  },
})

export default store