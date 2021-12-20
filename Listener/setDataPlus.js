export default function setDataLimited(arr, type, context){
  let targetArr = searchArr(arr, type);
  setStateLimited(targetArr, UpdateData, context);
}

function searchArr(array){
  let ansArray = [];
  array.map(item => {
    //获取当前路由
    currentRoute = getCurrentPage()[0].__route__;
    if(item.type === type){
      if(item.__route__ === currentRoute){
        //优化方案之一，当前展示界面优先setData
        ansArray.unshift(item);
      }else{
        ansArray.push(item);
      }
    }
  })
  return ansArray;
}

function UpdateData(arr, context){
  let len = arr.length;
  for(let i = 0; i < len; i++){
    let that = arr[i].page;
    if(arr[i].changeData){
      let idData = arr[i].changeData();
      that.setData({...idData});
    }else{
      that.setData({...context});
    }
  }
}

function arrSliceNum(length){
  let res = [];
  let len = Math.floor(length / 20) + 1;
  let begin = 0;
  for(let i = 0; i < len; i++){
    res.push(begin);
    begin = begin + 20;
  }
  return res;
}

function setStateLimited(arr, fn, context){
  if(arr.length <= 20){
    fn(arr, context);
    return ;
  }
  let len = arrSliceNum(arr.length);
  for(let i = 0; i < len; i++){
    let tmpArray = [];
    tmpArray = arr.slice(len[i], len[i] + 20);
    setTimeout(()=>fn(tmpArray), i * 1000);
  }
}