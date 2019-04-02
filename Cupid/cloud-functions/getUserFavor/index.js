// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const accountDB = db.collection('account')
// 云函数入口函数
exports.main = async (event, context) =>{
  const wxContext = cloud.getWXContext()
  const userAccount = await accountDB.where({ userId: wxContext.OPENID}).get()//
  return {
    userFavor: userAccount.data[0].favor
  }
}