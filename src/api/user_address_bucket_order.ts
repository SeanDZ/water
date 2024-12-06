import request from '@/utils/request'

// 押桶或退桶订单列表
export function apiUserAddressBucketOrderLists(params: any) {
    return request.get({ url: '/address.user_address_bucket_order/lists', params })
}

// 添加押桶或退桶订单
export function apiUserAddressBucketOrderAdd(params: any) {
    return request.post({ url: '/address.user_address_bucket_order/add', params })
}

// 编辑押桶或退桶订单
export function apiUserAddressBucketOrderEdit(params: any) {
    return request.post({ url: '/address.user_address_bucket_order/edit', params })
}

// 删除押桶或退桶订单
export function apiUserAddressBucketOrderDelete(params: any) {
    return request.post({ url: '/address.user_address_bucket_order/delete', params })
}

// 押桶或退桶订单详情
export function apiUserAddressBucketOrderDetail(params: any) {
    return request.get({ url: '/address.user_address_bucket_order/detail', params })
}

export function apiUserAddressBucketOrderPass(params: any) {
    return request.get({ url: '/address.user_address_bucket_order/pass', params })
}
export function apiUserAddressBucketOrderReject(params: any) {
    return request.get({ url: '/address.user_address_bucket_order/reject', params })
}