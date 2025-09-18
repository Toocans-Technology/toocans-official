import type { Meta, StoryObj } from '@storybook/nextjs'
import { JSX } from 'react'
import { Badge } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'

// Typography Components
const Heading = ({
  level = 1,
  children,
  className,
  ...props
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLHeadingElement>) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements
  const baseClasses = 'font-medium text-foreground'

  const sizeClasses = {
    1: 'text-4xl md:text-5xl lg:text-6xl leading-tight',
    2: 'text-3xl md:text-4xl lg:text-5xl leading-tight',
    3: 'text-2xl md:text-3xl lg:text-4xl leading-snug',
    4: 'text-xl md:text-2xl lg:text-3xl leading-snug',
    5: 'text-lg md:text-xl lg:text-2xl leading-normal',
    6: 'text-base md:text-lg lg:text-xl leading-normal',
  }

  return (
    <Component className={cn(baseClasses, sizeClasses[level], className)} {...props}>
      {children}
    </Component>
  )
}

const Text = ({
  size = 'base',
  weight = 'normal',
  color = 'foreground',
  children,
  className,
  ...props
}: {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'foreground' | 'muted-foreground' | 'primary' | 'destructive' | 'brand' | 'link' | 'warning'
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLParagraphElement>) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const colorClasses = {
    foreground: 'text-foreground',
    'muted-foreground': 'text-muted-foreground',
    primary: 'text-primary',
    destructive: 'text-destructive',
    brand: 'text-brand',
    link: 'text-link',
    warning: 'text-warning',
  }

  return (
    <p className={cn(sizeClasses[size], weightClasses[weight], colorClasses[color], className)} {...props}>
      {children}
    </p>
  )
}

const Code = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLElement>) => {
  return (
    <code
      className={cn('bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className)}
      {...props}
    >
      {children}
    </code>
  )
}

const Link = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a
      className={cn('text-link hover:text-link/80 underline underline-offset-4 transition-colors', className)}
      {...props}
    >
      {children}
    </a>
  )
}

const Blockquote = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLQuoteElement>) => {
  return (
    <blockquote className={cn('border-border text-muted-foreground mt-6 border-l-2 pl-6 italic', className)} {...props}>
      {children}
    </blockquote>
  )
}

const List = ({
  children,
  className,
  ordered = false,
  ...props
}: {
  children: React.ReactNode
  className?: string
  ordered?: boolean
} & React.HTMLAttributes<HTMLUListElement | HTMLOListElement>) => {
  const Component = ordered ? 'ol' : 'ul'
  return (
    <Component className={cn('my-6 ml-6 list-disc [&>li]:mt-2', ordered && 'list-decimal', className)} {...props}>
      {children}
    </Component>
  )
}

const ListItem = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLLIElement>) => {
  return (
    <li className={cn('text-foreground', className)} {...props}>
      {children}
    </li>
  )
}

// Meta configuration
const meta = {
  title: 'Design System/Typography',
  component: Text,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive typography system showcasing all text styles, sizes, weights, and colors available in the design system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl'],
      description: 'Text size variant',
    },
    weight: {
      control: 'select',
      options: ['light', 'normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight variant',
    },
    color: {
      control: 'select',
      options: ['foreground', 'muted-foreground', 'primary', 'destructive', 'brand', 'link', 'warning'],
      description: 'Text color variant',
    },
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

// Heading Stories
export const Headings: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Headings</h3>
        <div className="space-y-4">
          <Heading level={1}>Heading 1 - Main Title</Heading>
          <Heading level={2}>Heading 2 - Section Title</Heading>
          <Heading level={3}>Heading 3 - Subsection Title</Heading>
          <Heading level={4}>Heading 4 - Card Title</Heading>
          <Heading level={5}>Heading 5 - Small Title</Heading>
          <Heading level={6}>Heading 6 - Label Title</Heading>
        </div>
      </div>
    </div>
  ),
}

export const HeadingVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Heading Variants</h3>
        <div className="space-y-4">
          <Heading level={1} className="text-primary">
            Primary Heading
          </Heading>
          <Heading level={2} className="text-brand">
            Brand Heading
          </Heading>
          <Heading level={3} className="text-destructive">
            Destructive Heading
          </Heading>
          <Heading level={4} className="text-muted-foreground">
            Muted Heading
          </Heading>
        </div>
      </div>
    </div>
  ),
}

// Text Stories
export const TextSizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Text Sizes</h3>
        <div className="space-y-3">
          <Text size="xs">Extra Small Text (12px) - Perfect for captions and fine print</Text>
          <Text size="sm">Small Text (14px) - Great for secondary information and labels</Text>
          <Text size="base">Base Text (16px) - Default body text size for optimal readability</Text>
          <Text size="lg">Large Text (18px) - Emphasized body text and important content</Text>
          <Text size="xl">Extra Large Text (20px) - Prominent text and subheadings</Text>
        </div>
      </div>
    </div>
  ),
}

export const TextWeights: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Font Weights</h3>
        <div className="space-y-3">
          <Text weight="light">Light Weight (300) - Elegant and subtle</Text>
          <Text weight="normal">Normal Weight (400) - Standard body text</Text>
          <Text weight="medium">Medium Weight (500) - Slightly emphasized</Text>
          <Text weight="semibold">Semibold Weight (600) - Strong emphasis</Text>
          <Text weight="bold">Bold Weight (700) - Maximum emphasis</Text>
        </div>
      </div>
    </div>
  ),
}

export const TextColors: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Text Colors</h3>
        <div className="space-y-3">
          <Text color="foreground">Foreground - Primary text color</Text>
          <Text color="muted-foreground">Muted Foreground - Secondary text color</Text>
          <Text color="primary">Primary - Brand primary color</Text>
          <Text color="brand">Brand - Brand accent color</Text>
          <Text color="link">Link - Interactive link color</Text>
          <Text color="destructive">Destructive - Error and warning text</Text>
          <Text color="warning">Warning - Warning and caution text</Text>
        </div>
      </div>
    </div>
  ),
}

// Special Text Elements
export const SpecialElements: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Special Text Elements</h3>
        <div className="space-y-4">
          <div>
            <Text className="mb-2 font-medium">Links:</Text>
            <div className="space-y-2">
              <Link href="#">Default Link</Link>
              <br />
              <Link href="#" className="text-primary">
                Primary Link
              </Link>
              <br />
              <Link href="#" className="text-destructive">
                Destructive Link
              </Link>
            </div>
          </div>

          <div>
            <Text className="mb-2 font-medium">Code:</Text>
            <div className="space-y-2">
              <Text>
                This is inline <Code>code</Code> within text.
              </Text>
              <Text>
                Use <Code>const variable = "value"</Code> for JavaScript code.
              </Text>
            </div>
          </div>

          <div>
            <Text className="mb-2 font-medium">Blockquote:</Text>
            <Blockquote>"Design is not just what it looks like and feels like. Design is how it works."</Blockquote>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Lists
export const Lists: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Lists</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Text className="mb-2 font-medium">Unordered List:</Text>
            <List>
              <ListItem>First item in the list</ListItem>
              <ListItem>
                Second item with <Code>code</Code> inside
              </ListItem>
              <ListItem>
                Third item with a <Link href="#">link</Link>
              </ListItem>
              <ListItem>
                Fourth item with{' '}
                <Text color="primary" className="inline">
                  colored text
                </Text>
              </ListItem>
            </List>
          </div>

          <div>
            <Text className="mb-2 font-medium">Ordered List:</Text>
            <List ordered>
              <ListItem>Step one in the process</ListItem>
              <ListItem>Step two with important details</ListItem>
              <ListItem>
                Step three with <Badge variant="secondary">badge</Badge>
              </ListItem>
              <ListItem>Final step to complete</ListItem>
            </List>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Responsive Typography
export const ResponsiveTypography: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Responsive Typography</h3>
        <div className="space-y-4">
          <Text className="text-sm md:text-base lg:text-lg">
            This text scales from small on mobile to large on desktop screens.
          </Text>
          <Heading level={2} className="text-2xl md:text-3xl lg:text-4xl">
            Responsive Heading
          </Heading>
          <Text className="text-muted-foreground text-xs md:text-sm lg:text-base">
            Caption text that adapts to different screen sizes for optimal readability.
          </Text>
        </div>
      </div>
    </div>
  ),
}

// Typography in Context
export const TypographyInContext: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Typography in Context</h3>

        {/* Article Example */}
        <div className="bg-card max-w-2xl space-y-6 rounded-lg border p-6">
          <div>
            <Heading level={1} className="text-3xl md:text-4xl">
              The Future of Web Design
            </Heading>
            <Text color="muted-foreground" className="text-sm md:text-base">
              Published on January 15, 2025 • 5 min read
            </Text>
          </div>

          <Text size="lg" className="text-muted-foreground">
            Web design is constantly evolving, with new technologies and design patterns emerging every year. In this
            article, we explore the latest trends and what they mean for the future of digital experiences.
          </Text>

          <Heading level={2} className="text-2xl">
            Key Trends for 2025
          </Heading>

          <Text>
            The design landscape is shifting towards more{' '}
            <Text weight="semibold" className="inline">
              user-centric approaches
            </Text>
            , with emphasis on accessibility and performance. Here are the main trends to watch:
          </Text>

          <List>
            <ListItem>
              <Text weight="medium" className="inline">
                Dark mode optimization
              </Text>{' '}
              - Better contrast and reduced eye strain
            </ListItem>
            <ListItem>
              <Text weight="medium" className="inline">
                Micro-interactions
              </Text>{' '}
              - Subtle animations that enhance user experience
            </ListItem>
            <ListItem>
              <Text weight="medium" className="inline">
                Voice interfaces
              </Text>{' '}
              - Integration of voice commands and responses
            </ListItem>
          </List>

          <Blockquote>
            "The best designs are invisible. They don't get in the way of the user's goals, but instead facilitate them
            seamlessly."
          </Blockquote>

          <Text>
            As we move forward, designers must balance{' '}
            <Text color="primary" className="inline">
              innovation
            </Text>{' '}
            with
            <Text color="brand" className="inline">
              {' '}
              usability
            </Text>
            , ensuring that new technologies serve the user's needs rather than showcasing technical capabilities.
          </Text>

          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Design</Badge>
            <Badge variant="secondary">UX</Badge>
            <Badge variant="outline">Trends</Badge>
            <Badge variant="outline">2025</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Interactive Typography
export const InteractiveTypography: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-muted-foreground mb-4 text-lg font-semibold">Interactive Typography</h3>
        <div className="space-y-4">
          <div className="hover:bg-accent rounded-lg border p-4 transition-colors">
            <Text weight="medium" className="mb-2">
              Hoverable Text Block
            </Text>
            <Text size="sm" color="muted-foreground">
              This text block changes background on hover, demonstrating interactive typography.
            </Text>
          </div>

          <div className="space-y-2">
            <Text className="mb-2 font-medium">Clickable Elements:</Text>
            <div className="flex flex-wrap gap-4">
              <button className="text-link hover:text-link/80 underline underline-offset-4 transition-colors">
                Clickable Link
              </button>
              <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                Primary Button
              </button>
              <button className="text-destructive hover:text-destructive/80 font-medium transition-colors">
                Destructive Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Default story for controls
export const Default: Story = {
  args: {
    children: 'This is a customizable text element. Use the controls to change size, weight, and color.',
    size: 'base',
    weight: 'normal',
    color: 'foreground',
  },
}
