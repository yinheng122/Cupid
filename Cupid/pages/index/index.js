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
    brick_option: { defaultExpandStatus: true, fontColor: "#232323"},
  },

  getUserInfo: function (e) {
    var that = this
    app.globalData.userInfo = e.detail.userInfo
    that.getUserUniconId()
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      canIUse: true
    })
  },

  onLoad: function () {
    var that = this
    this.setData({
      windowHeight: app.globalData.windowHeight + 125,
      screenHeight: app.globalData.screenHeight + 125
    })
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      that.getUserUniconId()
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      console.log('进啦2')
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
 
        console.log(res.userInfo)
        console.log('进啦2-2')
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      console.log('进啦3')
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          that.getUserUniconId()
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

  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },

getUserUniconId(){
  wx.cloud.callFunction({
    name: 'getUserLogin',
    complete: res => {
      const db = wx.cloud.database()
      const accountDB = db.collection('account')
      var uniconId = res.result.openid
      app.globalData.userOpenID = uniconId
      console.log(uniconId)
      accountDB.where({
        userId: uniconId,
      }).get({
        success(res) {
          console.log(res)
          if(res.data.length<=0){
            accountDB.add({
              data: {
                name: app.globalData.userInfo.nickName,
                avatar: app.globalData.userInfo.avatarUrl,
                userId: uniconId,
                favor: [],
                friend:[],
                level:"新人红娘",
                formId:'00',
                canPushMessage:false,
                notInCircle:false,
              },
              success:function(res){
                wx.cloud.callFunction({
                  name: 'getUserID',
                  complete: res => {
                    console.log(res)
                    var userID = res.result.userID
                    app.globalData.userID = userID
                  }
                })
              }
            })
          }else{
            wx.cloud.callFunction({
              name: 'getUserID',
              complete: res => {
                console.log(res)
                var userID = res.result.userID
                app.globalData.userID = userID
              }
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
  
  getUserIDRequest(){
    
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
      // obj.dataArr.splice(0, obj.dataArr.length);
      // obj.dataSet.splice(0, obj.dataSet.length);
      obj.dataArr = []
      obj.dataSet = []
    }
    console.log(num)
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
        for (var i = 0; i < res.data.length; i++){
          var personInfo = res.data[i]
          var backgroundColorStr = '#FD5A5D'
          if(personInfo.sex == '男'){
            backgroundColorStr = '#B5ECFF'
            // backgroundColorStr = '#2DD0F5'
          }else{
            backgroundColorStr = '#FDC3E7'
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
            images: [personInfo.image[0]]
          }
          obj.dataSet.push(dic) 
        }
        that.setData({
          dataArr: obj.dataArr,
          dataSet: obj.dataSet
        })
        // if (res.data.length < 10) {
        //   // wx.showToast({
        //   //   title: '数据加载完毕',
        //   // })
        //   if (sum != 1 && res.data.length < 10) {
        //     sum = sum - 1
        //   }
        // }
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
    that.setData({
      sum:1
    })
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
    that.setData({
      sum:sum
    })
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

  meetMrRightAct(){
    wx.navigateTo({
      url: '/pages/meetMrRight/meetMrRight',
    })
  }
})
