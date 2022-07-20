 const deepCopyObj = (obj) => { //对象及数组深拷贝
   if (Object.prototype.toString.call(obj) == '[object Object]') {
     var newObj = {};
     for (var key in obj) {
       if (Object.prototype.toString.call(obj[key]) == '[object Object]') {
         var newChildObj = deepCopyObj(obj[key]);
         newObj[key] = newChildObj;
       } else {
         newObj[key] = obj[key];
       }
     }
     return newObj;
   } else if (Object.prototype.toString.call(obj) == '[object Array]') {
     let temp = []
     obj.forEach((item) => {
       let map;
       map = deepCopyObj(item)
       temp.push(map);
     })
     return temp
   } else {
     return obj
   }

 }

 export default deepCopyObj