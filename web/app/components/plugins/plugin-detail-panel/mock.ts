import { PluginSource, PluginType } from '../types'

export const toolNotion = {
  id: 'dlfajkgjdga-dfjalksjfglkds-dfjakld',
  created_at: '2024-10-16 16:05:33',
  updated_at: '2024-10-16 16:05:33',
  name: 'notion page search',
  plugin_id: 'Notion/notion-page-search',
  plugin_unique_identifier: 'Notion/notion-page-search:1.2.0@fldsjflkdsajfldsakajfkls',
  declaration: {
    version: '1.2.0',
    author: 'Notion',
    name: 'notion page search',
    category: PluginType.tool,
    icon: 'https://via.placeholder.com/150',
    label: {
      'en-US': 'Notion Page Search',
      'zh-Hans': 'Notion 页面搜索',
    },
    description: {
      'en-US': 'Description: Search Notion pages and open visited ones faster. No admin access required.More and more info...More and more info...More and more info...',
      'zh-Hans': '搜索 Notion 页面并更快地打开已访问的页面。无需管理员访问权限。More and more info...More and more info...More and more info...',
    },
    created_at: '2024-10-16 16:05:33',
    resource: {},
    plugins: {},
    tool: {}, // TODO
    verified: true,
  },
  installation_id: 'jflkdsjoewingljlsadjgoijg-dkfjldajglkajglask-dlfkajdg',
  tenant_id: 'jflkdsjoewingljlsadjgoijg',
  endpoints_setups: 2,
  endpoints_active: 1,
  version: '1.2.0',
  source: PluginSource.marketplace,
  meta: null,
}

export const toolNotionEndpoints = [
  {
    id: 'dlfajkgjdga-dfjalksjfglkds-dfjakld',
    created_at: '2024-10-16 16:05:33',
    updated_at: '2024-10-16 16:05:33',
    settings: {
      'api-key': '*******',
    },
    tenant_id: 'jflkdsjoewingljlsadjgoijg',
    plugin_id: 'Notion/notion-page-search',
    expired_at: '2024-10-16 16:05:33',
    declaration: {
      settings: [
        {
          type: 'secret-input',
          name: 'api-key',
          required: true,
          default: null,
          options: null,
          label: {
            'en-US': 'API-key',
            'zh-Hans': 'API-key',
          },
          help: null,
          url: null,
          placeholder: {
            'en-US': 'Please input your API key',
            'zh-Hans': '请输入你的 API key',
          },
        },
      ],
      endpoint: [
        { path: '/duck/<app_id>', method: 'GET' },
        { path: '/neko', method: 'GET' },
      ],
    },
    name: 'default',
    enabled: true,
    url: 'http://localhost:5002/e/45rj9V4TRxAjL0I2wXRZgZdXjdHEKBh8',
    hook_id: '45rj9V4TRxAjL0I2wXRZgZdXjdHEKBh8',
  },
]