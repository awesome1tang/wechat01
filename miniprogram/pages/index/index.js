//index.js
const app = getApp()

Page({
  data: {
    username:'',
    password:'',
    primarySize:9,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl:'',
    userInfo:'',
    appid:'wx777269f8e4f28ed2',
    secret:'ff1046a4f41b300e3577c8bf53b0fd2c',
    open_id:'',
    session_key:''
  },


  formSubmit: function (e) {

    console.log(getApp().globalData.openid);

    let { username, password } = e.detail.value;
    //还是json数据好e.detail.value
    var that = this;
    var formdata = e.detail.value;
    wx.request({
      url: 'http://localhost',
      data:formdata,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        var data = res.data;
        if(data.code == 240){
          console.log('登录成功');
          that.showok();
        }
      }
    })
    
  },

//弹出框，原来this就是这个page里面的内容
  showok: function () {
    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 2000
    })
  },


 //初始化事件
  onLoad: function() {
    var that = this;
    console.log('new restart.....');

    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    wx.login({
      //获取open_id一定要在服务端请求才安全
      success: function (res){
        var d = that.data;
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: d.appid,
            secret: d.secret,
            js_code:res.code,
            grant_type:'authorization_code'
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            //从数据库获取用户信息
            //that.queryUsreInfo();
            var data = res.data;
            that.setData({
              open_id: data.openid,
              session_key: data.session_key
            });
            //console.log(res.data);
          }
        });

       }
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.imi();
            }
          })
        }
      }
    })
  },

  bindGetUserInfo: function (e) {
   // console.log(e.detail.userInfo);

    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      wx.request({
        url: 'http://localhost',
        data: {
          openid: that.data.open_id,
          nickName: e.detail.userInfo.nickName,
          avatarUrl: e.detail.userInfo.avatarUrl,
          province: e.detail.userInfo.province,
          city: e.detail.userInfo.city
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //从数据库获取用户信息
          that.imi();
          console.log(res.data);
        },
        fail:function(res){
          that.imi();
        }

      });
      //授权成功后，跳转进入小程序首页
      wx.switchTab({
        url: '../imi/imi'
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }

  },

  imi:function(){

    wx.redirectTo({
      url: '../imi/imi',
    })

  },


  onGetUserInfo: function(e) {
     console.log('test the program');
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
