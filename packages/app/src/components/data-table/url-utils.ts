// "use server";

import { requestInfo } from "rwsdk/worker"

export interface UrlParams {
  page?: number
  pageSize?: number
  search?: string
  orderBy?: string
  order?: "asc" | "desc"
}

export function getUrlInfo() {
  const url = new URL(requestInfo.request.url)
  const pathname = url.pathname
  const searchParams = url.searchParams

  return { pathname, searchParams }
}

export function parseUrlParams(): UrlParams {
  const { searchParams } = getUrlInfo()

  const pageParam = searchParams.get("page")
  const pageSizeParam = searchParams.get("pageSize")
  const searchParam = searchParams.get("search")
  const orderByParam = searchParams.get("orderBy")
  const orderParam = searchParams.get("order")

  return {
    page: pageParam ? Number.parseInt(pageParam, 10) : undefined,
    pageSize: pageSizeParam ? Number.parseInt(pageSizeParam, 10) : undefined,
    search: searchParam || undefined,
    orderBy: orderByParam || undefined,
    order:
      orderParam === "asc" || orderParam === "desc" ? orderParam : undefined,
  }
}

export function buildUrlWithParams(params: UrlParams): string {
  const { pathname } = getUrlInfo()
  const newParams = new URLSearchParams()

  // Default pagination values
  const DEFAULT_PAGE_INDEX = 0
  const DEFAULT_PAGE_SIZE = 10

  // Handle page parameter - only include if not default (0)
  if (params.page !== undefined) {
    if (params.page !== DEFAULT_PAGE_INDEX) {
      newParams.set("page", params.page.toString())
    }
  }

  // Handle pageSize parameter - only include if not default (10)
  if (params.pageSize !== undefined) {
    if (params.pageSize !== DEFAULT_PAGE_SIZE) {
      newParams.set("pageSize", params.pageSize.toString())
    }
  }

  // Handle search parameter - only include if not empty
  if (params.search) {
    newParams.set("search", params.search)
  }

  // Handle sorting parameters, omitting defaults
  const isDefaultSort =
    params.orderBy === "consecutiveFailures" && params.order === "desc"

  if (params.orderBy && !isDefaultSort) {
    newParams.set("orderBy", params.orderBy)
    if (params.order) {
      newParams.set("order", params.order)
    }
  }

  // Construct the new URL, omitting '?' if no parameters
  const queryString = newParams.toString()
  return queryString ? `${pathname}?${queryString}` : pathname
}
