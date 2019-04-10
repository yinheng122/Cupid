// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  console.log(event)
  try {
    const result = await cloud.openapi.templateMessage.send({
      touser: event.openid,
      page: 'index',
      data: {
        keyword1: {
          value: 'yinhLink'
        },
        keyword2: {
          value: '贝贝你好啊'
        }
      },
      templateId: '86I9PgiDSJG1J2BegxPXUUSTy1vOVIb7Iewz6OwZNBY',
      formId: event.formid,
      emphasisKeyword: 'keyword1.DATA'
    })
    console.log(event)
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}