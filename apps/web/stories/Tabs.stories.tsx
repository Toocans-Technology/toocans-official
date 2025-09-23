import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/test'
import { Separator, Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Tabs',
  },
  render: (args) => (
    <Tabs defaultValue="deposit" className="w-full" {...args}>
      <TabsList className="-mx-2 h-8 bg-transparent p-0">
        <TabsTrigger value="deposit">Deposit</TabsTrigger>
        <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        <TabsTrigger value="transferIn">TransferIn</TabsTrigger>
        <TabsTrigger value="transferOut">TransferOut</TabsTrigger>
      </TabsList>
      <Separator />
      <TabsContent value="deposit" className="mt-2">
        <div>Deposit</div>
      </TabsContent>
      <TabsContent value="withdraw" className="mt-2">
        <div>Withdraw</div>
      </TabsContent>
      <TabsContent value="transferIn" className="mt-2">
        <div>TransferIn</div>
      </TabsContent>
      <TabsContent value="transferOut" className="mt-2">
        <div>TransferOut</div>
      </TabsContent>
    </Tabs>
  ),
}
