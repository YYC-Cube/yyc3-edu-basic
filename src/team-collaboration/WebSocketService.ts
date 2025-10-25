/**
 * YYC³ 团队协作 WebSocket 服务
 * 提供实时协作编辑功能的底层支持
 */

interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  cursor?: { x: number; y: number };
}

interface CollaborationEvent {
  type: string;
  userId: string;
  timestamp: number;
  data: Record<string, string | number | boolean | object | null | undefined>;
}

interface RoomState {
  id: string;
  name: string;
  users: Map<string, CollaborationUser>;
  canvasData: Record<string, string | number | boolean | object | null | undefined>[];
  history: CollaborationEvent[];
  maxHistoryLength: number;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private rooms: Map<string, RoomState> = new Map();
  private userId: string;
  private currentRoom: string | null = null;
  private eventHandlers: Map<string, ((data: Record<string, string | number | boolean | object | null | undefined>) => void)[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 2000;

  constructor(userId: string) {
    this.userId = userId;
  }

  // 连接到WebSocket服务器
  connect(serverUrl: string = 'wss://api.yyc3.ai/collaboration'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(serverUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connection established');
          this.reconnectAttempts = 0;
          this.send('join', { userId: this.userId });
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onclose = () => {
          console.log('WebSocket connection closed');
          this.handleReconnect(serverUrl);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  // 处理重连逻辑
  private handleReconnect(serverUrl: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect(serverUrl).catch(() => {
          // 重连失败，继续尝试
        });
      }, this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1)); // 指数退避
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('connection-lost', {});
    }
  }

  // 创建协作房间
  createRoom(roomName: string): void {
    this.send('create-room', { name: roomName });
  }

  // 加入协作房间
  joinRoom(roomId: string): void {
    this.currentRoom = roomId;
    this.send('join-room', { roomId });
  }

  // 离开当前房间
  leaveRoom(): void {
    if (this.currentRoom) {
      this.send('leave-room', { roomId: this.currentRoom });
      this.currentRoom = null;
    }
  }

  // 发送Canvas数据更新
  updateCanvasData(canvasData: Record<string, string | number | boolean | object | null | undefined>[]): void {
    if (this.currentRoom) {
      this.send('canvas-update', { roomId: this.currentRoom, data: canvasData });
    }
  }

  // 发送光标位置更新
  updateCursorPosition(x: number, y: number): void {
    if (this.currentRoom) {
      this.send('cursor-update', { roomId: this.currentRoom, position: { x, y } });
    }
  }

  // 发送协作事件
  send(eventType: string, data: Record<string, string | number | boolean | object | null | undefined>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const event = {
        type: eventType,
        userId: this.userId,
        timestamp: Date.now(),
        data
      };
      
      this.ws.send(JSON.stringify(event));
    } else {
      console.warn('WebSocket not connected, cannot send event');
    }
  }

  // 处理接收到的消息
  private handleMessage(message: string): void {
    try {
      const event: CollaborationEvent = JSON.parse(message);
      this.emit(event.type, event.data);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  // 注册事件处理器
  on(eventType: string, handler: (data: Record<string, string | number | boolean | object | null | undefined>) => void): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)?.push(handler);
  }

  // 移除事件处理器
  off(eventType: string, handler: (data: Record<string, string | number | boolean | object | null | undefined>) => void): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // 触发事件
  private emit(eventType: string, data: Record<string, string | number | boolean | object | null | undefined>): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      });
    }
  }

  // 断开连接
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.currentRoom = null;
  }

  // 获取当前连接状态
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  // 获取当前房间信息
  getCurrentRoom(): string | null {
    return this.currentRoom;
  }
}

export default WebSocketService;