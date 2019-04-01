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
    dataSet:[],

  },

  onLoad: function () {
    var that = this
    that.getUserUniconId()
    if (app.globalData.userInfo) {
      
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res.userInfo)
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

getUserUniconId(){
  wx.cloud.callFunction({
    name: 'getUserLogin',
    complete: res => {
      const db = wx.cloud.database()
      const accountDB = db.collection('account')
      var uniconId = res.result.openid
      console.log(uniconId)
      accountDB.where({
        userId: uniconId,
      }).get({
        success(res) {
          console.log(res.data)
          if(res.data.length<=0){
            accountDB.add({
              data: {
                name: app.globalData.userInfo.nickName,
                avatar: app.globalData.userInfo.avatarUrl,
                userId: uniconId,
                favor: [],
              },
            })
          }
        },
        fail(err){
          console.log(err)
        }
      })
      
    }
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
      obj.dataSet.splice(0, obj.dataSet.length);
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
        for(var i=0; i < obj.dataArr.length; i++){
          var personInfo = obj.dataArr[i]
          var backgroundColorStr = '#FD5A5D'
          if(personInfo.sex == '男'){
            backgroundColorStr = '#2DD0F5'
          }else{
            backgroundColorStr = '#FF898F'
          }
          var time = new Date(personInfo.createTime.replace(/-/g, "/")).getTime()
          time = time/1000
          var dic = {
            id: personInfo._id,
            content:'姓名:' + personInfo.name + '\n' + personInfo.age + '岁' + '(' + personInfo.introduce + ')',
            time: time,
            likedCount:personInfo.watchNum,
            backgroundColor: backgroundColorStr,
            user: {
              avatar: personInfo.editorIcon,
              username: personInfo.editor,
            },
            images: personInfo.image
          }
          obj.dataSet.push(dic) 
        }
        that.setData({
          dataArr: obj.dataArr,
          dataSet: obj.dataSet
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

  personDetailAct(e){
    var personID = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/personDetail/personDetail?ID=' + personID,
    })
  },

  tapCard: function (event) {
    var personID = event.detail.card_id
    wx.navigateTo({
      url: '/pages/personDetail/personDetail?ID=' + personID,
    })
  },

})
