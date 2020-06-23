import Vue from 'vue'
import Vuex from 'vuex'
import {_} from 'vue-underscore';
import { v4 as uuidv4 } from 'uuid';
import ken  from '../ken'

Vue.use(Vuex);

// 变量名定义
// sp => 商品
// sps => 商品列表
// sps_indexed => 以gid为索引的商品列表
// sps_grouped => 以barcode为索引的商品列表
// snap => 快照

const store = new Vuex.Store({
  state: {
    count : 1,
    cashier_id : 1,
    shop_id : 2,
    carts : [
        // cart,
    ],
    cart_disp : {
      lines : [
        // {
        //   rmb_snap : 0, // 商品加入时的快照
        //   qty_sp : 1,
        //   sp : {},
        //   // rmb_sp_sum : 1000, // 单个商品总价
        // },
      ],
      customer_id : 110,
      user_id : 1,
      pos_id : 'abc',
    },

    // done 修改sps，sps_indexed & sps_grouped也会被修改
    // 修改sps_indexed ，sps 也会被修改，但是若sps中的sp被赋值了拷贝对象，
    // 即只想地址变化了，那么indexed和grouped不会随着变化
    sps : [
     //  {
     //    gid : 'abc',
     //    barcode : 'def',
     //    rmb_price : 111,
     //    title : '香蕉',
     //    rmb_ref : 115,
     //    thumb : '',
     // }
    ],
    // index by gid
    sps_indexed : [],
    // group by barcode
    sps_grouped : [],
  },
  mutations: {
    increment (state) {
      state.count++
    },

    //将后台商品同步到前台
    sps_init (state,value) {
      state.sps = value;
    },

    //初始化sps [ gid => sp ]
    sps_indexed_init (state) {
      state.sps_indexed = _.indexBy(state.sps,function(item){
        return item.gid;
      });
    },

    //初始化sps [ barcode => sp ] , 同一条吗商品可能有多个
    sps_grouped_init (state) {
      state.sps_grouped = _.groupBy(state.sps,function(item){
        return item.barcode;
      });
    },

    sps_grouped_add (state,sp_copy){
      var barcode = sp_copy.barcode;
      if(state.sps_grouped[barcode] == undefined)
        state.sps_grouped[barcode] = [sp_copy];
      else
        state.sps_grouped[barcode].push(sp_copy);
    },

    // 添加或修改商品
    // todo sp被修改了，cart中的lines是否也会被修改
    // 修改sps后，sps_indexed 和 sps_grouped 也会自动修改
    // 修改sp后，sps.push(sp)，那么sps也会被修改，即此处sp是引用
    sps_modify (state,sp) {
      // 新商品添加
      if(sp.gid== ''){ // done

        var uuid = uuidv4();
        console.log('uuid',uuid);

        sp.gid = uuid; // done sp是引用，函数外sp.gid会被赋值
        var sp_copy = {...sp};

        state.sps.push(sp_copy);
        state.sps_indexed[sp.gid] = sp_copy;
        this.commit('sps_grouped_add',sp_copy)
      }
      // 判断旧商品是否修改了
      else if(!ken.deepCompare(state.sps_indexed[sp.gid],sp)){  // done

        // done find返回的结果是引用,但如果find返回的结果修改的不是属性，而是赋值拷贝对象，
        // 那么sps被found的对象不会被赋值拷贝对象
        var sp_found = state.sps_indexed[sp.gid];

        // done Object.assign 只将新对象的属性值赋给旧对象，地址不会传，
         Object.assign(sp_found,sp);
      }
    },

    // 有返回值的要放到getter中
    line_find (state,gid) {
      console.log('gid',gid);
      var line_found = _.find(state.cart_disp.lines,function(line_disp){
        console.log('line disp gid',line_disp.sp.gid);
        return line_disp.sp.gid == gid;
      });

      console.log('state line found',line_found);
      return line_found;
    },
    line_push (state,line) {
      state.cart_disp.lines.push(line);
    },
    // line_ref是state.cart_disp.lines中对象的引用line_found
    line_qty_modify (state,line_ref) {
      console('line_qty_modify');
      line_ref.qty_sp ++ ;
    },

    // 修改购物车
    cart_modify (state,line) {

      // 当前购物车中的价格额修改，之前保留的购物车价格不变

      // 当前购物车有该gid商品
      var line_disp = this.commit('line_find',line.sp.gid);
      // var line_copy = { ...line };
      console.log('line_disp',line_disp);
      // console.log('line_copy',line_copy);

      if(line_disp== undefined){
        // line.rmb_snap = line.sp.rmb_sp;
        // state.cart_disp.lines.push(line);
        this.commit('line_push',line);
      }
      // else 不用了，因为line是cart_disp中lines中对象的引用
      // else{
      //   Object.assign(line_disp,line_copy);
      // }

    }
  },
})

export default store;