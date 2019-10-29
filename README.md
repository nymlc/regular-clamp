# <regular-clamp>
JS实现多文本截断功能

#props
+ `autoresize（Boolean）`：根据内容区域变化来自适应，默认`false`
+ `max-lines（Number）`：可显示的最大行数
+ `max-height（Number|String）`：内容区域最大高度
+ `ellipsis（String）`：截断末尾省略号字符，默认`...`
+ `expanded（Boolean）`：默认是否展开文本，默认`false`

#结构复用
+ `before（String）`：`HTML`字符串，设置显示在内容区域之前的内容
+ `after（String）`：`HTML`字符串，设置显示在内容区域之后的内容

#Event
+ `toggle`：切换是否展开内容，配套使用的俩个变量为`localExpanded`（是否展开）、`isClamped`（是否截断）