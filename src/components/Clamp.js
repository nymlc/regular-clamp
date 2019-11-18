import {
    addListener,
    removeListener
} from 'resize-detector'
const UPDATE_TRIGGERS = ['maxLines', 'maxHeight', 'ellipsis', 'isClamped']
const INIT_TRIGGERS = ['tag', 'text', 'autoresize']

const Clamp = {
    name: 'regular-clamp',
    data: {
        offset: null,
        text: '',
        ellipsis: '...',
        localExpanded: false,
        realLines: 0
    },
    computed: {
        clampedText(data) {
            return data.text.slice(0, data.offset) + data.ellipsis
        },
        isClamped(data) {
            if (!data.text) {
                return false
            }
            return data.offset !== data.text.length
        },
        realText(data) {
            return this.$get('isClamped') ? this.$get('clampedText') : data.text
        },
        realMaxHeight(data) {
            if (data.localExpanded) {
                return null
            }
            let {
                maxHeight
            } = data
            if (!maxHeight) {
                return null
            }
            return typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
        }
    },
    config() {
        this.data.text = this.getText()
        this.data.maxLines = +this.data.maxLines || 0
        this.data.localExpanded = !!this.data.expanded
        this.$watch('expanded', (val) => {
            this.data.localExpanded = val
            this.$update()
        })
        this.$watch('localExpanded', (val) => {
            if (val) {
                this.clampAt(this.data.text.length)
            } else {
                this.update()
            }
            if (this.data.expanded !== val) {
                this.$emit('expanded', val)
            }
            this.$update()
        })
        this.$update()
    },
    init() {
        setTimeout(() => {
            this.mounted()
        }, 0)
    },
    destroy() {
        this.cleanUp()
    },
    mounted() {
        this.initComp()
        INIT_TRIGGERS.forEach(prop => {
            this.$watch(prop, this.initComp)
        })

        UPDATE_TRIGGERS.forEach(prop => {
            this.$watch(prop, this.update)
        })
        this.$watch(() => {
            return this.$refs.content
        }, (nVal) => {
            this.data.realLines = nVal.getClientRects().length
            this.$update()
        }, {
            deep: true,
            init: true
        })
    },
    initComp() {
        if (!this.data.text) {
            return
        }
        this.data.offset = this.data.text.length

        this.cleanUp()
        if (this.data.autoresize) {
            let resizeCallback = () => {
                this.update()
            }
            addListener(this.$refs.clamp, resizeCallback)
            this.unregisterResizeCallback = () => {
                removeListener(this.$refs.clamp, resizeCallback)
            }
        }
        this.update()
    },
    update() {
        this.data.realLines = this.getLines()
        this.$update()
        if (this.data.localExpanded) {
            return
        }
        this.applyChange()
        if (this.isOverflow() || this.$get('isClamped')) {
            this.search()
        }
    },
    toggle() {
        this.data.localExpanded = !this.data.localExpanded
        this.$update()
    },
    getLines() {
        return this.$refs.content.getClientRects().length
    },
    isOverflow() {
        if (!this.data.maxLines && !this.data.maxHeight) {
            return false
        }

        if (this.data.maxLines) {
            if (this.getLines() > this.data.maxLines) {
                return true
            }
        }

        if (this.data.maxHeight) {
            if (this.$el.scrollHeight > this.$el.offsetHeight) {
                return true
            }
        }
        return false
    },
    getText() {
        let [content] = (this._body.ast || []).filter(
            node => node.type === 'text'
        )
        return content ? content.text : ''
    },
    moveEdge(steps) {
        this.clampAt(this.data.offset + steps)
    },
    clampAt(offset) {
        this.data.offset = offset
        this.$update()
        this.applyChange()
    },
    applyChange() {
        this.$refs.text.textContent = this.$get('realText')
    },
    stepToFit() {
        this.fill()
        this.clamp()
    },
    fill() {
        while (
            (!this.isOverflow() || this.getLines() < 2) &&
            this.data.offset < this.data.text.length
        ) {
            this.moveEdge(1)
        }
    },
    clamp() {
        while (this.isOverflow() && this.getLines() > 1 && this.data.offset > 0) {
            this.moveEdge(-1)
        }
    },
    search(...range) {
        let [from = 0, to = this.data.offset] = range
        if (to - from <= 3) {
            this.stepToFit()
            return
        }
        let target = Math.floor((to + from) / 2)
        this.clampAt(target)
        if (this.isOverflow()) {
            this.search(from, target)
        } else {
            this.search(target, to)
        }
    },
    cleanUp() {
        if (this.unregisterResizeCallback) {
            this.unregisterResizeCallback()
        }
    },
    template: `<div ref="clamp" style="max-height: {realMaxHeight}; overflow: hidden;">
                    <span ref="content" style="box-shadow: transparent 0 0;">{#if before}{#include before}{/if}<span ref="text" aria-label="{text.trim()}">{realText}</span>{#if after}{#include after}{/if}</span>
                </div>`
}

if (typeof window !== 'undefined' && window.Regular) {
    window.Regular.extend(Clamp)
}

export default Clamp