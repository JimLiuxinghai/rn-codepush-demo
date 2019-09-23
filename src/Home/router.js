import React, {Component} from 'react';
import { StyleSheet, Image } from 'react-native';
import {
    createBottomTabNavigator
} from "react-navigation";
import HomePage from './pages/home';
import PaperPage from './pages/paper';


export default MainTab = createBottomTabNavigator({//在这里配置页面的路由
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            tabBarLabel: "首页"
        }
    },
    PaperPage:{
        screen: PaperPage,
        navigationOptions: {
            tabBarLabel: "慧评日报"
        }
    }
}, {
    abBarPosition:'bottom', // 设置tabbar的位置，iOS默认在底部，安卓默认在顶部。（属性值：'top'，'bottom')
    swipeEnabled:false, // 是否允许在标签之间进行滑动。
    animationEnabled: false, // 是否在更改标签时显示动画。
    lazy:true, // 是否根据需要懒惰呈现标签，而不是提前制作，意思是在app打开的时候将底部标签栏全部加载，默认false,推荐改成true哦。
    initialRouteName:'HomePage', // 设置默认的页面组件
    backBehavior:'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    tabBarOptions: {
        activeTintColor: '#F78941'
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text:{
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    tabBarHomeIcon: {
        width: 21,
        height: 22
    },
    tabBarPaperIcon: {
        width: 26,
        height: 23,
    },
    tabBarMyIcon: {
        width: 22,
        height: 25
    }
});