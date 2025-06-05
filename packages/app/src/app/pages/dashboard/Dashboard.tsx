"use client"

import { useHeaderContext } from "#/context/header-context"
import { useStatsStore } from "#/store/dashboard-stats-store"
import { useDataTableStore } from "#/store/data-table-store"

function Dashboard() {
  const { setHeaderLeftContent, setHeaderRightContent } = useHeaderContext()

  const fetchEndpointMonitors = useDataTableStore(
    (state) => state.fetchEndpointMonitors,
  )
  const fetchDashboardStats = useStatsStore(
    (state) => state.fetchDashboardStats,
  )

  // useEffect(() => {
  //   setHeaderLeftContent("Endpoint Monitors")
  //   setHeaderRightContent(
  //     <AddEndpointMonitorDialog
  //       onSuccess={async () => {
  //         await fetchEndpointMonitors()
  //         await fetchDashboardStats()
  //       }}
  //       trigger={
  //         <Button variant="primary">
  //           <IconCirclePlusFilled />
  //           <span>Create Endpoint Monitor</span>
  //         </Button>
  //       }
  //     />,
  //   )
  // }, [
  //   setHeaderLeftContent,
  //   setHeaderRightContent,
  //   fetchEndpointMonitors,
  //   fetchDashboardStats,
  // ])

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        {/* <SectionCards />
        <DataTable /> */}
      </div>
    </div>
  )
}

export default Dashboard
