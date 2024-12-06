import request from '@/utils/request'

// 空桶出入记录列表
export function apiGoodBstockHistoryLists(params: any) {
    return request.get({ url: '/good_bstock.good_bstock_history/lists', params })
}

// 添加空桶出入记录
export function apiGoodBstockHistoryAdd(params: any) {
    return request.post({ url: '/good_bstock.good_bstock_history/add', params })
}

// 编辑空桶出入记录
export function apiGoodBstockHistoryEdit(params: any) {
    return request.post({ url: '/good_bstock.good_bstock_history/edit', params })
}

// 删除空桶出入记录
export function apiGoodBstockHistoryDelete(params: any) {
    return request.post({ url: '/good_bstock.good_bstock_history/delete', params })
}

// 空桶出入记录详情
export function apiGoodBstockHistoryDetail(params: any) {
    return request.get({ url: '/good_bstock.good_bstock_history/detail', params })
}