var util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,
    screenHeight: 0,
    modalName: null,
    textareaAValue: '',
    imgList: [],
    avatarUrl: "/images/addImage.png",
    nameStr: '',
    ageStr: '',
    heightStr: '',
    careerStr: '',
    familyStr: '',
    educationStr: '',
    favorStr: '',
    sexStr: '点击选择性别',
    picker: ['男', '女'],
    backgroudColor: 'bg-gray',
    certainBtnColor: 'bg-red',
    userInfo: {},
    imagesUrlArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo)
    this.setData({
      windowHeight: app.globalData.windowHeight + 150,
      screenHeight: app.globalData.screenHeight + 150,
      userInfo: app.globalData.userInfo,
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


  /**自定义方法 */
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },

  scanPersonImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },

  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  addAvatarAct() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          avatarUrl: res.tempFilePaths
        })
      }
    });
  },

  PickerChange(e) {
    console.log(e);
    if (e.detail.value == 0) {
      this.setData({
        backgroudColor: 'bg-gradual-blue',
        certainBtnColor: 'bg-red'
      })
    } else {
      this.setData({
        backgroudColor: 'bg-gradual-red',
        certainBtnColor: 'bg-blue'
      })
    }
    var sexStr = this.data.picker[e.detail.value]
    this.setData({
      sexStr: sexStr
    })
  },

  nameInputAct(e) {
    this.setData({
      nameStr: e.detail.value
    })
  },

  ageInputAct(e) {
    this.setData({
      ageStr: e.detail.value
    })
  },

  heightInputAct(e) {
    this.setData({
      heightStr: e.detail.value
    })
  },

  careerInputAct(e) {
    this.setData({
      careerStr: e.detail.value
    })
  },

  familyInputAct(e) {
    this.setData({
      familyStr: e.detail.value
    })
  },

  educationInputAct(e) {
    this.setData({
      educationStr: e.detail.value
    })
  },

  favorInputAct(e) {
    this.setData({
      favorStr: e.detail.value
    })
  },

  certainAct() {
    var that = this
    var obj = that.data
    if (obj.avatarUrl.length <= 0) {
      wx.showToast({
        title: '请添加用户头像',
        icon: 'none'
      })
      return
    }
    if (obj.sexStr.length == '点击选择性别') {
      wx.showToast({
        title: '请选择用户性别',
        icon: 'none'
      })
      return
    }
    if (obj.nameStr.length <= 0) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return
    }
    if (obj.ageStr.length <= 0) {
      wx.showToast({
        title: '请填写年龄',
        icon: 'none'
      })
      return
    }
    if (obj.textareaAValue.length <= 0) {
      wx.showToast({
        title: '请填写用户详细情况',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '上传中...',
    })
    var timestamp = Date.parse(new Date())
    wx.cloud.uploadFile({
      cloudPath: timestamp + 'avatar.png',
      filePath: obj.avatarUrl[0], // 文件路径
      success: res => {
        that.setData({
          avatarUrl: res.fileID
        })
        that.uploadImgListRequest()
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '头像上传失败',
          icon: 'none'
        })
      }
    })
  },

  uploadImgListRequest() {
    var that = this
    var obj = that.data
    let timestamp = Date.parse(new Date())
    var sum = 0
    var imagesArr = new Array()
    if (obj.imgList.length != 0) {
      for (var i = 0; i < obj.imgList.length; i++) {
        wx.cloud.uploadFile({
          cloudPath: timestamp + i + '_imgList.png',
          filePath: obj.imgList[i], // 文件路径
          success: res => {
            imagesArr.push(res.fileID)
            sum++
            if (sum == obj.imgList.length) {
              that.setData({
                imagesUrlArr: imagesArr
              })
              that.certainRequest()
            }
          },
          fail: err => {
            wx.hideLoading()
            wx.showToast({
              title: '图片上传失败',
              icon: 'none'
            })
          }
        })
      }
    } else {
      that.certainRequest()
    }

  },

  certainRequest() {
    var that = this
    var obj = that.data
    const db = wx.cloud.database()
    const personListDB = db.collection('personList')
    let createTime = util.formatDate(new Date())
    personListDB.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        name: obj.nameStr,
        sex: obj.sexStr,
        age: obj.ageStr,
        career: obj.careerStr,
        favor: obj.favorStr,
        condition: obj.familyStr,
        editor: obj.userInfo.nickName,
        editorIcon: obj.userInfo.avatarUrl,
        avatar: obj.avatarUrl,
        createTime: createTime,
        height: obj.heightStr,
        introduce: obj.textareaAValue,
        watchNum: "0",
        image: obj.imagesUrlArr,
        education:obj.educationStr
      },
      success(res) {
        wx.hideLoading()
        wx.showToast({
          title: '添加成功',
          icon: 'none'
        })

        wx.reLaunch({
          url: '../index/index',
        })
        setTimeout(function () {

          wx.navigateBack({

          })
        }, 1000)
      },
      fail(err) {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '添加失败',
          icon: 'none'
        })
      }
    })
  }

})