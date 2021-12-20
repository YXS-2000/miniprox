const App = getApp();

//在App.js中使用
function initStore(obj, that){
  that.globalData = {...obj, storeDep: []};
}

function appSetStore(type, that, fn){
  let store = that.globalData;
  let storeDep = store.storeDep;
  let context = fn(store);
  for(let i = 0; i < storeDep.length; i++){
    if(storeDep[i].type === type){
      let these = storeDep[i].page;
      if(storeDep[i].changeData != undefined){
        let idData = storeDep[i].changeData(context);
        these.setData({...idData});
      }else{
        these.setData({
          ...context
        })
      }
    }
  }
  return ;
}

module.exports = {
  initStore: initStore,
  appSetStore: appSetStore
}