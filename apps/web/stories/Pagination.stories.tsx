import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/internal/test'
import { PaginationControls as Pagination } from '@/components/common'
import { PaginationControlsProps } from '@/components/common/PaginationControls'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onChange arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<PaginationControlsProps>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    totalPages: 10,
    currentPage: 1,
    onPageChange: fn(),
  },
  render: (args) => <Pagination {...args} />,
}
