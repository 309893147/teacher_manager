import Vue from "vue";

/**
 * @Description: 判断当前页面的历史记录是不是小于等于1，如果小于等于1，说明这个页面没有可以返回的上一页，如果没有可以返回的上一页，就给地址栏加上一个goindex=true的参数
 * @author Wish
 * @date 2019/8/19
*/
Vue.prototype.$setgoindex = () =>{
  if (window.history.length <= 1) {
    if (location.href.indexOf('?') === -1) {
      window.location.href = location.href + '?goindex=true'
    } else if (location.href.indexOf('?') !== -1 && location.href.indexOf('goindex') === -1) {
      window.location.href = location.href + '&goindex=true'
    }
  }
}

/**
 * @Description: 隐藏手机号中间四位 例: 123****1234
 * @author Wish
 * @date 2019/8/26
*/
Vue.prototype.$GetTelPhoneData = (data) =>{
  let telPhone;
  if(!data){
    telPhone = '未知手机号'
  } else {
    if (typeof data == 'number') {
      data = data.toString();
    }
    telPhone = data.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
  return telPhone;
};

/**
 * @Description: 时间截取 例:2019-8-26
 * @author Wish
 * @date 2019/8/27
*/
Vue.prototype.$GetTimeData = (data) =>{
  let str = data.substring(0, 10);
  return str;
};

/**
 * @Description: 文件名获取
 * @author Wish
 * @date 2019/8/27
 */
Vue.prototype.$GetFileName = (data) =>{
  if(data){
    let fileNameIndex = data.lastIndexOf("/") + 1;
    return data.substr(fileNameIndex)
  } else {
    return '暂无文件'
  }
};

