//imi/imi.js
const app = getApp()
const recorderManager = wx.getRecorderManager();

const recordOptions = {

  duration: 6000, // 录音的时长，单位 ms，最大值 60000（1 分钟）

  sampleRate: 44100, // 采样率

  numberOfChannels: 1, // 录音通道数

  encodeBitRate: 192000, // 编码码率

  format: 'aac'// 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和 Web）互通

};



Page({

data:{
  
  scrollheight:'',
  is_clock: false
},


onLoad:function(){


  var that = this;
  wx.getSystemInfo({

    success: function (res) {

            let clientHeight = res.windowHeight,
            clientWidth = res.windowWidth,
            rpxR = 750 / clientWidth;
            var calc = clientHeight * rpxR;
            console.log(calc);
            var scroll = calc - 175;
            console.log(scroll)
            that.setData({
              scrollheight:scroll
            });
            //console.log(scrollheight);
    }
  });



},

handleRecordStart:function(){

  // const recorderManager = wx.getRecorderManager()

 // console.log(recordOptions)

  recorderManager.start(recordOptions);

  recorderManager.onStart(() => {

    console.log('recorder start')

  })
},

handleRecordStop:function(){
  
  recorderManager.onStop((res) => {
    console.log('recorder stop', res)
    const { tempFilePath } = res
  })


},


handleTouchMove:function(){


 console.log('000000000');


}




})