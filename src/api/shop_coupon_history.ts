import request from '@/utils/request'

// 用户优惠券记录列表
export function apiShopCouponHistoryLists(params: any) {
    return request.get({ url: '/coupon_history.shop_coupon_history/lists', params })
}

// 添加用户优惠券记录
export function apiShopCouponHistoryAdd(params: any) {
    return request.post({ url: '/coupon_history.shop_coupon_history/add', params })
}

// 编辑用户优惠券记录
export function apiShopCouponHistoryEdit(params: any) {
    return request.post({ url: '/coupon_history.shop_coupon_history/edit', params })
}

// 删除用户优惠券记录
export function apiShopCouponHistoryDelete(params: any) {
    return request.post({ url: '/coupon_history.shop_coupon_history/delete', params })
}

// 用户优惠券记录详情
export function apiShopCouponHistoryDetail(params: any) {
    return request.get({ url: '/coupon_history.shop_coupon_history/detail', params })
}