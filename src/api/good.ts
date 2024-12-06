import request from '@/utils/request'

// 商品管理列表
export function apiGoodLists(params: any) {
    return request.get({ url: '/good.good/lists', params })
}

// 添加商品管理
export function apiGoodAdd(params: any) {
    return request.post({ url: '/good.good/add', params })
}

// 编辑商品管理
export function apiGoodEdit(params: any) {
    return request.post({ url: '/good.good/edit', params })
}

// 删除商品管理
export function apiGoodDelete(params: any) {
    return request.post({ url: '/good.good/delete', params })
}

// 商品管理详情
export function apiGoodDetail(params: any) {
    return request.get({ url: '/good.good/detail', params })
}

// 普通商品
export function apiNormalGood(params: any) {
    return request.get({ url: '/good.good/good_list', params })
}


// 水票管理列表
export function apiTicketLists(params: any) {
    return request.get({ url: '/good.ticket/lists', params })
}

// 添加水票管理
export function apiTicketAdd(params: any) {
    return request.post({ url: '/good.ticket/add', params })
}

// 编辑水票管理
export function apiTicketEdit(params: any) {
    return request.post({ url: '/good.ticket/edit', params })
}

// 删除水票管理
export function apiTicketDelete(params: any) {
    return request.post({ url: '/good.ticket/delete', params })
}

// 水票管理详情
export function apiTicketDetail(params: any) {
    return request.get({ url: '/good.ticket/detail', params })
}



// 组合商品列表
export function apiCombinationLists(params: any) {
    return request.get({ url: '/good.combination/lists', params })
}

export function apiCombinationAdd(params: any) {
    return request.post({ url: '/good.combination/add', params })
}

export function apiCombinationEdit(params: any) {
    return request.post({ url: '/good.combination/edit', params })
}

export function apiCombinationDelete(params: any) {
    return request.post({ url: '/good.combination/delete', params })
}
export function apiCombinationDetail(params: any) {
    return request.get({ url: '/good.combination/detail', params })
}


//分销商品
export function apiAllGood(params: any) {
    return request.get({ url: '/good.good/good_sale', params })
}

//折扣商品
export function apiVipGood(params: any) {
    return request.get({ url: '/good.good/good_vip', params })
}
export function apiCancelGood(params: any) {
    return request.get({ url: '/good.good/cancel_sale', params })
}

export function apiSetSaleGood(params: any) {
    return request.get({ url: '/good.good/set_sale', params })
}

export function apiSetPriceGood(params: any) {
    return request.post({ url: '/good.good/set_price', params })
}
