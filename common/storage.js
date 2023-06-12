const storageKey = 'productionManagement'

/**
 * 设置本地缓存
 * @param {*} key 
 * @param {*} value 
 */
const setItem = (key, value) => {
    const storage = wx.getStorageSync(storageKey) || {}
    storage[key] = value
    wx.setStorageSync(storageKey, storage)
}

/**
 * 获取本地缓存
 * @param {*} key 
 */
const getItem = (key) => {
    const storage = wx.getStorageSync(storageKey)
    if (storage && storage[key]) {
        return storage[key]
    }
    return ''
}

/**
 * 获取本地所有缓存
 */
const getAll = () => {
    const storage = wx.getStorageSync(storageKey)
    if (storage) {
        return storage
    }
    return ''
}

/**
 * 移除指定key的缓存
 * @param {*} key 
 */
const removeItem = (key) => {
    const storage = wx.getStorageSync(storageKey)
    if (storage && storage[key]) {
        delete storage[key]
        wx.setStorageSync(storageKey, storage)
        return true
    }
    return false
}

/**
 * 移除所有缓存
 */
const clear = () => {
    wx.removeStorageSync(storageKey)
}

export default {
    storageKey,
    setItem,
    getItem,
    getAll,
    removeItem,
    clear
}