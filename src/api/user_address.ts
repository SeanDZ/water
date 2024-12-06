import request from '@/utils/request'

// 客户地址列表
export function apiUserAddressLists(params: any) {
    return request.get({ url: '/address.user_address/lists', params })
}

// 添加客户地址
export function apiUserAddressAdd(params: any) {
    return request.post({ url: '/address.user_address/add', params })
}

// 编辑客户地址
export function apiUserAddressEdit(params: any) {
    return request.post({ url: '/address.user_address/edit', params })
}

// 删除客户地址
export function apiUserAddressDelete(params: any) {
    return request.post({ url: '/address.user_address/delete', params })
}

// 客户地址详情
export function apiUserAddressDetail(params: any) {
    return request.get({ url: '/address.user_address/detail', params })
}

// 押桶欠桶列表
export function apiUserBucketLists(params: any) {
    return request.get({ url: '/address.user_address/address_bucket', params })
}

// 添加空桶、欠桶
export function apiUserBucketAdd(params: any) {
    return request.get({ url: '/address.user_address/change_bucket', params })
}
// 减少空桶、欠桶
export function apiUserBucketDec(params: any) {
    return request.get({ url: '/address.user_address/dec_bucket', params })
}

// 水票列表
export function apiUserTicketsLists(params: any) {
    return request.get({ url: '/address.user_address/address_ticket', params })
}

// 添加水票
export function apiUserTicketsAdd(params: any) {
    return request.post({ url: '/address.user_address/add_ticket', params })
}

// 扣除水票
export function apiUserTicketsDelete(params: any) {
    return request.get({ url: '/address.user_address/dec_ticket', params })
}

export function apiUserBucketLog(params: any) {
    return request.get({ url: '/address.user_address/history', params })
}