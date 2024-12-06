import request from '@/utils/request'

// 商户配置表列表
export function apiShopConfigLists(params: any) {
    return request.get({ url: '/shop.shop_config/lists', params })
}

// 添加商户配置表
export function apiShopConfigAdd(params: any) {
    return request.post({ url: '/shop.shop_config/add', params })
}

// 编辑商户配置表
export function apiShopConfigEdit(params: any) {
    return request.post({ url: '/shop.shop_config/edit', params })
}

// 删除商户配置表
export function apiShopConfigDelete(params: any) {
    return request.post({ url: '/shop.shop_config/delete', params })
}

// 商户配置表详情
export function apiShopConfigDetail() {
    return request.get({ url: '/shop.shop_config/detail' })
}
export function apiShopConfigSet(params: any) {
    return request.post({ url: '/shop.shop_config/set_shop', params })
}

//设置货到付款
export function apiShopPayType() {
    return request.get({ url: '/shop.shop_config/pay_type' })
}
export function apiShopPayTypeSet(params: any) {
    return request.post({ url: '/shop.shop_config/set_pay_type', params })
}
