<template>
    <div>
        <van-nav-bar
                title="扫码"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
        />

        <div id="scandit-barcode-picker" class="scanner"></div>

        <van-popup
                v-model="show_price"
                position="bottom"
                round lazy-render
                :style="{ height: '75%' }">
            <van-row style="height: 50px;">

            </van-row>

            <van-row>
                <van-col offset="2">
                    <div style="font-size:19px;margin-left: 8px;margin-bottom: 5px;">
                        {{line.sp.title}}
                    </div>
                </van-col>
            </van-row>
            <van-row>
                <van-col span="19" offset="1">
                    <van-cell-group>
                        <van-cell @click="changeFocus('input_price')" style="font-size: 50px;line-height: 60px;">
                            <div style="display: inline-block;color: red;">
                                ￥{{sp.rmb_sp}}
                            </div>

                            <cursor_icon v-if="input_focus=='input_price'" style="display: inline-block;"></cursor_icon>
                        </van-cell>
                    </van-cell-group>
                </van-col>
                <van-col>
                    <div style="display: inline-block;margin-top: 20px;" @click="clearPrice">
                        <i role="button" tabindex="0" style="font-size: 36px;"
                           class="van-icon van-icon-close van-popup__close-icon "></i>
                    </div>
                </van-col>
            </van-row>
            <van-row>
                <van-col offset="10">
                    <div style="color: lightgray; margin-top: 10px;font-size: 19px;" @click="setRefPrice">
                        使用参考价 <label style="color:dodgerblue;">{{line.sp.rmb_ref}}</label> 元
                    </div>
                </van-col>
            </van-row>

            <van-row>
                <van-number-keyboard
                        :show="true"
                        theme="custom"
                        :extra-key="'.'"
                        close-button-text="确认"
                        @input="onInput"
                        @delete="onDelete"
                        @close="onClose"
                />
            </van-row>
        </van-popup>


        <van-dialog v-model="show_index" :overlay="false" :showConfirmButton="false"
                    closeOnClickOverlay width="100%" lazy-rende style="top:85%">

            <van-swipe-cell>
                <van-card
                        :num="line.qty_sp"
                        :thumb="line.sp.thumb"
                >
                    <template #title>
                        <div style="float: left;margin-left: 5px;font-size: 19px;" @click="changeShow('name')">
                            {{line.sp.title}}
                        </div>
                    </template>

                    <template #price>
                        <div style="color:red;font-size: 17px;float: right;" @click="changeShow('price')">
                            ￥{{line.rmb_snap}}
                        </div>
                    </template>

                    <template #thumb>
                        <van-image
                                src="https://img.yzcdn.cn/public_files/2017/10/24/2f9a36046449dafb8608e99990b3c205.jpeg"/>
                    </template>

                    <template #num>
                        <van-stepper min="1" v-model="line.qty_sp" theme="round" button-size="22" disable-input/>
                    </template>
                </van-card>

                <template #right>
                    <van-button square text="删除" type="danger" class="delete-button"
                                @click="deleteIndex(line.sp.gid)"/>
                </template>
            </van-swipe-cell>
        </van-dialog>
    </div>
</template>
<script>
    import * as ScanditSDK from "scandit-sdk";
    import { mapState } from 'vuex'
    import {_} from 'vue-underscore';
    import cursor_icon from './cursor_icon'
    import { Toast } from 'vant'

    export default {
        name: 'Scan',

        mixins: [],

        components: {
            cursor_icon
        },

        props: {},

        data() {
            return {
                scan_mode :  'barcode',

                // 当前显示的组件，最多一个为true
                show_price: false,
                show_index: false,
                show_name: false,
                show_carts: false,

                //方便判断当前显示的组件
                show_list: ['price', 'index', 'name', 'carts', 'scan'],

                //当前光标位置
                input_focus: 'input_price',

                // 本地的购物车模型，和view绑定，深拷贝state的cart/line
                line : {
                    qty_sp : 1,
                    rmb_snap : '',
                    sp : {
                        gid : '',
                        barcode : '',
                        rmb_price : '',
                        title : '',
                        rmb_ref : 0,
                        thumb : '',
                    },
                },
                sp : {
                    gid : '',
                    barcode : '',
                    rmb_price : '',
                    title : '',
                    rmb_ref : 0,
                    thumb : '',
                },
            }
        },

        computed: {
            ...mapState([
                // 映射 this.count 为 store.state.count
                'count',
                'cashier_id',
                'shop_id',
                'sps',
                'sps_indexed',
                'sps_grouped',
                'cart_disp',
                'carts',
            ]),
        },

        watch: {},

        created() {},

        mounted() {

            this.api.goods_sync(this.$store.state.shop_id,this.$store.state.cashier_id).then(res=>{

                console.log('res',res);
                this.$store.commit('sps_init',res.data.result);
                this.$store.commit('sps_indexed_init');
                this.$store.commit('sps_grouped_init');

                console.log('sps',this.$store.state.sps);
                console.log('sps_indexed',this.$store.state.sps_indexed);
                console.log('sps_grouped',this.$store.state.sps_grouped);

            })

            // 在回调函数中使用，彼时访问不到this
            let that = this;

            // 在网页控制台可以通过vue访问调试
            window.vue = this;

            //测试store中的功能
            // console.log('count',this.$store.state.count);
            // console.log('count1',this.count);   //mapState

            //设置sdk秘钥
            ScanditSDK.configure('AbBu+ywlM6NjGVMLCyXUEBwD7BZcGhzMZElIIm4TDz/mR1YqfyvEmWFDv8cmYCSTZ0Pzz2MdnApeaM/jem0dLzddc04ra0x3JDsDh0NozlD9Hhp8xyTipbkEWaePLV/P9y2jUivqeWQ5S038JOf5mjbm30GwqgCLmwhWL8F+2iZ6Y86cMq/dB45/WdnWJRP3qYA8vN04oslID4Pcxy3BPo5JfXs6PLeTSwNX0BJo0msmruEY0P7WJgrdy7opf61IDfNNFCEzVYqHDhlGkMkPTa9MIb3+VKW3NCys6SVhMFAq4ZbVoUct83lgypXyPM1Z1XxTBeG/61kxFw2GsXSUSvtxMKNaFYKidrO0N9f9Z84lru9jbNqzfruo17jRa0qY7DdajXplQvfVVeUYRpLg0LMTCmu53+Qu/KtxuO19eMSEBkBo6ttkIbf4s52OYMGysRCnCSb/99p0v/mKGnEsZUwAuTc+KTeK1m09iDVza3lHcFYm/UkPR+UbqoGeaXpJuKjrBMj2VVKAps9aOvQmkU9e7VwUM0nz5iAk9Ib+65bUd0NlJqGQ8QWSumoKeFvcQYsP9vt68l6HOSQUbH+ITKsjKbCxoPOxsEtbHF7Tg6nZOxybi7TNo/GBAq6UCfaXBWjthfC5XcPB3jYc+llxdFil+eNkBB78B3Rr2tRumJb5gNSBERoDjAYLM1OQ5yKbaLglqvdrL1yYx/N1l6tpLcKHJxdQrDDRgRW0tAS0x3uhaNB6J/mHJwFBpKIaxFWweW96Sono5iProQxpWtXmrovdJPxHNtTfk3SG3ah1+X1wRw==', {
                engineLocation: "https://cdn.jsdelivr.net/npm/scandit-sdk/build",
            });

            //初始化scandit
            setTimeout(function () {
                ScanditSDK.BarcodePicker.create(document.getElementById("scandit-barcode-picker"), {
                    playSoundOnScan: true,
                    // vibrateOnScan: true,
                }).then(function (barcodePicker) {
                    // barcodePicker is ready here to be used (rest of the tutorial code should go here)

                    var scanSettings = new ScanditSDK.ScanSettings({
                        enabledSymbologies: ["ean8", "ean13", "upca", "upce", "code128", "code39", "code93", "itf"],
                        codeDuplicateFilter: 1000,
                    });
                    barcodePicker.applyScanSettings(scanSettings);

                    barcodePicker.on("scan", function (scanResult) {

                        console.log('scan');
                        scanResult.barcodes.reduce(function (string, barcode) {

                            console.log(barcode.data);
                            that.when_barcode(barcode.data);
                        }, "");
                    });

                });
            }, 1000)

            // todo 测试
            this.when_barcode('6901236301081');


        },

        destroyed() {},

        methods: {
            // 返回上一页
            onClickLeft() {
                this.$router.push('home');
            },

            // 切换弹窗
            changeShow(value) {
                let that = this;

                //延时0.1s执行，避免点击price弹出层的确认键，会同时点击收款按钮的问题
                setTimeout(function () {
                    _.each(that.show_list, function (item) {

                        if (value == item) {
                            that['show_' + item] = true;
                        } else
                            that['show_' + item] = false;

                        if (value == 'name')
                            $('#name').focus();
                    })
                }, 100)

            },

            // 扫码识别后的处理逻辑
            when_barcode(barcode) {

                console.log(barcode);
                if(this.scan_mode == 'barcode') {
                    //本地有该货号的商品
                     if (this.sps_grouped[barcode] != undefined) {

                        console.log('show index')
                        if (this.sps_grouped[barcode].length == 1) {
                            var sp = this.sps_grouped[barcode][0];
                            this.sp = { ...sp };

                            // todo  有返回值的要放到getter中
                            var line_found = this.$store.commit('line_find',this.sp.gid);
                            console.log('line found',line_found);
                            if( line_found != undefined ){
                                this.$store.commit('line_qty_modify',line_found);
                                this.line = line_found;
                            }
                            else{
                                this.line = {
                                    qty_sp : 1,
                                    rmb_snap : sp.rmb_sp,
                                    sp : sp,
                                }
                                this.$store.commit('line_push',this.line);
                            }


                            console.log('line',this.line);
                        } else {
                            // 显示所有相同条码商品，不自动添加数量
                            alert('该条码商品有多个商品，待实现');
                        }
                        this.changeShow('index');

                    }
                    //本地没有该货号商品，需要调用接口查询商品信息
                    else {
                        console.log('show price')

                        this.api.goods_search_api(barcode).then(resp => {

                            console.log('barcode api');
                            console.log('resp', resp)

                            //接口成功返回商品数据
                            if (resp.data.qty == 1) {
                                this.sp = {
                                    gid: '',
                                        barcode: barcode,
                                        rmb_sp: '',
                                        title: resp.data.found[0].title || '',
                                        rmb_ref: resp.data.found[0].rmb_shoujia || 0,
                                        thumb: resp.data.found[0].url_photo || '',
                                };
                                this.line = {
                                    qty_sp : 1,
                                    rmb_snap : '',
                                    sp : { ...this.sp }
                                }
                            }
                            //接口未查询到商品
                            else if(resp.data.qty == 0 ){                       // done
                                this.sp = {
                                    gid: '',
                                    barcode: barcode,
                                    rmb_sp: '',
                                    title: '',
                                    rmb_ref: 0,
                                    thumb: '',  //todo 默认图片
                                };
                                this.line = {
                                    qty_sp : 1,
                                    rmb_snap : '',
                                    sp : { ...this.sp }
                                }
                            }
                            else{
                                //todo
                                alert('该条码对应多个商品')
                            }

                            this.changeShow('price');

                        }).catch(error => {
                            console.log(error);
                        });

                        this.changeShow('price');
                    }
                }
                else{
                   alert('扫码支付待实现');
                }
            },

            // 改变光标位置，因为使用了vant数字键盘，聚焦时会重复拉起手机系统键盘
            // 所以使用了自定义的光标组件
            changeFocus(focus_option) {
                this.input_focus = focus_option;
            },

            // 清除价格
            clearPrice() {
                this.line.sp.rmb_sp = '';
            },

            // 将价格设置为参考价
            setRefPrice() {
                this.line.sp.rmb_sp = this.line.sp.rmb_ref;
                this.changeFocus('input_price');
            },

            // 数字键盘输入
            onInput(value) {

                var reg = /^[0-9]+\.[0-9]{0,2}$/; //判断 加小数点的
                var reg2 = /^\d+$/;   //判断 不加小数点的
                var reg3 = /^00.*$/;   //判断 以00开头
                var reg4 = /^0.00$/;    //判断 输入数字为0.00
                var str = this.sp.rmb_sp + value.toString();
                var a = reg.test(str)
                var b = reg2.test(str)
                var c = reg3.test(str)
                var d = reg4.test(str)
                if (!((a || b) && !c && !d))
                    return;

                if (this.sp.rmb_sp.length == 7)
                    return;


                if (this.input_focus == 'input_price') {
                    this.sp.rmb_sp += value.toString();
                }
            },

            // 数字键盘删除
            onDelete() {
                console.log(this.input_focus);
                if (this.input_focus == 'input_price') {
                    var length = this.sp.rmb_sp.toString().length;
                    this.sp.rmb_sp = this.sp.rmb_sp.toString().substring(0, length - 1);
                }
            },

            // 数字键盘完成按钮事件
            onClose() {  // 点击完成按钮触发事件

                //检查数字键盘输入是否合法
                var msg = this.checkPrice();
                if(msg != ''){
                    Toast(msg);
                    return ;
                }

                // todo 将该部分放到action中，先同步提交到后台，成功后同步到前台
                this.$store.commit('sps_modify',this.sp);
                if(this.line.sp.gid == '')
                    this.line.sp.gid = this.sp.gid;
                this.line.rmb_snap = this.sp.rmb_sp;
                this.line.sp.rmb_sp = this.sp.rmb_sp;
                this.$store.commit('cart_modify',this.line);

                this.changeShow('index');
            },
            // 检验计算器中价格是否合法可提交,检验输入时可能不完全但是合法，提交不合法的情况
            checkPrice(){
                //todo   0.  .    0.0 0.00    0
                if (this.sp.rmb_sp == '') {
                    return '请输入售价';
                }
                else
                    return '';
            },

        },
    };
</script>
<style>

</style>
