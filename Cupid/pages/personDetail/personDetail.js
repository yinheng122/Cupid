// pages/personDetail/personDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personInfo:{},
    backViewColor:'PD_backRedHeaderColor',
    backDetailView:'PD_detailRedContentView',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var personID = options.ID;
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
  }
})