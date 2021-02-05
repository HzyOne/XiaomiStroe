<template>
    <div class="order-header">
        <div class="container clearfix">
            <div class="header-logo">
                <a href="/#/index"></a>
            </div>
            <div class="title">
                <h2>{{title}}<slot name="tip"></slot></h2>
            </div>
            <div class="username">
                <a href="javascript:;">{{username}}</a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'order-header',
    props: {
        title: String
    },
    computed: {
        // username () {
        //     return this.$store.state.username;
        // },
        // cartCount () {
        //     return this.$store.state.cartCount;
        // }
        //...mapState相当于this.$store.state.username;
        //当数据发生变化时，computed计算属性会重新将数据渲染在页面上
        ...mapState (['username'])
    }
}
</script>

<style lang="scss">
    @import './../assets/scss/config.scss';
    .order-header{
        padding: 30px 0;
        border-bottom:2px solid $colorA;
        .header-logo{
            float: left;
        }
        .title, .username{
            display: inline-block;
            height: 55px;
            line-height: 55px;
        }
        .title{
            float: left;
            margin-left: 54px;
            h2{
                font-size: $fontC;
                color: $colorB;
            }
            span{
                font-size: 14px;
                margin-left: 17px;
                color: $colorD;
                font-weight: 400;
            }
        }
        .username{
            float: right;
            a{
                color: $colorC;
                font-size: $fontI;
            }
        }
    }
</style>