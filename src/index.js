import Regular from 'regularjs'
import './components/Clamp'
const str = `Regular是什么
Regular 本身在网易公司内部稳定运行了超过4年(本节撰写于2018年), 支持了数十条产品线，可靠性是值得保证的。
Regular 是 MDV(数据驱动视图技术) 的一种实现， 它...
提供以下能力
数据绑定,局部刷新
深度的组件化能力
服务端渲染
单页系统：regular-state提供完整的单页系统解决方案，包括服务端渲染支持
编译到小程序: 感谢考拉团队精彩的 mpregular
拥有以下特性
语法灵活：自建DSL，表达能力不受HTML语法所限
基于脏检查：直接操作裸数据，没有 set/get 包装
良好的兼容性：支持 IE7+ 以及其他现代浏览器
渐进的视图层框架：无侵入性，可以配合任何框架和模块系统使用`
new Regular({
    template: `
        <regular-clamp on-expanded={this.updateExpanded($event)} tag="section" max-lines=3 ellipsis="..." after={after} before={before}>
            ${str}
        </regular-clamp>
    `,
    data: {
        after: `<span class="end tag" r-hide="!(localExpanded || isClamped)" on-click={this.toggle()}>
            {#if localExpanded}
                收起
            {#else}
                查看全部
            {/if}
        </span>`,
        before: '<span class="start tag">开始</span>'
    },
    updateExpanded: function (event) {
        console.log(event)
    }
}).$inject("#test")
new Regular({
    template: `
        <regular-clamp on-expanded={this.updateExpanded($event)} expanded autoresize max-lines=3 ellipsis="..." after={after} before={before}>
            ${str}
        </regular-clamp>
    `,
    data: {
        after: `<span class="end tag" r-hide="!(localExpanded || isClamped)" on-click={this.toggle()}>
            {#if localExpanded}
                收起
            {#else}
                查看全部
            {/if}
        </span>`,
        before: '<span class="start tag">开始</span>'
    },
    updateExpanded: function (event) {
        console.log(event)
    }
}).$inject("#resize")