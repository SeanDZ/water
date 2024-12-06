import request from '@/utils/request'

// 首页通知配置列表
export function apiShopNotificationLists(params: any) {
    return request.get({ url: '/notification.shop_notification/lists', params })
}

// 添加首页通知配置
export function apiShopNotificationAdd(params: any) {
    return request.post({ url: '/notification.shop_notification/add', params })
}

// 编辑首页通知配置
export function apiShopNotificationEdit(params: any) {
    return request.post({ url: '/notification.shop_notification/edit', params })
}

// 删除首页通知配置
export function apiShopNotificationDelete(params: any) {
    return request.post({ url: '/notification.shop_notification/delete', params })
}

// 首页通知配置详情
export function apiShopNotificationDetail(params: any) {
    return request.get({ url: '/notification.shop_notification/detail', params })
}