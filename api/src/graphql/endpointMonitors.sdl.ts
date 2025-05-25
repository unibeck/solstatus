export const schema = gql`
  type EndpointMonitor {
    id: String!
    name: String!
    url: String!
    method: String!
    checkInterval: Int!
    isRunning: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    lastCheckedAt: DateTime
    consecutiveFailures: Int!
    headers: JSON
    body: JSON
    statusCode: Int
    responseTime: Int
    statusText: String
  }

  type EndpointMonitorsPage {
    endpointMonitors: [EndpointMonitor!]!
    count: Int!
    hasMore: Boolean!
  }

  type Query {
    endpointMonitors(
      page: Int
      pageSize: Int
      orderBy: String
      order: String
      search: String
      isRunning: Boolean
      checkIntervalMin: Int
      checkIntervalMax: Int
    ): EndpointMonitorsPage! @requireAuth

    endpointMonitor(id: String!): EndpointMonitor @requireAuth

    endpointMonitorStatus(id: String!): EndpointMonitor @requireAuth
    
    endpointMonitorStats: JSON! @requireAuth
  }

  input CreateEndpointMonitorInput {
    name: String!
    url: String!
    method: String!
    checkInterval: Int!
    isRunning: Boolean!
    headers: JSON
    body: JSON
  }

  input UpdateEndpointMonitorInput {
    name: String
    url: String
    method: String
    checkInterval: Int
    isRunning: Boolean
    headers: JSON
    body: JSON
  }

  type Mutation {
    createEndpointMonitor(input: CreateEndpointMonitorInput!): EndpointMonitor! @requireAuth
    updateEndpointMonitor(id: String!, input: UpdateEndpointMonitorInput!): EndpointMonitor! @requireAuth
    deleteEndpointMonitor(id: String!): EndpointMonitor! @requireAuth
    pauseEndpointMonitor(id: String!): EndpointMonitor! @requireAuth
    resumeEndpointMonitor(id: String!): EndpointMonitor! @requireAuth
    executeCheck(id: String!): EndpointMonitor! @requireAuth
  }
`