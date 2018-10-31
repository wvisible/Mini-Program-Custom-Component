// pages/components/foldtext/foldtext.js
Component({
  properties: {
    title: {
      type: String,
      value: ""
    },
    desc: {
      type: String,
      value: ""
    }
  },
  data: {
    isVisibleText: "hidden",
    isShowFold: false
  },
  ready: function() {
    var that = this;
    var query = wx.createSelectorQuery().in(this);
    query.select(".item").boundingClientRect(function(rect) {
      if (rect.height > 45) {
        that.setData({
          isVisibleText: "visible",
          maxLine: 2,
          isShowFold: true,
          foldStatus: "展开",
          foldSrc: "../../../image/icon_fold.png"
        });
      }
    });
    query.exec();
  },
  methods: {
    _foldClick(event) {
      if (this.data.foldStatus === "展开") {
        this.setData({
          foldStatus: "收起",
          foldSrc: "../../../image/icon_unfold.png",
          maxLine: 1000
        });
      } else {
        this.setData({
          foldStatus: "展开",
          foldSrc: "../../../image/icon_fold.png",
          maxLine: 2
        });
      }
    }
  }
});
