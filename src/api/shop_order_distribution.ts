import request from '@/utils/request'
import configs from '@/config'


// 配送订单表列表
export function apiShopOrderDistributionLists(params: any) {
    return request.get({ url: '/distribution.shop_order_distribution/lists', params })
}

// 添加配送订单表
export function apiShopOrderDistributionAdd(params: any) {
    return request.post({ url: '/distribution.shop_order_distribution/add', params })
}

// 编辑配送订单表
export function apiShopOrderDistributionEdit(params: any) {
    return request.post({ url: '/distribution.shop_order_distribution/edit', params })
}

// 删除配送订单表
export function apiShopOrderDistributionDelete(params: any) {
    return request.post({ url: '/distribution.shop_order_distribution/delete', params })
}

// 配送订单表详情
export function apiShopOrderDistributionDetail(params: any) {
    return request.get({ url: '/distribution.shop_order_distribution/detail', params })
}


// export function apiShopOrderDistributionExport(params: any) {
//     request.get({ url: '/distribution.shop_order_distribution/export', params }).then((r: any) => {
//         console.log(r)
//         const downloadLink = document.createElement('a')
//         const blob = new Blob([r.data], { type: r.headers['content-type'] })
//         downloadLink.href = URL.createObjectURL(blob)
//         downloadLink.download = r.headers.filename
//         document.body.appendChild(downloadLink)
//         downloadLink.click()
//         document.body.removeChild(downloadLink)
//     })
// }
//
// export function apiShopOrderDistributionExport2(params: any) {
//     console.log(params.params)
//     window.open(configs.baseUrl +'adminapi/distribution.shop_order_distribution/export?'+ objectToGetString(params.params))
// }
//
// function objectToGetString(obj: any) {
//     return Object.keys(obj)
//         .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
//         .join('&')
// }
