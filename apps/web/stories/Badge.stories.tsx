import type { Meta, StoryObj } from '@storybook/nextjs'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Heart,
  Tag,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Clock,
  Award,
  Bell,
  Settings,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from 'lucide-react'
import { Badge } from '@workspace/ui/components'

// Meta configuration
const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A versatile badge component for displaying status, labels, and notifications with various visual styles and interactive states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Visual style variant of the badge',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as a child component using Radix Slot',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
  args: {
    children: 'Badge',
    variant: 'default',
    asChild: false,
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

// Basic Variants
export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Default Badge',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Badge',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Badge',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Badge',
  },
}

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Badge Variants</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>
    </div>
  ),
}

// Badges with Icons
export const WithIcons: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Badges with Icons</h3>
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-medium">Status Badges</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">
                <CheckCircle className="mr-1 h-3 w-3" />
                Success
              </Badge>
              <Badge variant="destructive">
                <XCircle className="mr-1 h-3 w-3" />
                Error
              </Badge>
              <Badge variant="secondary">
                <AlertCircle className="mr-1 h-3 w-3" />
                Warning
              </Badge>
              <Badge variant="outline">
                <Clock className="mr-1 h-3 w-3" />
                Pending
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Feature Badges</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">
                <Star className="mr-1 h-3 w-3" />
                Featured
              </Badge>
              <Badge variant="secondary">
                <Heart className="mr-1 h-3 w-3" />
                Liked
              </Badge>
              <Badge variant="outline">
                <Tag className="mr-1 h-3 w-3" />
                Tagged
              </Badge>
              <Badge variant="default">
                <Award className="mr-1 h-3 w-3" />
                Premium
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Action Badges</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline">
                <Download className="mr-1 h-3 w-3" />
                Download
              </Badge>
              <Badge variant="outline">
                <Upload className="mr-1 h-3 w-3" />
                Upload
              </Badge>
              <Badge variant="secondary">
                <Settings className="mr-1 h-3 w-3" />
                Settings
              </Badge>
              <Badge variant="default">
                <Bell className="mr-1 h-3 w-3" />
                Notifications
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Interactive Badges
export const Interactive: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Interactive Badges</h3>
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-medium">Clickable Badges</h4>
            <div className="flex flex-wrap gap-3">
              <Badge asChild>
                <a href="#" className="cursor-pointer transition-opacity hover:opacity-80">
                  <Tag className="mr-1 h-3 w-3" />
                  Clickable Badge
                </a>
              </Badge>
              <Badge asChild variant="secondary">
                <button className="cursor-pointer transition-opacity hover:opacity-80">
                  <Settings className="mr-1 h-3 w-3" />
                  Action Badge
                </button>
              </Badge>
              <Badge asChild variant="outline">
                <a href="#" className="cursor-pointer transition-opacity hover:opacity-80">
                  <Eye className="mr-1 h-3 w-3" />
                  View Details
                </a>
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Toggle Badges</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">
                <Lock className="mr-1 h-3 w-3" />
                Locked
              </Badge>
              <Badge variant="secondary">
                <Unlock className="mr-1 h-3 w-3" />
                Unlocked
              </Badge>
              <Badge variant="outline">
                <Eye className="mr-1 h-3 w-3" />
                Visible
              </Badge>
              <Badge variant="outline">
                <EyeOff className="mr-1 h-3 w-3" />
                Hidden
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Badge Sizes and Customization
export const SizesAndCustomization: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Badge Sizes and Customization</h3>
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-medium">Size Variations</h4>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="px-1.5 py-0.5 text-xs">XS</Badge>
              <Badge className="px-2 py-0.5 text-xs">Small</Badge>
              <Badge className="px-3 py-1 text-sm">Medium</Badge>
              <Badge className="px-4 py-1.5 text-base">Large</Badge>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Custom Colors</h4>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                <Shield className="mr-1 h-3 w-3" />
                Security
              </Badge>
              <Badge className="bg-green-500 text-white hover:bg-green-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                Growth
              </Badge>
              <Badge className="bg-purple-500 text-white hover:bg-purple-600">
                <Zap className="mr-1 h-3 w-3" />
                Performance
              </Badge>
              <Badge className="bg-orange-500 text-white hover:bg-orange-600">
                <Users className="mr-1 h-3 w-3" />
                Community
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Custom Shapes</h4>
            <div className="flex flex-wrap gap-3">
              <Badge className="rounded-full">
                <Star className="mr-1 h-3 w-3" />
                Rounded
              </Badge>
              <Badge className="rounded-none">
                <Tag className="mr-1 h-3 w-3" />
                Square
              </Badge>
              <Badge className="rounded-lg">
                <Award className="mr-1 h-3 w-3" />
                Large Radius
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Badge Usage Examples
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Usage Examples</h3>

        {/* User Profile Example */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">User Profile</h4>
          <div className="max-w-md rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">John Doe</span>
                  <Badge variant="default">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary">Premium User</Badge>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Center Example */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Notification Center</h4>
          <div className="max-w-md space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Bell className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">New message received</span>
              </div>
              <Badge variant="destructive">3</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Settings className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">System update available</span>
              </div>
              <Badge variant="default">New</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Award className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">Achievement unlocked</span>
              </div>
              <Badge variant="secondary">Completed</Badge>
            </div>
          </div>
        </div>

        {/* File Upload Example */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">File Upload Status</h4>
          <div className="max-w-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">document.pdf</span>
              <Badge variant="default">
                <CheckCircle className="mr-1 h-3 w-3" />
                Uploaded
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">image.jpg</span>
              <Badge variant="destructive">
                <XCircle className="mr-1 h-3 w-3" />
                Failed
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">video.mp4</span>
              <Badge variant="secondary">
                <Clock className="mr-1 h-3 w-3" />
                Processing
              </Badge>
            </div>
          </div>
        </div>

        {/* Tag Cloud Example */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Tag Cloud</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">Next.js</Badge>
            <Badge variant="outline">Tailwind CSS</Badge>
            <Badge variant="outline">Storybook</Badge>
            <Badge variant="outline">Design System</Badge>
            <Badge variant="outline">UI Components</Badge>
            <Badge variant="outline">Accessibility</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Badge States
export const States: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Badge States</h3>
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-medium">Status States</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">
                <CheckCircle className="mr-1 h-3 w-3" />
                Active
              </Badge>
              <Badge variant="secondary">
                <Clock className="mr-1 h-3 w-3" />
                Pending
              </Badge>
              <Badge variant="destructive">
                <XCircle className="mr-1 h-3 w-3" />
                Inactive
              </Badge>
              <Badge variant="outline">
                <AlertCircle className="mr-1 h-3 w-3" />
                Warning
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Priority States</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="destructive">
                <Zap className="mr-1 h-3 w-3" />
                High Priority
              </Badge>
              <Badge variant="default">
                <AlertCircle className="mr-1 h-3 w-3" />
                Medium Priority
              </Badge>
              <Badge variant="secondary">
                <Clock className="mr-1 h-3 w-3" />
                Low Priority
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Verification States</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">
                <Shield className="mr-1 h-3 w-3" />
                Verified
              </Badge>
              <Badge variant="destructive">
                <XCircle className="mr-1 h-3 w-3" />
                Unverified
              </Badge>
              <Badge variant="secondary">
                <Clock className="mr-1 h-3 w-3" />
                Pending Verification
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Badge with Counts
export const WithCounts: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Badges with Counts</h3>
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-medium">Notification Counts</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="destructive">99+</Badge>
              <Badge variant="default">42</Badge>
              <Badge variant="secondary">7</Badge>
              <Badge variant="outline">1</Badge>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">With Icons and Counts</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="destructive">
                <Bell className="mr-1 h-3 w-3" />
                12
              </Badge>
              <Badge variant="default">
                <Heart className="mr-1 h-3 w-3" />
                256
              </Badge>
              <Badge variant="secondary">
                <Users className="mr-1 h-3 w-3" />
                1.2k
              </Badge>
              <Badge variant="outline">
                <Star className="mr-1 h-3 w-3" />
                4.8
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Dark Mode Support
export const DarkMode: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Dark Mode Support</h3>
        <div className="bg-muted rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-foreground mb-2 text-sm font-medium">Badges in Dark Theme</h4>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            <div>
              <h4 className="text-foreground mb-2 text-sm font-medium">With Icons</h4>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Success
                </Badge>
                <Badge variant="destructive">
                  <XCircle className="mr-1 h-3 w-3" />
                  Error
                </Badge>
                <Badge variant="secondary">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Warning
                </Badge>
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3" />
                  Pending
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
}
