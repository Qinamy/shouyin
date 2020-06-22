<template>
    <div>
        <van-nav-bar
                title='家乐福'
        >
            <template #right>
                <van-button icon='https://img.yzcdn.cn/vant/logo.png' type='primary' plain round
                            size='small' @click='popMenu'></van-button>
            </template>
        </van-nav-bar>

        <!--            class=img必须放到van-image中才能让图片水平垂直居中，放到父级div中无效-->
        <van-image
                class='bottom'
                round
                width='4rem'
                height='4rem'
                :src="require('../img/scan.jpeg')"
                style='position: fixed;z-index:99999'
                @click='popScan'
        />

        <van-cell-group class='above-bottom' style='position: fixed;'>
            <van-row>
                <van-col>
                    <van-cell>
                        最近一单：
                    </van-cell>
                </van-col>

            </van-row>
            <van-row>
                <van-col>
                    <van-cell>
                        K20200509144913258
                    </van-cell>
                </van-col>
                <van-col>
                    <van-cell>
                        2020-05-09 14:49:13
                    </van-cell>
                </van-col>
            </van-row>
            <van-row>
                <van-col>
                    <van-cell>
                        <span style='color: red;'>￥25.00</span>
                    </van-cell>
                </van-col>
                <van-col>
                    <van-cell>
                        共5件
                    </van-cell>
                </van-col>
                <van-col style='float: right; margin-right: 15px;'>
                    <van-button type='primary' plain round size='small' @click='popOrder'> 查看订单</van-button>
                </van-col>
                <van-col style='float: right; margin-right: 15px;  '>
                    <van-image
                            round
                            width='2rem'
                            height='2rem'
                            fit='fill'
                            :src="require('../img/alipay.jpg')"
                    />
                </van-col>
            </van-row>
        </van-cell-group>

        <van-tabbar v-model='active'>
            <van-tabbar-item icon='search'>订单</van-tabbar-item>
            <van-tabbar-item icon='setting-o'>商品</van-tabbar-item>
        </van-tabbar>

    </div>
</template>
<script>

    import {Toast} from 'vant'
    import { mapState } from 'vuex'

    export default {
        name: '',

        mixins: [],

        components: {
            [Toast.name]: Toast,
        },

        props: {},

        data() {
            return {
                goods : [],
                amount: 4,
                active: 9,
                icon: {
                    active: 'https://img.yzcdn.cn/vant/user-active.png',
                    inactive: 'https://img.yzcdn.cn/vant/user-inactive.png',
                },
            }
        },

        computed: {
            labelText() {
                return '共' + this.amount + '件   合计 ：';
            },
            ...mapState([
                // 映射 this.count 为 store.state.count
                'count',
                'cashier_id',
                'shop_id',
                'shangpins',
                'shangpins_indexed',
                'shangpins_grouped',
            ]),
        },

        watch: {},

        created() {
        },

        mounted() {
            // store 测试
            // console.log('count',this.$store.state.count);
            // console.log('count1 home',this.count);   //mapState
            // this.$store.commit('increment', 10)
            // console.log('increment count',this.$store.state.count);
            // store.commit('increment', 10)
            // this.increment(10);
            // console.log('increment count',this.count); //mapMutations

            this.api.goods_sync(this.shop_id,this.cashier_id).then(res=>{

                console.log('res',res);
                this.$store.commit('shangpins_init',res.data.result);
                this.$store.commit('shangpins_indexed_init');
                this.$store.commit('shangpins_grouped_init');
                this.$store.commit('shangpins_modify');

                console.log('shangpins',this.shangpins);
                console.log('shangpins_indexed',this.shangpins_indexed);
                console.log('shangpins_grouped',this.shangpins_grouped);

                // this.sp = { ... this.shangpins[0] };   // 仅限ES6 深拷贝
                // console.log('sp',sp);    // console输出的是变量最后的值
                // sp.price = 1111;

            })

        },

        destroyed() {
        },

        methods: {
            pay() {
                Toast('收款');
            },
            popCart() {
                Toast('购物车');
            },
            popOrder() {
                Toast('订单');
            },
            popMenu() {
                Toast('菜单');
            },
            popScan() {
                // Toast('扫码');
                this.$router.push('scan');
            },

        },
    };


</script>
<style>

    /*水平垂直居中*/
    .center {
        margin: auto;

        position: absolute;

        bottom: 0;

        top: 0;

        left: 0;

        right: 0;
    }

    /*水平居中，垂直底部并距离底部60px*/
    .above-bottom {
        margin: auto;

        position: fixed;

        bottom: 100px;

        left: 0;

        right: 0;
    }


    /*水平居中，垂直底部*/
    .bottom {
        margin: auto;

        position: fixed;

        bottom: 0;


        left: 0;

        right: 0;
    }

    .my-modal-parent {
        position: fixed;
        z-index: 999999;
    }
</style>
