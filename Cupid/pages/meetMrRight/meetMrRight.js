// pages/meetMrRight/meetMrRight.js
var age
var height

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker: ['男', '女'],
    sex:'选择匹配人性别'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  PickerChange(e) {
    console.log(e);
    var that = this
    if(e.detail.value == '0'){
      that.setData({
        sex:'男'
      })
    }else{
      that.setData({
        sex: '女'
      })
    }
    this.setData({
      index: e.detail.value
    })
  },

  meetRightGayAct(){
    var that = this
    wx.navigateTo({
      url: '/pages/meetResult/meetResult',
    })
  },

  heightAct(e){
    height = e.detail.value
  },

  ageAct(e){
    age = e.detail.value
  },

})