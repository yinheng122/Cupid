// pages/personHistory/personHistory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr: [],
    backColor: 'backColor_male'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.personListNetRequest()
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

  personListNetRequest(){
    var openID = app.globalData.userOpenID
    var that = this
    const db = wx.cloud.database()
    const personListDB = db.collection('personList')
    console.log(openID)
    personListDB.where({
      _openid: openID
    }).get({
      success: function (res) {
        console.log(res)
        that.setData({
          dataArr: res.data
        })
      }
    })
  },

  personDetailAct(e){
    wx.navigateTo({
      url: '/pages/personDetail/personDetail?ID='+ e.currentTarget.id,
    })
  },

  deleteHistory(e){
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认删除此条消息',
      success(res) {
        if (res.confirm) {
          that.deleteHistoryNetRequest(e)
        } else if (res.cancel) {
          
        }
      }
    })
    
  },

  deleteHistoryNetRequest(e){
    var that = this
    const db = wx.cloud.database()
    const personListDB = db.collection('personList')
    console.log(e)
    personListDB.doc(e.currentTarget.id).remove({
      success(res) {
        that.personListNetRequest()
      }
    })
  }
})