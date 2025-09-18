import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/internal/test'
import { Checkbox } from '@workspace/ui/components'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    className: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'onChange' },
  },
  // Use `fn` to spy on the onChange arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
  render: (args) => <Checkbox {...args} />,
}

export const Checked: Story = {
  args: {
    checked: true,
  },
  render: (args) => <Checkbox {...args} />,
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => <Checkbox {...args} />,
}

export const Indeterminate: Story = {
  args: {
    checked: 'indeterminate',
  },
  render: (args) => <Checkbox {...args} />,
}
