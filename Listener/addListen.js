//import setDataLimited from "./setDataPlus";

const App = getApp();
const storeDep = App.globalData.storeDep;

//传入参数{type: string, page: this, changeData?: function}
export function addSubscribe(infoObject){
  //通过type进行管理
  let info = infoObject;
  storeDep.push(info);
  return ;
}

//通过函数获取初始值
export function getSubscribe(typePage, fn){
  addSubscribe(typePage);
  //对定制函数进行兼容
  if(fn === undefined) return ;
  if(typeof fn != 'function'){
    throw fn.name + 'is not a funtion'
  }
  let info = fn(App.globalData) || {};
  let that = typePage.page;
  that.setData({
    ...info
  })
  return ;
}

//改变默认值，type为之前设置的标记
export function setSubscribe(type, fn){
  let store = App.globalData;
  let context = fn(store);
  //setDataLimited(storeDep, type, context);
  storeDep.map(item => {
    if(item.type === type){
      let that = item.page;
      subRoute = that.__route__;
      if(item.changeData){
        let idData = item.changeData();
        that.setData({...idData});
      }else{
        that.setData({...context});
      }
    }
  })
  return ;
}

export function removeSubscribe(that){
  for(let i in storeDep){
    if(storeDep[i].page === that){
      storeDep.splice(i, 1);
    }
  }
}