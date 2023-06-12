const app = getApp()
Component({

    options: {
        addGlobalClass: true,
    },
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        list:[
       
          'https://www.sxhjzynykf.cn:8088/profile/upload/2022/12/11/2.jpg',
          'https://www.sxhjzynykf.cn:8088/profile/upload/2022/12/11/3.jpg',
          'https://www.sxhjzynykf.cn:8088/profile/upload/2022/12/11/1.jpg',
          'https://www.sxhjzynykf.cn:8088/profile/upload/2022/12/11/4.jpg',
          'https://www.sxhjzynykf.cn:8088/profile/upload/2022/12/11/5.jpg',
          'https://www.sxhjzynykf.cn:8088/profile/upload/2022/12/11/6.png'
        ]
    },
})