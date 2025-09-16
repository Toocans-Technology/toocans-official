import type { Meta, StoryObj } from '@storybook/nextjs'
import { PlusIcon, User2Icon } from 'lucide-react'
import { fn } from 'storybook/test'
import { Input } from '@/components/common'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/Input',
  component: Input,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onChange arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onChange: fn() },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    placeholder: 'Input',
  },
  render: (args) => <Input {...args} />,
}

export const WithStartContent: Story = {
  args: {
    placeholder: 'Input',
    startContent: <User2Icon />,
  },
  render: (args) => <Input {...args} />,
}

export const WithEndContent: Story = {
  args: {
    placeholder: 'Input',
    endContent: <PlusIcon />,
  },
  render: (args) => <Input {...args} />,
}

export const WithStartContentAndEndContent: Story = {
  args: {
    placeholder: 'Input',
    startContent: <User2Icon />,
    endContent: <PlusIcon />,
  },
  render: (args) => <Input {...args} />,
}

export const WithShowClear: Story = {
  args: {
    value: '123456',
    placeholder: 'Input',
    showClear: true,
  },
  render: (args) => <Input {...args} />,
}

export const WithShowClearAndStartContent: Story = {
  args: {
    value: '123456',
    placeholder: 'Input',
    showClear: true,
    startContent: <User2Icon />,
  },
  render: (args) => <Input {...args} />,
}

export const WithShowClearAndEndContent: Story = {
  args: {
    value: '123456',
    placeholder: 'Input',
    showClear: true,
    endContent: <PlusIcon />,
  },
  render: (args) => <Input {...args} />,
}
