import type { ComponentProps, FC, ReactNode } from 'react'
import { forwardRef } from 'react'
import classNames from '@/utils/classnames'

export type PreviewContainerProps = ComponentProps<'div'> & {
  header: ReactNode
  mainClassName?: string
}

export const PreviewContainer: FC<PreviewContainerProps> = forwardRef((props, ref) => {
  const { children, className, header, mainClassName, ...rest } = props
  return <div
    {...rest}
    ref={ref}
    className={classNames(
      'flex flex-col rounded-xl border-t-[0.5px] border-l-[0.5px] border-components-panel-border bg-background-default-lighter shadow shadow-shadow-shadow-5',
      className,
    )}
  >
    <header className='py-4 pl-5 pr-3 border-b border-divider-subtle'>
      {header}
    </header>
    <main className={classNames('py-5 px-6 w-full h-full', mainClassName)}>
      {children}
    </main>
  </div>
})
PreviewContainer.displayName = 'PreviewContainer'
