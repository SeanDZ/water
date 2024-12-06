import request from '@/utils/request'

// 商户优惠券列表
export function apiShopCouponLists(params: any) {
    return request.get({ url: '/coupon.shop_coupon/lists', params })
}

// 添加商户优惠券
export function apiShopCouponAdd(params: any) {
    return request.post({ url: '/coupon.shop_coupon/add', params })
}

// 编辑商户优惠券
export function apiShopCouponEdit(params: any) {
    return request.post({ url: '/coupon.shop_coupon/edit', params })
}

// 删除商户优惠券
export function apiShopCouponDelete(params: any) {
    return request.post({ url: '/coupon.shop_coupon/delete', params })
}

// 商户优惠券详情
export function apiShopCouponDetail(params: any) {
    return request.get({ url: '/coupon.shop_coupon/detail', params })
}