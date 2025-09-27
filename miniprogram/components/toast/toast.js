Component({
  properties: {
    open: {
      type: Boolean,
      value: false
    },
    content: {
      type: String,
      value: ''
    }
  },
  methods: {
    closeToast() {
      this.setData({ open: false });
    },
    updateContent(newContent) {
      this.setData({ content: newContent });
    }
  }
});
