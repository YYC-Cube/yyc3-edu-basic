Page({
  data: {
    toastOpen: false,
    toastContent: '您好，有什么可以帮您？',
    commands: ['关闭提示', '显示详情', '延长显示', '复制内容']
  },
  onLoad() {
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onStop(this.handleVoiceStop.bind(this));
  },
  startRecord() {
    this.recorderManager.start({ format: 'mp3' });
  },
  stopRecord() {
    this.recorderManager.stop();
  },
  handleVoiceStop(res) {
    wx.uploadFile({
      url: 'https://your-backend-api/voice', // 替换为你的后端语音识别接口
      filePath: res.tempFilePath,
      name: 'file',
      success: (result) => {
        // 假设后端返回 { command: '关闭提示' }
        const command = JSON.parse(result.data).command;
        if (this.data.commands.includes(command)) {
          if (command === '关闭提示') this.setData({ toastOpen: false });
          if (command === '显示详情') this.setData({ toastContent: '这里是详细信息。', toastOpen: true });
          if (command === '延长显示') {
            this.setData({ toastContent: '已为您延长显示时间。', toastOpen: true });
            // 可设置定时关闭
          }
          if (command === '复制内容') {
            wx.setClipboardData({ data: this.data.toastContent });
            this.setData({ toastContent: '内容已复制。', toastOpen: true });
          }
        }
      }
    });
  }
});
