import axios from 'axios';
let domainurl='http://localhost/posse/public'
// let domainurl='http://posserver.kuailai.me'
export default{
    goods_sync:(shop_id,cashier_id)=>{
        return  axios.get(`${domainurl}/api/goods/sync?shop_id=`+shop_id+'&cashier_id='+cashier_id);
    },
    goods_search_api:(barcode)=>{
        return  axios.get('https://sapi.kuailai.me/barcode/for/' + barcode);
    },
}