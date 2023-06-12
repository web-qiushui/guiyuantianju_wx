import ajax from './base'

// 获取生产单号列表
// operatorId 操作人ID
// ID 登录用户ID
export const getProcessOrders = ({operatorId,productionNo}) => {
    return ajax.get('/api/production/v1/getProductionNoList.html', {
        operatorId,
        productionNo
    })
}

// 获取生产计划列表
// productionNo 生产单号 
// operatorId 操作员ID
// productionStatus 生产状态：生产中-0，生成完成-1
// checkStatus 验收状态：合格-0 不合格-1
// checkId 验收员ID
// sendId 发货员ID
// pageNumber 当前页码
// pageSize 默认显示行数，是10行
export const getProductList = ({
    productionNo,
    operatorId,
    productionStatus,
    checkStatus,
    checkId,
    sendId,
    pageNumber,
    pageSize
} = {}) => {
    return ajax.post('/api/production/v1/getProductionList.html', {
        productionNo,
        operatorId,
        productionStatus,
        checkStatus,
        checkId,
        sendId,
        pageNumber,
        pageSize
    })
}

// 根据单号获取详情
// productionId 生产计划ID
export const getDetailByOrderID = (productionId) => {
    return ajax.get('/api/production/v1/loadProduction.html', {
        productionId
    })
}

// 修改工单信息
// productionId 生产计划id
// productionNo 生产单号
// modelNumber 型号
// specification 规格
// planNumber 计划生产米数
// planSendDateMsg 交货日期
export const updateOrderInfo = ({
    productionId,
    productionNo,
    modelNumber,
    specification,
    planNumber,
    planSendDateMsg
}) => {
    return ajax.post('/api/production/v1/updateProduction.html', {
        productionId,
        productionNo,
        modelNumber,
        specification,
        planNumber,
        planSendDateMsg
    })
}

// 获取机台型号
export const getMachineModel = () => {
    return ajax.get('/api/common/v1/getMachineModelData.html')
}

// 提交生产进度工单
// productionId 生产计划ID
// operatorId 登录用户ID
// operatorName 登录用户姓名
// machineModel 机台型号中的key
// workType 班次，取值范围：早班|晚班
// productionNumber 完成米数，取值大于0
// remark 备注
export const submitProcessOrder = ({
    productionId,
    operatorId,
    operatorName,
    machineModel,
    workType,
    productionNumber,
    remark = ''
}) => {
    // console.log('save')
    return ajax.post('/api/production/v1/saveProductionRecord.html', {
        productionId,
        operatorId,
        operatorName,
        machineModel,
        workType,
        productionNumber,
        remark
    })
}

// 验收
// productionId 生产单号
// checkId 验收员id
// checkName 验收员姓名
// productionNumber 验收状态：合格-0 不合格-1
// checkStatus 成品米数
// remark 备注信息
export const checkProduction = ({
    productionId,
    checkId,
    checkName,
    productionNumber,
    checkStatus,
    remark
} = {}) => {
    return ajax.post('/api/production/v1/checkProduction.html', {
        productionId,
        checkId,
        checkName,
        productionNumber,
        checkStatus,
        remark
    })
}

// 发货
// productionId 生产单号
// sendId 发货员id
// sendName 发货员姓名
// remark 备注
export const sendGoods = ({
    productionId,
    sendId,
    sendName,
    remark
}) => {
    return ajax.post('/api/production/v1/sendProduction.html', {
        productionId,
        sendId,
        sendName,
        remark
    })
}

// 删除工单
// productionId 生产计划id
export const deleteOrder = (productionId) => {
    return ajax.get('/api/production/v1/deleteProduction.html', {
        productionId
    })
}

// liebiao
export const queryPloughList = () => {
    return ajax.get('/business/plough/list')
}