"use client"

import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/registry/new-york-v4/ui/table"
import { Tabs, TabsContent } from "#/registry/new-york-v4/ui/tabs"
import { useDataTableStore } from "#/store/data-table-store"
import { columns } from "./columns"
import { DataRow } from "./data-row"
import { DataTableLoadingOverlay } from "./data-table-loading-overlay"
import { DataTableSkeleton } from "./data-table-skeleton"
import { Pagination } from "./pagination"
import { Toolbar } from "./toolbar"
import { buildUrlWithParams, parseUrlParams, type UrlParams } from "./url-utils"

// Default pagination values
const DEFAULT_PAGE_INDEX = 0
const DEFAULT_PAGE_SIZE = 10

export function DataTable() {
  "use no memo"

  // Get current URL params on component mount
  const [currentUrlParams, setCurrentUrlParams] = React.useState<UrlParams>(
    () => parseUrlParams(),
  )

  // Get state and actions from the store
  const data = useDataTableStore((state) => state.data)
  const isLoading = useDataTableStore((state) => state.isLoading)
  const totalEndpointMonitors = useDataTableStore(
    (state) => state.totalEndpointMonitors,
  )
  const rowSelection = useDataTableStore((state) => state.rowSelection)
  const columnVisibility = useDataTableStore((state) => state.columnVisibility)
  const columnFilters = useDataTableStore((state) => state.columnFilters)
  const sorting = useDataTableStore((state) => state.sorting)
  const pagination = useDataTableStore((state) => state.pagination)

  // Navigate to new URL with updated params
  const navigateToUrl = React.useCallback(
    (params: Partial<UrlParams>) => {
      const newUrlParams = { ...currentUrlParams, ...params }
      const newUrl = buildUrlWithParams(newUrlParams)

      // Update browser history without page reload
      window.history.pushState(null, "", newUrl)
      setCurrentUrlParams(newUrlParams)
    },
    [currentUrlParams],
  )

  // Update URL with query params, omitting default values
  const updateUrlParams = React.useCallback(
    (params: {
      page?: number
      pageSize?: number
      search?: string
      orderBy?: string
      order?: "asc" | "desc"
    }) => {
      // Handle page parameter - set to undefined to remove from URL if default
      const pageParam =
        params.page === DEFAULT_PAGE_INDEX ? undefined : params.page

      // Handle pageSize parameter - set to undefined to remove from URL if default
      const pageSizeParam =
        params.pageSize === DEFAULT_PAGE_SIZE ? undefined : params.pageSize

      // Handle search parameter - set to undefined to remove from URL if empty
      const searchParam = params.search || undefined

      // Handle sorting parameters, omitting defaults
      const isDefaultSort =
        params.orderBy === "consecutiveFailures" && params.order === "desc"
      const orderByParam = isDefaultSort ? undefined : params.orderBy
      const orderParam = isDefaultSort ? undefined : params.order

      navigateToUrl({
        page: pageParam,
        pageSize: pageSizeParam,
        search: searchParam,
        orderBy: orderByParam,
        order: orderParam,
      })
    },
    [navigateToUrl],
  )

  // Handle state changes with proper typing
  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    const store = useDataTableStore.getState()
    if (typeof updater === "function") {
      store.setRowSelection(
        updater(store.rowSelection) as Record<string, boolean>,
      )
    } else {
      store.setRowSelection(updater as Record<string, boolean>)
    }
  }

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const store = useDataTableStore.getState()
    let newSorting: SortingState
    if (typeof updater === "function") {
      newSorting = updater(store.sorting)
    } else {
      newSorting = updater
    }
    store.setSorting(newSorting) // Update store first

    // Update URL params based on new sorting state
    updateUrlParams({
      orderBy: newSorting[0]?.id,
      order: newSorting[0]?.desc ? "desc" : "asc",
    })

    // Fetch data with new sorting
    store.fetchEndpointMonitors()
  }

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (
    updater,
  ) => {
    const store = useDataTableStore.getState()
    if (typeof updater === "function") {
      store.setColumnFilters(updater(store.columnFilters))
    } else {
      store.setColumnFilters(updater)
    }
  }

  const handleVisibilityChange: OnChangeFn<VisibilityState> = (updater) => {
    const store = useDataTableStore.getState()
    if (typeof updater === "function") {
      store.setColumnVisibility(updater(store.columnVisibility))
    } else {
      store.setColumnVisibility(updater)
    }
  }

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const store = useDataTableStore.getState()
    let newPagination: PaginationState

    if (typeof updater === "function") {
      newPagination = updater(store.pagination)
    } else {
      newPagination = updater
    }

    // Remove manual scroll - let browser handle it
    // scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });

    // Always set the new pagination in the store
    store.setPagination(newPagination)

    // Update URL with new pagination values
    updateUrlParams({
      page: newPagination.pageIndex,
      pageSize: newPagination.pageSize,
    })

    // Fetch data with new pagination
    store.fetchEndpointMonitors()
  }

  // Initialize from URL params on first load
  React.useEffect(() => {
    const urlParams = parseUrlParams()

    const store = useDataTableStore.getState()
    let needsUpdate = false

    // Update pagination from URL if present and different from store
    const currentPageIndex = store.pagination.pageIndex
    const currentPageSize = store.pagination.pageSize
    const targetPageIndex = urlParams.page ?? DEFAULT_PAGE_INDEX
    const targetPageSize = urlParams.pageSize ?? DEFAULT_PAGE_SIZE

    if (
      targetPageIndex !== currentPageIndex ||
      targetPageSize !== currentPageSize
    ) {
      store.setPagination({
        pageIndex: targetPageIndex,
        pageSize: targetPageSize,
      })
      needsUpdate = true
    }

    // Update search from URL if present and different from store
    const currentSearchValue = store.searchValue
    const targetSearchValue = urlParams.search ?? ""
    if (targetSearchValue !== currentSearchValue) {
      store.setSearchValue(targetSearchValue)
      needsUpdate = true
    }

    // Update sorting from URL if present and different from store
    const currentSorting = store.sorting
    if (urlParams.orderBy) {
      const targetSorting: SortingState = [
        {
          id: urlParams.orderBy,
          desc: urlParams.order === "desc",
        },
      ]
      // Check if targetSorting is different from currentSorting
      if (
        currentSorting.length !== 1 ||
        currentSorting[0].id !== targetSorting[0].id ||
        currentSorting[0].desc !== targetSorting[0].desc
      ) {
        store.setSorting(targetSorting)
        needsUpdate = true
      }
    } else if (
      currentSorting.length > 0 &&
      currentSorting[0].id !== "consecutiveFailures"
    ) {
      // If no sort params in URL, but current sort isn't the default, reset to default
      store.setSorting([{ id: "consecutiveFailures", desc: true }])
      needsUpdate = true
    }

    // Fetch data only if any state was updated or initially
    if (needsUpdate || store.data.length === 0) {
      // Fetch if state changed or data is empty
      store.fetchEndpointMonitors()
    }
  }, []) // Empty dependency array for mount-only effect

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: handleVisibilityChange,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    pageCount: Math.max(
      1,
      Math.ceil(totalEndpointMonitors / pagination.pageSize),
    ),
  })

  const hasData = data.length > 0

  return (
    <Tabs
      defaultValue="endpointMonitors"
      className="w-full flex-col justify-start gap-6"
    >
      <Toolbar table={table} totalEndpointMonitors={totalEndpointMonitors} />
      <TabsContent
        value="endpointMonitors"
        className="relative flex flex-col gap-4 overflow-auto"
      >
        {isLoading && !hasData ? (
          <DataTableSkeleton />
        ) : (
          <div className="overflow-hidden rounded-lg border relative">
            {isLoading && hasData && <DataTableLoadingOverlay />}
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  table
                    .getRowModel()
                    .rows.map((row) => <DataRow key={row.id} row={row} />)
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No endpoint monitors found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
        <Pagination table={table} />
      </TabsContent>
    </Tabs>
  )
}
