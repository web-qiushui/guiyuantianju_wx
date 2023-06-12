import ajax from './base'

// 上传图片


// 新增耕地
// name 耕地名称
// description 耕地描述
// specification 规格
// 作物信息对象
// name 作物名称
// imageUrl 作物图片
// status 状态
// specifications 规格
// unitPrice 单价
// amount 产量
export const addPlough = ({
    name,
    status,
    imageUrl,
    description,
    specifications,
}) => {
    return ajax.post('/business/plough/add', {
        name,
        status,
        imageUrl,
        description,
        specifications,
    })
}
// 编辑耕地
export const updatePlough = ({
    id,
    name,
    status,
    imageUrl,
    description,
    specifications,
}) => {
    return ajax.post('/business/plough/update', {
        id,
        name,
        status,
        imageUrl,
        description,
        specifications,
    })
}

// 删除
export const deletePlough = (id) => {
    return ajax.get('/business/plough/delete', {id})
}

// 耕地列表
// pageSize 一页几个
// pageNum  第几页
export const getPloughList = ({
    userType
}) => {
    return ajax.get('/business/plough/list', {
        userType
    })
}

// 耕地详情
export const getPloughDetail = (id) => {
    return ajax.get('/business/plough/detail', {
        id
    })
}

// 耕作 视频
export const getLiveStreamByIp = (data) => {
    return ajax.post('/api/camera/linux/convert', data)
}

// 查询作物信息
export const getCropDetail = (data) => {
    return ajax.get('/business/crop/query', data)
}

// 作物新增
// 作物信息对象
// name 作物名称
// imageUrl 作物图片
// status 状态
// specifications 规格
// unitPrice 单价
// amount 产量
export const addCrop = ({
    ploughId,
    name,
    imageUrl,
    status,
    specifications,
    unitPrice,
    amount
}) => {
    return ajax.post('/business/crop/add', {
        ploughId,
        name,
        imageUrl,
        status,
        specifications,
        unitPrice,
        amount
    })
}
// 编辑作物
export const updateCrop = ({
    name,
    imageUrl,
    status,
    specifications,
    unitPrice,
    amount,
    id
}) => {
    return ajax.post('/business/crop/update', {
        name,
        imageUrl,
        status,
        specifications,
        unitPrice,
        amount,
        id
    })
}

//提交申请
export const submitPlough = ({
    ploughId,
    userId,
    status
}) => {
  return ajax.post('/business/plough/claim', {
    ploughId,
    userId,
    status
  })
}

//取消订单
export const resolveOrder = ({
  ploughId,
    userId
}) => {
  return ajax.post('/business/plough/resolve', {
    ploughId,userId
  })
}

//查询提交的状态
export const claimStatus = ({
        ploughId,
        userId,
    }) => {
    return ajax.post('/business/operation/status', {
        ploughId,
        userId,
    })
}

// 订单列表
export const getOrderList = (userId) => {
    return ajax.get('/business/order/private',{
        userId
    })
}

// 认领列表
export const getRecordList = (userType) => {
    return ajax.get('/business/operation/list',{
        userType
    })
}

// 订单详情
export const getOrderDetail = (id) => {
    return ajax.get('/business/order/query', {
        id
    })
}

// 认领详情
export const getClaimDetail = (id) => {
    return ajax.get('/business/operation/query', {
        id
    })
}

// 认领审核
// 通过2 未通过1
export const updatePloughState = ({
    id,
    ploughId,
    userId,
    status
}) => {
    return ajax.post('/business/operation/update', {
        id,
        ploughId,
        userId,
        status
    })
}

// 认领id查耕认领状态
export const getClaimState = (id) => {
    return ajax.get('/business/operation/specific', {
        id
    })
}

// 下订单
// export const addOrder = ({
//     userName,
//     userPhone,
//     userAddress,
//     status,
//     ploughId,
//     orderEntities
// }) => {
//     return ajax.post('/business/order/add', {
//         userName,
//         userPhone,
//         userAddress,
//         status,
//         ploughId,
//         orderEntities
//     })
// }

export const addOrder = (data) => {
    return ajax.post('/business/order/add', data)
}

// 确认收货
export const updateOrderStatus = (data) => {
    return ajax.post('/business/order/updateStatus', data)
}