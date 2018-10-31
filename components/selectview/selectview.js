Component({
  properties: {
    activeIndex: {
      type: Number,
      value: 0
    },
    tabTitles: {
      type: Array,
      value: []
    }
  },
  methods: {
    _itemClick(event) {
      let index = event.currentTarget.dataset.index;
      this.setData({
        activeIndex: index
      });
      this.triggerEvent("selecttab", { index: index });
    }
  }
});
