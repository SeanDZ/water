import request from '@/utils/request'

// 商户配置表详情
export function apiPointConfigDetail() {
    return request.get({ url: '/point.point_config/detail' })
}
export function apiPointConfigSet(params: any) {
    return request.post({ url: '/point.point_config/set_point', params })
}

