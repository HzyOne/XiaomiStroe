<template>
  <div class="order-pay">
    <order-header title="订单支付">
      <template v-slot:tip>
        <span>请谨防钓鱼链接和诈骗电话</span>
      </template>
    </order-header>
    <div class="wrapper">
      <div class="container">
        <div class="order-wrap">
          <div class="item-order">
            <div class="icon-succ"></div>
            <div class="order-info">
              <h2>订单提交成功！去付款咯～</h2>
              <p>请在<span>30分</span>内完成支付, 超时后将取消订单</p>
              <p>收货信息：{{addresInfo}}</p>
            </div>
            <div class="order-total">
              <p>应付总额：<span>{{payMent}}</span>元</p>
              <p>订单详情<em class="icon-down" :class="{'up' : showDetail}" @click="showDetail=!showDetail"></em></p>
            </div>
          </div>
          <div class="item-detail" v-if="showDetail">
            <div class="item">
              <div class="detail-title">订单号：</div>
              <div class="detail-info theme-color">{{orderId}}</div>
            </div>
            <div class="item">
              <div class="detail-title">收货信息：{{addresInfo}}</div>
              <div class="detail-info"></div>
            </div>
            <div class="item good">
              <div class="detail-title">商品名称：</div>
              <div class="detail-info">
                <ul>
                  <li v-for="(item, index) in orderDetail" :key="index">
                    <img v-lazy="item.productImage">
                    {{item.productName}}
                  </li>
                </ul>
              </div>
            </div>
            <div class="item">
              <div class="detail-title">发票信息：</div>
              <div class="detail-info">电子发票 个人</div>
            </div>
          </div>
        </div>
        <div class="item-pay">
          <h3>选择以下支付方式付款</h3>
          <div class="pay-way">
            <p>支付平台</p>
            <div class="pay pay-ali" :class="{'checked':payType==1}" @click="paySubmit(1)"></div>
            <div class="pay pay-wechat" :class="{'checked':payType==2}" @click="paySubmit(2)"></div>
          </div>
        </div>
      </div>
    </div>
    <scan-pay-code v-if="showPay" @close="closePayModal" :img="payImg"></scan-pay-code>
    <modal
      title="支付确认"
      sureText="查看订单"
      cancelText="未支付"
      btnType="3"
      modalType="middle"
      v-bind:showModal="showPayModal"
      v-on:submit="goOrederList"
      v-on:cancel="showPayModal=false"
    >
      <template v-slot:body>
        <p>您是否成功支付？</p>
      </template>
    </modal>
  </div>
</template>
<script>
import QRCode from 'qrcode';
import ScanPayCode from './../components/ScanPayCode';
import OrderHeader from './../components/OrderHeader';
import Modal from './../components/Modal';
export default{
  name:'order-pay',
  components: {
    ScanPayCode,
    OrderHeader,
    Modal
  },
  data () {
    return {
      orderId: this.$route.query.orderNo,
      addresInfo: '',//收货人地址
      orderDetail: [],//订单详情，包含商品列表
      payMent: '',//支付金额
      showDetail: false,//是否显示订单详情
      payType: '',//支付类型 1为支付宝支付  2为微信支付
      showPay: false,//是否显示微信支付弹窗
      payImg: '',//微信支付二维码地址
      showPayModal: false,//是否显示二次支付确认弹框
      T: ''//定时器ID
    }
  },
  mounted () {
    this.getOrderDetail();
  },
  methods: {
    //获取订单信息和订单详情  orderId为提交的订单时所生成的id
    getOrderDetail () {
      this.axios.get(`/orders/${this.orderId}`).then((res) => {
        let item = res.shippingVo;
        this.addresInfo = `${item.receiverName} ${item.receiverMobile} ${item.receiverProvince} ${item.receiverCity} ${item.receiverDistrict} ${item.receiverAddress}`;
        this.orderDetail = res.orderItemVoList;
        this.payMent = res.payment;
      })
    },
    //支付
    paySubmit (payType) {
      //支付宝支付
      if (payType == 1) {
        window.open('/#/order/alipay?orderId=' + this.orderId,'_bank')
      } else { //微信支付
          this.axios.post('/pay',{
            orderId: this.orderId,
            orderName: 'Vue高仿小米商城',
            amount: 0.01,
            payType: 2
        }).then((res) => {
          //qrcode二维码插件
          QRCode.toDataURL(res.content)
          .then(url => {
            this.showPay = true;
            this.payImg = url;
            //当生成二维码以后轮循判断是否支付成功
            this.loopOrderState();
          })
          .catch(() => {
            this.$message.error('微信二维码生成失败，请稍后重试！')
          })
        })
      }
    },
    //关闭微信支付弹窗
    closePayModal () {
      this.showPay = false;
      this.showPayModal = true;
      //当用户关闭微信支付页面时,清除定时器
      clearInterval(this.T);
    },
    //轮循当前订单支付状态
    //每隔一秒发起一个请求
    loopOrderState () {
      this.T = setInterval(() => {
        this.axios.get(`/orders/${this.orderId}`).then((res) => {
          if (res.status == 20) {
            //res.status == 20代表已完成支付，此时清除定时器，同时跳转到订单列表页面
            clearInterval(this.T);
            this.goOrederList();
          }
        })
      },1000)
    },
    goOrederList () {
      this.$router.push('/order/list');
    }
  }
}
</script>
<style lang="scss">
  .order-pay{
    .wrapper{
      background-color:#F5F5F5;
      padding-top:30px;
      padding-bottom:61px;
      .order-wrap{
        padding: 62px 50px;
        background-color: #fff;
        font-size:14px;
        margin-bottom:30px;
        .item-order{
          display: flex;
          align-items: center;
          .icon-succ{
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background:url('/imgs/icon-gou.png') #80c58a no-repeat center;
            background-size:60px;
            margin-right:40px;
          }
          .order-info{
            margin-right: 248px;
            h2{
              font-size:24px;
              color:#333333;
              margin-bottom:20px;
            }
            p{
              color:#666666;
              span{
                color:#FF6700;
              }
            }
          }
          .order-total{
            &>p:first-child{
              margin-bottom:30px;
            }
            span{
              font-size:28px;
              color:#FF6700;
            }
            .icon-down{
              display:inline-block;
              width:14px;
              height:10px;
              background:url('/imgs/icon-down.png') no-repeat center;
              background-size:contain;
              margin-left:9px;
              transition:all .3s;
              cursor:pointer;
              &.up{
                transform: rotate(180deg);
              }
            }
            .icon-up{
              transform: rotate(180deg);
            }
          }
        }
        .item-detail{
          border-top: 1px solid #D7D7D7;
          padding-top: 47px;
          padding-left: 130px;
          font-size: 14px;
          margin-top: 45px;
          .item{
            margin-bottom:19px;
            .detail-title{
              float:left;
            }
            .detail-info{
              display:inline-block;
              img{
                width: 30px;
                vertical-align: middle;
              }
            }
          }
        }
      }
      .item-pay{
        padding:26px 50px 72px;
        background-color:#ffffff;
        color: #333333;
        h3{
          font-size: 20px;
          font-weight: 200;
          color: #333333;
          padding-bottom: 24px;
          border-bottom: 1px solid #D7D7D7;
          margin-bottom: 26px;
        }
        .pay-way{
          font-size:18px;
          .pay{
            display:inline-block;
            width:188px;
            height:64px;
            border:1px solid #D7D7D7;
            cursor:pointer;
            &:last-child{
              margin-left:20px;
            }
            &.checked{
              border:1px solid #FF6700;
            }
          }
          .pay-ali{
            background:url('/imgs/pay/icon-ali.png') no-repeat center;
            background-size:103px 38px;
            margin-top:19px;
          }
          .pay-wechat{
            background:url('/imgs/pay/icon-wechat.png') no-repeat center;
            background-size:103px 38px;
          }
        }
      }
    }
  }
</style>