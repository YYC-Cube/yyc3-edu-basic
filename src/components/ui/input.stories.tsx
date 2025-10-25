import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Label } from './label';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    type: 'email',
    placeholder: 'Email',
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-2">Email</Label>
      <Input {...args} id="email-2" />
      <p className="text-sm text-muted-foreground">请输入您的邮箱地址。</p>
    </div>
  ),
  args: {
    type: 'email',
    placeholder: 'Email',
  },
};

export const Disabled: Story = {
    args: {
        placeholder: '已禁用的输入框',
        disabled: true,
    },
};