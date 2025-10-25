/**
 * YYC³ 团队协作评论系统
 * 提供代码行级评论与讨论功能
 */

interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
}

interface CommentReply {
  id: string;
  author: CommentAuthor;
  content: string;
  timestamp: number;
  reactions?: { [key: string]: number };
}

export interface Comment {
  id: string;
  targetType: 'code' | 'node' | 'canvas';
  targetId: string;
  lineNumber?: number;
  position?: { x: number; y: number };
  author: CommentAuthor;
  content: string;
  timestamp: number;
  resolved: boolean;
  replies: CommentReply[];
  reactions?: { [key: string]: number };
}

export class CommentSystem {
  private projectId: string;
  private comments: Map<string, Comment> = new Map();
  private currentUser: CommentAuthor;

  constructor(projectId: string, currentUser: CommentAuthor) {
    this.projectId = projectId;
    this.currentUser = currentUser;
  }

  // 创建评论
  async createComment(
    targetType: 'code' | 'node' | 'canvas',
    targetId: string,
    content: string,
    lineNumber?: number,
    position?: { x: number; y: number }
  ): Promise<Comment | null> {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const commentId = this.generateCommentId();
      const comment: Comment = {
        id: commentId,
        targetType,
        targetId,
        lineNumber,
        position,
        author: this.currentUser,
        content,
        timestamp: Date.now(),
        resolved: false,
        replies: [],
        reactions: {}
      };
      
      this.comments.set(commentId, comment);
      return comment;
    } catch (error) {
      console.error('Failed to create comment:', error);
      return null;
    }
  }

  // 获取特定目标的评论
  async getCommentsForTarget(
    targetType: 'code' | 'node' | 'canvas',
    targetId: string,
    includeResolved: boolean = false
  ): Promise<Comment[]> {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const comments = Array.from(this.comments.values())
        .filter(comment => 
          comment.targetType === targetType && 
          comment.targetId === targetId && 
          (includeResolved || !comment.resolved)
        )
        .sort((a, b) => a.timestamp - b.timestamp);
      
      return comments;
    } catch (error) {
      console.error(`Failed to get comments for ${targetType}:${targetId}:`, error);
      return [];
    }
  }

  // 获取代码行的评论
  async getCommentsForCodeLine(
    codeId: string,
    lineNumber: number,
    includeResolved: boolean = false
  ): Promise<Comment[]> {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const comments = Array.from(this.comments.values())
        .filter(comment => 
          comment.targetType === 'code' && 
          comment.targetId === codeId && 
          comment.lineNumber === lineNumber && 
          (includeResolved || !comment.resolved)
        )
        .sort((a, b) => a.timestamp - b.timestamp);
      
      return comments;
    } catch (error) {
      console.error(`Failed to get comments for code ${codeId} line ${lineNumber}:`, error);
      return [];
    }
  }

  // 添加回复
  async addReply(commentId: string, content: string): Promise<CommentReply | null> {
    try {
      const comment = this.comments.get(commentId);
      if (!comment) {
        throw new Error(`Comment ${commentId} not found`);
      }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const reply: CommentReply = {
        id: this.generateReplyId(),
        author: this.currentUser,
        content,
        timestamp: Date.now(),
        reactions: {}
      };
      
      comment.replies.push(reply);
      return reply;
    } catch (error) {
      console.error(`Failed to add reply to comment ${commentId}:`, error);
      return null;
    }
  }

  // 解析评论
  async resolveComment(commentId: string, resolved: boolean = true): Promise<boolean> {
    try {
      const comment = this.comments.get(commentId);
      if (!comment) {
        throw new Error(`Comment ${commentId} not found`);
      }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 200));
      
      comment.resolved = resolved;
      return true;
    } catch (error) {
      console.error(`Failed to resolve comment ${commentId}:`, error);
      return false;
    }
  }

  // 删除评论
  async deleteComment(commentId: string): Promise<boolean> {
    try {
      const comment = this.comments.get(commentId);
      if (!comment) {
        throw new Error(`Comment ${commentId} not found`);
      }
      
      // 检查是否有权限删除评论
      if (comment.author.id !== this.currentUser.id && this.currentUser.role !== 'admin') {
        throw new Error('You do not have permission to delete this comment');
      }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 200));
      
      this.comments.delete(commentId);
      return true;
    } catch (error) {
      console.error(`Failed to delete comment ${commentId}:`, error);
      return false;
    }
  }

  // 删除回复
  async deleteReply(commentId: string, replyId: string): Promise<boolean> {
    try {
      const comment = this.comments.get(commentId);
      if (!comment) {
        throw new Error(`Comment ${commentId} not found`);
      }
      
      const replyIndex = comment.replies.findIndex(r => r.id === replyId);
      if (replyIndex === -1) {
        throw new Error(`Reply ${replyId} not found`);
      }
      
      const reply = comment.replies[replyIndex];
      
      // 检查是否有权限删除回复
      if (reply.author.id !== this.currentUser.id && this.currentUser.role !== 'admin') {
        throw new Error('You do not have permission to delete this reply');
      }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 200));
      
      comment.replies.splice(replyIndex, 1);
      return true;
    } catch (error) {
      console.error(`Failed to delete reply ${replyId} from comment ${commentId}:`, error);
      return false;
    }
  }

  // 添加反应
  async addReaction(commentId: string, reactionType: string): Promise<boolean> {
    try {
      const comment = this.comments.get(commentId);
      if (!comment) {
        throw new Error(`Comment ${commentId} not found`);
      }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 150));
      
      if (!comment.reactions) {
        comment.reactions = {};
      }
      
      comment.reactions[reactionType] = (comment.reactions[reactionType] || 0) + 1;
      return true;
    } catch (error) {
      console.error(`Failed to add reaction to comment ${commentId}:`, error);
      return false;
    }
  }

  // 为回复添加反应
  async addReplyReaction(commentId: string, replyId: string, reactionType: string): Promise<boolean> {
    try {
      const comment = this.comments.get(commentId);
      if (!comment) {
        throw new Error(`Comment ${commentId} not found`);
      }
      
      const reply = comment.replies.find(r => r.id === replyId);
      if (!reply) {
        throw new Error(`Reply ${replyId} not found`);
      }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 150));
      
      if (!reply.reactions) {
        reply.reactions = {};
      }
      
      reply.reactions[reactionType] = (reply.reactions[reactionType] || 0) + 1;
      return true;
    } catch (error) {
      console.error(`Failed to add reaction to reply ${replyId} in comment ${commentId}:`, error);
      return false;
    }
  }

  // 生成评论ID
  private generateCommentId(): string {
    return 'comment-' + Math.random().toString(36).substring(2, 10);
  }

  // 生成回复ID
  private generateReplyId(): string {
    return 'reply-' + Math.random().toString(36).substring(2, 10);
  }
}

export default CommentSystem;