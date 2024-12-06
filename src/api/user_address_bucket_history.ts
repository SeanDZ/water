import request from '@/utils/request'

// 用户桶记录列表
export function apiUserAddressBucketHistoryLists(params: any) {
    return request.get({ url: '/address.user_address_bucket_history/lists', params })
}

// 添加用户桶记录
export function apiUserAddressBucketHistoryAdd(params: any) {
    return request.post({ url: '/address.user_address_bucket_history/add', params })
}

// 编辑用户桶记录
export function apiUserAddressBucketHistoryEdit(params: any) {
    return request.post({ url: '/address.user_address_bucket_history/edit', params })
}

// 删除用户桶记录
export function apiUserAddressBucketHistoryDelete(params: any) {
    return request.post({ url: '/address.user_address_bucket_history/delete', params })
}

// 用户桶记录详情
export function apiUserAddressBucketHistoryDetail(params: any) {
    return request.get({ url: '/address.user_address_bucket_history/detail', params })
}

export function apiUserAddressBucketHistoryPass(params: any) {
    return request.get({ url: '/address.user_address_bucket_order/pass', params })
}

export function apiUserAddressBucketHistoryReject(params: any) {
    return request.get({ url: '/address.user_address_bucket_order/reject', params })
}
