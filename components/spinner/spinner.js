// pages/components/spinner/spinner.js
Component({
  properties: {
    selectData: {
      type: Array,
      value: []
    },
    selectText: {
      type: String,
      value: ""
    }
  },
  data: {
    selectTextColor: "#999999",
    show: false,
    isShowOther: false
  },
  methods: {
    getSelectText() {
      return this.data.selectText
    },
    _selectTap() {
      this.setData({
        show: !this.data.show
      });
    },
    _optionTap(event) {
      let index = event.currentTarget.dataset.index //获取点击的下拉列表的下标
      this.setData({
        selectText: this.data.selectData[index],
        selectTextColor: "#333333",
        show: !this.data.show,
        isShowOther: false
      });
      if(index === this.data.selectData.length - 1){
        this.setData({
          isShowOther: true
        });
      }
    }
  }
});
