# 智能学科问答与导师建议接口文档

## POST /edu-qa

- 语音提问：multipart/form-data，file字段为音频文件
- 文本提问：application/json，字段如下

### 请求参数

| 参数     | 类型   | 说明             |
| -------- | ------ | ---------------- |
| question | string | 用户问题（文本） |
| userName | string | 用户昵称         |
| file     | file   | 用户语音（可选） |

### 返回参数

| 参数      | 类型   | 说明            |
| --------- | ------ | --------------- |
| answer    | string | 智能体答复      |
| mood      | string | 情感标签        |
| voiceUrl  | string | 语音合成文件URL |
| mentorTip | string | 导师建议        |

### 示例返回

```json
{
  "answer": "你提出的问题属于七年级数学的函数部分，解题思路如下...",
  "mood": "encourage",
  "voiceUrl": "https://your-cdn/voice/answer.mp3",
  "mentorTip": "建议你多做相关练习，遇到难题可以随时提问。加油！"
}
```
