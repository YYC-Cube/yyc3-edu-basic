import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
import { Button } from './button';
import { Label } from './label';
import { Input } from './input';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>创建项目</CardTitle>
        <CardDescription>一键部署您的新项目。</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">项目名称</Label>
              <Input id="name" placeholder="您的项目名称" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>框架</Label>
              <p className="text-sm text-muted-foreground">Next.js</p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">取消</Button>
        <Button>部署</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
    args: {
        children: (
            <>
                <CardHeader>
                    <CardTitle>简单卡片</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>这是一个简单卡片的内容。</p>
                </CardContent>
            </>
        )
    },
    render: (args) => (
        <Card className="w-[350px]" {...args} />
    )
};
