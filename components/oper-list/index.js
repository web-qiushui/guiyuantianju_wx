Component({
  properties: {
    // listData: {
    //     type: Object,
    //     value: {}
    // },
  },
  data:{
    moving:false,
    moveIndex:-1,
    listData:[
      {
      url:'',
      name:'gegndi',
      id:''
    },
    {
      url:'',
      name:'gegndi',
      id:''
    }
  ]
  },

  touchS(e) {
    let index = e.currentTarget.dataset.index;
    // 获得起始坐标
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.setData({
      moveIndex:index
    })
  }, 
  touchM(e) {
    // 获得当前坐标
    this.currentX = e.touches[0].clientX;
    this.currentY = e.touches[0].clientY;
    const x = this.startX - this.currentX; //横向移动距离
    const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
    if (x > 35 && y < 110) {
    //向左滑是显示删除
      this.setData({
        moving: true
      })
    } else if (x < -35 && y < 110) {
    //向右滑
      this.setData({
        moving: false
      })
    }
  },
  manage() {
    this.triggerEvent('manage')
  },
  delBtn(){
    this.triggerEvent('delBtn')
  }
})