<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import storage from './storage/index'
export default {
  name: 'app',
  components: {

  },
  data () {
    return {
      res: {}
    }
  },
  mounted () {
    if (this.$cookie.get('userId')) {
      this.getUser();
      this.getCartCount();
    }
    
    //本地加载请求静态json文件的形式
    //vue-axios插件能够把axios对象挂载到Vue实例上面，所以能够在全局使用this.axios
    //没安装vue-axios插件，要是用axios需要导入axios插件后才能使用axios
    // this.axios.get('/mock/user/login.json').then((res) => {
    //   this.res = res;
    // })

    //通过easy-mock平台实现数据mock
    // this.axios.get('/user/login').then((res) => {
    //   this.res = res;
    // })

    //本地集成mockjs实现数据mock
    // this.axios.get('/user/login').then((res) => {
    //   this.res = res;
    // })
  },
  methods: {
    // 保存到vuex 获取用户名
    getUser () {
      this.axios.get('/user').then((res={}) => {
        this.$store.dispatch('saveUserName', res.username);
      })
    },
    //获取购物车商品总和
    getCartCount () {
      this.axios.get('/carts/products/sum').then((res=0) => {
        this.$store.dispatch('saveCartCount', res);
      })
    }
  }
}
</script>

<style lang="scss">
  @import './assets/scss/reset.scss';
  @import './assets/scss/config.scss';
  @import './assets/scss/button.scss'; 
</style>
