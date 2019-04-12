// // 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()

// // 云函数入口函数
// exports.main = async (event, context) => {
//   const result = await cloud.openapi.templateMessage.send({
//     touser: event.openid,
//     page: 'pages/circle/circle',
//     data: {
//       keyword1: {
//         value: event.name
//       },
//       keyword2: {
//         value: event.content
//       },
//       keyword3: {
//         value: event.phone
//       },
//       keyword4: {
//         value: event.time
//       },
//       keyword5: {
//         value: event.wechat
//       }
//     },
//     templateId: 'IEqhjHAcEDROqXnmeyK-6C6NgYg5QcgNb9CLkBgBlSA',
//     formId: event.formid,
//     emphasisKeyword: 'keyword1.DATA'
//   })
//   return result
// }

const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return sendTemplateMessage(event)
}


async function sendTemplateMessage(event) {
  const { OPENID } = cloud.getWXContext()

  // 接下来将新增模板、发送模板消息、然后删除模板
  // 注意：新增模板然后再删除并不是建议的做法，此处只是为了演示，模板 ID 应在添加后保存起来后续使用
  // const addResult = await cloud.openapi.templateMessage.addTemplate({
  //   id: 'AT0002',
  //   keywordIdList: [1,2,3, 4, 5]
  // })

  // const templateId = addResult.templateId

  const sendResult = await cloud.openapi.templateMessage.send({
    touser: event.openid,
    templateId: 'IEqhjHAcEDROqXnmeyK-6C6NgYg5QcgNb9CLkBgBlSA',
    formId: event.formid,
    page: 'pages/circle/circle',
    data: {
      keyword1: {
        value: event.name
      },
      keyword2: {
        value: event.content
      },
      keyword3: {
        value: event.phone
      },
      keyword4: {
        value: event.time
      },
      keyword5: {
        value: event.wechat
      }
    }
  })
  // await cloud.openapi.templateMessage.deleteTemplate({
  //   templateId,
  // })
  return sendResult
}
