# Mini-Program-Custom-Component
自定义小程序组件
一般在多个地方会使用到的 view，我们都可以写成一个组件，以方便复用，小程序自定义组件的相关内容我们可以在这里[自定义组件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html)找到，下面我通过自己定义的几个组件讲述小程序自定义组件开发的一般步骤。
#### 效果图
![](https://github.com/wvisible/Mini-Program-Custom-Component/blob/master/image/demonstrate.gif)
#### 一、选择 view

我们看上图第一个 view 可以看出，很简单的选择器，选择哪个view，哪一个view就改变背景色以及字体颜色，这种实现起来很简单，我先通过一个简单的 view 来说明一下自定义组件的步骤。我的思路就是用列表渲染来做，当需要使用的时候传入相应的数据，直接根据数据渲染成相应的 view 块。布局很简单，我们先看 wxml:

```html
<view class="tab-title">
    <text wx:for="{{tabTitles}}" data-index="{{index}}" class="title {{activeIndex === index ? 'selected' : ''}}" bindtap="_itemClick">{{item}}</text>
</view>
```

布局很简单，就是一个普通的列表渲染，然后通过选择的小标 index 来改变对用的 css，下面看 wxss:

```css
.tab-title {
  margin-top: 42rpx;
  margin-bottom: 40rpx;
  text-align: center;
}
.title {
  border: 2rpx solid #dddddd;
  font-size: 28rpx;
  color: #333333;
  display: inline-block;
  width: 160rpx;
  height: 48rpx;
}
.title.selected {
  color: #ffffff;
  background: #e61e2b;
}

```

如果需要在左右两端设置一个圆角，就需要使用伪类选择器，但是在组件里使用不行，需要在使用的界面 wxss 里面书写相应的 css, 组件的 class 为 `tab-title` ，如下所示:

```css
.tab-title:first-child {
  border-radius: 8rpx 0 0 8rpx;
}
.tab-title:last-child {
  border-radius: 0 8rpx 8rpx 0;
}
```

然后需要我们在 json 文件里面写上:

```json
{
    "component": true
}
```

最后就是我们在 js 里面写上初始数据，需要传递的数据，以及定义的点击事件等

```javascript
Component({
  properties: {//定义组件的对外属性
    activeIndex: {
      type: Number,
      value: 0
    },
    tabTitles: {
      type: Array,
      value: []
    }
  },
  data: {//组件的内部数据
  },
  methods: {//组件的方法，包括事件响应函数和任意的自定义方法
    _itemClick(event) {
      let index = event.currentTarget.dataset.index;
      this.setData({
        activeIndex: index
      });
      this.triggerEvent("selecttab", { index: index });//当点击选择某个view时对外暴露一个方法，类似于接口回调
    }
  }
});
```

上面的方法属性名可以在官方文档这里[Component构造器](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)找到，接下来我们看看怎么使用。首先我们需要在使用的 json 里面加上路径，比如我们这个组件:

```json
"usingComponents": {
    "selectview": "../components/selectview/selectview"
  }
```

然后直接在使用的组件里面写上:

```wxml
<selectview class="tab-title" tabTitles="{{tabs}}" activeIndex="{{1}}" bindselecttab="tabClick"></selectview>
```

点击的时候我们需要知道点击的是哪一个view，我们就是用这个 `bind` 的方法:

```javascript
 tabClick(event) {
    console.log(event.detail.index);//这个参数就是传递过来的下标
 }
```

一个简答的自定义组件就完成了，总体来说还是相对简单

#### 二、TabLayout

一个滑动的选项页卡，用的地方蛮多的，不过也分几种类型，超过屏幕和不超过屏幕宽度的，这里介绍的是超过屏幕宽度的一种，我们主要做到选择相应的 tab 时候下划线跟到滑动并且相应的 tab 滑倒屏幕的正中位置，布局这些直接看代码就好了，我只说几个我遇到的问题:

1. 下划线有两种形式，充满每一个 tab，还有一种就是刚好在文字的下方，那么我们就要计算文字的宽度，刚开始使用的是`wx.createCanvasContext`计算的，参考代码是[计算文字宽度](https://developers.weixin.qq.com/community/develop/doc/0000aabe9b0960eefe7617bc756400)，对于文字计算的还是正确的，可是对有括号的计算就不准确，最后在官网找到 `SelectorQuery.in(Component component)`直接计算文字宽度，带括号也是准确的

   ```javascript
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
   ```

   这里不能使用`const query = wx.createSelectorQuery()`，因为组件必须使用上面带`in`的，这里屏幕宽度除以4是每个tab的宽度，减去文字宽度的一般刚好是刚开始下划线的一个偏移值。

2. 就是计算`scroll-view`的一个滑动值，我们这里采用如下计算：

   ```
   wx.getSystemInfoSync().windowWidth / 8 + (index - 2) * (wx.getSystemInfoSync().windowWidth / 4)
   ```

   这里的下标减去2意思就是点击第三个开始滑动，从右向左也能向左滑动，因为屏幕宽度下是4个tab，那么点击第三个的时候加上一个tab的宽度在加上自身的宽度一半大约在中间。

#### 三、Spinner

下拉列表就是一个点击输入框的时候弹出选项然后选择列表值，感觉这个比较简单，没有什么好说的，就是一个注意点如果需要弹出的弹窗覆盖在其它内容上面是需要使用z-index属性，具体看代码。

#### 四、Foldtext

点击阅读更多的功能，这里如果我们显示2行，超过2行就要展示展开，然后并显示收起，那么我们怎么判断是否超过2行呢？我们可以这样根绝每行的高度，比如我们每行高度22px，那么我们就可以这样判断：

```javascript
var that = this;
var query = wx.createSelectorQuery().in(this);
query.select(".item").boundingClientRect(function(rect) {
    if (rect.height > 45) {
        that.setData({
            isVisibleText: "visible",
            maxLine: 2,
            isShowFold: true,
            foldStatus: "展开",
            foldSrc: "../../../images/icon_fold.png"
        });
    }
});
query.exec();
```

我们先获取整个内容高度，然后判断高度是否超过了2行的高度，然后展示相应的展开与收起，我们必须动态的设置最大行数，因为最小的时候我们设置为一个定值，当展开的时候我们无法得知内容会占满多少行，我们可以设置一个较大的数值，比如1000，这样点击展开和收起就可以实现内容的展开和关闭，具体可以看代码。

#### 最后
初次入门，难免会有问题，如果遇到有任何问题或者写错的地方，欢迎指出和一起探讨！

### License
Wechat-Mini-Gank is licensed under the MIT license. See the LICENSE.txt file for more information.
