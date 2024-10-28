'use client'

import { useState } from 'react'
import { PluginType } from '../types'
import {
  RiArchive2Line,
  RiBrain2Line,
  RiHammerLine,
  RiPuzzle2Line,
} from '@remixicon/react'
import cn from '@/utils/classnames'

const PLUGIN_TYPE_SEARCH_MAP = {
  all: 'all',
  model: PluginType.model,
  tool: PluginType.tool,
  extension: PluginType.extension,
  bundle: 'bundle',
}
type PluginTypeSwitchProps = {
  onChange?: (type: string) => void
}
const options = [
  {
    value: PLUGIN_TYPE_SEARCH_MAP.all,
    text: 'All',
    icon: null,
  },
  {
    value: PLUGIN_TYPE_SEARCH_MAP.model,
    text: 'Models',
    icon: <RiBrain2Line className='mr-1.5 w-4 h-4' />,
  },
  {
    value: PLUGIN_TYPE_SEARCH_MAP.tool,
    text: 'Tools',
    icon: <RiHammerLine className='mr-1.5 w-4 h-4' />,
  },
  {
    value: PLUGIN_TYPE_SEARCH_MAP.extension,
    text: 'Extensions',
    icon: <RiPuzzle2Line className='mr-1.5 w-4 h-4' />,
  },
  {
    value: PLUGIN_TYPE_SEARCH_MAP.bundle,
    text: 'Bundles',
    icon: <RiArchive2Line className='mr-1.5 w-4 h-4' />,
  },
]
const PluginTypeSwitch = ({
  onChange,
}: PluginTypeSwitchProps) => {
  const [activeType, setActiveType] = useState(PLUGIN_TYPE_SEARCH_MAP.all)

  return (
    <div className={cn(
      'sticky top-[60px] flex items-center justify-center py-3 bg-background-body space-x-2 z-10',
    )}>
      {
        options.map(option => (
          <div
            key={option.value}
            className={cn(
              'flex items-center px-3 h-8 border border-transparent rounded-xl cursor-pointer hover:bg-state-base-hover hover:text-text-secondary system-md-medium text-text-tertiary',
              activeType === option.value && 'border-components-main-nav-nav-button-border !bg-components-main-nav-nav-button-bg-active !text-components-main-nav-nav-button-text-active shadow-xs',
            )}
            onClick={() => {
              setActiveType(option.value)
              onChange?.(option.value)
            }}
          >
            {option.icon}
            {option.text}
          </div>
        ))
      }
    </div>
  )
}

export default PluginTypeSwitch