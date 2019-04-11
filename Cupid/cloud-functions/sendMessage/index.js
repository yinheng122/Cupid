// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  console.log(event)
  // const result = await cloud.openapi.templateMessage.send({
  //   touser: event.openid,
  //   page: 'pages/circle/circle',
  //   data: {
  //     keyword1: {
  //       value: event.name
  //     },
  //     keyword2: {
  //       value: event.content
  //     },
  //     keyword3: {
  //       value: event.phone
  //     },
  //     keyword4: {
  //       value: event.time
  //     },
  //     keyword5: {
  //       value: event.wechat
  //     }
  //   },
  //   userInfo:{
  //     appId: 'wxd4b4b18dadaa34f8',
  //     openId: event.openid
  //   },
  //   templateId: 'IEqhjHAcEDROqXnmeyK-6C6NgYg5QcgNb9CLkBgBlSA',
  //   formId: event.formid,
  //   emphasisKeyword: 'keyword1.DATA' + '<a data-miniprogram-appid="wxd4b4b18dadaa34f8" data-miniprogram-path="pages/index/index">进入小程序</a>'
  // })event.name + '说：' + event.content + '/n' + '电话：' + event.phoneNum + '/n' + '微信：' + event.wechat 
  const result = await cloud.openapi.customerServiceMessage.send({
    touser: event.openid,
    msgtype: 'text',
    text: {
      content: 'test'
    }
  })
  return result
}