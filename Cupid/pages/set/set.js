// pages/set/set.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openID = app.globalData.userOpenID
    var that = this
    const db = wx.cloud.database()
    const accountDB = db.collection('account')
    accountDB.where({
      _openid: openID
    }).get({
      success: function (res) {
        console.log(res)
        that.setData({
          userInfo: res.data[0]
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  messagePushSwitch(e){
    var that = this
    const db = wx.cloud.database()
    const accountDB = db.collection('account')
    console.log(e.detail.value)
    accountDB.doc(app.globalData.userID).update({
      data: {
        canPushMessage: e.detail.value
      },
      success: function (res) {
        
      }
    })
  },

  cannotSeeSwitch(e){
    var that = this
    const db = wx.cloud.database()
    const accountDB = db.collection('account')
    accountDB.doc(app.globalData.userID).update({
      data: {
        notInCircle: e.detail.value
      },
      success: function (res) {

      }
    })
  },

  formSubmit(e){
    var formId = e.detail.formId
    var that = this
    const db = wx.cloud.database()
    const accountDB = db.collection('account')
    accountDB.doc(app.globalData.userID).update({
      data: {
        formId: formId
      },
      success: function (res) {
        wx.showToast({
          title: '获取推送码成功',
        })
      }
    })
  }
})