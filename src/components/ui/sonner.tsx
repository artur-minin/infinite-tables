import { CSSProperties } from 'react'

import { Toaster as Sonner, ToasterProps } from 'sonner'

import { useTheme } from '@/lib/theme-provider'

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--secondary)',
          '--normal-text': 'var(--secondary-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius-primary)'
        } as CSSProperties
      }
      {...props}
    />
  )
}
