import request from '@/utils/request'

// 积分记录列表
export function apiUserPointLogLists(params: any) {
    return request.get({ url: '/point.user_point_log/lists', params })
}


export function apiUserPointData(params: any) {
    return request.post({ url: '/point.user_point_log/point', params })
}
