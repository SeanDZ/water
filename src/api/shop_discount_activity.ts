import request from '@/utils/request'

// 满减活动列表
export function apiShopDiscountActivityLists(params: any) {
    return request.get({ url: '/activity.shop_discount_activity/lists', params })
}

// 添加满减活动
export function apiShopDiscountActivityAdd(params: any) {
    return request.post({ url: '/activity.shop_discount_activity/add', params })
}

// 编辑满减活动
export function apiShopDiscountActivityEdit(params: any) {
    return request.post({ url: '/activity.shop_discount_activity/edit', params })
}

// 删除满减活动
export function apiShopDiscountActivityDelete(params: any) {
    return request.post({ url: '/activity.shop_discount_activity/delete', params })
}

// 满减活动详情
export function apiShopDiscountActivityDetail(params: any) {
    return request.get({ url: '/activity.shop_discount_activity/detail', params })
}