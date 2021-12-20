# Vegex
> ——基于微信小程序的状态管理容器
`version 1.0.1 Beta`
---

#### 介绍：
##### 什么是Vegex？
Vegex是基于微信小程序的状态管理容器，灵感来源于react的redux状态管理，同时不改变微信小程序的最底层工作原理，保证项目的平滑过渡，即插即用。目前在华师心院被试平台的微信小程序端中测试使用。
##### Vegex能做什么？
- 数据统一管理：实现页面共享数据通过唯一的数据管理对象进行管理
- 发布订阅者模式：从原生的微信小程序页面的被动更新数据变为主动更新
- 提升用户UI体验：用户可在第一时间看到数据的更新结果。
- 内部封装**setData**：内部封装setdata，让开发者能更加关注逻辑

#### 使用方式：
##### 初始化数据：
我们开发是基于微信小程序原生提供的“暗示”：`app.js`中`App`对象中的`globalData`属性，所以请不要除掉`globalData`对象。初始化方式：
```javascript
//app.js
const _ = require("../../Server/Listener/initListen");
_.initStore({
    //...write the object which you want to init...
},  this)
```
初始化数据的时候只需要在`iniStore`方法中编写所需管理的初始属性即可。其中`this`参数代表指向App对象的指针。

> 为了便于开发，我们希望每一个初始设置的属性都能拥有一个真值

##### 订阅数据
使用订阅数据的方法意味着你希望一些参数将接受来自其他页面的数据改动
###### addSubscribe()
```javascript
//a  javascript file
import {addSubscribe} from '../../Server/Lister/addListen';

let that = this;
addSubscribe({
    type: 'SOME_ACTION',
    page: that,
    changeData: function(res){
        //...do something
    }
})
```
该方法接受一个对象参数：
- **type**属性接受一个字符代号，拥有该字符代号的所有订阅者都会接收到来自相同代号的发布者的变化。
- **page**属性接受当前指向该页面的指针以获取当前所在的页面信息
- **changeData()**（选填），若你对改变的数据拥有定制化的需求，可通过该函数进行定制，其中`res`代表改变了的对象属性。**同时返回一个对象，该对象将会发送到自己页面的data中**

###### getSubscribe()
```javascript
import {getSubscribe} from '../../Server/Lister/addListen';

let that = this;
getSubscribe({
    type: 'SOME_ACTION',
    page: that,
    changeData: function(res){
        //...do something
    }
}, store => store.example)
```
该方法接受两个参数，其中对象参数与`addSubscribe()`方法并无不同，另一个参数为函数参数，该函数返回值将直接赋值到当前页面的`data()`中。

> addSubscribe()与getSubscribe():用途上前者只是监听变化并接受变化的值，无法获取globalData内的初始值，欲获取初始值，则建议使用后者。

> 注：后期更新二者将直接合并。

##### 修改数据
修改数据表示你将改变`globalData`中的一些属性

##### appSetStore() & setSubscribe()
###### appSetStore()
```javascript
//app.js
const _ = require('../../Server/Listener/initListen');

let that = this;
_.appSetStore(
    type: 'SOME_ACTION',
    that: that,
    ()=>{
        //do something to change data...
    }
)
```

###### setSubscribe()
```javascript
// some page file
import {setSubscribe} from '../../Server/Listener/addListen';

setSubscribe(
    type: 'SOME_ACTION',
    (store)=>{
        //do something ....
    }
)
```
两种方法使用上并没有上什么差别，主要区别就是使用文件位置区别。`appSetStore`使用在`app.js`文件中，而`setSubscribe`适用于任何一个页面js文件。

参数介绍：
- type：发布者字符代号，拥有相同字符代号的订阅者将收到来自发布者的返回值
- 执行函数：在函数内对`globaData`对象相应参数进行修改，同时返回一个对象让发布者接收。

