Page({
  data: {
    toastOpen: false,
    toastContent: '欢迎使用智能学科辅导，请说出或输入你的问题。',
    userName: '同学',
    mood: 'neutral',
    voiceUrl: '',
    mentorTip: '',
    textInput: ''
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
      url: 'https://your-backend-api/edu-qa', // 后端需集成智能问答与导师建议服务
      filePath: res.tempFilePath,
      name: 'file',
      formData: { userName: this.data.userName },
      success: (result) => {
        const { answer, mood, voiceUrl, mentorTip } = JSON.parse(result.data);
        this.setData({
          toastContent: answer,
          toastOpen: true,
          mood: mood || 'neutral',
          voiceUrl: voiceUrl || '',
          mentorTip: mentorTip || ''
        });
      }
    });
  },
  onTextInput(e) {
    this.setData({ textInput: e.detail.value });
  },
  submitText() {
    wx.request({
      url: 'https://your-backend-api/edu-qa',
      method: 'POST',
      data: {
        question: this.data.textInput,
        userName: this.data.userName
      },
      success: (result) => {
        const { answer, mood, voiceUrl, mentorTip } = result.data;
        this.setData({
          toastContent: answer,
          toastOpen: true,
          mood: mood || 'neutral',
          voiceUrl: voiceUrl || '',
          mentorTip: mentorTip || ''
        });
      }
    });
  }
});
