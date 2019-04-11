// pages/circle/circle.js

//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()
var userOpenId
var phoneNum = '***'
var wechat = '***'
var content = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    dataArr:[],
    friendArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getAccountList()
    that.getFriendList()
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

  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  getAccountList(){
    var that = this
    const db = wx.cloud.database()
    const accountDB = db.collection('account')
    accountDB.get({
      success: function (res) {
        console.log(res)
        that.setData({
          dataArr: res.data
        })
        that.compareFriendWithAccount()
      },
      fail:function(err){
        console.log(err)
      }
      
    })
  },

  getFriendList(){
    var that = this
    wx.cloud.callFunction({
      name: 'getUserFriend',
      complete: res => {
        var userFriendArr = res.result.userFriend
        console.log(res)
        that.setData({
          friendArr:userFriendArr
        })
        that.compareFriendWithAccount()
        const db = wx.cloud.database()
        const accountDB = db.collection('account')
        accountDB.where({
          _id: db.command.in(userFriendArr)
        }).get({
          success: function (res) {
            wx.hideLoading()
            console.log(res)
            that.setData({
              friendDataArr: res.data
            })
          },
        })
      }
    })
    
  },

  compareFriendWithAccount(){
    var that = this
    var obj = that.data
    var friendArr = obj.friendArr
    var accountArr = obj.dataArr
    var isFriendArr = new Array()
    for(var i = 0; i < accountArr.length; i++){
      var account = accountArr[i]._id
      if (friendArr.indexOf(account) <= -1){
        isFriendArr.push("0")
      }else{
        isFriendArr.push("1")
      }
    }
    console.log(isFriendArr)
    that.setData({
      isFriendArr:isFriendArr
    })
  },

  addFriendAct(e){
    wx.showLoading({
      title: '',
    })
    var that = this
    var friendArr = that.data.friendArr
    friendArr.push(e.currentTarget.id)
    const db = wx.cloud.database()
    const accountDB = db.collection('account')
    console.log(app.globalData.userID)
    accountDB.doc(app.globalData.userID).update({
      data:{
        friend:friendArr
      },
      success(res) {
        console.log(res)
        that.getFriendList()
      }
    })
  },

  deleteFriendAct(e){
    wx.showLoading({
      title: '',
    })
    var that = this
    var friendArr = that.data.friendArr
    var index = friendArr.indexOf(e.currentTarget.id);
    if (index > -1) {
      friendArr.splice(index, 1);
    } 
    const db = wx.cloud.database()
    const accountDB = db.collection('account')
    accountDB.doc(app.globalData.userID).update({
      data: {
        friend: friendArr
      },
      success(res) {
        that.getFriendList()
      }
    })
  },

  publishAct(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/publish/publish?ID=' + e.currentTarget.id,
    })
  },

  wechatMessage(e){
    userOpenId = e.currentTarget.id
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  formSubmit(e){
    console.log(userOpenId)
    if(content.length <= 0){
      wx.showToast({
        title: '请填写您要发送的信息',
        icon:'none'
      })
      return
    }
    var that = this
    wx.showLoading({
      title: '发送中',
    })
    let createTime = util.formatTime(new Date())
    wx.cloud.callFunction({
      name: 'sendMessage',
      data: {
        openid: userOpenId,
        formid: e.detail.formId,
        time:createTime,
        name: app.globalData.userInfo.nickName,
        wechat:wechat,
        phone:phoneNum,
        content:content
      },
      success: res => {
        wx.hideLoading()
        console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
        wx.showModal({
          title: '发送成功',
          content: '对方将会收到您的信息',
          showCancel: false,
        })
        that.hideModal("hide")
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
      }
    })
  },

  phoneNumInput(e){
    phoneNum = e.detail.value
  },

  wechatInput(e){
    wechat = e.detail.value
  },

  messageContentInput(e){
    content = e.detail.value
  }
})