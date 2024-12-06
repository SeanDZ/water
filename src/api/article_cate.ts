import request from '@/utils/request'

// 文章分类表列表
export function apiArticleCateLists(params: any) {
    return request.get({ url: '/article.article_cate/lists', params })
}

// 添加文章分类表
export function apiArticleCateAdd(params: any) {
    return request.post({ url: '/article.article_cate/add', params })
}

// 编辑文章分类表
export function apiArticleCateEdit(params: any) {
    return request.post({ url: '/article.article_cate/edit', params })
}

// 删除文章分类表
export function apiArticleCateDelete(params: any) {
    return request.post({ url: '/article.article_cate/delete', params })
}

// 文章分类表详情
export function apiArticleCateDetail(params: any) {
    return request.get({ url: '/article.article_cate/detail', params })
}