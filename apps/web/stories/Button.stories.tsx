import type { Meta, StoryObj } from '@storybook/nextjs'
import { PlusIcon } from 'lucide-react'
import { fn } from 'storybook/test'
import { Button } from '@workspace/ui/components'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: { control: 'select', options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] },
    size: { control: 'select', options: ['default', 'sm', 'lg', 'icon'] },
    rounded: { control: 'select', options: ['default', 'sm', 'md', 'full'] },
    fullWidth: { control: 'boolean' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn(), variant: 'default', size: 'default', rounded: 'default', fullWidth: false },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Button',
    fullWidth: true,
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Button',
    fullWidth: true,
  },
}

export const Rounded: Story = {
  args: {
    rounded: 'full',
    children: 'Button',
  },
}

export const IconOnly: Story = {
  args: {
    size: 'icon',
  },
  render: (args) => (
    <Button {...args}>
      <PlusIcon size={24} />
    </Button>
  ),
}
