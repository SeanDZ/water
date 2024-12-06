import request from '@/utils/request'

// 进货单列表
export function apiShopPurchaseOrderLists(params: any) {
    return request.get({ url: '/purchase.shop_purchase_order/lists', params })
}

// 添加进货单
export function apiShopPurchaseOrderAdd(params: any) {
    return request.post({ url: '/purchase.shop_purchase_order/add', params })
}

// 编辑进货单
export function apiShopPurchaseOrderEdit(params: any) {
    return request.post({ url: '/purchase.shop_purchase_order/edit', params })
}

// 删除进货单
export function apiShopPurchaseOrderDelete(params: any) {
    return request.post({ url: '/purchase.shop_purchase_order/delete', params })
}

// 进货单详情
export function apiShopPurchaseOrderDetail(params: any) {
    return request.get({ url: '/purchase.shop_purchase_order/detail', params })
}