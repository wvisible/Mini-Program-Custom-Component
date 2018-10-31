Component({
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },
  data: {
    activeIndex: 0
  },
  ready: function() {
    var that = this;
    const query = wx.createSelectorQuery().in(this);
    query.select(".title").boundingClientRect();
    query.exec(function(res) {
      that.setData({
        sliderLeft:
          (wx.getSystemInfoSync().windowWidth / 4 - res[0].width) / 2,
        sliderWidth: res[0].width
      });
    });
  },
  methods: {
    _tabClick: function(e) {
      var that = this;
      let index = e.currentTarget.dataset.index;
      this.setData({
        activeIndex: index
      })
      const query = wx.createSelectorQuery().in(this);
      query.select(".title.on").boundingClientRect();
      query.exec(function(res) {
        that.setData({
          sliderOffset: e.currentTarget.offsetLeft, 
          sliderLeft:
          (wx.getSystemInfoSync().windowWidth / 4 - res[0].width) / 2,
          sliderWidth: res[0].width,
          scrollLeft:
          res[0].width + (index - 2) * (wx.getSystemInfoSync().windowWidth / 4)
        });
      });
      this.triggerEvent("selecttab", { index: index });
    }
  }
});
