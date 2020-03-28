Component({
  data: {
    business: [
     
      {
        title: '运动',
        icon: "../../images/321.png",
        selectedIcon: "../../images/407.png",
        pagePath:"../../pages/index/index"
      },
      {
        title: '房间聊天',
        icon: "../../images/customer_normol.png",
        selectedIcon: "../../images/customer_focus.png",
        pagePath: "../../pages/imi/imi"
      },
      {
        title: '我的',
        icon: "../../images/me_tabbar.png",
        selectedIcon: "../../images/me_tabbar_checked.png",
        pagePath: "../../pages/index/index"
      }
    ]
  },
 
  methods: {
  onTabbarItemTap (e){
    var data = e.currentTarget.dataset;
    var url = data.path;
    wx.reLaunch({ url });
    console.log('-------------');
  }

  }
})