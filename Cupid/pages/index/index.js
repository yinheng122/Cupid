//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    cardCur: 0,
    motto: 'Hi 开发者！',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    dataArr: [],
    sum: 1,
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var that = this
    that.getPersonListNetRequest(1)


  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

    DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },

  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  click(e){
    console.log(e.target.id)
  },

  getPersonListNetRequest(num){
    var that = this
    var obj = that.data
    if (num == 1) {
      obj.dataArr.splice(0, obj.dataArr.length);
    }
    const db = wx.cloud.database()
    const personListDB = db.collection('personList')
    personListDB.skip((num - 1) * 10).limit(10).get({
      success: function (res) {
        console.log(res.data)
        for (var i = 0; i < res.data.length; i++) {
          var data = res.data[i]
          obj.dataArr.push(data)
        }
        console.log(obj.dataArr)
        that.setData({
          dataArr: obj.dataArr
        })
        if (res.data.length < 10) {
          // wx.showToast({
          //   title: '数据加载完毕',
          // })
          if (sum != 1 && res.data.length < 10) {
            sum = sum - 1
          }
        }
        if (sum == 1) {
          wx.stopPullDownRefresh()
        }
      }
    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    that.getPersonListNetRequest(1)
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var sum = that.data.sum
    if (that.data.dataArr.length < 10) {
      sum = 1
    } else {
      sum = sum + 1
    }
    that.getPersonListNetRequest(sum)
  },

})
