// pages/myFavor/myFavor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getUserFavor()
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

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },

  getUserFavor(){
    var that = this
    wx.cloud.callFunction({
      name: 'getUserFavor',
      complete: res => {
        console.log(res)
        var favorIdArr = res.result.userFavor
        const db = wx.cloud.database()
        const personListDB = db.collection('personList')
        personListDB.where({
          _id: db.command.in(favorIdArr)
        }).get({
          success: function (res) {
            console.log(res)
            that.setData({
              dataArr:res.data
            })
          },
          fail:function(err){
            console.log(err)
          }
        })
      }
    })
  },

  toDetailAct(e){
    var personID = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/personDetail/personDetail?ID=' + personID,
    })
  }
})