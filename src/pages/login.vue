<template>
  <div class="login">
    <div class="container">
      <a href="/#/index"><img src="/imgs/login-logo.png" alt=""></a>
    </div>
    <div class="wrapper">
      <div class="container">
        <div class="login-form">
          <h3>
            <span class="checked">帐号登录</span><span class="sep-line">|</span><span>扫码登录</span>
          </h3>
          <div class="input">
            <input type="text" placeholder="请输入帐号" v-model="username">
          </div>
          <div class="input">
            <input type="password" placeholder="请输入密码" v-model="password">
          </div>
          <div class="btn-box">
            <a href="javascript:;" class="btn" @click="login">登录</a>
          </div>
          <div class="tips">
            <div class="sms" @click="showTestModal=true">手机短信登录/注册</div>
            <!-- <div class="reg">立即注册<span>|</span>忘记密码？</div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-link">
        <a href="https://cn.vuejs.org/v2/guide/" target="_blank">Vue官方文档</a><span>|</span>
        <a href="https://git.imooc.com/" target="_blank">慕课git仓库</a><span>|</span>
        <a href="https://coding.imooc.com/class/236.html" target="_blank">React全家桶课程</a><span>|</span>
      </div>
      <p class="copyright">此网站设计稿为慕课网(Vue全家桶实战 从零独立开发企业级电商系统)蓝湖设计稿</p>
      <p class="copyright">此网站模仿小米官网，所有相关代码均为本人手写</p>
    </div>
    <modal
      title="账号注册"
      sureText="注册"
      btnType="1"
      modalType="middle"
      v-on:submit="register"
      v-on:cancel="showTestModal=false"
      v-bind:showModal="showTestModal"
    >
      <template v-slot:body>
        <div class="inputWarp">
          <input type="text" class="input" placeholder="请输入注册账号" v-model="regUserName">
          <input type="password" class="input" placeholder="请输入密码" v-model="regPassWord">
          <input type="email" class="input" placeholder="请输入电子邮箱" v-model="regEmail">
          <div class="clearIpnut" @click="clearAllIpnut">清空</div>
        </div>
      </template>
    </modal>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import Modal from './../components/Modal';
// import { Message } from 'element-ui';
export default {
  name: 'login',
  data () {
    return {
        username: '',
        password: '',
        userId: '',
        regUserName: '',
        regPassWord: '',
        regEmail: '',
        showTestModal: false
    }
  },
  components: {
    Modal
  },
  methods: {
      login () {
          let { username, password } = this;
          if (!username || !password) {
            this.$message.error('请填写账号信息');
          } else {
              this.axios.post('/user/login', {
                username,
                password
          }).then((res) => {
              //todo 保存用户名
              this.$cookie.set('userId', res.id, { expires: 'Session' });
              // this.$store.dispatch('saveUserName', res.username);
              this.saveUserName(res.username);
              this.$message.success('登陆成功');
              //从login页面跳转到index页面，携带参数为login， from:login  用parmas传递参数
              //如果用query传参：在跳转到index页面时，地址栏会拼接login地址为 /index?from=login
              // this.$router.push({
              //     path:'/index',
              //     query: {
              //       from: 'login'
              //     }
              //   });
              //用params传参不会再地址栏拼接login地址
              this.$router.push({
                name:'index',
                params: {
                  from: 'login'
                }
              });
            }).catch((error) => {
              this.$message.error(error.msg);
            })
          }
      },
      //辅助函数mapActions 当store里面变量过多时使用
      ...mapActions(['saveUserName']),
      register () {
        if (!this.regUserName || !this.regUserName || !(this.regEmail && /^[a-zA-Z0-9]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(this.regEmail))) {
          this.$message.error('请填写完整注册信息或者您所填邮箱不符合格式xxx@xx.xx');
        } else {
            this.axios.post('/user/register', {
              username: this.regUserName,
              password: this.regPassWord,
              email: this.regEmail
          }).then((res) => {
              if (!res) {
                this.$message.success('注册成功');
                this.showTestModal = false;
              }
          }).catch((error) => {
              this.$message.error(error.msg)
          })
        }
      },
      clearAllIpnut () {
        this.regUserName = '';
        this.regPassWord = '';
        this.regEmail = '';
      }
  }
}
</script>
<style lang="scss">
.login{
  &>.container{
    height:113px;
    img{
      width:auto;
      height:100%;
    }
  }
  .wrapper{
    background:url('/imgs/login-bg.jpg') no-repeat center;
    .container{
      position: relative;
      height:576px;
      .login-form{
        position:absolute;
        right:10px;
        top: 50%;
        margin-top: -255px;
        box-sizing: border-box;
        padding-left: 31px;
        padding-right: 31px;
        width:410px;
        height:510px;
        background-color:#ffffff;
        h3{
          line-height:23px;
          font-size:24px;
          text-align:center;
          margin:40px auto 49px;
          .checked{
            color:#FF6600;
          }
          .sep-line{
            margin:0 32px;
          }
        }
        .input{
          display:inline-block;
          width:348px;
          height:50px;
          border:1px solid #E5E5E5;
          margin-bottom:20px;
          input{
            width: 100%;
            height: 100%;
            border: none;
            box-sizing: border-box;
            padding-left: 12px;
          }
        }
        .btn{
          width:100%;
          line-height:50px;
          margin-top:10px;
          font-size:16px;
        }
        .tips{
          margin-top:14px;
          display:flex;
          justify-content:space-between;
          font-size:14px;
          cursor:pointer;
          .sms{
            color:#FF6600;
          }
          .reg{
            color:#999999;
            span{
              margin:0 7px;
            }
          }
        }
      }
    }
  }
  .footer{
    height:100px;
    padding-top:60px;
    color:#999999;
    font-size:16px;
    text-align:center;
    .footer-link{
      a{
        color:#999999;
        display:inline-block;
      }
      span{
        margin:0 10px;
      }
    }
    .copyright{
      margin-top:13px;
    }
  }
  .inputWarp{      
    width:348px;
    margin:0 auto;
    margin-bottom:10px;
    input{
      width: 100%;
      height: 38px;
      margin: 10px 0;
      border:1px solid #E5E5E5;
      box-sizing: border-box;
      padding-left: 12px;
    }
    .clearIpnut{
      width: 30px;
      font-weight: bold;
      text-align: right;
      color: #666666;
      margin-left: 318px;
      cursor: pointer;
    }
  }
}
</style>