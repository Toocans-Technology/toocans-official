import type { Meta, StoryObj } from '@storybook/nextjs'
import Image from 'next/image'
import { cn } from '@workspace/ui/lib/utils'

// Icon component wrapper for consistent usage
interface IconProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  alt?: string
  priority?: boolean
}

const Icon = ({ name, size = 'md', className, alt, priority = false }: IconProps) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
    '2xl': 'h-12 w-12',
  }

  return (
    <Image
      src={`/icons/${name}.svg`}
      alt={alt || `${name} icon`}
      width={24}
      height={24}
      className={cn(sizeClasses[size], className)}
      priority={priority}
    />
  )
}

// All available icons from the public/icons folder
const iconList = [
  { name: 'address', description: 'Location or address icon' },
  { name: 'check-mark', description: 'Success check mark with green styling' },
  { name: 'checked', description: 'Checked state indicator' },
  { name: 'copy', description: 'Copy to clipboard action' },
  { name: 'delete', description: 'Delete or remove action' },
  { name: 'download', description: 'Download file action' },
  { name: 'edit', description: 'Edit or modify action' },
  { name: 'identity', description: 'User identity verification' },
  { name: 'intl', description: 'International or language selection' },
  { name: 'list', description: 'List view or menu' },
  { name: 'qrcode', description: 'QR code generation' },
  { name: 'search', description: 'Search functionality' },
  { name: 'upload', description: 'Upload file action' },
  { name: 'user', description: 'User profile or account' },
]

// Meta configuration
const meta = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A collection of custom SVG icons used throughout the application. Each icon is optimized for different sizes and can be styled with custom classes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: iconList.map((icon) => icon.name),
      description: 'Icon name (without .svg extension)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Icon size variant',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    alt: {
      control: 'text',
      description: 'Alt text for accessibility',
    },
  },
  args: {
    name: 'user',
    size: 'md',
    alt: 'User icon',
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

// All Icons Showcase
export const AllIcons: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">All Available Icons</h3>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {iconList.map((icon) => (
            <div key={icon.name} className="flex flex-col items-center space-y-2 rounded-lg border p-4">
              <Icon name={icon.name} size="lg" />
              <span className="text-center text-xs font-medium">{icon.name}</span>
              <span className="text-muted-foreground text-center text-xs">{icon.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

// Size Variations
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Icon Sizes</h3>
        <div className="space-y-4">
          {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
            <div key={size} className="flex items-center space-x-4">
              <span className="w-12 text-sm font-medium">{size.toUpperCase()}</span>
              <Icon name="user" size={size} />
              <Icon name="search" size={size} />
              <Icon name="check-mark" size={size} />
              <Icon name="copy" size={size} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

// Styled Icons
export const StyledIcons: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Styled Icons</h3>
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-medium">Color Variations</h4>
            <div className="flex flex-wrap gap-4">
              <Icon name="user" size="lg" className="text-primary" />
              <Icon name="search" size="lg" className="text-destructive" />
              <Icon name="check-mark" size="lg" className="text-brand" />
              <Icon name="copy" size="lg" className="text-muted-foreground" />
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Background Styles</h4>
            <div className="flex flex-wrap gap-4">
              <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                <Icon name="user" size="md" className="text-primary-foreground" />
              </div>
              <div className="bg-destructive flex h-12 w-12 items-center justify-center rounded-full">
                <Icon name="delete" size="md" className="text-white" />
              </div>
              <div className="bg-brand flex h-12 w-12 items-center justify-center rounded-full">
                <Icon name="check-mark" size="md" className="text-white" />
              </div>
              <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg">
                <Icon name="search" size="md" className="text-muted-foreground" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Hover Effects</h4>
            <div className="flex flex-wrap gap-4">
              <Icon name="user" size="lg" className="hover:text-primary transition-colors" />
              <Icon name="search" size="lg" className="hover:text-destructive transition-colors" />
              <Icon name="copy" size="lg" className="hover:text-brand transition-colors" />
              <Icon name="edit" size="lg" className="hover:text-muted-foreground transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Usage Examples
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Usage Examples</h3>

        {/* Button with Icons */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Buttons with Icons</h4>
          <div className="flex flex-wrap gap-3">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2 rounded-md px-4 py-2">
              <Icon name="user" size="sm" />
              <span>Profile</span>
            </button>
            <button className="border-input bg-background hover:bg-accent flex items-center space-x-2 rounded-md border px-4 py-2">
              <Icon name="search" size="sm" />
              <span>Search</span>
            </button>
            <button className="bg-destructive hover:bg-destructive/90 flex items-center space-x-2 rounded-md px-4 py-2 text-white">
              <Icon name="delete" size="sm" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Navigation Menu</h4>
          <div className="max-w-md space-y-1">
            <div className="hover:bg-accent flex items-center space-x-3 rounded-md px-3 py-2">
              <Icon name="user" size="sm" />
              <span className="text-sm">Account Settings</span>
            </div>
            <div className="hover:bg-accent flex items-center space-x-3 rounded-md px-3 py-2">
              <Icon name="identity" size="sm" />
              <span className="text-sm">Identity Verification</span>
            </div>
            <div className="hover:bg-accent flex items-center space-x-3 rounded-md px-3 py-2">
              <Icon name="address" size="sm" />
              <span className="text-sm">Address Management</span>
            </div>
            <div className="hover:bg-accent flex items-center space-x-3 rounded-md px-3 py-2">
              <Icon name="intl" size="sm" />
              <span className="text-sm">Language Settings</span>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Status Indicators</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Icon name="check-mark" size="sm" />
              <span className="text-brand text-sm">Verification Complete</span>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="checked" size="sm" />
              <span className="text-muted-foreground text-sm">Profile Updated</span>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="qrcode" size="sm" />
              <span className="text-sm">QR Code Generated</span>
            </div>
          </div>
        </div>

        {/* File Actions */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">File Actions</h4>
          <div className="max-w-md space-y-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center space-x-3">
                <Icon name="upload" size="sm" />
                <span className="text-sm">document.pdf</span>
              </div>
              <div className="flex space-x-2">
                <button className="hover:bg-accent rounded p-1">
                  <Icon name="download" size="sm" />
                </button>
                <button className="hover:bg-accent rounded p-1">
                  <Icon name="copy" size="sm" />
                </button>
                <button className="hover:bg-destructive/10 rounded p-1">
                  <Icon name="delete" size="sm" className="text-destructive" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}
