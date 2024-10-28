import type { Fetcher } from 'swr'
import { del, get, post, upload } from './base'
import type {
  CreateEndpointRequest,
  EndpointOperationResponse,
  EndpointsRequest,
  EndpointsResponse,
  InstallPackageResponse,
  PluginDeclaration,
  TaskStatusResponse,
  UpdateEndpointRequest,
} from '@/app/components/plugins/types'
import type { DebugInfo as DebugInfoTypes } from '@/app/components/plugins/types'
import type {
  MarketplaceCollectionPluginsResponse,
  MarketplaceCollectionsResponse,
} from '@/app/components/plugins/marketplace/types'

export const createEndpoint: Fetcher<EndpointOperationResponse, { url: string; body: CreateEndpointRequest }> = ({ url, body }) => {
  // url = /workspaces/current/endpoints/create
  return post<EndpointOperationResponse>(url, { body })
}

export const fetchEndpointList: Fetcher<EndpointsResponse, { url: string; params?: EndpointsRequest }> = ({ url, params }) => {
  // url = /workspaces/current/endpoints/list/plugin?plugin_id=xxx
  return get<EndpointsResponse>(url, { params })
}

export const deleteEndpoint: Fetcher<EndpointOperationResponse, { url: string; endpointID: string }> = ({ url, endpointID }) => {
  // url = /workspaces/current/endpoints/delete
  return del<EndpointOperationResponse>(url, { body: { endpoint_id: endpointID } })
}

export const updateEndpoint: Fetcher<EndpointOperationResponse, { url: string; body: UpdateEndpointRequest }> = ({ url, body }) => {
  // url = /workspaces/current/endpoints/update
  return post<EndpointOperationResponse>(url, { body })
}

export const enableEndpoint: Fetcher<EndpointOperationResponse, { url: string; endpointID: string }> = ({ url, endpointID }) => {
  // url = /workspaces/current/endpoints/enable
  return post<EndpointOperationResponse>(url, { body: { endpoint_id: endpointID } })
}

export const disableEndpoint: Fetcher<EndpointOperationResponse, { url: string; endpointID: string }> = ({ url, endpointID }) => {
  // url = /workspaces/current/endpoints/disable
  return post<EndpointOperationResponse>(url, { body: { endpoint_id: endpointID } })
}

export const installPackageFromGitHub: Fetcher<InstallPackageResponse, { repo: string; version: string; package: string }> = ({ repo, version, package: packageName }) => {
  return post<InstallPackageResponse>('/workspaces/current/plugin/upload/github', {
    body: { repo, version, package: packageName },
  })
}

export const fetchDebugKey = async () => {
  return get<DebugInfoTypes>('/workspaces/current/plugin/debugging-key')
}

export const uploadPackageFile = async (file: File) => {
  const formData = new FormData()
  formData.append('pkg', file)
  return upload({
    xhr: new XMLHttpRequest(),
    data: formData,
  }, false, '/workspaces/current/plugin/upload/pkg')
}

export const installPackageFromLocal = async (uniqueIdentifier: string) => {
  return post<InstallPackageResponse>('/workspaces/current/plugin/install/pkg', {
    body: { plugin_unique_identifiers: [uniqueIdentifier] },
  })
}

export const fetchManifest = async (uniqueIdentifier: string) => {
  return get<PluginDeclaration>(`/workspaces/current/plugin/fetch-manifest?plugin_unique_identifier=${uniqueIdentifier}`)
}

export const installPackageFromMarketPlace = async (uniqueIdentifier: string) => {
  return post<InstallPackageResponse>('/workspaces/current/plugin/install/marketplace', {
    body: { plugin_unique_identifiers: [uniqueIdentifier] },
  })
}

export const fetchMarketplaceCollections: Fetcher<MarketplaceCollectionsResponse, { url: string; }> = ({ url }) => {
  return get<MarketplaceCollectionsResponse>(url)
}

export const fetchMarketplaceCollectionPlugins: Fetcher<MarketplaceCollectionPluginsResponse, { url: string }> = ({ url }) => {
  return get<MarketplaceCollectionPluginsResponse>(url)
}

export const checkTaskStatus = async (taskId: string) => {
  return get<TaskStatusResponse>(`/workspaces/current/plugin/tasks/${taskId}`)
}