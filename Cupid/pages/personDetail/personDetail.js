// pages/personDetail/personDetail.js
var favorArr = new Array()
var personIDStr = new String() 
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personInfo:{},
    backViewColor:'PD_backRedHeaderColor',
    backDetailView:'PD_detailRedContentView',
    favorOrNot:'1',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.cloud.callFunction({
      name: 'getUserFavor',
      complete: res => {
        favorArr = res.result.userFavor
      }
    })
    var personID = options.ID;
    personIDStr = personID
    const db = wx.cloud.database()
    const personListDB = db.collection('personList')
    personListDB.doc(personID).get({
      success(res) {
        // res.data 包含该记录的数据
        console.log(res.data)
        if(res.data.sex == '男'){
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#166CF1',
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }

          })
          that.setData({
            backViewColor: 'PD_backBlueHeaderColor',
            backDetailView: 'PD_detailBlueContentView'
          })
        }else{
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#FD5A5D',
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }
          })
          that.setData({
            backViewColor:'PD_backRedHeaderColor',
            backDetailView: 'PD_detailRedContentView'
          })
        }
        that.setData({
          personInfo:res.data
        })
      }
    })

    wx.cloud.callFunction({
      name: 'getUserFavor',
      complete: res => {
        var favorIdArr = res.result.userFavor
        if(favorIdArr.indexOf(personID) <= -1){
          that.setData({
            favorOrNot:'0'
          })
        }else{
          that.setData({
            favorOrNot: '1'
          })
        }
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

  imagePreview(e){
    var url = e.currentTarget.id
    var personInfo = this.data.personInfo
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: personInfo.image // 需要预览的图片http链接列表
    })
  },

  addFavorAct(){
    wx.showLoading({
      title: '',
    })
    var that = this
    const db = wx.cloud.database()
    const accountDB = db.collection('account')
    favorArr.push(personIDStr)
    accountDB.doc(app.globalData.userID).update({
      data: {
        favor: favorArr
      },
      success(res) {
        wx.hideLoading()
        that.setData({
          favorOrNot:"1"
        })
      }
    })
  },

  deleteFavorAct(){
    wx.showLoading({
      title: '',
    })
    var that = this
    const db = wx.cloud.database()
    const accountDB = db.collection('account')
    var index = favorArr.indexOf(personIDStr);
    if (index > -1) {
      favorArr.splice(index, 1);
    } 
    accountDB.doc(app.globalData.userID).update({
      data: {
        favor: favorArr
      },
      success(res) {
        wx.hideLoading()
        that.setData({
          favorOrNot: "0"
        })
      }
    })
  }
})