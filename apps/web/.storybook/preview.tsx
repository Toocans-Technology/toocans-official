import type { Preview } from '@storybook/nextjs'
import React from 'react'
import '@workspace/ui/styles/globals.css'
import { fontSans, fontInter } from '../app/[lang]/layout'
import { BaseProviders } from '../components/providers'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story) => {
      return (
        <div className={`${fontSans.variable} ${fontInter.variable} font-inter antialiased`}>
          <BaseProviders>
            <Story />
          </BaseProviders>
        </div>
      )
    },
  ],
}

export default preview
