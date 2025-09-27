import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';
import { Label } from './label';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
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
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: '在这里输入您的消息...',
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message-2">您的消息</Label>
      <Textarea {...args} id="message-2" />
      <p className="text-sm text-muted-foreground">
        您的消息将被发送给我们的团队。
      </p>
    </div>
  ),
  args: {
    placeholder: '请在此输入您的消息...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: '已禁用的文本域',
    disabled: true,
  },
};