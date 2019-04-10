// pages/meetResult/meetResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveSearched:false,
    noticeWord:'正在帮你匹配心仪的对象...',
    noticePic:'/images/loading.gif'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var age = options.age
    var height = options.height
    var sex = options.sex
    var ageArr = new Array()
    var heightArr = new Array()
    var ageInt = parseInt(age)
    var heightInt = parseInt(height)
    var sexToChoose
    for(var i = 1; i < 6; i++){
      var ageAdd = '' + (ageInt + i)
      var ageRel = '' + (ageInt - i)
      ageArr.push(ageAdd)
      ageArr.push(ageRel)
    }
    if(sex == '男'){
      var heightGirl = parseInt(heightInt/1.09)
      sexToChoose = '女'
      var heightGirlStr = '' + heightGirl
      heightArr.push(heightGirlStr)
      for (var i = 1; i < 5; i++) {
        var heightGirlAdd = '' + (heightGirl + i)
        var heightGirlRel = '' + (heightGirl - i)
        heightArr.push(heightGirlAdd)
        heightArr.push(heightGirlRel)
      } 
    }else{
      var heightBoy = parseInt(heightInt * 1.09)
      sexToChoose = '男'
      var heightBoyStr = '' + heightBoy
      heightArr.push(heightBoyStr)
      for(var i = 1; i < 5; i++){
        var heightBoyAdd = '' + (heightBoy + i)
        var heightBoyRel = '' + (heightBoy - i)
        heightArr.push(heightBoyAdd)
        heightArr.push(heightBoyRel)
      }
    }
    const db = wx.cloud.database()
    const _ = db.command
    const personListDB = db.collection('personList')
    console.log(heightArr)
    console.log(ageArr)
    console.log(sexToChoose)
    personListDB.where({
      sex:sexToChoose,
      age:_.in(ageArr),
      height:_.in(heightArr)
    }).get({
      success(res) {
        setTimeout(function () {
          if(res.data.length <= 0){
            that.setData({
              haveSearched: false,
              dataArr: [],
              noticeWord:'抱歉未匹配到合适的人选',
              noticePic:'/images/noData.png'
            })
          }else{
            that.setData({
              haveSearched: true,
              dataArr: res.data
            })
          }
          
        }, 2000)
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

  toDetailAct(e){
    var personID = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/personDetail/personDetail?ID=' + personID,
    })
  }
})