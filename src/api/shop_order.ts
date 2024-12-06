import request from '@/utils/request'

// 销售订单列表
export function apiShopOrderLists(params: any) {
    return request.get({ url: '/order.shop_order/lists', params })
}
// 押桶订单列表
export function apiShopOrderBucketLists(params: any) {
    return request.get({ url: '/order.shop_order/bucket_lists', params })
}
// 月结订单
export function apiShopOrderMonthLists(params: any) {
    return request.get({ url: '/order.shop_order/month_lists', params })
}

// 添加销售订单
export function apiShopOrderAdd(params: any) {
    return request.post({ url: '/order.shop_order/add', params })
}

// 编辑销售订单
export function apiShopOrderEdit(params: any) {
    return request.post({ url: '/order.shop_order/edit', params })
}

// 删除销售订单
export function apiShopOrderDelete(params: any) {
    return request.post({ url: '/order.shop_order/delete', params })
}

// 删除销售订单
export function apiShopOrderCancel(params: any) {
    return request.post({ url: '/order.shop_order/cancel', params })
}

// 代客订单
export function apiShopOrderAddForUser(params: any) {
    return request.post({ url: '/order.shop_order/order_for_user', params })
}

// 销售订单详情
export function apiShopOrderDetail(params: any) {
    return request.get({ url: '/order.shop_order/detail', params })
}

// 押桶订单详情
export function apiShopOrderBucketDetail(params: any) {
    return request.get({ url: '/order.shop_order/bucket_detail', params })
}

//退桶
export function apiShopOrderRefund(params: any) {
    return request.post({ url: '/order.shop_order/refund_bucket', params })
}

// 通过
export function apiShopOrderPass(params: any) {
    return request.get({ url: '/order.shop_order/pass', params })
}
// 驳回
export function apiShopOrderReject(params: any) {
    return request.get({ url: '/order.shop_order/reject', params })
}


//月结订单汇总
export function apiShopOrderMonthOrderData(params: any) {
    return request.get({ url: '/order.shop_order/month_order_data', params })
}

//月结订单配送明细
export function apiShopOrderMonthOrderDataDetail(params: any) {
    return request.get({ url: '/order.shop_order/month_order_data_detail', params })
}
//结算账单
export function apiShopOrderMonthOrderDone(params: any) {
    return request.get({ url: '/order.shop_order/month_order_done', params })
}