<template>
    <div class="index">
        <div class="container">
          <div class="swiper-box">
            <div class="nav-menu">
              <ul class="menu-wrap">
                <li class="menu-item">
                  <a href="">手机 电话卡</a>
                  <div class="children">
                    <ul 
                      v-for="(item, index) in menuList"
                      :key="index"
                    >
                      <li 
                        v-for="(sub, info) in item"
                        :key="info"
                      >
                        <a v-bind:href="sub ? '/#/product/' + sub.id : ''">
                          <img v-bind:src="sub ? sub.img : '/imgs/item-box-1.png'" alt="">
                          {{ sub ? sub.name : '小米9' }}
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li class="menu-item">
                  <a href="">电视 盒子</a>
                </li>
                <li class="menu-item">
                  <a href="">笔记本 平板</a>
                </li>
                <li class="menu-item">
                  <a href="">家电 插线板</a>
                </li>
                <li class="menu-item">
                  <a href="">出行 穿戴</a>
                </li>
                <li class="menu-item">
                  <a href="">耳机 音箱</a>
                </li>
                <li class="menu-item">
                  <a href="">电源 配件</a>
                </li>
                <li class="menu-item">
                  <a href="">生活 箱包</a>
                </li>
              </ul>
            </div>
            <swiper v-bind:options="swiperOption">
              <swiper-slide v-for="(item, index) in slideList"
                            v-bind:key="index"
              >
                <a v-bind:href="'/#/product/' + item.id">
                  <img v-bind:src="item.img">
                </a>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
              <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
          </div>
          <div class="ads-box">
            <a v-bind:href="'/#/product/' + item.id" 
               v-for="(item, index) in adsList" 
               :key="index"
            >
              <img v-lazy="item.img" alt="">
            </a>
          </div>
          <div class="banner">
              <a href="/#/product/30">
                <img v-lazy="'/imgs/banner-1.png'" alt="">
              </a>
          </div>      
        </div>
        <div class="product-box">
            <div class="container">
              <h2>手机</h2>
              <div class="wrapper">
              <div class="banner-left">
                <a href="'/#/product/35'">
                  <img v-lazy="'/imgs/mix-alpha.jpg'" alt="">
                </a>
              </div>
              <div class="list-box">
                <div class="list"
                     v-for="(arr, index) in phoneList"
                     :key="index">
                  <div class="item" 
                       v-for="(item, alone) in arr" 
                       :key="alone">
                    <span v-bind:class="{'new-pro' : alone%2 == 0}">新品</span>
                    <div class="item-img">
                      <img v-lazy="item.mainImage">
                    </div>
                    <div class="item-info">
                      <h3>{{item.name}}</h3>
                      <p>{{item.subtitle}}</p>
                      <p class="price" @click="addCart(item.id)">{{item.price}}元</p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
        </div>
        <service-bar></service-bar>
        <modal
          title="提示"
          sureText="查看购物车"
          btnType="1"
          modalType="middle"
          v-bind:showModal="showModal"
          v-on:submit="goToCart"
          v-on:cancel="showModal=false"
        >
          <template v-slot:body>
            <p>商品添加成功！</p>
          </template>
        </modal>
    </div>
</template>

<script>
import ServiceBar from './../components/ServiceBar';
import Modal from './../components/Modal';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';

export default {
  name: 'index',
  data () {
    return {
      swiperOption: {
        autoplay: true,
        loop: true,
        effect: 'cube',
        cubeEffect: {
          slideShadows: true,
          shadow: true,
          shadowOffset: 100,
          shadowScale: 0.8
        },
        pagination: {
          el: '.swiper-pagination',
          clickable :true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      },
      slideList: [
        {
          id: '42',
          img: '/imgs/slider/slide-1.jpg'
        }, {
          id: '45',
          img: '/imgs/slider/slide-2.jpg'
        }, {
          id: '46',
          img: '/imgs/slider/slide-3.jpg'
        }, {
          id: '',
          img: '/imgs/slider/slide-4.jpg'
        }, {
          id: '',
          img: '/imgs/slider/slide-5.jpg'
        }
      ],
      menuList: [
        [
          {
            id: 30,
            img: '/imgs/item-box-1.png',
            name: '小米CC9'
          },{
            id: 31,
            img: '/imgs/item-box-2.png',
            name: '小米8青春版'
          },
          {
            id: 32,
            img: '/imgs/item-box-3.jpg',
            name: 'RedMi K20 Pro'
          },
          {
            id: 33,
            img: '/imgs/item-box-4.jpg',
            name: '移动4G专区'
          }
        ],
        [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]
      ],
      adsList: [
        {
          id:33,
          img: '/imgs/ads/ads-1.png'
        },
        {
          id:48,
          img: '/imgs/ads/ads-2.jpg'
        },
        {
          id:45,
          img: '/imgs/ads/ads-3.png'
        },
        {
          id:47,
          img: '/imgs/ads/ads-4.jpg'
        },
      ],
      phoneList: [],
      showModal: false
    }
  },
  components: {
    Swiper,
    SwiperSlide,
    ServiceBar,
    Modal
  },
 
    mounted () {
      this.init();
  },
  methods: {
    init () {
      this.axios.get('/products', {
        params: {
          categoryId: '100012',
          //请求14条数据
          pageSize: 14
        }
      }).then((res) => {
        //将请求到的数据（数组）进行截取，从第6条数据到第14条（不包含最后一条）
        res.list = res.list.slice(6, 14);
        //二维数组phoneList，第一为行，第二为列，以此进行循环为一个二行二列的数据
        this.phoneList = [res.list.slice(0, 4),res.list.slice(4, 8)];
      })
    },
    //添加购物车
    addCart (id) {
      this.axios.post('/carts',{
        productId:id,
        selected: true
      }).then((res) => {
        this.showModal = true;
        this.$store.dispatch('saveCartCount',res.cartTotalQuantity);
      }).catch((res) => {
        if (res.status === 10) {
          this.$router.push('/login');
          this.$message.warning('请先登录账号');
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    goToCart () {
      this.$router.push('/cart');
    }
  }
}
</script>

<style lang="scss">
@import './../assets/scss/mixin.scss';
@import './../assets/scss/config.scss';

  .index{
    .swiper-box{
      .nav-menu{
        position: absolute;
        width: 264px;
        height: 451px;
        z-index: 9;
        padding: 26px 0;
        box-sizing: border-box;
        background-color: #55585aa1;
        .menu-wrap{
          .menu-item{
            height: 50px;
            line-height: 50px;
            transition: all 0.6s;
            a{
              position: relative;
              display: block;
              font-size: 16px;
              padding-left: 30px;
              font-weight: bold;
              color: #FFFFFF;
              &:after{
                position: absolute;
                right: 30px;
                top: 17.5px;
                content: '';
                @include bgImg(10px,15px,'/imgs/icon-arrow.png');
              }
            }
            &:hover{
              background-color: #FF6600;
              .children{
                display: block;
              }
            }
            .children{
              width: 1234px;
              height: 451px;
              background-color: $colorG;
              position: absolute;
              left: 264px;
              top: 0;
              border: 1px solid $colorH;
              display: none;
              ul{
                display: flex;
                justify-content: space-between;
                height: 75px;
                li{
                  height: 75px;
                  line-height: 75px;
                  flex: 1;
                  padding-left: 23px;
                  a{
                    color: $colorB;
                    font-size: 14px;
                  }
                  img{
                    width: 42px;
                    height: 35px;
                    vertical-align: middle;
                    margin-right: 15px;
                  }
                }
              }
            }
          }
        }
      }
      .swiper-container {
        height: 451px;
        .swiper-button-prev{
          left: 274px;
        }
        img{
          width: 100%;
          height: 100%;
        }
      }  
    }
    .ads-box{
      @include flex();
      margin-top: 14px;
      margin-bottom: 31px;
      a{
        width: 355px;
        height: 200px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .banner{
      margin-bottom: 50px;
      a{
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .product-box{
      margin: auto 0;
      background-color: $colorJ;
      padding: 30px 0 50px;
      h2{
        font-size: $fontF;
        height: 21px;
        line-height: 21px;
        color: $colorB;
        margin-bottom: 20px;
      }
      .wrapper{
        display: flex;
        .banner-left{
          margin-right: 38px;
          a{
            img{
              width: 288px;
              height: 618px;
            }
          }
        }
        .list-box{
          .list{
            @include flex();
            width: 1172px;
            margin-bottom: 14px;
            &:last-child{
              margin-bottom: 0;
            }
            .item{
              width: 270px;
              height: 302px;
              background-color: $colorG;
              text-align: center;
              cursor: pointer;
              transition: all 0.3s;
              &:hover{
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, .2);
                transform: scale(1.03);  
              }
              span{
                display: inline-block;
                width: 67px;
                height: 24px;
                font-size: $fontJ;
                color: $colorG;
                line-height: 24px;
                &.new-pro{
                  background-color: #7ECF68;
                }
                &.kill-pro{
                  background-color: #E82626;
                }
              }
              .item-img{
                img{
                  width: 100%;
                  height: 195px;
                }
              }
              .item-info{
                h3{
                  font-size: $fontJ;
                  color: $colorB;
                  line-height: $fontJ;
                  font-weight: bold;
                }
                p{
                  color: $colorD;
                  line-height: 13px;
                  margin: 6px auto;
                }
                .price{
                  color: #F20A0A;
                  font-size: $fontJ;
                  font-weight: bold;
                  cursor: pointer;
                  &:after{
                    @include bgImg(20px, 20px, '/imgs/icon-cart-hover.png');
                    content: '';
                    margin-left: 8px;
                    vertical-align: middle;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>