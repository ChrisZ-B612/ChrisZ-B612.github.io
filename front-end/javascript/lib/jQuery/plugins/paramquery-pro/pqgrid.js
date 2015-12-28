/**
 * ParamQuery Pro
 *
 * Copyright (c) 2012-2015 Paramvir Dhindsa (http://paramquery.com)
 * Released under Evaluation license
 * http://paramquery.com/pro/license/evaluate
 *
 */
(function(k) {
    var h = k.paramquery = k.paramquery || {};
    k.paramquery.pqgrid = k.paramquery.pqgrid || {};
    h.xmlToArray = function(h, g) {
        var e = g.itemParent,
            c = g.itemNames,
            f = [];
        k(h).find(e).each(function(b, l) {
            var a = k(l),
                d = [];
            k(c).each(function(n, b) {
                d.push(a.find(b).text().replace(/\r|\n|\t/g, ""))
            });
            f.push(d)
        });
        return f
    };
    h.xmlToJson = function(h, g) {
        var e = g.itemParent,
            c = g.itemNames,
            f = [];
        k(h).find(e).each(function(b, l) {
            for (var a = k(l), d = {}, n = 0, N = c.length; n < N; n++) {
                var B = c[n];
                d[B] = a.find(B).text().replace(/\r|\n|\t/g, "")
            }
            f.push(d)
        });
        return f
    };
    h.tableToArray = function(h) {
        var g = [],
            e = [];
        h = k(h).children("tbody").children("tr");
        var c = h.length ? k(h[0]) : k(),
            f = 1 < h.length ? k(h[1]) : k();
        c.children("th,td").each(function(b, c) {
            var a = k(c),
                d = a.html(),
                a = a.width(),
                n = "left";
            if (f.length) var N = f.find("td:eq(" + b + ")").attr("align"),
                n = N ? N : n;
            g.push({
                title: d,
                width: a,
                dataType: "string",
                align: n,
                dataIndx: b
            })
        });
        h.each(function(b, c) {
            if (0 != b) {
                var a = [];
                k(c).children("td").each(function(d, n) {
                    a.push(k.trim(k(n).html()))
                });
                e.push(a)
            }
        });
        return {
            data: e,
            colModel: g
        }
    };
    h.formatCurrency = function(h) {
        if (isNaN(h)) return h;
        h = Math.round(100 * h) / 100;
        h += ""; - 1 == h.indexOf(".") ? h += ".00" : h.indexOf(".") + 2 == h.length && (h += "0");
        var g = h.length,
            e = h.substring(0, g - 3);
        h = h.substring(g - 3, g);
        for (var e = e.match(/\d/g).reverse(), g = [], c = 0; c < e.length; c++) 0 < c && 0 == c % 3 && g.push(","), g.push(e[c]);
        g = g.reverse();
        e = g.join("");
        return e + h
    };
    h.validation = {
        is: function(h, g) {
            if ("string" == h || !h) return !0;
            h = h.substring(0, 1).toUpperCase() + h.substring(1, h.length);
            return this["is" + h](g)
        },
        isFloat: function(h) {
            var g =
                parseFloat(h);
            return isNaN(g) || g != h ? !1 : !0
        },
        isInteger: function(h) {
            var g = parseInt(h);
            return isNaN(g) || g != h ? !1 : !0
        },
        isDate: function(h) {
            h = Date.parse(h);
            return isNaN(h) ? !1 : !0
        }
    }
})(jQuery);
(function(k) {
    var h = {
        options: {
            curPage: 0,
            totalPages: 0,
            totalRecords: 0,
            msg: "",
            rPPOptions: [10, 20, 30, 40, 50, 100],
            rPP: 20
        },
        _regional: {
            strDisplay: "Displaying {0} to {1} of {2} items.",
            strFirstPage: "First Page",
            strLastPage: "Last Page",
            strNextPage: "Next Page",
            strPage: "Page {0} of {1}",
            strPrevPage: "Previous Page",
            strRefresh: "Refresh",
            strRpp: "Records per page:{0}"
        }
    };
    k.extend(h.options, h._regional);
    h._create = function() {
        var h = this,
            g = this.options;
        this.element.addClass("pq-pager");
        this.first = k("<button type='button' title='" +
            g.strFirstPage + "'></button>", {}).appendTo(this.element).button({
            icons: {
                primary: "ui-icon-seek-first"
            },
            text: !1
        }).bind("click.paramquery", function(e) {
            1 < h.options.curPage && h._onChange(e, 1)
        });
        this.prev = k("<button type='button' title='" + g.strPrevPage + "'></button>").appendTo(this.element).button({
            icons: {
                primary: "ui-icon-seek-prev"
            },
            text: !1
        }).bind("click", function(e) {
            1 < h.options.curPage && h._onChange(e, h.options.curPage - 1)
        });
        k("<span class='pq-separator'></span>").appendTo(this.element);
        this.pageHolder = k("<span class='pq-page-placeholder'></span>").appendTo(this.element);
        k("<span class='pq-separator'></span>").appendTo(this.element);
        this.next = k("<button type='button' title='" + this.options.strNextPage + "'></button>").appendTo(this.element).button({
            icons: {
                primary: "ui-icon-seek-next"
            },
            text: !1
        }).bind("click", function(e) {
            h._onChange(e, h.options.curPage + 1)
        });
        this.last = k("<button type='button' title='" + this.options.strLastPage + "'></button>").appendTo(this.element).button({
            icons: {
                primary: "ui-icon-seek-end"
            },
            text: !1
        }).bind("click", function(e) {
            h._onChange(e, h.options.totalPages)
        });
        k("<span class='pq-separator'></span>").appendTo(this.element);
        this.rPPHolder = k("<span class='pq-page-placeholder'></span>").appendTo(this.element);
        this.$refresh = k("<button type='button' title='" + this.options.strRefresh + "'></button>").appendTo(this.element).button({
            icons: {
                primary: "ui-icon-refresh"
            },
            text: !1
        }).bind("click", function(e) {
            if (!1 === h._trigger("beforeRefresh", e)) return !1;
            h._trigger("refresh", e)
        });
        k("<span class='pq-separator'></span>").appendTo(this.element);
        this.$msg = k("<span class='pq-pager-msg'></span>").appendTo(this.element);
        this._refresh()
    };
    h._refreshPage = function() {
        var h = this;
        this.pageHolder.empty();
        for (var g = this.options, e = g.strPage.split(" "), c = [], f = 0, b = e.length; f < b; f++) {
            var l = e[f];
            "{0}" == l ? c.push("<input type='text' tabindex='0' class='ui-corner-all' />") : "{1}" == l ? c.push("<span class='total'></span>") : c.push("<span>", l, "</span>")
        }
        e = c.join("");
        e = k(e).appendTo(this.pageHolder);
        this.page = e.filter("input").bind("change", function(a) {
            var d = k(this),
                n = d.val();
            if (isNaN(n) || 1 > n) return d.val(g.curPage), !1;
            n = parseInt(n);
            if (n >
                g.totalPages || !1 === h._onChange(a, n)) return d.val(g.curPage), !1
        });
        this.$total = e.filter("span.total")
    };
    h._onChange = function(h, g) {
        if (!1 === this._trigger("beforeChange", h, {
                curPage: g
            }) || !1 === this._trigger("change", h, {
                curPage: g
            })) return !1;
        this.option({
            curPage: g
        })
    };
    h._refresh = function() {
        this._refreshPage();
        var h = this,
            g = this.options;
        this.first.attr("title", g.strFirstPage);
        this.prev.attr("title", g.strPrevPage);
        this.next.attr("title", g.strNextPage);
        this.last.attr("title", g.strLastPage);
        this.$refresh.attr("title",
            g.strRefresh);
        this.rPPHolder.empty();
        if (g.strRpp) {
            var e = g.rPPOptions,
                c = g.strRpp;
            if (-1 != c.indexOf("{0}")) {
                for (var f = ["<select class='ui-corner-all'>"], b = 0, l = e.length; b < l; b++) {
                    var a = e[b];
                    f.push('<option value="', a, '">', a, "</option>")
                }
                f.push("</select>");
                e = f.join("");
                c = c.replace("{0}", "</span>" + e);
                c = "<span>" + c + "<span class='pq-separator'></span>"
            } else c = "<span>" + c + "</span><span class='pq-separator'></span>";
            this.$rPP = k(c).appendTo(this.rPPHolder).filter("select").val(g.rPP).change(function(a) {
                var n =
                    k(this),
                    b = n.val();
                if (!1 === h._trigger("beforeChange", a, {
                        rPP: b
                    })) return n.val(h.options.rPP), !1;
                !1 !== h._trigger("change", a, {
                    rPP: b
                }) && (h.options.rPP = b)
            })
        }
        g.curPage >= g.totalPages ? (this.next.button({
            disabled: !0
        }), this.last.button({
            disabled: !0
        })) : (this.next.button({
            disabled: !1
        }), this.last.button({
            disabled: !1
        }));
        1 >= g.curPage ? (this.first.button({
            disabled: !0
        }), this.prev.button({
            disabled: !0
        })) : (this.first.button({
            disabled: !1
        }), this.prev.button({
            disabled: !1
        }));
        this.page.val(g.curPage);
        this.$total.text(g.totalPages);
        0 < this.options.totalRecords ? (c = g.rPP, e = g.curPage, f = g.totalRecords, b = e * c, b > f && (b = f), g = g.strDisplay, g = g.replace("{0}", (e - 1) * c + 1), g = g.replace("{1}", b), g = g.replace("{2}", f), this.$msg.html(g)) : this.$msg.html("")
    };
    h._destroy = function() {
        this.element.empty().removeClass("pq-pager").enableSelection()
    };
    h._setOption = function(h, g) {
        if ("curPage" == h || "totalPages" == h) g = parseInt(g);
        this._super.call(this, h, g)
    };
    h._setOptions = function() {
        this._super.apply(this, arguments);
        this._refresh()
    };
    k.widget("paramquery.pqPager",
        h);
    k.paramquery.pqPager.regional = {};
    k.paramquery.pqPager.regional.en = h._regional
})(jQuery);
(function(k) {
    k.widget("paramquery.pqScrollBar", {
        options: {
            length: 200,
            num_eles: 3,
            cur_pos: 0,
            ratio: 0,
            timeout: 350,
            pace: "optimum",
            direction: "vertical",
            theme: !1
        },
        _destroy: function() {
            k(document).off("." + this.eventNamespace);
            this.element.removeClass("pq-sb-vert pq-sb-vert-t pq-sb-vert-wt").enableSelection().removeClass("pq-sb-horiz pq-sb-horiz-t pq-sb-horiz-wt").unbind("click.pq-scrollbar").empty();
            this.element.removeData()
        },
        _create: function() {
            this._createLayout()
        },
        _createLayout: function() {
            var h = this,
                m = this.options,
                g = m.direction,
                e = this.eventNamespace,
                c = m.theme,
                f = this.element.empty();
            "vertical" == g ? (f.removeClass("pq-sb-vert-t pq-sb-vert-wt").addClass("pq-sb-vert"), c ? (f.addClass("pq-sb-vert-t"), f.html("<div class='top-btn pq-sb-btn ui-state-default ui-corner-top'><div class='ui-icon ui-icon-triangle-1-n'></div></div><div class='pq-sb-slider ui-corner-all ui-state-default'></div><div class='bottom-btn pq-sb-btn ui-state-default ui-corner-bottom'><div class='ui-icon ui-icon-triangle-1-s'></div></div>")) : (f.addClass("pq-sb-vert-wt"),
                f.html("<div class='top-btn pq-sb-btn'></div><div class='pq-sb-slider'><div class='vert-slider-top'></div><div class='vert-slider-bg'></div><div class='vert-slider-center'></div><div class='vert-slider-bg'></div><div class='vert-slider-bottom'></div></div><div class='bottom-btn pq-sb-btn'></div>"))) : (f.removeClass("pq-sb-horiz-t pq-sb-horiz-wt").addClass("pq-sb-horiz"), c ? (f.addClass("pq-sb-horiz-t"), f.html("<div class='left-btn pq-sb-btn ui-state-default ui-corner-left'><div class='ui-icon ui-icon-triangle-1-w'></div></div><div class='pq-sb-slider pq-sb-slider-h ui-state-default ui-corner-all'></div><div class='right-btn pq-sb-btn ui-state-default ui-corner-right'><div class='ui-icon ui-icon-triangle-1-e'></div></div>")) :
                (f.addClass("pq-sb-horiz-wt"), f.width(this.width), f.html("<div class='left-btn pq-sb-btn'></div><div class='pq-sb-slider pq-sb-slider-h'><span class='horiz-slider-left'></span><span class='horiz-slider-bg'></span><span class='horiz-slider-center'></span><span class='horiz-slider-bg'></span><span class='horiz-slider-right'></span></div><div class='right-btn pq-sb-btn'></div>")));
            f.disableSelection().unbind(".pq-scrollbar").on("mousedown.pq-scrollbar", function(b) {
                if (!m.disabled && !h.$slider.is(":hidden"))
                    if (k(document).off("." +
                            e).on("mouseup." + e, function(a) {
                            h._mouseup(a)
                        }), "vertical" == g) {
                        var c = b.pageY,
                            a = h.element.offset().top,
                            d = a + m.length,
                            n = h.$slider,
                            N = n.offset().top,
                            B = n.height(),
                            f = N + B;
                        c < N && c > a + 17 ? h.mousedownInterval = window.setInterval(function() {
                            c >= n.offset().top ? (window.clearInterval(h.mousedownInterval), h.mousedownInterval = null) : h._pageUp(b)
                        }, 0) : c > f && c < d - 17 && (h.mousedownInterval = window.setInterval(function() {
                            c <= n.offset().top + B ? (window.clearInterval(h.mousedownInterval), h.mousedownInterval = null) : h._pageDown(b)
                        }, 0))
                    } else {
                        var v =
                            b.pageX,
                            a = h.element.offset().left,
                            d = a + m.length,
                            N = h.$slider.offset().left,
                            f = N + h.$slider.width();
                        v < N && v > a + 17 ? (h.$slider.css("left", v - h.element.offset().left), h._updateCurPosAndTrigger(b)) : v > f && v < d - 17 && (h.$slider.css("left", v - h.element.offset().left - h.$slider.width()), h._updateCurPosAndTrigger(b))
                    }
            });
            f = this.$slider = k("div.pq-sb-slider", this.element);
            c && f.attr("tabindex", "0");
            this._bindSliderEvents(f);
            this.$top_btn = k("div.top-btn,div.left-btn", this.element).click(function(b) {
                if (!h.options.disabled) return h.decr_cur_pos(b),
                    b.preventDefault(), !1
            }).mousedown(function(b) {
                h.options.disabled || (h.mousedownTimeout = window.setTimeout(function() {
                    h.mousedownInterval = window.setInterval(function() {
                        h.decr_cur_pos(b)
                    }, 0)
                }, h.options.timeout))
            }).bind("mouseup mouseout", function(b) {
                h._mouseup(b)
            });
            this.$bottom_btn = k("div.bottom-btn,div.right-btn", this.element).click(function(b) {
                if (!h.options.disabled) return h.incr_cur_pos(b), b.preventDefault(), !1
            }).mousedown(function(b) {
                h.options.disabled || (h.mousedownTimeout = window.setTimeout(function() {
                    h.mousedownInterval =
                        window.setInterval(function() {
                            h.incr_cur_pos(b)
                        }, 0)
                }, h.options.timeout))
            }).bind("mouseup mouseout", function(b) {
                h._mouseup(b)
            });
            this.refresh()
        },
        _bindSliderEvents: function(h) {
            var m = this,
                g = "x";
            "vertical" == this.options.direction && (g = "y");
            h.draggable({
                axis: g,
                helper: function(e, c) {
                    m._setDragLimits();
                    return this
                },
                start: function(e) {
                    m.topWhileDrag = null;
                    m.dragging = !0
                },
                drag: function(e) {
                    m.dragging = !0;
                    var c = m.options.pace;
                    "optimum" == c ? m._setNormalPace(e) : "fast" == c && m._updateCurPosAndTrigger(e)
                },
                stop: function(e) {
                    "fast" !=
                    m.options.pace && m._updateCurPosAndTrigger(e);
                    m.dragging = !1;
                    m.refresh()
                }
            }).on("keydown.pq-scrollbar", function(e) {
                var c = e.keyCode,
                    f = m.options,
                    b = f.cur_pos,
                    l = f.ratio,
                    a = f.num_eles,
                    d = k.ui.keyCode;
                null == m.keydownTimeout && (m.keydownTimeout = window.setTimeout(function() {
                    c == d.DOWN || c == d.RIGHT ? m.incr_cur_pos(e) : c == d.UP || c == d.LEFT ? m.decr_cur_pos(e) : c == d.HOME ? f.steps ? 0 < b && (f.cur_pos = 0, m.updateSliderPos(), m.scroll(e)) : 0 < l && (f.ratio = 0, m.updateSliderPos(), m.drag(e)) : c == d.END ? f.steps ? b < a && (f.cur_pos = a, m.updateSliderPos(),
                        m.scroll(e)) : 1 > l && (f.ratio = 1, m.updateSliderPos(), m.drag(e)) : "vertical" == f.direction && (c == d.PAGE_DOWN ? m._pageDown(e) : c == d.PAGE_UP && m._pageUp(e));
                    m.keydownTimeout = null
                }, 0));
                if (c == d.DOWN || c == d.RIGHT || c == d.UP || c == d.LEFT || c == d.PAGE_DOWN || c == d.PAGE_UP || c == d.HOME || c == d.END) return e.preventDefault(), !1
            })
        },
        decr_cur_pos: function(h) {
            var k = this.options;
            if (k.steps) 0 < k.cur_pos && (k.cur_pos--, this.updateSliderPos(), this.scroll(h));
            else if (0 < k.ratio) {
                var g = k.ratio - 1 / (k.num_eles - 1);
                0 > g && (g = 0);
                k.ratio = g;
                this.updateSliderPos();
                this.drag(h)
            }
        },
        incr_cur_pos: function(h) {
            var k = this.options;
            if (k.steps) k.cur_pos < k.num_eles - 1 && k.cur_pos++, this.updateSliderPos(), this.scroll(h);
            else {
                if (1 > k.ratio) {
                    var g = k.ratio + 1 / (k.num_eles - 1);
                    1 < g && (g = 1);
                    k.ratio = g
                }
                this.updateSliderPos();
                this.drag(h)
            }
        },
        _mouseup: function(h) {
            this.options.disabled || (window.clearTimeout(this.mousedownTimeout), this.mousedownTimeout = null, window.clearInterval(this.mousedownInterval), this.mousedownInterval = null)
        },
        _setDragLimits: function() {
            var h = this.options;
            if ("vertical" ==
                h.direction) {
                var k = this.element.offset().top + 17,
                    h = k + h.length - 34 - this.slider_length;
                this.$slider.draggable("option", "containment", [0, k, 0, h])
            } else k = this.element.offset().left + 17, h = k + h.length - 34 - this.slider_length, this.$slider.draggable("option", "containment", [k, 0, h, 0])
        },
        refresh: function() {
            var h = this.options,
                k = this.element;
            1 >= h.num_eles ? k.css("display", "none") : (k.css("display", ""), this._validateCurPos(), this.dragging || (k["vertical" === h.direction ? "height" : "width"](h.length), this._setSliderBgLength(),
                4 > this.scroll_space || 1 >= h.num_eles ? this.$slider.css("display", "none") : this.$slider.css("display", "")), this.updateSliderPos())
        },
        _setSliderBgLength: function() {
            var h = this.options,
                m = h.theme,
                g = this.$slider,
                e = h.length,
                e = Math.round(((e - 34) * e / (40 * h.num_eles + e) - 14) / 2);
            1 > e && (e = 1);
            var c = 14 + 2 * e;
            this.scroll_space = h.length - 34 - c;
            if (c !== this.slider_length)
                if (this.slider_length = c, h = "vertical" === h.direction ? {
                        dim: "height",
                        cls: ".vert-slider-bg"
                    } : {
                        dim: "width",
                        cls: ".horiz-slider-bg"
                    }, m) g[h.dim](c - 2);
                else k(h.cls, this.element)[h.dim](e),
                    g[h.dim](c)
        },
        _updateCurPosAndTrigger: function(h, k) {
            var g = this.options,
                e = g.direction,
                c = this.$slider;
            null == k && (k = parseInt(c[0].style["vertical" === e ? "top" : "left"]));
            e = (k - 17) / (g.length - 34 - this.slider_length);
            if (g.steps) {
                if (e *= g.num_eles - 1, e = Math.round(e), g.cur_pos != e) {
                    if (this.dragging) {
                        if (null != this.topWhileDrag && (this.topWhileDrag < k && g.cur_pos > e || this.topWhileDrag > k && g.cur_pos < e)) return;
                        this.topWhileDrag = k
                    }
                    this.options.cur_pos = e;
                    this.scroll(h)
                }
            } else g.ratio = e, this.drag(h)
        },
        _setNormalPace: function(h) {
            this.timer &&
                (window.clearInterval(this.timer), this.timer = null);
            var k = this,
                g = this.options.direction;
            k.timer = window.setInterval(function() {
                var e = parseInt(k.$slider[0].style["vertical" === g ? "top" : "left"]);
                k.prev_top === e && (k._updateCurPosAndTrigger(h, e), window.clearInterval(k.timer), k.timer = null);
                k.prev_top = e
            }, 20)
        },
        _validateCurPos: function() {
            var h = this.options;
            h.cur_pos >= h.num_eles && (h.cur_pos = h.num_eles - 1);
            0 > h.cur_pos && (h.cur_pos = 0)
        },
        _updateSliderPosRatio: function() {
            var h = this.options,
                k = h.direction,
                g = h.ratio,
                e = this.$slider,
                h = h.length - 34 - this.slider_length;
            if (null == g) throw "ration N/A";
            g = g * h + 17;
            "vertical" == k ? e.css("top", g) : e.css("left", g)
        },
        _updateSliderPosCurPos: function() {
            var h = this.options,
                k = this.scroll_space * h.cur_pos / (h.num_eles - 1);
            "vertical" == h.direction ? this.$slider.css("top", 17 + k) : this.$slider.css("left", 17 + k)
        },
        updateSliderPos: function() {
            var h = this.options;
            if (void 0 === h.steps) throw "assert failed. steps N/A";
            h.steps ? this._updateSliderPosCurPos() : this._updateSliderPosRatio()
        },
        scroll: function(h) {
            var k = this.options;
            this._trigger("scroll", h, {
                cur_pos: k.cur_pos,
                num_eles: k.num_eles
            })
        },
        drag: function(h) {
            this._trigger("drag", h, {
                ratio: this.options.ratio
            })
        },
        _pageDown: function(h) {
            this._trigger("pageDown", h, null)
        },
        _pageUp: function(h) {
            this._trigger("pageUp", h, null)
        },
        _setOption: function(h, k) {
            "disabled" == h ? (this._super(h, k), !0 == k ? this.$slider.draggable("disable") : this.$slider.draggable("enable")) : "theme" == h ? (this._super(h, k), this._createLayout()) : "ratio" == h ? 0 <= k && 1 >= k && this._super(h, k) : this._super(h, k)
        },
        _setOptions: function() {
            this._super.apply(this,
                arguments);
            this.refresh()
        }
    })
})(jQuery);
(function(k) {
    k.paramquery = k.paramquery || {};
    k.paramquery.onResize = function(h, m) {
        var g = k(h);
        "static" === g.css("position") && g.css("position", "relative");
        var e = k('<iframe type="text/html" src="about:blank" class="pq-resize-iframe" style="display:block;width:100%;height:100%;position:absolute;top:0;left:0;z-index:-1;overflow: hidden; pointer-events: none;" />').appendTo(g);
        e[0].data = "about:blank";
        e.css("opacity", "0");
        for (var c = 0; c < g.length; c++) k(e[c].contentWindow).on("resize", function(c) {
            m()
        })
    }
})(jQuery);
(function(k) {
    var h = function() {};
    h.prototype.belongs = function(a) {
        if (a.target == this.that.element[0]) return !0
    };
    k.paramquery.cClass = h;
    var m = function(a) {
        this.that = a;
        this.hidearrHS1 = [];
        this.options = a.options;
        this.offset = null
    };
    k.paramquery.cGenerateView = m;
    h = m.prototype;
    h.generateView = function(a) {
        var d = this.that,
            n = d.options,
            b = n.freezeCols,
            c = "flex" === n.width,
            f = "flex" === n.height,
            e = d.colModel,
            g, h, x = d.initH,
            p = d.finalH,
            q = n.groupModel,
            t = d.pqpanes;
        if (a) {
            var m = this._generateTables(null, null, a),
                q = a.$cont;
            q.empty();
            t.v ? q.append(["<div class='pq-grid-cont-inner'>", m, "</div><div class='pq-grid-cont-inner'>", m, "</div>"].join("")) : q.append("<div class='pq-grid-cont-inner'>" + m + "</div>");
            var y = q.children("div"),
                f = y.children("table"),
                m = d.iRefresh,
                c = c ? "" : m.getEContWd(),
                m = f[0].scrollHeight - 1;
            q.height(m);
            if (t.v) {
                var t = k(y[0]),
                    q = k(y[1]),
                    y = k(f[1]),
                    u = l.call(d, -1, b),
                    b = l.call(d, b, x);
                t.css({
                    width: u,
                    zIndex: 1
                });
                q.css({
                    left: u - 1,
                    width: c - u,
                    height: m
                });
                y.css({
                    left: -1 * (b + u)
                })
            } else y.css({
                width: c,
                height: m
            });
            d.tables || (d.tables = []);
            b = -1;
            for (t = 0; t < d.tables.length; t++) d.tables[t].cont == a.$cont[0] && (b = t); - 1 == b ? d.tables.push({
                $tbl: f,
                cont: a.$cont[0]
            }) : d.tables[b].$tbl = f
        } else {
            g = d.initV;
            h = d.finalV;
            var A = q ? d.dataGM : d.pdata,
                q = d.$cont;
            null != n.editModel.indices && d.blurEditor({
                force: !0
            });
            m = this._generateTables(g, h, a);
            q.empty();
            0 === d.totalVisibleRows ? q.append("<div class='pq-grid-cont-inner pq-grid-norows' >" + n.strNoRows + "</div>") : (b = f || c ? "style='position:relative;'" : "", q[0].innerHTML = t.h && t.v ? ["<div class='pq-grid-cont-inner'>", m, "</div><div class='pq-grid-cont-inner'>",
                m, "</div><div class='pq-grid-cont-inner'>", m, "</div><div class='pq-grid-cont-inner'>", m, "</div>"
            ].join("") : t.v ? ["<div class='pq-grid-cont-inner' ", b, " >", m, "</div><div class='pq-grid-cont-inner' >", m, "</div>"].join("") : t.h ? ["<div class='pq-grid-cont-inner' style='position:static;' >", m, "</div><div class='pq-grid-cont-inner' style='position:static;' >", m, "</div>"].join("") : ["<div class='pq-grid-cont-inner' ", b, " >", m, "</div>"].join(""));
            d.$tbl = q.children("div").children("table");
            if (n.scrollModel.flexContent &&
                d.$tbl[0]) k.paramquery.onResize(d.$tbl[0], function() {
                var a = d.iRefresh;
                a.ignoreTResize || (a.refreshScrollbars(), d.iGenerateView.setPanes(), d._saveDims(), d.iMouseSelection.syncScrollBarVert(), "flex" == n.height && a.setContAndGridHeightFromTable(), "flex" == n.width && a.setContAndGridWidthFromTable(), a._refreshFrozenLine())
            });
            this.setPanes();
            this.setPaneEvents()
        }
        a || d._trigger("refresh", null, {
            dataModel: n.dataModel,
            colModel: e,
            pageData: A,
            initV: g,
            finalV: h,
            initH: x,
            finalH: p
        });
        d._saveDims();
        this.scrollView()
    };
    h.scrollView =
        function() {
            var a = this.that,
                d = this.options,
                n = d.virtualXHeader,
                b = d.virtualY;
            d.virtualX || "flex" === d.width || a.$hscroll.pqScrollBar("drag");
            b || "flex" === d.height || a.$vscroll.pqScrollBar("drag");
            !1 === n && a.$hscroll && (d = a.$hscroll.pqScrollBar("option"), d = parseInt(d.cur_pos), a.iMouseSelection.syncHeaderViewWithScrollBarHor(d))
        };
    h.setPaneEvents = function() {
        var a = this.that,
            d = a.pqpanes,
            n = a.$cont.children("div"),
            b = a.iMouseSelection;
        if ((a = a.$tbl) && a.length)
            if (d.h && d.v) {
                var d = k(n[0]),
                    a = k(n[1]),
                    c = k(n[2]),
                    n = k(n[3]);
                d.on("scroll", function(a) {
                    this.scrollLeft = this.scrollTop = 0
                });
                a.on("scroll", function(a) {
                    this.scrollTop = 0;
                    this.scrollLeft = b.getScrollLeft()
                });
                c.on("scroll", function(a) {
                    this.scrollTop = b.getScrollTop();
                    this.scrollLeft = 0
                });
                n.on("scroll", function(a) {
                    this.scrollTop = b.getScrollTop();
                    this.scrollLeft = b.getScrollLeft()
                })
            } else if (d.v) d = k(n[0]), n = k(n[1]), d.on("scroll", function(a) {
            this.scrollTop = b.getScrollTop();
            this.scrollLeft = 0
        }), n.on("scroll", function(a) {
            this.scrollTop = b.getScrollTop();
            this.scrollLeft = b.getScrollLeft()
        });
        else if (d.h) d = k(n[0]), n = k(n[1]), d.on("scroll", function(a) {
            this.scrollTop = 0;
            this.scrollLeft = b.getScrollLeft()
        }), n.on("scroll", function(a) {
            this.scrollTop = b.getScrollTop();
            this.scrollLeft = b.getScrollLeft()
        });
        else n.on("scroll", function(a) {
            this.scrollTop = b.getScrollTop();
            this.scrollLeft = b.getScrollLeft()
        })
    };
    h.setPanes = function() {
        var a = this.that,
            d = a.pqpanes,
            n = a.$cont.children("div"),
            b = a.iRefresh,
            c = a.$tbl,
            f = a.options,
            e = parseInt(f.freezeCols),
            g = a.initH;
        if (c && c.length) {
            var h = "flex" === f.width,
                f = "flex" === f.height ?
                "" : b.getEContHt(),
                b = h ? "" : b.getEContWd();
            if (d.h && d.v) {
                var g = k(n[0]),
                    d = k(n[1]),
                    h = k(c[1]),
                    x = k(n[2]),
                    p = k(c[2]),
                    n = k(n[3]),
                    q = k(c[3]),
                    c = l.call(a, -1, e),
                    a = a.calcHeightFrozenRows(),
                    e = a - 1;
                g.css({
                    width: c,
                    height: e
                });
                d.css({
                    left: c,
                    width: b - c,
                    height: e
                });
                h.css({
                    left: -1 * c
                });
                x.css({
                    width: c,
                    top: e,
                    height: f - e
                });
                p.css({
                    marginTop: -a
                });
                n.css({
                    left: c,
                    width: b - c,
                    top: e,
                    height: f - e
                });
                q.css({
                    marginTop: -a,
                    left: -1 * c
                })
            } else d.v ? (d = k(n[0]), n = k(n[1]), h = k(c[1]), c = l.call(a, -1, e), a = l.call(a, e, g), d.css({
                width: c,
                height: f
            }), n.css({
                left: c,
                width: b - c,
                height: f
            }), h.css({
                left: -1 * (a + c)
            })) : d.h ? (g = k(n[0]), n = k(n[1]), c = k(c[1]), a = a.calcHeightFrozenRows(), e = a - 1, g.css({
                height: e,
                width: b
            }), n.css({
                width: b,
                top: e,
                height: f - e
            }), c.css({
                marginTop: -a
            })) : n.css({
                width: b,
                height: f
            })
        }
    };
    h._generateTables = function(a, d, n) {
        var b = this.that,
            c = b.colModel,
            f = b.options,
            e = f.virtualX,
            l = b.initH,
            g = b.finalH,
            h = f.numberCell,
            k = f.columnBorders,
            q = f.rowBorders,
            t = f.wrap,
            m = f.groupModel,
            y = f.freezeCols,
            f = parseInt(f.freezeRows),
            u = !1,
            A = 0,
            C = n ? n.data.length - 1 : d,
            D = m ? !0 : !1,
            E = n && n.data ? n.data :
            D ? b.dataGM : b.pdata,
            G = b.rowIndxOffset;
        n || b._trigger("beforeTableView", null, {
            pageData: E,
            initV: a,
            finalV: d,
            initH: l,
            finalH: g,
            colModel: c
        });
        if (n || null != a && null != C) {
            u = "pq-grid-table ";
            k && (u += "pq-td-border-right ");
            q && (u += "pq-td-border-bottom ");
            k = ["<table class='" + (t ? u + "pq-wrap " : u + "pq-no-wrap ") + "' cellpadding=0 cellspacing=0 >"];
            this.hidearrHS1 = [];
            k.push("<tr class='pq-row-hidden'>");
            h.show && (A = h.width + 1, k.push("<td style='width:" + A + "px;' ></td>"));
            for (u = 0; u <= g; u++) {
                if (u < l && u >= y && (e || n) && (u = l, u > g)) throw "initH>finalH";
                A = c[u];
                A.hidden || (A = A.outerWidth, k.push("<td style='width:", A, "px;' pq-col-indx='", u, "'></td>"))
            }
            k.push("</tr>");
            this.offsetRow = null;
            for (A = 0; A <= C; A++) A < a && A >= f && (A = a), e = E[A], l = D ? e.rowIndx - G : A, e && e.pq_hidden || (u = b.lastFrozenRow === l, m && e.groupTitle ? this._generateTitleRow(m, e, k, u) : m && e.groupSummary ? this._generateSummaryRow(m, e, c, k, u) : (g = e.pq_detail && e.pq_detail.show, this._generateRow(e, l, c, k, n, u, g), g && this._generateDetailRow(e, l, c, k, n, u)));
            b.scrollMode = !1;
            k.push("</table>");
            return k.join("")
        }
    };
    h._renderCell =
        function(a, d) {
            var n = this.options,
                b = a.rowData,
                c = a.column,
                f = c.type,
                c = c.dataIndx,
                e = b[c];
            if (b) {
                void 0 != d ? f = d : "checkBoxSelection" == f ? f = "<input type='checkbox' " + (e ? "checked='checked'" : "") + " />" : "detail" == f ? (f = n.detailModel, f = "<div class='ui-icon " + (e && e.show ? f.expandIcon : f.collapseIcon) + "'></div>") : f = e;
                if ("" === f || void 0 == f) f = "&nbsp;";
                var e = "",
                    l;
                a.tree && (l = n.treeModel) && l.labelIndx == c ? (n = !b.pq_collapse, c = (b.pq_level + 1) * l.indent, e = "", e = b.pq_leaf ? l.leafIcon : n ? l.expandIcon + " pq-tree-expand-icon" : l.collapseIcon +
                    " pq-tree-expand-icon", b = ["<div class='pq-tree-icon-container' style='width:", c, "px;'><div class='ui-icon ", e, " pq-tree-icon' ></div></div>"].join(""), e = "<div class='" + cls + "'>" + b + f + "</div>") : e = f;
                return e
            }
        };
    h.renderCell = function(a) {
        var d = this.that,
            n = this.options,
            b = a.rowData,
            c = a.rowIndx,
            f = a.rowIndxPage,
            e = a.column,
            l = a.colIndx,
            g = e.dataIndx,
            h = n.freezeCols,
            k = n.columnBorders,
            q = "pq-col-indx='" + l + "'",
            m = !1,
            w = "pq-grid-cell ";
        "right" == e.align ? w += " pq-align-right" : "center" == e.align && (w += " pq-align-center");
        l ==
            h - 1 && k && (w += " pq-last-frozen-col");
        (h = e.cls) && (w = w + " " + h);
        (h = b.pq_cellselect) && (m = h[g]);
        m && (w += " pq-state-select ui-state-highlight");
        var y;
        e.render && (y = e.render.call(d.element[0], {
            data: d.pdata,
            dataModel: n.dataModel,
            rowData: b,
            cellData: b[g],
            rowIndxPage: f,
            rowIndx: c,
            colIndx: l,
            column: e,
            dataIndx: g
        }));
        (d = b.pq_cellcls) && (d = d[g]) && (w += " " + d);
        if (b = b.pq_cellattr)
            if (g = b[g])
                for (var u in g) b = g[u], "title" == u && (b = b.replace(/\"/g, "&quot;")), q += " " + u + '="' + b + '"';
        return ["<td class='", w, "' ", q, " >", this._renderCell(a,
            y), "</td>"].join("")
    };
    h.refreshRow = function(a, d, n) {
        var b = this.that,
            c = b.pdata[a];
        this._generateRow(c, a, d, n, null, b.lastFrozenRow === a, c.pq_detail && c.pq_detail.show)
    };
    h._generateRow = function(a, d, n, b, c, f, e) {
        var l = "pq-grid-row";
        f && (l += " pq-last-frozen-row");
        e && (l += " pq-detail-master");
        var g = this.that,
            h = this.options;
        f = h.freezeCols;
        var k = h.numberCell;
        e = h.treeModel.labelIndx ? !0 : !1;
        var q = h.virtualX,
            m = g.initH,
            g = g.finalH,
            w = this.offset;
        h.stripeRows && d / 2 == parseInt(d / 2) && (l += " pq-grid-oddRow");
        a.pq_rowselect && (l +=
            " pq-row-select ui-state-highlight");
        h = a.pq_rowcls;
        null != h && (l += " " + h);
        var h = a.pq_rowattr,
            y = "";
        if (h)
            for (var u in h) var A = h[u],
                A = A.replace('"', "&quot;"),
                y = y + (u + '="' + A + '"');
        b.push("<tr pq-row-indx='", d, "' class='", l, "' ", y, " >");
        k.show && b.push(["<td class='pq-grid-number-cell ui-state-default'>", c ? "&nbsp;" : d + 1, "</td>"].join(""));
        a = {
            rowIndx: d + w,
            rowIndxPage: d,
            rowData: a
        };
        for (d = 0; d <= g; d++) {
            if (d < m && d >= f && (q || c) && (d = m, d > g)) throw "initH>finalH";
            l = n[d];
            l.hidden || (a.column = l, a.colIndx = d, a.tree = e, b.push(this.renderCell(a)))
        }
        b.push("</tr>");
        return b
    };
    h = {
        widgetEventPrefix: "pqgrid"
    };
    h.options = {
        cancel: "input,textarea,button,select,option,.pq-no-capture,.ui-resizable-handle",
        distance: 3,
        collapsible: {
            on: !0,
            toggle: !0,
            collapsed: !1,
            _collapsed: !1,
            refreshAfterExpand: !0,
            css: {
                zIndex: 1E3
            }
        },
        colModel: null,
        columnBorders: !0,
        dataModel: {
            cache: !1,
            dataType: "JSON",
            location: "local",
            sorting: "local",
            sortDir: "up",
            method: "GET"
        },
        direction: "",
        draggable: !1,
        editable: !0,
        editModel: {
            cellBorderWidth: 0,
            pressToEdit: !0,
            clicksToEdit: 2,
            filterKeys: !0,
            keyUpDown: !0,
            reInt: /^([\-]?[1-9][0-9]*|[\-]?[0-9]?)$/,
            reFloat: /^[\-]?[0-9]*\.?[0-9]*$/,
            onBlur: "validate",
            saveKey: k.ui.keyCode.ENTER,
            onSave: "next",
            allowInvalid: !1,
            invalidClass: "pq-cell-red-tr pq-has-tooltip",
            warnClass: "pq-cell-blue-tr pq-has-tooltip",
            validate: !0
        },
        editor: {
            select: !1,
            type: "textbox"
        },
        validation: {
            icon: "ui-icon-alert",
            cls: "ui-state-error",
            style: "padding:3px 10px;"
        },
        warning: {
            icon: "ui-icon-info",
            cls: "",
            style: "padding:3px 10px;"
        },
        freezeCols: 0,
        freezeRows: 0,
        calcDataIndxFromColIndx: !0,
        height: 400,
        hoverMode: "null",
        _maxColWidth: "100%",
        _minColWidth: 50,
        minWidth: 100,
        numberCell: {
            width: 30,
            title: "",
            resizable: !0,
            minWidth: 30,
            maxWidth: 100,
            show: !0
        },
        pageModel: {
            curPage: 1,
            totalPages: 0,
            rPP: 10,
            rPPOptions: [10, 20, 50, 100]
        },
        resizable: !1,
        roundCorners: !0,
        rowBorders: !0,
        scrollModel: {
            pace: "fast",
            horizontal: !0,
            lastColumn: "auto",
            autoFit: !1,
            theme: !1
        },
        selectionModel: {
            fireSelectChange: !1,
            type: "cell",
            mode: "block"
        },
        swipeModel: {
            on: !0,
            speed: 20,
            ratio: .15,
            repeat: 20
        },
        showBottom: !0,
        showHeader: !0,
        showTitle: !0,
        showToolbar: !0,
        showTop: !0,
        sortable: !0,
        sql: !1,
        stripeRows: !0,
        title: "&nbsp;",
        treeModel: null,
        virtualX: !1,
        virtualY: !1,
        width: 500,
        wrap: !0,
        hwrap: !0
    };
    h._regional = {
        strAdd: "Add",
        strDelete: "Delete",
        strEdit: "Edit",
        strLoading: "Loading",
        strNextResult: "Next Result",
        strNoRows: "No rows to display.",
        strNothingFound: "Nothing found",
        strPrevResult: "Previous Result",
        strSearch: "Search",
        strSelectedmatches: "Selected {0} of {1} match(es)"
    };
    k.extend(h.options, h._regional);
    h._destroyResizable = function() {
        this.element.data("resizable") && this.element.resizable("destroy")
    };
    h._disable = function() {
        null ==
            this.$disable && (this.$disable = k("<div class='pq-grid-disable'></div>").css("opacity", .2).appendTo(this.element))
    };
    h._enable = function() {
        this.$disable && (this.element[0].removeChild(this.$disable[0]), this.$disable = null)
    };
    h._destroy = function() {
        this.loading && this.xhr.abort();
        this._destroyResizable();
        this._destroyDraggable();
        this._mouseDestroy();
        this.element.off(this.eventNamespace);
        k(window).unbind(this.eventNamespace);
        k(document).unbind(this.eventNamespace);
        this.element.empty().css("height", "").css("width",
            "").removeClass("pq-grid ui-widget ui-widget-content ui-corner-all").removeData()
    };
    h.destroy = function() {
        this._trigger("destroy");
        this._super();
        window.clearInterval(this._refreshEditorPosTimer);
        this.autoResizeTimeout && clearTimeout(this.autoResizeTimeout);
        for (var a in this) delete this[a];
        k.fragments = {}
    };
    h.collapse = function(a) {
        var d = this,
            n = this.element,
            b = this.options.collapsible,
            c = b.$collapse.children("span"),
            f = function() {
                n.css("overflow", "hidden");
                c.addClass("ui-icon-circle-triangle-s").removeClass("ui-icon-circle-triangle-n");
                n.hasClass("ui-resizable") && n.resizable("destroy");
                d.$toolbar.pqToolbar("disable");
                b.collapsed = !0;
                b._collapsed = !0;
                b.animating = !1;
                d._trigger("collapse")
            };
        a = a ? a : {};
        if (b._collapsed) return !1;
        b.htCapture = n.height();
        !1 === a.animate ? (n.height(23), f()) : (b.animating = !0, n.animate({
            height: "23px"
        }, function() {
            f()
        }))
    };
    h.expand = function(a) {
        var d = this,
            n = this.element,
            b = this.options.collapsible,
            c = b.htCapture,
            f = b.$collapse.children("span"),
            e = function() {
                n.css("overflow", "");
                b._collapsed = !1;
                b.collapsed = !1;
                d._refreshResizable();
                b.refreshAfterExpand && d.refresh();
                f.addClass("ui-icon-circle-triangle-n").removeClass("ui-icon-circle-triangle-s");
                d.$toolbar.pqToolbar("enable");
                b.animating = !1;
                d._trigger("expand")
            };
        a = a ? a : {};
        if (!1 === b._collapsed) return !1;
        !1 === a.animate ? (n.height(c), e()) : (b.animating = !0, n.animate({
            height: c
        }, function() {
            e()
        }))
    };
    h._createCollapse = function() {
        var a = this,
            d = this.$top,
            n = this.options.collapsible;
        n.$stripe || (d = k("<div class='pq-slider-icon pq-no-capture'  ></div>").appendTo(d), n.$stripe = d);
        n.on ? n.$collapse ||
            (n.$collapse = k("<div style='float:left;margin-left:5px;' class='pq-collapse'><span class='ui-icon ui-icon-circle-triangle-n' style='float:left;'></span></div>").appendTo(n.$stripe).mouseover(function(a) {
                k(this).addClass("ui-state-hover")
            }).mouseout(function(a) {
                k(this).removeClass("ui-state-hover")
            }).click(function(d) {
                n.collapsed ? a.expand() : a.collapse()
            })) : n.$collapse && (n.$collapse.remove(), delete n.$collapse);
        n.collapsed && !n._collapsed ? a.collapse({
            animate: !1
        }) : !n.collapsed && n._collapsed && a.expand({
            animate: !1
        });
        n.toggle ? n.$toggle || (n.$toggle = k("<div style='float:left;' class='pq-max'><span class='ui-icon ui-icon-arrow-4-diag' style='float:left;'></span></div>").prependTo(n.$stripe).mouseover(function(a) {
            k(this).addClass("ui-state-hover")
        }).mouseout(function(a) {
            k(this).removeClass("ui-state-hover")
        }).click(function(d) {
            a.toggle()
        })) : n.$toggle && (n.$toggle.remove(), delete n.$toggle)
    };
    h._create = function() {
        var a = this,
            d = this.options;
        d.collapsible || (d.collapsible = {
            on: !1,
            collapsed: !1
        });
        d.flexHeight && (d.height = "flex");
        d.flexWidth && (d.width = "flex");
        this.setEditorPosTimer();
        this.iGenerateView = new m(this);
        this.iRefresh = new k.paramquery.cRefresh(this);
        this.iKeyNav = new b(this);
        this.iIsValid = new c(this);
        this.hidearr = [];
        this.hidearrHS = [];
        this.tables = [];
        this.$tbl = null;
        this._calcThisColModel();
        this.iSort = new k.paramquery.cSort(this);
        this.iSort._refreshSorters();
        this.iHeader = new k.paramquery.cHeader(this);
        this._initTypeColumns();
        var n = this.element;
        n.empty().addClass("pq-grid ui-widget ui-widget-content" + (d.roundCorners ?
            " ui-corner-all" : "")).html(["<div class='pq-grid-top ui-widget-header", d.roundCorners ? " ui-corner-top" : "", "'><div class='pq-grid-title", d.roundCorners ? " ui-corner-top" : "", "'>&nbsp;</div></div><div class='pq-grid-center' ><div class='pq-header-outer ui-widget-header'></div><div class='pq-grid-cont-outer' ><div class='pq-grid-cont' tabindex='0'></div></div></div><div class='pq-grid-bottom ui-widget-header", d.roundCorners ? " ui-corner-bottom" : "", "'><div class='pq-grid-footer'>&nbsp;</div></div>"].join(""));
        this._trigger("render", null, {
            dataModel: this.options.dataModel,
            colModel: this.colModel
        });
        this.$top = k("div.pq-grid-top", n);
        this.$title = k("div.pq-grid-title", n);
        d.showTitle || this.$title.css("display", "none");
        this.$toolbar = k("div.pq-grid-toolbar", n);
        this.$grid_inner = k("div.pq-grid-center", n);
        this.$header_o = k("div.pq-header-outer", this.$grid_inner);
        d.showTop || this.$top.css("display", "none");
        this.$bottom = k("div.pq-grid-bottom", n);
        d.showBottom || this.$bottom.css("display", "none");
        this.$footer = k("div.pq-grid-footer",
            n);
        this.$cont_o = k(".pq-grid-cont-outer", this.$grid_inner);
        n = this.$cont = k("div.pq-grid-cont", this.$grid_inner);
        k(window).bind("resize" + a.eventNamespace + " orientationchange" + a.eventNamespace, function(d, n) {
            a.onWindowResize(d, n)
        });
        n.on("click", "td.pq-grid-cell", function(d) {
            if (!0 !== k.data(d.target, a.widgetName + ".preventClickEvent") && k(d.target).closest(".pq-grid")[0] == a.element[0]) return a._onClickCell(d)
        });
        n.on("click", "tr.pq-grid-row", function(d) {
            if (!0 !== k.data(d.target, a.widgetName + ".preventClickEvent") &&
                k(d.target).closest(".pq-grid")[0] == a.element[0]) return a._onClickRow(d)
        });
        n.on("contextmenu", "td.pq-grid-cell", function(d) {
            if (k(d.target).closest(".pq-grid")[0] == a.element[0]) return a._onRightClickCell(d)
        });
        n.on("contextmenu", "tr.pq-grid-row", function(d) {
            if (k(d.target).closest(".pq-grid")[0] == a.element[0]) return a._onRightClickRow(d)
        });
        n.on("dblclick", "td.pq-grid-cell", function(d) {
            if (k(d.target).closest(".pq-grid")[0] == a.element[0]) return a._onDblClickCell(d)
        });
        n.on("dblclick", "tr.pq-grid-row", function(d) {
            if (k(d.target).closest(".pq-grid")[0] ==
                a.element[0]) return a._onDblClickRow(d)
        });
        n.on("mousedown", "td.pq-grid-cell", function(d) {
            if (k(d.target).closest(".pq-grid")[0] == a.element[0]) return a._onCellMouseDown(d)
        });
        n.on("mousedown", "tr.pq-grid-row", function(d) {
            if (k(d.target).closest(".pq-grid")[0] == a.element[0]) return a._onRowMouseDown(d)
        });
        n.on("mousedown", function(d) {
            if (k(d.target).closest(".pq-grid")[0] == a.element[0]) return a._onContMouseDown(d)
        });
        n.on("mouseenter", "td.pq-grid-cell", function(d) {
            if (k(d.target).closest(".pq-grid")[0] == a.element[0]) return a._onCellMouseEnter(d,
                k(this))
        });
        n.on("mouseenter", "tr.pq-grid-row", function(d) {
            if (k(d.target).closest(".pq-grid")[0] == a.element[0]) return a._onRowMouseEnter(d, k(this))
        });
        n.on("mouseleave", "td.pq-grid-cell", function(d) {
            if (k(d.target).closest(".pq-grid")[0] == a.element[0]) return a._onCellMouseLeave(d, k(this))
        });
        n.on("mouseleave", "tr.pq-grid-row", function(d) {
            if (k(d.target).closest(".pq-grid")[0] == a.element[0]) return a._onRowMouseLeave(d, k(this))
        });
        n.bind("mousewheel DOMMouseScroll", function(d) {
            return a._onMouseWheel(d)
        });
        this.$hvscroll = k("<div class='pq-hvscroll-square ui-widget-content'></div>").appendTo(this.$grid_inner);
        this.$vscroll = k("<div class='pq-vscroll'></div>").appendTo(this.$grid_inner);
        this.prevVScroll = 0;
        n = d.scrollModel;
        void 0 === n.lastColumn && d.virtualX && (n.lastColumn = "auto");
        this.$vscroll.pqScrollBar({
            pace: n.pace,
            theme: n.theme,
            steps: d.virtualY,
            direction: "vertical",
            cur_pos: 0,
            pageDown: function(d, n) {
                a.iKeyNav.pageDown()
            },
            pageUp: function(d, n) {
                a.iKeyNav.pageUp()
            },
            drag: function(n, b) {
                d.virtualY || a.iMouseSelection.syncViewWithScrollBarVert(b.ratio)
            },
            scroll: function(n, b) {
                if (d.virtualY) {
                    a.scrollMode = !0;
                    var c = a.iRefresh;
                    c.calcInitFinal();
                    a.iGenerateView.generateView();
                    1 >= c._setScrollVNumEles() && c.refreshScrollbars()
                }
            }
        });
        var f = this.$hscroll = k("<div class='pq-hscroll'></div>").appendTo(this.$grid_inner);
        "flex" === d.height && f.css("position", "relative");
        f.pqScrollBar({
            direction: "horizontal",
            pace: n.pace,
            theme: n.theme,
            steps: d.virtualX,
            cur_pos: 0,
            drag: function(n, b) {
                d.virtualX || a.iMouseSelection.syncViewWithScrollBarHor(b.ratio)
            },
            scroll: function(n, b) {
                var c =
                    d.virtualXHeader;
                d.virtualX && a.refresh({
                    header: !1 === c ? !1 : !0
                });
                !1 === c && a.iMouseSelection.syncHeaderViewWithScrollBarHor(b.cur_pos)
            }
        });
        d.selectionModel["native"] || this.disableSelection();
        window.opera ? this.$grid_inner.bind("keypress.pq-grid", {
            that: this
        }, function(d) {
            k(d.target).closest(".pq-grid")[0] == a.element[0] && a._onKeyPressDown(d)
        }) : this.$grid_inner.bind("keydown.pq-grid", {
            that: this
        }, function(d) {
            k(d.target).closest(".pq-grid")[0] == a.element[0] && a._onKeyPressDown(d)
        });
        this._refreshTitle();
        this.iRows =
            new k.paramquery.cRows(this);
        this.iCells = new k.paramquery.cCells(this);
        this.generateLoading();
        this._initPager();
        this._refreshResizable();
        this._refreshDraggable();
        this.iResizeColumns = new k.paramquery.cResizeColumns(this);
        this._mouseInit()
    };
    h.toggle = function() {
        var a = this.options,
            d = a.collapsible,
            n = this.element,
            b;
        b = k(document.body);
        "fixed" == n.css("position") ? (a = this.maxim.eleObj, d = this.maxim.docObj, this.option({
            height: a.height,
            width: a.width
        }), n.css({
            position: a.position,
            left: a.left,
            top: a.top,
            margin: a.margin,
            zIndex: a.zIndex
        }), b.css({
            height: d.height,
            width: d.width,
            overflow: d.overflow
        }), k("html").css({
            overflow: "visible"
        }), window.scrollTo(d.scrollLeft, d.scrollTop), b = "min") : (a = {
            height: a.height,
            width: a.width,
            position: n.css("position"),
            left: n.css("left"),
            top: n.css("top"),
            margin: n.css("margin"),
            zIndex: n.css("zIndex")
        }, this.option({
            height: "100%-2",
            width: "100%-2"
        }), n.css(k.extend({
            position: "fixed",
            left: 0,
            top: 0,
            margin: 0
        }, d.css)), d = {
            height: b.height(),
            width: b.width(),
            overflow: b.css("overflow"),
            scrollLeft: k(window).scrollLeft(),
            scrollTop: k(window).scrollTop()
        }, k(document.body).css({
            height: 0,
            width: 0,
            overflow: "hidden"
        }), k("html").css({
            overflow: "hidden"
        }), window.scrollTo(0, 0), this.maxim = {
            eleObj: a,
            docObj: d
        }, b = "max");
        this._trigger("toggle", null, {
            state: b
        });
        this._refreshResizable();
        this.refresh();
        k(window).trigger("resize", {
            $grid: n,
            state: b
        })
    };
    h._mouseCapture = function(a) {
        var d = this.options;
        if (d.virtualX && d.virtualY || !a.target) return !1;
        if (k(a.target).closest(".pq-grid")[0] == this.element[0]) {
            if ("flex" == d.height && "flex" == d.width) return !1;
            a = d.swipeModel;
            return !1 == a.on || "touch" == a.on && !k.support.touch ? !1 : !0
        }
        return !1
    };
    h._saveDims = function() {
        var a = this.$tbl;
        if (a)
            for (var d = 0; d < a.length; d++) {
                var n = a[d],
                    b = k(n);
                b.data("offsetHeight", Math.round(n.offsetHeight));
                b.data("scrollWidth", Math.round(n.scrollWidth))
            }
        if (a = this.$tbl_header)
            for (d = 0; d < a.length; d++) n = a[d], b = k(n).parent(), b.data("offsetHeight", Math.round(n.offsetHeight)), b.data("scrollWidth", Math.round(n.scrollWidth))
    };
    h._mousePQUp = function(a) {
        k(document).unbind("mouseup" + this.eventNamespace,
            this._mousePQUpDelegate);
        this._trigger("mousePQUp", a, null)
    };
    h._mouseDown = function(a) {
        var d = this;
        if (k(a.target).closest(".pq-editor-focus").length) this._blurEditMode = !0, window.setTimeout(function() {
            d._blurEditMode = !1
        }, 0);
        else return this._saveDims(), this._mousePQUpDelegate = function(a) {
            return d._mousePQUp(a)
        }, k(document).bind("mouseup" + this.eventNamespace, this._mousePQUpDelegate), this._super(a)
    };
    h._mouseStart = function(a) {
        this.blurEditor({
            force: !0
        });
        return !0
    };
    h._mouseDrag = function(a) {
        return !1 == this._trigger("mouseDrag",
            a, null) ? !1 : !0
    };
    h._mouseStop = function(a) {
        return !1 == this._trigger("mouseStop", a, null) ? !1 : !0
    };
    var g, e;
    h.onWindowResize = function(a, d) {
        var n = this.options,
            b = this.element,
            c = b.parent();
        if (d) {
            var f = d.$grid;
            if (f && (f == b || 0 == b.closest(f).length)) return
        }
        if (c.length && (c[0] == document.body || "fixed" == b.css("position") ? (b = window.innerHeight ? window.innerHeight : k(window).height(), c = k(window).width()) : (b = c.height(), c = c.width()), null == g || b != g || c != e) && (g = b, e = c, !(k.support.touch && n.editModel.indices && k(document.activeElement).is(".pq-editor-focus")))) {
            var l =
                this,
                n = n.autoSizeInterval,
                n = void 0 === n ? 0 : n;
            this.autoResizeTimeout && (clearTimeout(this.autoResizeTimeout), delete this.autoResizeTimeout);
            this.autoResizeTimeout = window.setTimeout(function() {
                l._refreshAfterResize();
                delete l.autoResizeTimeout
            }, n)
        }
    };
    h._onMouseWheel = function(a) {
        this._saveDims();
        var d = this.options,
            n = 0,
            b = !1;
        a = a.originalEvent;
        var c = a.wheelDeltaX,
            f = a.wheelDeltaY,
            e = a.wheelDelta;
        if (c && Math.abs(c) > Math.abs(f)) {
            if ("flex" == d.width) return !0;
            b = !0;
            n = c / 120
        } else if (e) {
            if ("flex" == d.height) return !0;
            n =
                e / 120
        } else if (a.detail) {
            if ("flex" == d.height) return !0;
            n = -1 * a.detail / 3
        }
        a = b ? this.$hscroll : this.$vscroll;
        c = a.pqScrollBar("option");
        f = parseInt(c.cur_pos);
        e = parseInt(c.num_eles);
        b && d.virtualX || !b && d.virtualY ? (n = 0 < n ? Math[1 > n ? "ceil" : "floor"](n) : Math[-1 > n ? "ceil" : "floor"](n), 0 <= f - n && (a.pqScrollBar("option", "cur_pos", f - n), a.pqScrollBar("scroll"))) : (d = c.ratio - n / (e - 1), 1 < d ? d = 1 : 0 > d && (d = 0), a.pqScrollBar("option", "ratio", d), a.pqScrollBar("drag"));
        return !1
    };
    h._onDblClickCell = function(a) {
        var d = k(a.currentTarget),
            n =
            this.getCellIndices({
                $td: d
            }),
            b = n.rowIndxPage,
            c = b + this.rowIndxOffset,
            n = n.colIndx;
        if (null != n) {
            if (!1 == this._trigger("cellDblClick", a, {
                    $td: d,
                    rowIndxPage: b,
                    rowIndx: c,
                    colIndx: n,
                    column: this.colModel[n],
                    rowData: this.pdata[b]
                })) return !1;
            1 < this.options.editModel.clicksToEdit && this.isEditableRow({
                rowIndx: c
            }) && this.isEditableCell({
                colIndx: n,
                rowIndx: c
            }) && this.editCell({
                rowIndxPage: b,
                colIndx: n
            })
        }
    };
    h._onClickCont = function(a) {};
    h._onClickRow = function(a) {
        var d = k(a.currentTarget),
            n = parseInt(d.attr("pq-row-indx")),
            b = n + this.rowIndxOffset;
        if (!isNaN(n) && !1 == this._trigger("rowClick", a, {
                $tr: d,
                rowIndxPage: n,
                rowIndx: b,
                rowData: this.pdata[n]
            })) return !1
    };
    h._onRightClickRow = function(a) {
        var d = k(a.currentTarget),
            n = parseInt(d.attr("pq-row-indx")),
            b = n + this.rowIndxOffset;
        if (!isNaN(n) && !1 == this._trigger("rowRightClick", a, {
                $tr: d,
                rowIndxPage: n,
                rowIndx: b,
                rowData: this.pdata[n]
            })) return !1
    };
    h._onDblClickRow = function(a) {
        var d = k(a.currentTarget),
            n = parseInt(d.attr("pq-row-indx")),
            b = this.getRowIndxOffset();
        if (!1 == this._trigger("rowDblClick",
                a, {
                    $tr: d,
                    rowIndxPage: n,
                    rowIndx: n + b,
                    rowData: this.pdata[n]
                })) return !1
    };
    k.paramquery.getValueFromDataType = function(a, d, n) {
        if ("date" == d) return d = Date.parse(a), isNaN(d) ? "" : n ? d : a;
        if ("integer" == d) d = parseInt(a);
        else if ("float" == d) d = parseFloat(a);
        else return "bool" == d ? (d = k.trim(a).toLowerCase(), 0 == d.length ? null : "true" == d || "yes" == d || "1" == d ? !0 : "false" == d || "no" == d || "0" == d ? !1 : Boolean(d)) : k.trim(a);
        return isNaN(d) || null == d ? null == a ? a : null : d
    };
    var c = function(a) {
            this.that = a
        },
        f = c.prototype;
    f._isValidCell = function(a) {
        var d =
            this.that,
            n = a.column,
            b = n.validations;
        if (!b || !b.length) return {
            valid: !0
        };
        var c = a.value,
            f = n.dataType,
            e = function(a) {
                return k.paramquery.getValueFromDataType(a, f, !0)
            };
        a = a.rowData;
        if (!a) throw "rowData required.";
        for (var l = 0; l < b.length; l++) {
            var g = b[l],
                h = g.type,
                p = !1,
                q = g.msg,
                m = g.value;
            if (!1 !== g.on && (null == c && "function" != typeof h ? p = !1 : "minLen" == h ? (c = e(c), m = e(m), c.length >= m && (p = !0)) : "nonEmpty" == h ? null != c && "" !== c && (p = !0) : "maxLen" == h ? (c = e(c), m = e(m), c.length <= m && (p = !0)) : "gt" == h ? (c = e(c), m = e(m), c > m && (p = !0)) : "gte" ==
                    h ? (c = e(c), m = e(m), c >= m && (p = !0)) : "lt" == h ? (c = e(c), m = e(m), c < m && (p = !0)) : "lte" == h ? (c = e(c), m = e(m), c <= m && (p = !0)) : "neq" == h ? (c = e(c), m = e(m), c !== m && (p = !0)) : "regexp" == h ? (new RegExp(m)).test(c) && (p = !0) : "function" == typeof h ? (m = {
                        column: n,
                        value: c,
                        rowData: a,
                        msg: q
                    }, !1 == h.call(d.element[0], m) ? (p = !1, m.msg != q && (q = m.msg)) : p = !0) : p = !0, !p)) return {
                valid: !1,
                msg: q,
                column: n,
                warn: g.warn,
                dataIndx: n.dataIndx,
                validation: g
            }
        }
        return {
            valid: !0
        }
    };
    f.isValidCell = function(a) {
        var d = this.that,
            n = a.rowData,
            b = a.rowIndx,
            c = a.value,
            f = a.valueDef,
            e =
            a.column,
            l = d.options,
            g = a.allowInvalid,
            h = e.dataIndx,
            p = l.validation,
            m = l.warning,
            t = l.editModel,
            w = t.invalidClass,
            t = t.warnClass,
            y = document.activeElement;
        if (a.checkEditable && !1 == d.isEditableCell({
                rowData: n,
                rowIndx: b,
                dataIndx: h
            })) return {
            valid: !0
        };
        a = this._isValidCell({
            column: e,
            value: c,
            rowData: n
        });
        var c = a.valid,
            e = a.warn,
            u = a.msg;
        if (c) d.data({
            rowData: n,
            dataIndx: h,
            data: "pq_valid"
        }) && (d.removeClass({
            rowData: n,
            rowIndx: b,
            dataIndx: h,
            cls: t + " " + w
        }), d.removeData({
            rowData: n,
            dataIndx: h,
            data: "pq_valid"
        }));
        else var p = k.extend({},
                e ? m : p, a.validation),
            A = p.css,
            C = p.cls,
            D = p.icon,
            E = p.style;
        if (g || e) {
            if (c) return {
                valid: !0
            };
            d.addClass({
                rowData: n,
                rowIndx: b,
                dataIndx: h,
                cls: e ? t : w
            });
            d.data({
                rowData: n,
                dataIndx: h,
                data: {
                    pq_valid: {
                        css: A,
                        icon: D,
                        style: E,
                        msg: u,
                        cls: C
                    }
                }
            });
            return a
        }
        if (!c) {
            b = null == b ? d.getRowIndx({
                rowData: n
            }).rowIndx : b;
            if (null == b) return a;
            if (!f) d.goToPage({
                rowIndx: b
            }), d.editCell({
                rowIndx: b,
                dataIndx: h
            });
            else if (k(y).hasClass("pq-editor-focus") && (f = l.editModel.indices)) {
                n = f.rowIndx;
                f = f.dataIndx;
                if (null != b && b != n) throw "incorrect usage of isValid rowIndx: " +
                    b;
                if (h != f) throw "incorrect usage of isValid dataIndx: " + h;
                d.editCell({
                    rowIndx: n,
                    dataIndx: h
                })
            }
            if ((d = d.getEditCell()) && d.$cell) {
                var G = d.$cell;
                G.attr("title", u);
                try {
                    G.tooltip("destroy")
                } catch (I) {}
                G.tooltip({
                    position: {
                        my: "left center+5",
                        at: "right center"
                    },
                    content: function() {
                        return ("" == D ? "" : "<span class='ui-icon " + D + " pq-tooltip-icon'></span>") + u
                    },
                    open: function(a, d) {
                        C && d.tooltip.addClass(C);
                        if (E) {
                            var n = d.tooltip.attr("style");
                            d.tooltip.attr("style", n + ";" + E).css("zIndex", G.zIndex() + 5)
                        }
                        A && d.tooltip.css(A)
                    }
                }).tooltip("open")
            }
            return a
        }
        if (f &&
            (d = d.getEditCell()) && d.$cell) {
            G = d.$cell;
            G.removeAttr("title");
            try {
                G.tooltip("destroy")
            } catch (H) {}
        }
        return {
            valid: !0
        }
    };
    h.isValid = function(a) {
        return this.iIsValid.isValid(a)
    };
    f.isValid = function(a) {
        var d = this.that;
        a = a || {};
        var n = a.allowInvalid,
            b = a.checkEditable,
            n = null == n ? !1 : n,
            c = a.dataIndx;
        if (null != c) {
            var f = d.columns[c],
                e = a.rowData || d.getRowData(a),
                l = a.hasOwnProperty("value"),
                d = l ? a.value : e[c],
                d = this.isValidCell({
                    rowData: e,
                    checkEditable: b,
                    rowIndx: a.rowIndx,
                    value: d,
                    valueDef: l,
                    column: f,
                    allowInvalid: n
                });
            return d.valid ||
                d.warn ? {
                    valid: !0
                } : d
        }
        if (null != a.rowIndx || null != a.rowIndxPage || null != a.rowData)
            for (var e = a.rowData || d.getRowData(a), g = d.colModel, l = [], h = 0, k = g.length; h < k; h++) {
                if (f = g[h], !f.hidden && (c = f.dataIndx, d = e[c], d = this.isValidCell({
                        rowData: e,
                        value: d,
                        column: f,
                        rowIndx: a.rowIndx,
                        checkEditable: b,
                        allowInvalid: n
                    }), !d.valid && !d.warn))
                    if (n) l.push({
                        rowData: e,
                        dataIndx: c,
                        column: f
                    });
                    else return d
            } else {
                a = a.data ? a.data : d.options.dataModel.data;
                l = [];
                if (!a) return null;
                h = 0;
                for (k = a.length; h < k; h++) {
                    e = a[h];
                    if (b && (f = this.getRowIndx({
                            rowData: e
                        }).rowIndx, !1 == d.isEditableRow({
                            rowData: e,
                            rowIndx: f
                        }))) continue;
                    e = this.isValid({
                        rowData: e,
                        rowIndx: f,
                        checkEditable: b,
                        allowInvalid: n
                    });
                    if (!1 === n) {
                        if (!e.valid) return e
                    } else l = l.concat(e.cells)
                }
            }
        return n && l.length ? {
            cells: l,
            valid: !1
        } : {
            valid: !0
        }
    };
    h.isEditableRow = function(a) {
        var d = this.options.editable;
        if (null != d) {
            if ("function" == typeof d) {
                var n = a.rowIndx;
                a = a.rowData || this.getRowData({
                    rowIndx: n
                });
                return d.call(this.element[0], {
                    rowData: a,
                    rowIndx: n
                })
            }
            return d
        }
        return !0
    };
    h.isEditableCell = function(a) {
        var d = a.colIndx,
            n = a.dataIndx,
            d = null == d ? this.getColIndx({
                dataIndx: n
            }) : d,
            d = this.colModel[d],
            n = null == n ? d.dataIndx : n,
            b = d.editable;
        if (a.checkVisible && d.hidden) return !1;
        if (null != b) {
            if ("function" == typeof b) {
                var c = a.rowIndx;
                a = a.rowData || this.getRowData(a);
                return b.call(this.element[0], {
                    rowIndx: c,
                    rowData: a,
                    column: d,
                    dataIndx: n
                })
            }
            return b
        }
        return !0
    };
    h._getRowPQData = function(a, d, n) {
        return (n = null == n ? this.pdata[a] : n) ? n[d] : null
    };
    h._setRowPQData = function(a, d, n) {
        if (n = null == n ? this.pdata[a] : n)
            for (var b in d) n[b] = d[b]
    };
    h._onContMouseDown = function(a) {
        this.blurEditor({
            blurIfFocus: !0
        });
        if (!1 === this._trigger("contMouseDown", a, {
                dataModel: this.options.dataModel
            })) return !1;
        var d = k(a.target);
        a = d.closest(".pq-grid-cell");
        d = d.closest(".pq-grid-row");
        a.length || d.length || this.$cont.attr("tabindex", 0).focus();
        return !0
    };
    h._onCellMouseDown = function(a) {
        var d = k(a.currentTarget),
            n = this.getCellIndices({
                $td: d
            });
        n.$td = d;
        n.dataModel = this.options.dataModel;
        return !1 == this._trigger("cellMouseDown", a, n) ? !1 : !0
    };
    h._onRowMouseDown = function(a) {
        var d = k(a.currentTarget),
            n = this.getRowIndx({
                $tr: d
            });
        n.$tr = d;
        n.dataModel =
            this.options.dataModel;
        return !1 == this._trigger("rowMouseDown", a, n) ? !1 : !0
    };
    h._onCellMouseEnter = function(a, d) {
        var n = this.options,
            b = this.getCellIndices({
                $td: d
            });
        if (null != b.rowIndx && null != b.colIndx) {
            if (!1 === this._trigger("cellMouseEnter", a, b)) return !1;
            "cell" == n.hoverMode && this.highlightCell(d);
            return !0
        }
    };
    h._onRowMouseEnter = function(a, d) {
        var n = this.options,
            b = this.getRowIndx({
                $tr: d
            }),
            c = b.rowIndxPage;
        if (!1 === this._trigger("rowMouseEnter", a, b)) return !1;
        "row" == n.hoverMode && this.highlightRow(c);
        return !0
    };
    h._onCellMouseLeave =
        function(a, d) {
            "cell" == this.options.hoverMode && this.unHighlightCell(d);
            return !0
        };
    h._onRowMouseLeave = function(a, d) {
        var n = this.getRowIndx({
            $tr: d
        }).rowIndxPage;
        "row" == this.options.hoverMode && this.unHighlightRow(n);
        return !0
    };
    h.enableSelection = function() {
        this.element.removeClass("pq-disable-select").off("selectstart" + this.eventNamespace)
    };
    h.disableSelection = function() {
        this.element.addClass("pq-disable-select").on("selectstart" + this.eventNamespace, function(a) {
            if (a.target) {
                var d = k(a.target);
                if (d.is("input,textarea,select") ||
                    d.closest(".pq-native-select").length) return !0;
                a.preventDefault()
            }
        })
    };
    h._onCellMouseUp = function(a) {
        var d = k(a.currentTarget),
            n = this.getCellIndices({
                $td: d
            });
        n.$td = d;
        n.dataModel = this.options.dataModel;
        return !1 == this._trigger("cellMouseUp", a, n) ? !1 : !0
    };
    h._onRowMouseUp = function(a) {
        var d = k(a.currentTarget),
            d = this.getRowIndx({
                $tr: d
            });
        return !1 == this._trigger("rowMouseUp", a, d) ? !1 : !0
    };
    h._onClickCell = function(a) {
        var d = this.colModel,
            n = this.options.editModel,
            b = k(a.currentTarget),
            c = this.getCellIndices({
                $td: b
            }),
            f = c.rowIndxPage,
            e = f + this.rowIndxOffset,
            l = c.colIndx;
        c.rowIndx = e;
        if (null != l) {
            var d = d[l],
                g = d.dataIndx;
            c.dataIndx = g;
            c.evt = a;
            if (!1 == this._trigger("cellClick", a, {
                    $td: b,
                    rowIndxPage: f,
                    rowIndx: e,
                    colIndx: l,
                    dataIndx: g,
                    column: d,
                    rowData: this.pdata[f]
                })) return !1;
            1 == n.clicksToEdit && this.isEditableRow({
                rowIndx: e
            }) && this.isEditableCell({
                colIndx: l,
                rowIndx: e
            }) && this.editCell(c)
        }
    };
    h._onRightClickCell = function(a) {
        var d = k(a.currentTarget),
            n = this.getCellIndices({
                $td: d
            }),
            b = n.rowIndxPage,
            c = b + this.rowIndxOffset,
            n = n.colIndx,
            f = this.colModel;
        if (null != n && (f = f[n], !1 == this._trigger("cellRightClick", a, {
                $td: d,
                rowIndxPage: b,
                rowIndx: c,
                colIndx: n,
                dataIndx: f.dataIndx,
                column: f,
                rowData: this.pdata[b]
            }))) return !1
    };
    h.highlightCell = function(a) {
        a.addClass("pq-grid-cell-hover ui-state-hover")
    };
    h.unHighlightCell = function(a) {
        a.removeClass("pq-grid-cell-hover ui-state-hover")
    };
    h.highlightRow = function(a) {
        isNaN(a) || (a = this.getRow({
            rowIndxPage: a
        })) && a.addClass("pq-grid-row-hover ui-state-hover")
    };
    h.unHighlightRow = function(a) {
        isNaN(a) || (a = this.getRow({
                rowIndxPage: a
            })) &&
            a.removeClass("pq-grid-row-hover ui-state-hover")
    };
    h._getCreateEventData = function() {
        return {
            dataModel: this.options.dataModel,
            data: this.pdata,
            colModel: this.options.colModel
        }
    };
    h._findCellFromEvt = function(a) {
        a = k(a.target).closest(".pq-grid-cell");
        if (null == a || 0 == a.length) return {
            rowIndxPage: null,
            colIndx: null,
            $td: null
        };
        var d = this.getCellIndices({
            $td: a
        });
        d.$td = a;
        return d
    };
    h._initPager = function() {
        var a = this,
            d = {
                change: function(d, b) {
                    a.blurEditor({
                        force: !0
                    });
                    var c = a.options.pageModel;
                    void 0 != b.curPage && (c.prevPage =
                        c.curPage, c.curPage = b.curPage);
                    void 0 != b.rPP && (c.rPP = b.rPP);
                    "remote" == c.type ? a.remoteRequest({
                        callback: function() {
                            a._onDataAvailable({
                                apply: !0,
                                header: !1
                            })
                        }
                    }) : a.refreshView({
                        header: !1
                    })
                },
                refresh: function(d) {
                    a.refreshDataAndView()
                }
            };
        this.options.pageModel.type && this.$footer.pqPager(d)
    };
    h.generateLoading = function() {
        this.$loading && this.$loading.remove();
        this.$loading = k("<div class='pq-loading'></div>").appendTo(this.element);
        k(["<div class='pq-loading-bg'></div><div class='pq-loading-mask ui-state-highlight'><div>",
            this.options.strLoading, "...</div></div>"
        ].join("")).appendTo(this.$loading);
        this.$loading.find("div.pq-loading-bg").css("opacity", .2)
    };
    h._refreshLoadingString = function() {
        this.$loading.find("div.pq-loading-mask").children("div").html(this.options.strLoading)
    };
    h.showLoading = function() {
        null == this.showLoadingCounter && (this.showLoadingCounter = 0);
        this.showLoadingCounter++;
        this.$loading.show()
    };
    h.hideLoading = function() {
        0 < this.showLoadingCounter && this.showLoadingCounter--;
        this.showLoadingCounter || this.$loading.hide()
    };
    h.refreshDataFromDataModel = function() {
        this._trigger("beforeRefreshData", null, {});
        var a = this.options,
            d = a.pageModel,
            n = a.dataModel.data,
            b = d.type;
        this.rowIndxOffset = 0;
        if (null == n || 0 == n.length) b && (d.curPage = 0, d.totalPages = 0, d.totalRecords = 0), this.pdata = n;
        else {
            if (b && "local" == b) {
                d.totalRecords = n.length;
                d.totalPages = Math.ceil(n.length / d.rPP);
                d.curPage > d.totalPages && (d.curPage = d.totalPages);
                1 > d.curPage && 0 < d.totalPages && (d.curPage = 1);
                var a = (d.curPage - 1) * d.rPP,
                    c = d.curPage * d.rPP;
                c > n.length && (c = n.length);
                this.pdata =
                    n.slice(a, c)
            } else "remote" == b ? (a = Math.ceil(d.totalRecords / d.rPP), (d.totalPages = a) && !d.curPage && (d.curPage = 1), c = d.rPP, c > n.length && (c = n.length), this.pdata = n.slice(0, c)) : this.pdata = a.backwardCompat ? n.slice(0) : n;
            if ("local" == b || "remote" == b) this.rowIndxOffset = d.rPP * (d.curPage - 1)
        }
    };
    k.paramquery.filter = function() {
        var a = {
            begin: {
                text: "Begins With",
                TR: !0,
                string: !0
            },
            between: {
                text: "Between",
                TR: !0,
                string: !0,
                date: !0,
                number: !0
            },
            notbegin: {
                text: "Does not begin with",
                TR: !0,
                string: !0
            },
            contain: {
                text: "Contains",
                TR: !0,
                string: !0
            },
            notcontain: {
                text: "Does not contain",
                TR: !0,
                string: !0
            },
            equal: {
                text: "Equal To",
                TR: !0,
                string: !0,
                bool: !0
            },
            notequal: {
                text: "Not Equal To",
                TR: !0,
                string: !0
            },
            empty: {
                text: "Empty",
                TR: !1,
                string: !0,
                bool: !0
            },
            notempty: {
                text: "Not Empty",
                TR: !1,
                string: !0,
                bool: !0
            },
            end: {
                text: "Ends With",
                TR: !0,
                string: !0
            },
            notend: {
                text: "Does not end with",
                TR: !0,
                string: !0
            },
            less: {
                text: "Less Than",
                TR: !0,
                number: !0,
                date: !0
            },
            lte: {
                text: "Less than or equal",
                TR: !0,
                number: !0,
                date: !0
            },
            range: {
                TR: !0,
                string: !0,
                number: !0,
                date: !0
            },
            regexp: {
                TR: !0,
                string: !0,
                number: !0,
                date: !0
            },
            great: {
                text: "Great Than",
                TR: !0,
                number: !0,
                date: !0
            },
            gte: {
                text: "Greater than or equal",
                TR: !0,
                number: !0,
                date: !0
            }
        };
        return {
            conditions: a,
            getAllConditions: function() {
                var d = [],
                    n;
                for (n in a) d.push(n);
                return d
            }(),
            getConditions: function(d) {
                var n = [],
                    b;
                for (b in a) a[b][d] && n.push(b);
                return n
            },
            getTRConditions: function() {
                var d = [],
                    n;
                for (n in a) a[n].TR && d.push(n);
                return d
            }(),
            getWTRConditions: function() {
                var d = [],
                    n;
                for (n in a) a[n].TR || d.push(n);
                return d
            }()
        }
    }();
    k.paramquery.filter.rules = {};
    k.paramquery.filter.rules.en = {
        begin: "Begins With",
        between: "Between",
        notbegin: "Does not begin with",
        contain: "Contains",
        notcontain: "Does not contain",
        equal: "Equal To",
        notequal: "Not Equal To",
        empty: "Empty",
        notempty: "Not Empty",
        end: "Ends With",
        notend: "Does not end with",
        less: "Less Than",
        lte: "Less than or equal",
        great: "Great Than",
        gte: "Greater than or equal"
    };
    h.getQueryStringSort = function() {
        var a = this.iSort.sorters,
            d = "",
            n = this.options,
            b = n.stringify;
        if (n.sql) {
            for (n = 0; n < a.length; n++) b = a[n], d += (0 < n ? ", " : "") + b.dataIndx + " " + ("up" == b.dir ?
                "asc" : "desc");
            return d
        }
        return a.length ? !1 === b ? a : JSON.stringify(a) : ""
    };
    h.getQueryStringCRUD = function() {
        return ""
    };
    h.getQueryStringFilter = function() {
        var a = this.options,
            d = a.sql,
            n = a.stringify,
            b = a.filterModel,
            a = b.mode,
            c = this.getFilterData({
                CM: this.colModel,
                location: "remote"
            }),
            f = "";
        if (b && b.on && c)
            if (d) {
                f = [];
                for (n = 0; n < c.length; n++) {
                    var e = c[n],
                        d = e.condition,
                        b = e.dataIndx,
                        e = k.trim(e.value);
                    "contain" === d ? f.push(b + " like '%" + e + "%'") : "notcontain" === d ? f.push(b + " not like '%" + e + "%'") : "begin" === d ? f.push(b + " like '" +
                        e + "%'") : "end" === d ? f.push(b + " like '%" + e + "'") : "equal" === d ? f.push(b + "='" + e + "'") : "notequal" === d ? f.push(b + "!='" + e + "'") : "empty" === d ? f.push("isnull(" + b + ",'')=''") : "notempty" === d ? f.push("isnull(" + b + ",'')!=''") : "less" === d ? f.push(b + "<'" + e + "'") : "great" === d && f.push(b + ">'" + e + "'")
                }
                f = f.join(" " + a + " ")
            } else c.length ? (a = {
                mode: a,
                data: c
            }, f = !1 === n ? a : JSON.stringify(a)) : f = "";
        return f
    };
    h.remoteRequest = function(a) {
        this.loading && this.xhr.abort();
        var d = this,
            n = "",
            b = "",
            c = this.options,
            f = !1,
            e = this.colModel,
            l = c.dataModel,
            g = c.filterModel,
            h = c.pageModel;
        if ("function" == typeof l.getUrl)(c = l.getUrl.call(this.element[0], {
            colModel: e,
            dataModel: l,
            groupModel: c.groupModel,
            pageModel: h,
            filterModel: g
        })) && c.url && (n = c.url), c && c.data && (b = c.data);
        else if ("string" == typeof l.url) {
            var n = l.url,
                b = {},
                c = {},
                p = {};
            if ("remote" == l.sorting) {
                var m = this.getQueryStringSort();
                m && (b = {
                    pq_sort: m
                })
            }
            "remote" == h.type && (p = {
                pq_curpage: h.curPage,
                pq_rpp: h.rPP
            });
            "local" != g.type && (m = this.getQueryStringFilter()) && (f = !0, c = {
                pq_filter: m
            });
            var m = l.postData,
                t = l.postDataOnce;
            m && "function" ==
                typeof m && (m = m.call(this.element[0], {
                    colModel: e,
                    dataModel: l
                }));
            b = k.extend({
                pq_datatype: l.dataType
            }, c, p, b, m, t)
        }
        n && (this.loading = !0, this.showLoading(), this.xhr = k.ajax({
            url: n,
            dataType: l.dataType,
            async: null == l.async ? !0 : l.async,
            cache: l.cache,
            contentType: l.contentType,
            type: l.method,
            data: b,
            beforeSend: function(a, b) {
                if ("function" == typeof l.beforeSend) return l.beforeSend.call(d.element[0], a, b)
            },
            success: function(b, n, c) {
                "function" == typeof l.getData && (b = l.getData.call(d.element[0], b, n, c));
                l.data = b.data;
                h.type &&
                    "remote" == h.type && (b.curPage && (h.curPage = b.curPage), b.totalRecords && (h.totalRecords = b.totalRecords));
                d.hideLoading();
                d.loading = !1;
                a && a.callback && a.callback();
                d._trigger("load", null, {
                    dataModel: l,
                    colModel: e
                });
                f && d._trigger("filter", null, {
                    type: "remote",
                    dataModel: l,
                    colModel: e,
                    filterModel: g
                })
            },
            error: function(a, b, n) {
                d.hideLoading();
                d.loading = !1;
                if ("function" == typeof l.error) l.error.call(d.element[0], a, b, n);
                else if ("abort" != n) throw "Error : " + n;
            }
        }))
    };
    h._refreshTitle = function() {
        this.$title.html(this.options.title)
    };
    h._destroyDraggable = function() {
        var a = this.element,
            d = a.parent(".pq-wrapper");
        d.length && d.data("draggable") && (d.draggable("destroy"), this.$title.removeClass("pq-draggable pq-no-capture"), a.unwrap(".pq-wrapper"))
    };
    h._refreshDraggable = function() {
        var a = this.element,
            d = this.$title;
        this.options.draggable ? (d.addClass("pq-draggable pq-no-capture"), a.parent(".pq-wrapper").length || a.wrap("<div class='pq-wrapper' />"), a.parent(".pq-wrapper").draggable({
            handle: d
        })) : this._destroyDraggable()
    };
    h._refreshResizable =
        function() {
            var a = this,
                d = this.element,
                b = this.options,
                c = -1 < (b.width + "").indexOf("%"),
                f = -1 < (b.height + "").indexOf("%"),
                e = "auto" == b.width,
                l = "flex" == b.width,
                g = "flex" == b.height;
            if (!b.resizable || (g || f) && (l || c || e)) this._destroyResizable();
            else {
                var h = "e,s,se";
                if (g || f) h = "e";
                else if (l || c || e) h = "s";
                c = !0;
                d.hasClass("ui-resizable") && (f = d.resizable("option", "handles"), h == f ? c = !1 : this._destroyResizable());
                c && d.resizable({
                    helper: "ui-state-default",
                    handles: h,
                    minWidth: b.minWidth,
                    minHeight: b.minHeight ? b.minHeight : 100,
                    delay: 0,
                    start: function(a, d) {
                        k(d.helper).css({
                            opacity: .5,
                            background: "#ccc",
                            border: "1px solid steelblue"
                        })
                    },
                    resize: function(a, d) {},
                    stop: function(d, c) {
                        var f = a.element,
                            e = b.width,
                            l = b.height,
                            g = -1 < (e + "").indexOf("%"),
                            N = -1 < (l + "").indexOf("%"),
                            h = "auto" == e,
                            e = "flex" == e,
                            B = !1;
                        N || "flex" == l || (B = !0, b.height = f.height());
                        g || h || e || (B = !0, b.width = f.width());
                        a.refresh();
                        f.css("position", "relative");
                        B && k(window).trigger("resize")
                    }
                })
            }
        };
    h._refreshAfterResize = function() {
        var a = this.options,
            d = a.width,
            b = a.height,
            a = -1 != (d + "").indexOf("%") ?
            !0 : !1,
            d = "auto" === d,
            b = -1 != (b + "").indexOf("%") ? !0 : !1;
        (a || d || b) && this.refresh()
    };
    h.refresh = function(a) {
        this.iRefresh._refresh(a)
    };
    h._refreshDataIndices = function() {
        for (var a = "JSON" == this.getDataType() ? !0 : !1, d = {}, b = {}, c = {}, f = this.colModel, e = f.length, l = 0; l < e; l++) {
            var g = f[l],
                h = g.dataIndx;
            null == h && (h = a ? "dataIndx_" + l : l, g.dataIndx = h);
            d[h] = g;
            b[h] = l;
            g.validations && (c[h] = c)
        }
        this.columns = d;
        this.colIndxs = b;
        this.validations = c
    };
    h.refreshView = function(a) {
        null != this.options.editModel.indices && this.blurEditor({
            force: !0
        });
        this.refreshDataFromDataModel();
        this.refresh(a)
    };
    h._refreshPager = function() {
        var a = this.options,
            d = a.pageModel,
            b = this.$footer,
            c = d.rPP,
            f = d.totalRecords;
        d.type ? (a = a.pageModel, !1 == b.hasClass("pq-pager") && this._initPager(), b.pqPager("option", a), f > c && this.$bottom.css("display", "")) : (b.hasClass("pq-pager") && b.pqPager("destroy"), a.showBottom ? this.$bottom.css("display", "") : this.$bottom.css("display", "none"))
    };
    h.getInstance = function() {
        return {
            grid: this
        }
    };
    h._addRowsData = function(a) {
        var d = a.data,
            b = this.options.dataModel.data;
        a = a.rowIndx;
        null == b && (b = []);
        if (null == a)
            for (var c = 0, f = d.length; c < f; c++) {
                var e = d[c];
                b.push(e)
            } else if (a < b.length)
                for (c = 0, f = d.length; c < f; c++) e = d[c], b.splice(a, 0, e), a++;
            else return !1;
        return !0
    };
    h.addRows = function(a) {
        return this._addRowsData(a) ? (this.refreshDataFromDataModel(), this.refresh(), !0) : !1
    };
    h.refreshDataAndView = function(a) {
        var d = this.options.dataModel;
        this.iSort._refreshSorters();
        if ("remote" == d.location) {
            var b = this;
            this.remoteRequest({
                callback: function() {
                    b._onDataAvailable(a)
                }
            })
        } else this._onDataAvailable(a)
    };
    h.getColIndx = function(a) {
        a = a.dataIndx;
        if (void 0 === a) throw "dataIndx NA";
        for (var d = this.colModel, b = 0, c = d.length; b < c; b++)
            if (d[b].dataIndx == a) return b
    };
    h.getColumn = function(a) {
        if (null == a.dataIndx) throw "dataIndx N/A";
        return this.columns[a.dataIndx]
    };
    h._onDataAvailable = function() {};
    h._setOption = function(a, d) {
        var b = this.options;
        if ("height" === a) {
            if ("flex" === d) {
                var c = this.$vscroll;
                d && c && c.hasClass("pq-sb-vert") && (b.virtualY ? c.pqScrollBar("option", "cur_pos", 0) : c.pqScrollBar("option", "ratio", 0));
                this.$hscroll.css("position",
                    "relative")
            } else "flex" === b.height && this.$hscroll.css("position", "");
            this._super(a, d)
        } else "width" === a && "flex" == d ? (this._super(a, d), c = this.$hscroll, d && c && c.hasClass("pq-sb-horiz") && (b.virtualX ? c.pqScrollBar("option", "cur_pos", 0) : c.pqScrollBar("option", "ratio", 0))) : "title" == a ? (this._super(a, d), this._refreshTitle()) : "roundCorners" == a ? (this._super(a, d), d ? (this.element.addClass("ui-corner-all"), this.$top.addClass("ui-corner-top"), this.$bottom.addClass("ui-corner-bottom")) : (this.element.removeClass("ui-corner-all"),
                this.$top.removeClass("ui-corner-top"), this.$bottom.removeClass("ui-corner-bottom"))) : "freezeCols" == a ? (d = parseInt(d), !isNaN(d) && 0 <= d && d <= this.colModel.length - 2 && this._super(a, d)) : "freezeRows" == a ? (d = parseInt(d), !isNaN(d) && 0 <= d && this._super(a, d)) : "resizable" == a ? (this._super(a, d), this._refreshResizable()) : "draggable" == a ? (this._super(a, d), this._refreshDraggable()) : "scrollModel" == a ? this._super(a, d) : "dataModel" == a ? this._super(a, d) : "pageModel" == a ? this._super(a, d) : "selectionModel" === a ? this._super(a, d) : "colModel" ===
            a || "columnTemplate" == a ? (this._super(a, d), this._calcThisColModel()) : "disabled" === a ? (this._super(a, d), !0 === d ? this._disable() : this._enable()) : "numberCell" === a ? (this._super(a, d), this.iRefresh.decidePanes()) : "strLoading" === a ? (this._super(a, d), this._refreshLoadingString()) : "showTop" === a ? (this._super(a, d), !0 === d ? this.$top.css("display", "") : this.$top.css("display", "none")) : "showTitle" === a ? (this._super(a, d), !0 === d ? this.$title.css("display", "") : this.$title.css("display", "none")) : "showToolbar" === a ? (this._super(a,
                d), !0 === d ? this.$toolbar.css("display", "") : this.$toolbar.css("display", "none")) : "toolbar" == a ? (this._super(a, d), this.$toolbar.remove(), this._super(a, d), this._createToolbar()) : "collapsible" === a ? (this._super(a, d), this._createCollapse()) : "showBottom" === a ? (this._super(a, d), !0 === d ? this.$bottom.css("display", "") : this.$bottom.css("display", "none")) : this._super(a, d)
    };
    h._generateCellRowOutline = function() {
        var a = this.options,
            d = a.editModel;
        if (this.$div_focus) {
            if (a.debug) throw "this.$div_focus already present assert failed";
        } else a = this.element, d.inline && (a = this.getCell(d.indices), a.css("padding", 0).empty()), this.$div_focus = k("<div class='pq-editor-outer'><div class='pq-editor-inner'></div></div>").appendTo(a), this.$div_focus.css("zIndex", a.zIndex() + 5), d = k.extend({
            all: !0
        }, d.indices), d = this.getCell(d), d.css("height", d.height()), d.empty(), this.refreshEditorPos()
    };
    h._removeCellRowOutline = function(a) {
        if (this.$div_focus) {
            a = this.$div_focus.find(".pq-editor-focus");
            a.hasClass("hasDatepicker") && a.datepicker("hide").datepicker("destroy");
            if (a[0] == document.activeElement) {
                var d = this._blurEditMode;
                this._blurEditMode = !0;
                a.blur();
                this._blurEditMode = d
            }
            this.$div_focus.remove();
            delete this.$div_focus;
            a = this.options.editModel;
            d = k.extend({}, a.indices);
            a.indices = null;
            this.refreshCell(d)
        }
    };
    h.refreshEditorPos = function() {
        var a = this.options.editModel,
            d = a.cellBorderWidth,
            b = this.$div_focus,
            c = this.getCell(a.indices);
        if (!c) return !1;
        var a = c[0].offsetWidth - (d ? 2 * d : 1),
            f = c[0].offsetHeight - (d ? 2 * d : 1),
            e = this.element.offset(),
            c = c.offset();
        b.css({
            height: f,
            width: a,
            borderWidth: d,
            left: c.left - e.left - 1,
            top: c.top - e.top - 1
        })
    };
    h.setEditorPosTimer = function() {
        var a = this,
            d = this.options;
        this._refreshEditorPosTimer && (window.clearInterval(this._refreshEditorPosTimer), this._refreshEditorPosTimer = null);
        this._refreshEditorPosTimer = window.setInterval(function() {
            d.editModel.indices && a.refreshEditorPos()
        }, 200)
    };
    h._selectRow = function(a, d) {
        this.selectRow(a, d)
    };
    h._findfirstUnhiddenColIndx = function() {
        for (var a = 0; a < this.colModel.length; a++)
            if (!this.colModel[a].hidden) return a
    };
    h.selectRow =
        function(a) {
            var d = a.evt;
            if (d && ("keydown" == d.type || "keypress" == d.type)) {
                if (!1 == this.iRows.replace(a)) return !1
            } else if (!1 == this.iRows.add(a)) return !1;
            return !0
        };
    h.get$Tbl = function(a, d) {
        var b = this.$tbl,
            c = [];
        if (b && b.length) {
            var f = this.pqpanes,
                e = this.options,
                l = e.freezeRows,
                e = e.freezeCols;
            f.h && f.v ? null == d ? a >= l ? c.push(b[2], b[3]) : c.push(b[0], b[1]) : c = d >= e && a >= l ? b[3] : d < e && a >= l ? b[2] : d >= e && a < l ? b[1] : b[0] : c = f.v ? null == d ? b : d >= e ? b[1] : b[0] : f.h ? a >= l ? b[1] : b[0] : b[0];
            if (c) return k(c)
        }
    };
    h.scrollCell = function(a) {
        this.scrollRow(a);
        this.scrollColumn(a)
    };
    h.scrollY = function(a) {
        this.$vscroll.pqScrollBar("option", "cur_pos", a).pqScrollBar("scroll")
    };
    h.scrollRow = function(a) {
        var d = this.options;
        if (!this.pdata || a.rowIndxPage >= this.pdata.length || "flex" === d.height) return !1;
        d.virtualY ? this._scrollRowVirtual(a) : this.iMouseSelection.scrollRowNonVirtual(a)
    };
    h._scrollRowVirtual = function(a) {
        var d = this.options,
            b = a.rowIndxPage,
            c = this.iHierarchy ? !0 : !1,
            f = a.rowIndx;
        a = this.scrollCurPos;
        b = null == b ? f - this.rowIndxOffset : b;
        f = parseInt(d.freezeRows);
        if (!(b <
                f) && (d = this._calcCurPosFromRowIndxPage(b), null != d)) {
            d < a && this.$vscroll.pqScrollBar("option", "cur_pos", d).pqScrollBar("scroll");
            var e = this.get$Tbl(b);
            if (!e || !e.length) return null;
            var l = e.children("tbody").children("tr[pq-row-indx=" + b + "]"),
                g = b = l.last();
            1 < l.length && (g = l.first());
            var h = b[0],
                l = parseInt(e.css("marginTop"));
            if (void 0 == h) this.$vscroll.pqScrollBar("option", "cur_pos", d).pqScrollBar("scroll");
            else {
                var h = h.offsetTop + h.offsetHeight,
                    k = this.$cont[0].offsetHeight,
                    p = this._getSBHeight(),
                    g = g.prev("tr");
                if (!g.hasClass("pq-row-hidden") && !g.hasClass("pq-last-frozen-row") && h > k - p - l) {
                    g = h - (k - p - l);
                    l = e.children().children("tr");
                    h = e = 0;
                    f ? (f = l.filter("tr.pq-last-frozen-row").last().next(), 0 == f.length && (f = l.filter("tr.pq-row-hidden").next())) : f = l.filter("tr.pq-row-hidden").next();
                    do {
                        e += f[0].offsetHeight;
                        if (f[0] == b[0]) break;
                        else if (c && !1 != f.hasClass("pq-detail-child") || h++, e >= g) break;
                        f = f.next()
                    } while (1);
                    c = a + h;
                    c > d && (c = d);
                    a = this.$vscroll.pqScrollBar("option", "num_eles");
                    a < c + 1 && (a = c + 1);
                    this.$vscroll.pqScrollBar("option", {
                        num_eles: a,
                        cur_pos: c
                    }).pqScrollBar("scroll")
                }
            }
        }
    };
    h.blurEditor = function(a) {
        if (this.$div_focus) {
            var d = this.$div_focus.find(".pq-editor-focus");
            if (a && a.blurIfFocus) document.activeElement == d[0] && d.blur();
            else return d.triggerHandler("blur", a)
        }
    };
    h._scrollColumnVirtual = function(a) {
        var d = a.colIndx,
            d = null == d ? this.getColIndx({
                dataIndx: a.dataIndx
            }) : d;
        a = this.options.freezeCols;
        var b = this._calcRightEdgeCol(d).width,
            c = this._getSBWidth(),
            c = this.$cont[0].offsetWidth - c;
        if (b > c) {
            for (var b = l.call(this, -1, d + 1) - c, c =
                    this.colModel, f = c.length, e = 0, g = 0, h = a; h < f; h++) {
                var k = c[h];
                k.hidden || (e += k.outerWidth);
                if (h == d) {
                    g = h - a - this._calcNumHiddenUnFrozens(h);
                    break
                } else if (e >= b) {
                    g = h - a - this._calcNumHiddenUnFrozens(h) + 1;
                    break
                }
            }
            this.$hscroll.pqScrollBar("option", "cur_pos", g).pqScrollBar("scroll");
            return !0
        }
        return this.hidearrHS[d] ? (this.hidearrHS[d] = !1, d = d - a - this._calcNumHiddenUnFrozens(d), this.$hscroll.pqScrollBar("option", "cur_pos", d).pqScrollBar("scroll"), !0) : !1
    };
    h.scrollColumn = function(a) {
        var d = this.options;
        return "flex" ===
            d.width ? !1 : d.virtualX ? this._scrollColumnVirtual(a) : this.iMouseSelection.scrollColumnNonVirtual(a)
    };
    h.selection = function(a) {
        var d = a.method,
            b = a.type;
        if ("row" == b) return this.iRows[d](a);
        if ("cell" == b) return this.iCells[d](a)
    };
    h._bringPageIntoView = function(a) {
        a = a.rowIndx;
        var d = this.options.pageModel;
        if ("local" == d.type && 0 <= a) {
            var b = d.curPage,
                c = d.rPP;
            a >= (b - 1) * c && a < b * c || (d.curPage = Math.ceil((a + 1) / c), this.refreshDataFromDataModel(), this.refresh())
        }
    };
    h.goToPage = function(a) {
        var d = this.options.pageModel;
        if ("local" ==
            d.type || "remote" == d.type) {
            var b = a.rowIndx,
                c = d.rPP;
            a = null == a.page ? Math.ceil((b + 1) / c) : a.page;
            a != d.curPage && (d.curPage = a, "local" == d.type ? (this.refreshDataFromDataModel(), this.refresh()) : this.refreshDataAndView())
        }
    };
    h.setSelection = function(a) {
        if (null == a) return this.iRows.removeAll({
            raiseEvent: !0
        }), this.iCells.removeAll({
            raiseEvent: !0
        }), !1;
        var d = this.pdata,
            b, c;
        if (a.rowData) b = this.getRowIndx(a).rowIndx;
        else {
            var f = this.rowIndxOffset;
            b = a.rowIndx;
            c = a.rowIndxPage;
            b = null == b ? c + f : b
        }
        f = null == a.colIndx && void 0 !==
            a.dataIndx ? this.getColIndx({
                dataIndx: a.dataIndx
            }) : a.colIndx;
        if (0 > b || 0 > f || f >= this.colModel.length || null == d || 0 == d.length) return !1;
        a.rowIndx = b;
        a.colIndx = f;
        this._bringPageIntoView(a);
        c = b - this.rowIndxOffset;
        a.rowIndxPage = c;
        this.scrollRow({
            rowIndxPage: c
        });
        if (null == f) return this._selectRow(a);
        this.scrollColumn({
            colIndx: f
        });
        return this.selectCell(a)
    };
    h.getColModel = function() {
        return this.colModel
    };
    h.saveEditCell = function(a) {
        var d = this.options,
            b = d.editModel;
        if (!b.indices) return null;
        var c = k.extend({}, b.indices),
            b = a ? a.evt : null,
            f = c.rowIndxPage,
            e = f + this.rowIndxOffset,
            l = this.colModel[c.colIndx],
            c = l.dataIndx,
            g = this.pdata[f],
            h = d.dataModel,
            m;
        if (null == g) return null;
        if (null != f) {
            var p = this.getEditCellData();
            if (k.isPlainObject(p)) {
                m = {};
                for (var q in p) m[q] = g[q]
            } else m = g[c];
            "<br>" == p && (p = "");
            null == m && "" === p && (p = null);
            q = {
                rowIndx: e,
                rowIndxPage: f,
                dataIndx: c,
                column: l,
                newVal: p,
                value: p,
                oldVal: m,
                rowData: g,
                dataModel: h
            };
            if (!1 === this._trigger("cellBeforeSave", b, q)) return !1;
            l = {};
            g = !1;
            k.isPlainObject(p) ? (l = p, g = !0) : l[c] = p;
            if (!1 ===
                this.updateRow({
                    row: l,
                    rowIndx: e,
                    refresh: g,
                    silent: !0,
                    source: "edit",
                    checkEditable: !1
                })) return !1;
            this._trigger("cellSave", b, q);
            "flex" == d.height ? (this.iRefresh.setContAndGridHeightFromTable(), this._fixIEFooterIssue()) : a && this.scrollRow({
                rowIndxPage: f
            });
            return !0
        }
    };
    h._addInvalid = function(a) {};
    h._digestData = function(a) {
        if (!1 === this._trigger("beforeValidate", null, a)) return !1;
        var d = this.options,
            b = d.editModel,
            c = d.dataModel,
            f = c.data,
            e = d.colModel,
            l = d.pageModel,
            g = d.historyModel,
            h = a.validate,
            h = null == h ? b.validate :
            h,
            m = l.type,
            p = a.allowInvalid,
            p = null == p ? b.allowInvalid : p,
            q = d.trackModel,
            b = a.track,
            b = null == b ? null == d.track ? q.on : d.track : b,
            t = a.history,
            t = null == t ? g.on : t,
            w = a.checkEditable,
            w = null == w ? !0 : w,
            y = a.checkEditableAdd,
            y = null == y ? w : y,
            u = this.columns,
            A = this.colIndxs,
            C = a.source,
            g = this.rowIndxOffset,
            D = k.paramquery.getValueFromDataType,
            q = a.rowList,
            E = q.length;
        f || (f = d.dataModel.data = []);
        for (var G = [], I = 0; I < E; I++) {
            var H = q[I],
                F = H.newRow,
                M = H.rowData,
                J = H.type,
                Q = H.checkEditable,
                O = H.rowIndx,
                R = H.oldRow;
            null == Q && ("update" == J ? Q = w :
                "add" == J && (Q = y));
            if ("update" == J) {
                if (!R || !M) throw "assert failed: oldRow and rowData required while update";
                if (Q && !0 !== d.editable && !1 === this.isEditableRow({
                        rowIndx: O,
                        rowData: M
                    })) continue
            } else if ("delete" == J) {
                G.push(H);
                continue
            }
            if ("add" == J)
                for (var K = 0, S = e.length; K < S; K++) {
                    var P = e[K],
                        L = P.dataIndx;
                    F[L] = F[L]
                }
            for (L in F) {
                P = u[L];
                K = A[L];
                if (P) {
                    if (Q && null != P.editable && !1 === this.isEditableCell({
                            rowIndx: O,
                            colIndx: K,
                            dataIndx: L
                        })) {
                        delete F[L];
                        continue
                    }
                    var S = P.dataType,
                        K = D(F[L], S),
                        T = M ? M[L] : void 0,
                        T = void 0 !== T ? D(T,
                            S) : void 0;
                    F[L] = K;
                    if (h && P.validations)
                        if ("edit" == C && !1 === p) {
                            if (P = this.isValid({
                                    dataIndx: L,
                                    rowIndx: O,
                                    value: K
                                }), !1 == P.valid && !P.warn) return !1
                        } else P = this.iIsValid.isValidCell({
                            column: P,
                            rowData: "add" == J ? F : M,
                            allowInvalid: p,
                            value: K
                        }), !1 === P.valid && (!1 !== p || P.warn || delete F[L]);
                    if ("update" == J && K === T) {
                        if ("edit" == C) return null;
                        delete F[L];
                        continue
                    }
                }
                "update" == J && (R[L] = T)
            }
            if (F)
                if ("update" == J)
                    for (L in F) {
                        G.push(H);
                        break
                    } else G.push(H)
        }
        q = a.rowList = G;
        E = q.length;
        if (!E) return !1;
        t && (this.iHistory.increment(), this.iHistory.push({
            rowList: q
        }));
        for (I = 0; I < E; I++)
            if (H = q[I], J = H.type, F = H.newRow, O = H.rowIndx, d = H.rowIndxPage, M = H.rowData, "update" == J)
                for (L in b && this.iUCData.update({
                        rowData: M,
                        row: F,
                        refresh: !1
                    }), F) K = F[L], M[L] = K;
            else if ("add" == J) b && this.iUCData.add({
            rowData: F
        }), null == O && null == d ? f.push(F) : (d = O - g, d = "remote" == m ? d : O, f.splice(d, 0, F)), "remote" == m && l.totalRecords++;
        else if ("delete" == J) {
            d = this.getRowIndx({
                rowData: M
            });
            e = d.uf;
            O = d.rowIndx;
            if (b) this.iUCData["delete"]({
                rowIndx: O,
                rowData: M
            });
            d = O - g;
            d = "remote" == m ? d : O;
            e ? c.dataUF.splice(d, 1) : (d = f.splice(d,
                1)) && d.length && "remote" == m && l.totalRecords--
        }
        this._trigger("change", null, a);
        return !0
    };
    h._fixTableViewPort = function() {
        this.iGenerateView.setPanes();
        var a = this.element[0];
        a.scrollTop = 0;
        a.scrollLeft = 0;
        a = this.$header_o[0];
        a.scrollLeft = 0;
        a.scrollTop = 0
    };
    h._fixIEFooterIssue = function() {
        k(".pq-grid-footer").css({
            position: "absolute"
        });
        k(".pq-grid-footer").css({
            position: "relative"
        })
    };
    h.refreshColumn = function(a) {
        var d = this.colModel,
            b = a.colIndx,
            c = a.dataIndx,
            b = null == b ? this.getColIndx({
                dataIndx: c
            }) : b,
            c = null == c ?
            d[b] : c,
            f = this.rowIndxOffset;
        a.colIndx = b;
        for (var e = this.initV, l = this.finalV, g = e; g <= l; g++) {
            var h = g;
            a.rowIndx = h + f;
            a.rowIndxPage = h;
            a.colIndx = b;
            a.column = d[b];
            a.skip = !0;
            this.refreshCell(a)
        }
        this._fixTableViewPort();
        this.iRefresh.refreshScrollbars();
        this._trigger("refreshColumn", null, {
            dataModel: this.options.dataModel,
            colModel: d,
            initV: e,
            finalV: l,
            colIndx: b,
            dataIndx: c
        })
    };
    h.refreshCell = function(a) {
        if (this.pdata) {
            var d = this.rowIndxOffset,
                b = a.skip,
                c = a.rowIndx,
                f = a.rowIndxPage,
                c = a.rowIndx = null == c ? f + d : c,
                f = a.rowIndxPage =
                null == f ? c - d : f,
                d = a.dataIndx,
                e = a.colIndx,
                e = a.colIndx = null == e ? this.getColIndx({
                    dataIndx: d
                }) : e,
                l = this.getCell({
                    all: !0,
                    rowIndxPage: f,
                    colIndx: e
                }),
                g = a.column,
                h = this.colModel;
            a.column = g ? g : h[e];
            var k = this.options.treeModel;
            if (g = this.pdata[f]) a.tree = k.labelIndx ? !0 : !1, a.rowData = g, l && 0 < l.length && (a = this.iGenerateView.renderCell(a), l.replaceWith(a), b || (this._fixTableViewPort(), this.iRefresh.refreshScrollbars(), this._trigger("refreshCell", null, {
                dataModel: this.options.dataModel,
                colModel: h,
                rowData: g,
                rowIndx: c,
                rowIndxPage: f,
                colIndx: e,
                dataIndx: d
            })))
        }
    };
    h.refreshRow = function(a) {
        if (this.pdata) {
            var d = this.rowIndxOffset,
                b = a.rowIndx;
            a = a.rowIndxPage;
            b = null == b ? a + d : b;
            a = null == a ? b - d : a;
            var d = this.getRow({
                    all: !0,
                    rowIndxPage: a
                }),
                c = this.colModel,
                f = this.pdata[a],
                e = !1,
                l = document.activeElement;
            k(l);
            if (l == d[0] || 1 < d.length && l == d[1]) e = !0;
            if (!f || !d || !d.length) return null;
            l = [];
            this.iGenerateView.refreshRow(a, c, l, null, null, f.pq_detail && f.pq_detail.show);
            c = l.join("");
            d.replaceWith(c);
            this._fixTableViewPort();
            this.iRefresh.refreshScrollbars();
            e && this.getRow({
                all: !0,
                rowIndxPage: a
            }).attr("tabindex", 0).focus();
            this._trigger("refreshRow", null, {
                rowData: f,
                rowIndx: b,
                rowIndxPage: a
            });
            return !0
        }
    };
    h.quitEditMode = function(a) {
        if (!this._quitEditMode) {
            var d = !1,
                b = !1,
                c = !1,
                f = this.options.editModel,
                e = f.indices,
                l = void 0;
            this._quitEditMode = !0;
            a && (d = a.old, b = a.silent, c = a.fireOnly, l = a.evt);
            e && (b || d || this._trigger("editorEnd", l, e), c || (this._removeCellRowOutline(a), f.indices = null));
            this._quitEditMode = null
        }
    };
    h._fixIE = function() {
        var a = this.$cont[0];
        a.scrollLeft = 0;
        a.scrollTop = 0
    };
    h.getViewPortRowsIndx = function() {
        return {
            beginIndx: this.initV,
            endIndx: this.finalV
        }
    };
    h.getViewPortIndx = function() {
        return {
            initV: this.initV,
            finalV: this.finalV,
            initH: this.initH,
            finalH: this.finalH
        }
    };
    h.getRowIndxOffset = function() {
        return this.rowIndxOffset
    };
    h.selectCell = function(a) {
        var d = a.evt;
        if (d && ("keydown" == d.type || "keypress" == d.type)) {
            if (!1 == this.iCells.replace(a)) return !1
        } else if (!1 === this.iCells.add(a)) return !1;
        return !0
    };
    h.getEditCell = function() {
        var a = this.options.editModel;
        if (a.indices) {
            var a =
                this.getCell(a.indices),
                d = this.$div_focus.children(".pq-editor-inner"),
                b = d.find(".pq-editor-focus");
            return {
                $td: a,
                $cell: d,
                $editor: b
            }
        }
        return null
    };
    h.editCell = function(a) {
        this.scrollRow(a);
        this.scrollColumn(a);
        var d = this.getCell(a);
        if (d && d.length) return this._editCell(a)
    };
    h.getFirstEditableColIndx = function(a) {
        if (null == a.rowIndx) throw "rowIndx NA";
        if (!this.isEditableRow(a)) return -1;
        for (var d = this.colModel, b = 0; b < d.length; b++)
            if (a.colIndx = b, this.isEditableCell(a) && !d[b].hidden) return b;
        return -1
    };
    h.editFirstCellInRow =
        function(a) {
            var d = this.rowIndxOffset,
                b = a.rowIndx;
            a = a.rowIndxPage;
            b = null == b ? a + d : b;
            a = null == a ? b - d : a;
            d = this.getFirstEditableColIndx({
                rowIndx: b
            }); - 1 != d && this.editCell({
                rowIndxPage: a,
                colIndx: d
            })
        };
    h._editCell = function(a) {
        var d = this,
            b = a.evt,
            c = this.rowIndxOffset,
            f = a.rowIndxPage,
            e = a.rowIndx,
            e = null == e ? f + c : e,
            f = null == f ? e - c : f,
            c = a.colIndx,
            l = a.dataIndx,
            c = null == c ? this.getColIndx({
                dataIndx: l
            }) : c,
            g = this.colModel[c],
            l = g.dataIndx,
            h = g.editor,
            m = this.options,
            p = m.editModel,
            m = m.editor,
            q = h ? k.extend({}, m, h) : m,
            h = d.pdata[f],
            m = !1;
        if (!this.pdata || f >= this.pdata.length) return !1;
        if (p.indices) {
            var t = p.indices;
            if (t.rowIndxPage == f && t.colIndx == c) {
                this.refreshEditorPos();
                var w = this.$div_focus.find(".pq-editor-focus");
                window.setTimeout(function() {
                    w.focus()
                }, 0);
                return !1
            }
            if (!1 === this.blurEditor({
                    evt: b
                })) return !1;
            this.quitEditMode({
                evt: b
            })
        }
        p.indices = {
            rowIndxPage: f,
            rowIndx: e,
            colIndx: c,
            column: g,
            dataIndx: l
        };
        this._generateCellRowOutline();
        t = this.$div_focus.children(".pq-editor-inner");
        "right" == g.align ? t.addClass("pq-align-right") : "center" ==
            g.align ? t.addClass("pq-align-center") : t.addClass("pq-align-left");
        var y = h[l],
            u = q.type;
        a = null == a.select ? q.select : a.select;
        var A = q.init,
            C = q.valueIndx,
            D = q.dataMap,
            E = q.mapIndices,
            E = E ? E : {},
            G = "pq-editor-focus " + (q.cls ? q.cls : ""),
            I = G + " pq-cell-editor ",
            H = q.attr ? q.attr : "",
            F = q.style,
            M = (F = F ? F : "") ? "style='" + F + "'" : "",
            J = t.width() - 8,
            Q = "style='width:" + J + "px;" + F + "'",
            O = F ? "style='" + F + "'" : "",
            F = {
                rowIndx: e,
                rowIndxPage: f,
                $cell: t,
                cellData: y,
                rowData: h,
                cls: G,
                dataIndx: l,
                column: g
            };
        "function" == typeof u ? q = u.call(d.element[0],
            F) : "checkbox" == u ? (q = q.subtype, t.html("<input " + (y ? "checked='checked'" : "") + " class='" + I + "' " + H + " " + O + " type=checkbox name='" + l + "' />"), u = t.children("input"), "triple" == q && (u.pqval({
            val: y
        }), t.click(function(a) {
            k(this).children("input").pqval({
                incr: !0
            })
        }))) : "textarea" == u || "select" == u || "textbox" == u ? ("textarea" == u ? q = "<textarea class='" + I + "' " + H + " " + Q + " name='" + l + "' ></textarea>" : "select" == u ? (G = (G = q.options) ? G : [], "function" === typeof G && (G = G.call(d.element[0], {
            column: g,
            rowData: h
        })), I = [H, " class='", I, "' ",
            Q, " name='", l, "'"
        ].join(""), q = k.paramquery.select({
            options: G,
            attr: I,
            prepend: q.prepend,
            labelIndx: q.labelIndx,
            valueIndx: C,
            groupIndx: q.groupIndx,
            dataMap: D
        })) : q = "<input class='" + I + "' " + H + " " + Q + " type=text name='" + l + "' />", k(q).appendTo(t).width(J).val("select" == u && null != C && (E[C] || this.columns[C]) ? E[C] ? h[E[C]] : h[C] : y)) : (t.html("<div contenteditable='true' tabindx='0' " + M + " " + H + " class='pq-editor-default " + G + "'></div>"), t.children().html(y), m = !0);
        "function" == typeof A && A.call(d.element[0], F);
        var d = this,
            w = t.children(".pq-editor-focus"),
            R = p.filterKeys;
        (y = g.editModel) && void 0 !== y.filterKeys && (R = y.filterKeys);
        var K = {
            $cell: t,
            $editor: w,
            dataIndx: l,
            column: g,
            colIndx: c,
            rowIndx: e,
            rowIndxPage: f,
            rowData: h
        };
        p.indices = K;
        w.data({
            FK: R
        }).on("click", function(a) {
            k(this).focus()
        }).on("keydown", function(a) {
            d.iKeyNav._keyDownInEdit(a)
        }).on("keypress", function(a) {
            return d.iKeyNav._keyPressInEdit(a, {
                FK: R
            })
        }).on("keyup", function(a) {
            return d.iKeyNav._keyUpInEdit(a, {
                FK: R
            })
        }).on("blur", function(a, b) {
            var c = d.options.editModel,
                n = c.onBlur,
                f = "save" == n,
                e = "validate" == n,
                l = c.cancelBlurCls,
                g = b ? b.force : !1;
            if (!d._quitEditMode && !d._blurEditMode && c.indices) {
                c = k(a.target);
                if (!g) {
                    if (!1 === d._trigger("editorBlur", a, K) || !n || l && c.hasClass(l)) return;
                    if (c.hasClass("hasDatepicker")) {
                        if (c.datepicker("widget").is(":visible")) return !1
                    } else if (c.hasClass("ui-autocomplete-input")) {
                        if (c.autocomplete("widget").is(":visible")) return
                    } else if (c.hasClass("ui-multiselect")) {
                        if (k(".ui-multiselect-menu").is(":visible") || k(document.activeElement).closest(".ui-multiselect-menu").length) return
                    } else if (c.hasClass("pq-select-button") &&
                        (k(".pq-select-menu").is(":visible") || k(document.activeElement).closest(".pq-select-menu").length)) return
                }
                d._blurEditMode = !0;
                if (!d.saveEditCell({
                        evt: a,
                        silent: g || f || !e
                    }) && !g && e) return d._deleteBlurEditMode(), !1;
                d.quitEditMode({
                    evt: a
                });
                d._deleteBlurEditMode()
            }
        }).on("focus", function(a) {
            d._trigger("editorFocus", a, K)
        });
        d._trigger("editorBegin", b, K);
        w.focus();
        window.setTimeout(function() {
            !1 === k(document.activeElement).hasClass("pq-editor-focus") && d.element.find(".pq-editor-focus").focus()
        }, 0);
        d.element[0].scrollLeft =
            0;
        d.element[0].scrollTop = 0;
        if (a)
            if (m) try {
                var S = w[0],
                    P = document.createRange();
                P.selectNodeContents(S);
                var L = window.getSelection();
                L.removeAllRanges();
                L.addRange(P)
            } catch (T) {} else w.select()
    };
    h._deleteBlurEditMode = function(a) {
        var d = this;
        a = a ? a : {};
        d._blurEditMode && (a.timer ? window.setTimeout(function() {
            delete d._blurEditMode
        }, 0) : delete d._blurEditMode)
    };
    h.getRow = function(a) {
        var d = a.rowIndxPage,
            b = a.rowIndx,
            c = this.rowIndxOffset,
            d = null == d ? b - c : d;
        a = a.all ? this.$tbl : this.get$Tbl(d);
        var f;
        a && a.length && (b = a.children("tbody"),
            null != d && (f = b.children("tr[pq-row-indx=" + d + "]"), f.length > a.length && (f = f.filter(".pq-detail-master"))));
        return f
    };
    h.getCell = function(a) {
        var d = a.rowIndxPage,
            b = a.rowIndx,
            d = null == d ? b - this.rowIndxOffset : d,
            b = a.colIndx,
            c = a.dataIndx,
            b = null == b ? this.getColIndx({
                dataIndx: c
            }) : b;
        return (a = a.all ? this.$tbl : this.get$Tbl(d, b)) && a.length ? a.children().children("tr[pq-row-indx=" + d + "]").children("td[pq-col-indx=" + b + "]") : k()
    };
    h.getCellHeader = function(a) {
        var d = a.colIndx;
        a = a.dataIndx;
        d = null == d ? this.getColIndx({
                dataIndx: a
            }) :
            d;
        a = this.$tbl_header;
        var b, c = this.options.freezeCols;
        void 0 != a && (1 < a.length && (a = d >= c ? k(a[1]) : k(a[0])), b = a.children().children("tr.pq-grid-title-row:last").children("td[pq-col-indx=" + d + "]"));
        return 0 == b.length || "hidden" == b[0].style.visibility ? null : b
    };
    h.getEditorIndices = function() {
        var a = this.options.editModel.indices;
        return a ? k.extend({}, a) : null
    };
    h.getEditCellData = function() {
        var a = this.options,
            d = a.editModel.indices;
        if (!d) return null;
        var b = d.rowIndxPage,
            c = d.rowIndx,
            f = this.colModel[d.colIndx],
            e = f.editor,
            a = a.editor,
            a = e ? k.extend({}, a, e) : a,
            l = a.valueIndx,
            g = a.labelIndx,
            e = (e = a.mapIndices) ? e : {},
            h = f.dataIndx,
            m = this.$div_focus.children(".pq-editor-inner"),
            p;
        if ("function" == typeof a.getData) p = a.getData.call(this.element[0], {
            $cell: m,
            rowData: d.rowData,
            dataIndx: h,
            rowIndx: c,
            rowIndxPage: b,
            column: f
        });
        else if (d = a.type, "checkbox" == d) p = m.children(), p = "triple" == a.subtype ? p.pqval() : p.is(":checked") ? !0 : !1;
        else if ("contenteditable" == d) p = m.children().html();
        else if ((b = m.find('*[name="' + h + '"]')) && b.length)
            if ("select" == d &&
                null != l)
                if (e[l] || this.columns[l]) {
                    if (p = {}, p[e[l] ? e[l] : l] = b.val(), p[e[g] ? e[g] : g] = b.find("option:selected").text(), d = a.dataMap)
                        if (b = b.find("option:selected").data("map"))
                            for (c = 0; c < d.length; c++) f = d[c], p[e[f] ? e[f] : f] = b[f]
                } else p = b.val();
        else p = b.val();
        else(b = m.find(".pq-editor-focus")) && b.length && (p = b.val());
        return p
    };
    h.getCellIndices = function(a) {
        var d = a.$td;
        if (null == d || 0 == d.length || d.closest(".pq-grid")[0] != this.element[0]) return {
            rowIndxPage: null,
            colIndx: null
        };
        a = d.parent("tr").attr("pq-row-indx");
        var b;
        null != a && (a = parseInt(a), b = a + this.rowIndxOffset);
        var d = d.attr("pq-col-indx"),
            c;
        null != d && (d = parseInt(d), c = this.colModel[d].dataIndx);
        return {
            rowIndxPage: a,
            rowIndx: b,
            colIndx: d,
            dataIndx: c
        }
    };
    h.getRowsByClass = function(a) {
        var d = this.options,
            b = "remote" == d.pageModel.type ? !0 : !1,
            c = this.rowIndxOffset,
            d = d.dataModel.data,
            f = [];
        if (null == d) return f;
        for (var e = 0, l = d.length; e < l; e++) {
            var g = d[e];
            a.rowData = g;
            this.hasClass(a) && (g = {
                rowData: g
            }, g.rowIndx = b ? e + c : e, f.push(g))
        }
        return f
    };
    h.getCellsByClass = function(a) {
        var d = this.options,
            b = "remote" == d.pageModel.type ? !0 : !1,
            c = this.rowIndxOffset,
            d = d.dataModel.data,
            f = this.colModel,
            e = f.length,
            l = [],
            g = function(a) {
                for (var d = 0; d < e; d++) {
                    var b = f[d].dataIndx;
                    a.dataIndx = b;
                    this.hasClass(a) && l.push({
                        rowData: a.rowData,
                        dataIndx: b,
                        colIndx: d,
                        rowIndx: a.rowIndx
                    })
                }
            };
        if (null == d) return l;
        if (null != a.rowIndx || null != a.rowIndxPage || null != a.rowData) a.rowData = a.rowData || this.getRowData(a), null == a.rowIndx && (a.rowIndx = this.getRowIndx({
            rowData: m
        })), g(a);
        else
            for (var h = 0, k = d.length; h < k; h++) {
                var m = d[h];
                a.rowData = m;
                a.rowIndx = b ? h + c : h;
                g(a)
            }
        return l
    };
    h.data = function(a) {
        var d = a.dataIndx,
            b = a.data,
            c = null == b || "string" == typeof b ? !0 : !1;
        a = a.rowData || this.getRowData(a);
        if (!a) return null;
        if (null == d) {
            d = a.pq_rowdata;
            if (c) {
                var f;
                null != d && (f = null == b ? d : d[b]);
                return {
                    data: f
                }
            }
            b = k.extend(!0, a.pq_rowdata, b);
            a.pq_rowdata = b
        } else {
            var e = a.pq_celldata;
            if (c) return null != e && (d = e[d], f = null == b || null == d ? d : d[b]), {
                data: f
            };
            e || (a.pq_celldata = {});
            b = k.extend(!0, a.pq_celldata[d], b);
            a.pq_celldata[d] = b
        }
    };
    h.attr = function(a) {
        var d = a.rowIndx,
            b = a.dataIndx,
            c = a.attr,
            f = null == c || "string" == typeof c ? !0 : !1,
            e = this.rowIndxOffset,
            l = a.refresh;
        a = a.rowData || this.getRowData(a);
        if (!a) return null;
        f || !1 === l || null != d || (d = this.getRowIndx({
            rowData: a
        }).rowIndx);
        if (null == b) {
            b = a.pq_rowattr;
            if (f) {
                var g;
                null != b && (g = null == c ? b : b[c]);
                return {
                    attr: g
                }
            }
            c = k.extend(a.pq_rowattr, c);
            a.pq_rowattr = c;
            !1 !== l && null != d && (d = this.getRow({
                rowIndxPage: d - e
            })) && d.attr(c)
        } else {
            var h = a.pq_cellattr;
            if (f) return null != h && (d = h[b], g = null == c || null == d ? d : d[c]), {
                attr: g
            };
            h || (a.pq_cellattr = {});
            c = k.extend(a.pq_cellattr[b],
                c);
            a.pq_cellattr[b] = c;
            !1 !== l && null != d && (d = this.getCell({
                rowIndxPage: d - e,
                dataIndx: b
            })) && d.attr(c)
        }
    };
    h.removeData = function(a) {
        var d = a.dataIndx,
            b = a.data,
            b = null == b ? [] : b,
            b = "string" == typeof b ? b.split(" ") : b,
            c = b.length,
            f = a.rowData || this.getRowData(a);
        if (f)
            if (null == d) {
                if (d = f.pq_rowdata) {
                    if (c)
                        for (a = 0; a < c; a++) {
                            var e = b[a];
                            delete d[e]
                        }
                    c && !k.isEmptyObject(d) || delete f.pq_rowdata
                }
            } else if ((f = f.pq_celldata) && f[d]) {
            var l = f[d];
            if (c)
                for (a = 0; a < c; a++) e = b[a], delete l[e];
            c && !k.isEmptyObject(l) || delete f[d]
        }
    };
    h.removeAttr =
        function(a) {
            var d = a.rowIndx,
                b = a.dataIndx,
                c = a.attr,
                c = null == c ? [] : c,
                c = "string" == typeof c ? c.split(" ") : c,
                f = c.length,
                e = d - this.rowIndxOffset,
                l = a.refresh,
                g = a.rowData || this.getRowData(a);
            if (g)
                if (!1 !== l && null == d && (d = this.getRowIndx({
                        rowData: g
                    }).rowIndx), null == b) {
                    if (b = g.pq_rowattr) {
                        if (f)
                            for (a = 0; a < f; a++) {
                                var h = c[a];
                                delete b[h]
                            } else
                                for (h in b) c.push(h);
                        f && !k.isEmptyObject(b) || delete g.pq_rowattr
                    }!1 !== l && null != d && c.length && (c = c.join(" "), (d = this.getRow({
                        rowIndxPage: e
                    })) && d.removeAttr(c))
                } else {
                    if ((g = g.pq_cellattr) &&
                        g[b]) {
                        var m = g[b];
                        if (f)
                            for (a = 0; a < f; a++) h = c[a], delete m[h];
                        else
                            for (h in m) c.push(h);
                        f && !k.isEmptyObject(m) || delete g[b]
                    }!1 !== l && null != d && c.length && (c = c.join(" "), (d = this.getCell({
                        rowIndxPage: e,
                        dataIndx: b
                    })) && d.removeAttr(c))
                }
        };
    k.paramquery.uniqueArray = function(a) {
        for (var d = [], b = k.inArray, c = 0, f = a.length; c < f; c++) {
            var e = a[c]; - 1 == b(e, d) && d.push(e)
        }
        return d
    };
    h.addClass = function(a) {
        var d = a.rowIndx,
            b = a.dataIndx,
            c = k.paramquery.uniqueArray,
            f = a.cls,
            e = this.rowIndxOffset,
            l = a.refresh,
            g = a.rowData || this.getRowData(a);
        if (g)
            if (!1 !== l && null == d && (d = this.getRowIndx({
                    rowData: g
                }).rowIndx), null == b) {
                var b = g.pq_rowcls,
                    h;
                h = c((b ? b + " " + f : f).split(/\s+/)).join(" ");
                g.pq_rowcls = h;
                !1 !== l && null != d && (d = this.getRow({
                    rowIndxPage: d - e
                })) && d.addClass(f)
            } else {
                a = [];
                "function" != typeof b.push ? a.push(b) : a = b;
                var m = g.pq_cellcls;
                m || (m = g.pq_cellcls = {});
                for (var g = 0, p = a.length; g < p; g++) b = a[g], h = (h = m[b]) ? h + " " + f : f, h = c(h.split(/\s+/)).join(" "), m[b] = h, !1 !== l && null != d && (b = this.getCell({
                    rowIndxPage: d - e,
                    dataIndx: b
                })) && b.addClass(f)
            }
    };
    h.removeClass =
        function(a) {
            var d = a.rowIndx,
                b = this.getRowData(a),
                c = a.dataIndx,
                f = a.cls;
            a = a.refresh;
            if (b) {
                var e = b.pq_cellcls,
                    l = b.pq_rowcls;
                !1 !== a && null == d && (d = this.getRowIndx({
                    rowData: b
                }).rowIndx);
                if (null == c) l && (b.pq_rowcls = this._removeClass(l, f), null != d && !1 !== a && (d = this.getRow({
                    rowIndx: d
                })) && d.removeClass(f));
                else if (e) {
                    l = [];
                    "function" != typeof c.push ? l.push(c) : l = c;
                    for (var g = 0, h = l.length; g < h; g++) {
                        var c = l[g],
                            k = e[c];
                        k && (b.pq_cellcls[c] = this._removeClass(k, f), null != d && !1 !== a && (c = this.getCell({
                                rowIndx: d,
                                dataIndx: c
                            })) &&
                            c.removeClass(f))
                    }
                }
            }
        };
    h.hasClass = function(a) {
        var d = a.dataIndx,
            b = a.cls;
        a = this.getRowData(a);
        b = new RegExp("\\b" + b + "\\b");
        return a ? null == d ? (d = a.pq_rowcls) && b.test(d) ? !0 : !1 : (a = a.pq_cellcls) && a[d] && b.test(a[d]) ? !0 : !1 : null
    };
    h._removeClass = function(a, d) {
        if (a && d) {
            for (var b = a.split(/\s+/), c = d.split(/\s+/), f = [], e = 0, l = b.length; e < l; e++) {
                for (var g = b[e], h = !1, k = 0, m = c.length; k < m; k++)
                    if (g === c[k]) {
                        h = !0;
                        break
                    }
                h || f.push(g)
            }
            return 1 < f.length ? f.join(" ") : 1 === f.length ? f[0] : null
        }
    };
    h.getRowIndx = function(a) {
        var d = a.$tr;
        if (a =
            a.rowData) {
            var d = this.options,
                b = d.dataModel,
                d = "remote" == d.pageModel.type ? !0 : !1,
                c = b.data,
                f = !1,
                b = b.dataUF,
                e = !1;
            if (c)
                for (var l = 0, g = c.length; l < g; l++)
                    if (c[l] == a) {
                        e = !0;
                        break
                    }
            if (!e && b)
                for (f = !0, l = 0, g = b.length; l < g; l++)
                    if (b[l] == a) {
                        e = !0;
                        break
                    }
            return e ? (a = this.rowIndxOffset, {
                rowIndxPage: f ? void 0 : d ? l : l - a,
                uf: f,
                rowIndx: d ? l + a : l
            }) : {}
        }
        if (null == d || 0 == d.length) return {
            rowIndxPage: null
        };
        l = d.attr("pq-row-indx");
        if (null == l) return {
            rowIndxPage: null
        };
        l = parseInt(l);
        return {
            rowIndxPage: l,
            rowIndx: l + this.rowIndxOffset
        }
    };
    var b = function(a) {
            this.options =
                a.options;
            this.that = a;
            var d = this,
                b = a.widgetEventPrefix.toLowerCase();
            a.element.on(b + "celleditkeyup" + a.eventNamespace, function(a, b) {
                return d.filterKeys(a, b)
            })
        },
        f = b.prototype;
    f._incrRowIndx = function(a, d) {
        var b = this.that,
            c = a;
        d = null == d ? 1 : d;
        for (var b = b.pdata, f = 0, e = a + 1, l = b.length; e < l && (b[e].pq_hidden || (f++, c = e, f != d)); e++);
        return c
    };
    f._decrRowIndx = function(a, d) {
        var b = a,
            c = this.that.pdata;
        d = null == d ? 1 : d;
        for (var f = 0, e = a - 1; 0 <= e && (c[e].pq_hidden || (f++, b = e, f != d)); e--);
        return b
    };
    h.addColumn = function(a, d) {
        var b =
            this.options,
            c = b.dataModel.data;
        b.colModel.push(a);
        this._calcThisColModel();
        for (b = 0; b < c.length; b++) c[b].push("")
    };
    h.rowNextSelect = function() {
        var a = this.selection({
                type: "row",
                method: "getSelection"
            }),
            d, b = this.rowIndxOffset;
        a && a[0] && (a = a[0].rowIndx, d = this.iKeyNav._incrRowIndx(a - b));
        null != d && (this.setSelection(null), this._setSelection({
            rowIndxPage: d
        }));
        return d
    };
    h.rowPrevSelect = function() {
        var a = this.selection({
                type: "row",
                method: "getSelection"
            }),
            d, b = this.rowIndxOffset;
        a && a[0] && (a = a[0].rowIndx, d = this.iKeyNav._decrRowIndx(a -
            b));
        null != d && (this.setSelection(null), this.setSelection({
            rowIndxPage: d
        }));
        return d
    };
    f._incrIndx = function(a, d) {
        var b = this.that,
            c = b._getLastVisibleRowIndxPage(b.pdata),
            b = b.colModel,
            f = b.length;
        if (null == d) {
            if (a == c) return null;
            a = this._incrRowIndx(a);
            return {
                rowIndxPage: a
            }
        }
        var e;
        do {
            d++;
            if (d >= f) {
                if (a == c) return null;
                a = this._incrRowIndx(a);
                d = 0
            }
            e = b[d]
        } while (e && e.hidden);
        return {
            rowIndxPage: a,
            colIndx: d
        }
    };
    f._decrIndx = function(a, d) {
        var b = this.that,
            c = b.colModel,
            f = c.length,
            b = b._getFirstVisibleRowIndxPage(b.pdata);
        if (null == d) {
            if (a == b) return null;
            a = this._decrRowIndx(a);
            return {
                rowIndxPage: a
            }
        }
        var e;
        do {
            d--;
            if (0 > d) {
                if (a == b) return null;
                a = this._decrRowIndx(a);
                d = f - 1
            }
            e = c[d]
        } while (e && e.hidden);
        return {
            rowIndxPage: a,
            colIndx: d
        }
    };
    f._incrEditIndx = function(a, d) {
        var b = this.that,
            c = b.colModel,
            f = c.length,
            e, l = b.rowIndxOffset,
            g = b._getLastVisibleRowIndxPage(b.pdata);
        do {
            d++;
            if (d >= f) {
                if (a == g) return null;
                do {
                    a = this._incrRowIndx(a);
                    var h = a + l;
                    e = b.isEditableRow({
                        rowIndx: h
                    });
                    if (a == g && !1 == e) return null
                } while (!1 == e);
                d = 0
            }
            e = c[d];
            h = a + l;
            h = b.isEditableCell({
                rowIndx: h,
                colIndx: d,
                checkVisible: !0
            })
        } while (e && (e.hidden || !1 == h));
        return {
            rowIndxPage: a,
            colIndx: d
        }
    };
    f._decrEditIndx = function(a, d) {
        var b = this.that,
            c = b.colModel,
            f = c.length,
            e, l = b.rowIndxOffset,
            g = b._getFirstVisibleRowIndxPage(b.pdata);
        do {
            d--;
            if (0 > d) {
                if (a == g) return null;
                do {
                    a = this._decrRowIndx(a);
                    var h = a + l;
                    e = b.isEditableRow({
                        rowIndx: h
                    });
                    if (a == g && !1 == e) return null
                } while (!1 == e);
                d = f - 1
            }
            e = c[d];
            h = a + l;
            h = b.isEditableCell({
                rowIndx: h,
                colIndx: d,
                checkVisible: !0
            })
        } while (e && (e.hidden || !1 == h));
        return {
            rowIndxPage: a,
            colIndx: d
        }
    };
    f._incrEditRowIndx =
        function(a, d) {
            var b = this.that,
                c = b.rowIndxOffset,
                f = b._getLastVisibleRowIndxPage(b.pdata);
            if (a == f) return null;
            do {
                a = this._incrRowIndx(a);
                var e = a + c,
                    l = b.isEditableRow({
                        rowIndx: e
                    }),
                    e = b.isEditableCell({
                        rowIndx: e,
                        colIndx: d
                    }),
                    l = l && e;
                if (a == f && !l) return null
            } while (!l);
            return {
                rowIndxPage: a,
                colIndx: d
            }
        };
    f._decrEditRowIndx = function(a, d) {
        var b = this.that,
            c = b.rowIndxOffset,
            f = b._getFirstVisibleRowIndxPage(b.pdata);
        if (a == f) return null;
        do {
            a = this._decrRowIndx(a);
            var e = a + c,
                l = b.isEditableRow({
                    rowIndx: e
                }),
                e = b.isEditableCell({
                    rowIndx: e,
                    colIndx: d
                }),
                l = l && e;
            if (a == f && !l) return null
        } while (!l);
        return {
            rowIndxPage: a,
            colIndx: d
        }
    };
    h._onKeyPressDown = function(a) {
        if (0 < k(a.target).closest(".pq-grid-header").length) return !1 == this._trigger("headerKeyDown", a, {
            dataModel: this.options.dataModel
        }) ? !1 : !0;
        if (!1 === this.iKeyNav._bodyKeyPressDown(a) || !1 == this._trigger("keyDown", a, {
                dataModel: this.options.dataModel
            })) return !1
    };
    f._saveAndMove = function(a, d) {
        if (null == a) return d.preventDefault(), !1;
        var b = this.that,
            c = this.options.selectionModel,
            f = a.rowIndxPage,
            e = a.colIndx;
        b._blurEditMode = !0;
        if (!1 === b.saveEditCell({
                evt: d
            }) || !b.pdata) return b.pdata || b.quitEditMode(d), b._deleteBlurEditMode({
            timer: !0,
            msg: "_saveAndMove saveEditCell"
        }), d.preventDefault(), !1;
        b.quitEditMode(d);
        if (a.incr) var l, f = (l = d.shiftKey ? this._decrEditIndx(f, e) : this._incrEditIndx(f, e)) ? l.rowIndxPage : f,
            e = l ? l.colIndx : e;
        "row" == c.type ? (b.setSelection(null), b.setSelection({
                rowIndxPage: f
            }), b.scrollColumn({
                colIndx: e
            })) : "cell" == c.type ? (b.setSelection(null), b.setSelection({
                rowIndxPage: f,
                colIndx: e
            })) :
            (b.scrollRow({
                rowIndxPage: f
            }), b.scrollColumn({
                colIndx: e
            }));
        !1 !== a.edit && b._editCell({
            rowIndxPage: f,
            colIndx: e
        });
        b._deleteBlurEditMode({
            timer: !0,
            msg: "_saveAndMove"
        });
        d.preventDefault();
        return !1
    };
    f._keyPressInEdit = function(a, d) {
        var b = this.that,
            c = b.options.editModel.indices;
        d = d ? d : {};
        var f = d.FK,
            e = "Backspace Left Right Up Down Del Home End".split(" "),
            l = c.column.dataType;
        return a.key && -1 !== k.inArray(a.key, e) ? !0 : !1 === b._trigger("editorKeyPress", a, k.extend({}, c)) || f && ("float" == l || "integer" == l) && (b = "float" ==
            l ? "0123456789.-" : "0123456789-", c = (c = a.charCode) ? c : a.keyCode, (c = String.fromCharCode(c)) && -1 == b.indexOf(c)) ? !1 : !0
    };
    f.getValText = function(a) {
        a = a[0].nodeName.toLowerCase();
        var d = "text"; - 1 != k.inArray(a, ["input", "textarea", "select"]) && (d = "val");
        return d
    };
    f._keyUpInEdit = function(a, d) {
        var b = this.that,
            c = b.options;
        d = d ? d : {};
        var f = d.FK,
            c = c.editModel,
            e = c.indices;
        b._trigger("editorKeyUp", a, k.extend({}, e));
        b = e.column.dataType;
        if (f && ("float" == b || "integer" == b)) {
            var f = k(a.target),
                e = "integer" == b ? c.reInt : c.reFloat,
                c =
                this.getValText(f),
                l = f.data("oldVal"),
                g = f[c]();
            if (!1 == e.test(g))
                if (e.test(l)) f[c](l);
                else if (b = "float" == b ? parseFloat(l) : parseInt(l), isNaN(b)) f[c](0);
            else f[c](b)
        }
    };
    f._keyDownInEdit = function(a) {
        var d = this.that,
            b = d.options,
            c = b.editModel.indices;
        if (c) {
            var f = k(a.target),
                e = k.ui.keyCode,
                l = b.selectionModel,
                g = b.editModel,
                c = k.extend({}, c),
                b = c.rowIndxPage,
                h = c.colIndx,
                m = c.column.editModel,
                g = m ? k.extend({}, g, m) : g,
                m = this.getValText(f);
            f.data("oldVal", f[m]());
            if (!1 == d._trigger("cellEditKeyDown", a, c) || !1 == d._trigger("editorKeyDown",
                    a, c)) return !1;
            if (a.keyCode == e.TAB) return c = {
                rowIndxPage: b,
                colIndx: h,
                incr: !0
            }, this._saveAndMove(c, a);
            if (a.keyCode == g.saveKey) return c = "next" == g.onSave ? {
                rowIndxPage: b,
                colIndx: h,
                incr: !0
            } : {
                rowIndxPage: b,
                colIndx: h,
                edit: !1
            }, this._saveAndMove(c, a);
            if (a.keyCode == e.ESCAPE) return d.quitEditMode({
                evt: a
            }), "cell" == l.type ? d.getCell({
                rowIndxPage: b,
                colIndx: h
            }).attr("tabindex", 0).focus() : "row" == l.type && (d = d.getRow({
                rowIndxPage: b
            }), k(d[0]).attr("tabindex", 0).focus()), a.preventDefault(), !1;
            if (a.keyCode == e.PAGE_UP ||
                a.keyCode == e.PAGE_DOWN) return a.preventDefault(), !1;
            if (g.keyUpDown) {
                if (a.keyCode == e.DOWN) return c = this._incrEditRowIndx(b, h), this._saveAndMove(c, a);
                if (a.keyCode == e.UP) return c = this._decrEditRowIndx(b, h), this._saveAndMove(c, a)
            }
        }
    };
    f.select = function(a) {
        var d = this.that,
            b = a.rowIndx,
            c = a.colIndx,
            f = d.options.selectionModel;
        a = a.evt;
        a.shiftKey && "single" != f.mode ? "row" == f.type ? (d.scrollRow({
            rowIndx: b
        }), d.iRows.extendSelection({
            rowIndx: b,
            evt: a
        })) : "cell" == f.type && (d.scrollCell({
            rowIndx: b,
            colIndx: c
        }), d.iCells.extendSelection({
            rowIndx: b,
            colIndx: c,
            evt: a
        })) : d.setSelection({
            rowIndx: b,
            colIndx: c,
            evt: a,
            setFirst: !0
        })
    };
    f._bodyKeyPressDown = function(a) {
        var d = this.that,
            b, c, f = d.rowIndxOffset,
            e = this.options,
            l = d.colModel,
            g = e.selectionModel,
            h = e.editModel,
            m = a.ctrlKey || a.metaKey,
            p, q, t = k.ui.keyCode,
            w = a.keyCode;
        if (h.indices) d.$div_focus.find(".pq-cell-focus").focus();
        else {
            if ("row" == g.type) {
                c = m ? d.iRows.getFocusSelection({
                    old: !0
                }) : d.iRows.getFocusSelection({
                    old: !1
                });
                if (null == c) return;
                p = c.rowIndx;
                e = p - f;
                if (null == p) return;
                if (!1 == d._trigger("rowKeyDown",
                        a, {
                            rowData: d.pdata[e],
                            rowIndx: p,
                            rowIndxPage: e
                        })) return !1
            } else if ("cell" == g.type) {
                b = m ? d.iCells.getFocusSelection({
                    old: !0
                }) : d.iCells.getFocusSelection({
                    old: !1
                });
                if (null == b) return;
                q = b;
                p = q.rowIndx;
                var e = p - f,
                    y = q.dataIndx;
                q = d.getColIndx({
                    dataIndx: y
                });
                if (null == p || null == q) return;
                if (!1 == d._trigger("cellKeyDown", a, {
                        rowData: d.pdata[e],
                        rowIndx: p,
                        rowIndxPage: e,
                        colIndx: q,
                        dataIndx: y,
                        column: l[q]
                    })) return !1;
                if (a.cancelBubble) return
            } else return;
            if (w == t.LEFT) {
                if (q = this._decrIndx(e, q)) p = q.rowIndxPage + f, this.select({
                    rowIndx: p,
                    colIndx: q.colIndx,
                    evt: a
                });
                a.preventDefault()
            } else if (w == t.RIGHT) {
                if (q = this._incrIndx(e, q)) p = q.rowIndxPage + f, this.select({
                    rowIndx: p,
                    colIndx: q.colIndx,
                    evt: a
                });
                a.preventDefault()
            } else if (w == t.UP) e = this._decrRowIndx(e), null != e && this.select({
                rowIndx: e + f,
                colIndx: q,
                evt: a
            }), a.preventDefault();
            else if (w == t.DOWN) e = this._incrRowIndx(e), null != e && this.select({
                rowIndx: e + f,
                colIndx: q,
                evt: a
            }), a.preventDefault();
            else if (w == t.PAGE_DOWN || w == t.SPACE) {
                if (d = this.pageDown(e)) e = d.rowIndxPage, null != e && this.select({
                    rowIndx: e +
                        f,
                    colIndx: q,
                    evt: a
                });
                a.preventDefault()
            } else if (w == t.PAGE_UP) {
                if (d = this.pageUp(e)) e = d.rowIndxPage, null != e && this.select({
                    rowIndx: e + f,
                    colIndx: q,
                    evt: a
                });
                a.preventDefault()
            } else w == t.HOME ? ("row" == g.type || m ? (p = d._getFirstVisibleRowIndxPage(d.pdata) + f, this.select({
                rowIndx: p,
                colIndx: q,
                evt: a
            })) : "cell" == g.type && (q = d._getFirstVisibleColIndx(), this.select({
                rowIndx: p,
                colIndx: q,
                evt: a
            })), a.preventDefault()) : w == t.END ? ("row" == g.type || m ? (p = d._getLastVisibleRowIndxPage(d.pdata) + f, this.select({
                    rowIndx: p,
                    colIndx: q,
                    evt: a
                })) :
                "cell" == g.type && (q = d._getLastVisibleColIndx(), this.select({
                    rowIndx: p,
                    colIndx: q,
                    evt: a
                })), a.preventDefault()) : w == t.ENTER ? ("row" == g.type ? null != c && d.editFirstCellInRow({
                rowIndx: e + f
            }) : null != b && (b = d.getCell({
                rowIndxPage: e,
                colIndx: q
            })) && 0 < b.length && (p = e + f, f = d.isEditableRow({
                rowIndx: p
            }), b = d.isEditableCell({
                rowIndx: p,
                colIndx: q
            }), f && b && d.editCell({
                rowIndxPage: e,
                colIndx: q
            })), a.preventDefault()) : m && "65" == w ? ("row" == g.type && "single" != g.mode ? d.iRows.selectAll({
                    all: g.all
                }) : "cell" == g.type && "single" != g.mode && d.iCells.selectAll({
                    all: g.all
                }),
                a.preventDefault()) : h.pressToEdit && 32 <= w && 127 >= w && !m && null != b && (b = d.getCell({
                rowIndxPage: e,
                colIndx: q
            })) && 0 < b.length && (p = e + f, f = d.isEditableRow({
                rowIndx: p
            }), b = d.isEditableCell({
                rowIndx: p,
                colIndx: q
            }), f && b && d.editCell({
                rowIndxPage: e,
                colIndx: q,
                select: !0
            }))
        }
    };
    f.incrPageSize = function() {
        for (var a = this.that, d = a.$tbl, b = d.children("tbody").children("tr.pq-grid-row").not(".pq-group-row,.pq-summary-row"), d = parseInt(d.css("marginTop")), d = a.iRefresh.getEContHt() - d, c = b.length - 1; 0 <= c; c--) {
            var f = b[c];
            if (f.offsetTop <
                d) break
        }
        return {
            rowIndxPage: a.getRowIndx({
                $tr: k(f)
            }).rowIndxPage
        }
    };
    f.pageNonVirtual = function(a, d) {
        var b = this.that,
            c = b.$cont[0].offsetHeight - b._getSBHeight(),
            f = b.getRow({
                rowIndxPage: a
            }),
            e = 0,
            l = 0,
            g = k(f[0])[d]("tr.pq-grid-row"),
            h = g.length;
        if (0 < h) {
            do {
                f = g[l];
                e += f.offsetHeight;
                if (e >= c) break;
                l++
            } while (l < h);
            l = 0 < l ? l - 1 : l;
            do
                if (f = k(g[l]), a = b.getRowIndx({
                        $tr: f
                    }).rowIndxPage, null != a) break;
                else l--;
            while (0 <= l)
        }
        return a
    };
    f.pageDown = function(a) {
        var d = this.that,
            b = d.options,
            c = d.$vscroll.pqScrollBar("option"),
            f = c.cur_pos,
            e = c.num_eles,
            c = c.ratio;
        if (b.virtualY) {
            if (f < e - 1) {
                a = this.incrPageSize().rowIndxPage;
                var l = d._calcCurPosFromRowIndxPage(a);
                if (null == l) return;
                d.$vscroll.pqScrollBar("option", "cur_pos", l).pqScrollBar("scroll")
            }
        } else null != a ? a = this.pageNonVirtual(a, "nextAll") : 1 > c && (b = d.iRefresh.getEContHt(), d = d.iMouseSelection, d.updateTableY(-1 * b), d.syncScrollBarVert());
        return {
            rowIndxPage: a,
            curPos: l
        }
    };
    f.pageUp = function(a) {
        var d = this.that,
            b = d.options,
            c = d.$vscroll.pqScrollBar("option"),
            f = c.cur_pos,
            c = c.ratio;
        if (b.virtualY) {
            if (0 <
                f) {
                a = this.decrPageSize().rowIndxPage;
                var e = d._calcCurPosFromRowIndxPage(a);
                if (null == e) return;
                d.$vscroll.pqScrollBar("option", "cur_pos", e).pqScrollBar("scroll")
            }
        } else null != a ? a = this.pageNonVirtual(a, "prevAll") : 0 < c && (b = d.iRefresh.getEContHt(), d = d.iMouseSelection, d.updateTableY(b), d.syncScrollBarVert());
        return {
            rowIndxPage: a,
            curPos: e
        }
    };
    f.decrPageSize = function() {
        var a = this.that,
            d = a.$tbl.children("tbody").children("tr.pq-grid-row").not(".pq-group-row,.pq-summary-row"),
            b = a.options.freezeRows,
            c = 0;
        if (d.length) {
            var f;
            b ? (f = d.filter("tr.pq-last-frozen-row"), f.length && (f = f.next())) : 2 <= d.length && (f = k(d[1]));
            f && f.length && (c = a.getRowIndx({
                $tr: f
            }).rowIndxPage, c = c - a.pageSize + 4, 0 > c && (c = 0))
        }
        return {
            rowIndxPage: c
        }
    };
    h._calcNumHiddenFrozens = function() {
        for (var a = 0, d = this.options.freezeCols, b = 0; b < d; b++) this.colModel[b].hidden && a++;
        return a
    };
    h._calcNumHiddenUnFrozens = function(a) {
        var d = 0;
        a = null != a ? a : this.colModel.length;
        for (var b = this.options.freezeCols; b < a; b++) this.colModel[b].hidden && d++;
        return d
    };
    h._getSBHeight = function() {
        return this.iRefresh.getSBHeight()
    };
    h._getSBWidth = function(a) {
        return this.iRefresh.getSBWidth()
    };
    h._getFirstVisibleRowIndxPage = function(a) {
        for (var d = 0, b = a.length; d < b; d++)
            if (!a[d].pq_hidden) return d
    };
    h._getLastVisibleRowIndxPage = function(a) {
        for (var d = a.length - 1; 0 <= d; d--)
            if (!a[d].pq_hidden) return d;
        return null
    };
    h._getFirstVisibleColIndx = function() {
        for (var a = this.colModel, d = a.length, b = 0; b < d; b++)
            if (!a[b].hidden) return b;
        return null
    };
    h._getLastVisibleColIndx = function() {
        for (var a = this.colModel, d = a.length - 1; 0 <= d; d--)
            if (!a[d].hidden) return d;
        return null
    };
    h.getTotalVisibleColumns = function() {
        for (var a = this.colModel, d = a.length, b = 0, c = 0; c < d; c++) a[c].hidden || b++;
        return b
    };
    h._calcCurPosFromRowIndxPage = function(a) {
        var d = this.options,
            b = d.groupModel,
            c = b ? this.dataGM : this.pdata,
            f = d.freezeRows;
        if (a < f) return 0;
        for (var d = 0, e = f, l = c.length; f < l; f++) {
            var g = c[f];
            if (!b || !g.groupSummary && !g.groupTitle) {
                if (e == a) break;
                e++
            }
            g.pq_hidden || d++
        }
        return d >= l ? null : d
    };
    h._calcCurPosFromColIndx = function(a) {
        var b = this.colModel,
            c = this.options.freezeCols;
        if (a < c) return 0;
        for (var f =
                0, e = c, l = b.length; c < l; c++) {
            var g = b[c];
            if (e == a) break;
            e++;
            g.hidden || f++
        }
        return f >= l ? null : f
    };
    var l = function(a, b, c) {
        var f = 0,
            e = this.options,
            l = e.columnBorders ? 1 : 0,
            g = e.numberCell,
            e = this.colModel; - 1 == a && (g.show && (f = c ? f + (parseInt(g.width) + 1) : f + g.outerWidth), a = 0);
        if (c)
            for (; a < b; a++) {
                if ((c = e[a]) && !c.hidden) {
                    if (!c._width) throw "assert failed";
                    f += c._width + l
                }
            } else
                for (; a < b; a++)(c = e[a]) && !c.hidden && (f += c.outerWidth);
        return f
    };
    k.paramquery.pqgrid.calcWidthCols = l;
    h.calcHeightFrozenRows = function() {
        var a = this.$tbl,
            b = 0;
        a && a.length && (a = k(a[0]).find("tr.pq-last-frozen-row")) && a.length && (b = a[0], b = b.offsetTop + b.offsetHeight);
        return b
    };
    h._calcRightEdgeCol = function(a) {
        var b = 0,
            c = 0,
            f = this.colModel,
            e = this.hidearrHS,
            l = this.options.numberCell;
        l.show && (b += l.outerWidth, c++);
        for (l = 0; l <= a; l++) {
            var g = f[l];
            g.hidden || !1 != e[l] || (b += g.outerWidth, c++)
        }
        return {
            width: b,
            cols: c
        }
    };
    h.nestedCols = function(a, b, c) {
        var f = a.length,
            e = [];
        null == b && (b = 1);
        for (var l = b, g = 0, h = 0, k = 0; k < f; k++) {
            var m = a[k];
            if (!0 === c || !1 === c) m.hidden = c;
            if (null != m.colModel && 0 <
                m.colModel.length) {
                var p = this.nestedCols(m.colModel, b + 1, m.hidden),
                    e = e.concat(p.colModel);
                0 < p.colSpan ? (p.depth > l && (l = p.depth), m.colSpan = p.colSpan, g += p.colSpan) : (m.colSpan = 0, m.hidden = !0);
                m.childCount = p.childCount;
                h += p.childCount
            } else m.hidden ? m.colSpan = 0 : (m.colSpan = 1, g++), m.childCount = 0, h++, e.push(m)
        }
        return {
            depth: l,
            colModel: e,
            colSpan: g,
            width: 0,
            childCount: h
        }
    };
    h.getHeadersCells = function() {
        for (var a = this.options.colModel, b = this.colModel.length, c = this.depth, f = [], e = 0; e < c; e++) {
            f[e] = [];
            for (var l = 0, g = 0, h = 0; h <
                b; h++) {
                var k;
                if (0 == e) k = a[l];
                else {
                    var m = f[e - 1][h];
                    k = m.colModel;
                    if (null == k || 0 == k.length) k = m;
                    else {
                        for (var m = h - m.leftPos, p = 0, q = 0, t = 0; t < k.length; t++)
                            if (p += 0 < k[t].childCount ? k[t].childCount : 1, m < p) {
                                q = t;
                                break
                            }
                        k = k[q]
                    }
                }
                m = k.childCount ? k.childCount : 1;
                h == g ? (k.leftPos = h, f[e][h] = k, g += m, a[l + 1] && l++) : f[e][h] = f[e][h - 1]
            }
        }
        return this.headerCells = f
    };
    h.getDataType = function() {
        var a = this.colModel;
        if (a && a[0]) return "string" == typeof a[0].dataIndx ? "JSON" : "ARRAY";
        throw "dataType unknown";
    };
    h.assignRowSpan = function() {
        for (var a =
                this.colModel.length, b = this.headerCells, c = this.depth, f = 0; f < a; f++)
            for (var e = 0; e < c; e++) {
                var l = b[e][f];
                if (!(0 < f && l == b[e][f - 1] || 0 < e && l == b[e - 1][f])) {
                    for (var g = 1, h = e + 1; h < c; h++) l == b[h][f] && g++;
                    l.rowSpan = g
                }
            }
        return b
    };
    h._calcThisColModel = function() {
        var a = this.options,
            b = a.columnTemplate,
            a = this.nestedCols(a.colModel);
        this.colModel = a.colModel;
        this.depth = a.depth;
        var a = this.colModel,
            c = a.length;
        if (b)
            for (var f = 0; f < c; f++) {
                var e = a[f],
                    l = k.extend({}, b, e, !0);
                k.extend(e, l, !0)
            }
        this.getHeadersCells();
        this.assignRowSpan();
        this._refreshDataIndices()
    };
    h._createHeader = function() {
        this.iHeader.createHeader()
    };
    h.createTable = function(a) {
        this.iGenerateView.generateView(a);
        this.iRefresh.setContAndHeaderHeight();
        this.iGenerateView.setPanes();
        this.iRefresh.refreshScrollbars()
    };
    k.widget("paramquery._pqGrid", k.ui.mouse, h)
})(jQuery);
(function(k) {
    function h(e) {
        this.that = e
    }
    var m = k.paramquery.pqgrid.calcWidthCols;
    k.paramquery._pqGrid.prototype.getHeaderColumnFromTD = function(e) {
        var c = e.attr("pq-col-indx");
        e = e.attr("pq-row-indx");
        var f;
        null != c && null != e && (c = parseInt(c), e = parseInt(e), f = this.headerCells[e][c]);
        var b = !0;
        if (!f || f.colModel && f.colModel.length) b = !1;
        return {
            column: f,
            colIndx: c,
            rowIndx: e,
            leaf: b
        }
    };
    k.paramquery.cHeader = h;
    var g = h.prototype;
    g.createHeader = function() {
        var e = this.that,
            c = this,
            f = e.options,
            b = f.hwrap,
            l = e.pqpanes,
            a = parseInt(f.freezeCols),
            d = f.numberCell,
            g = e.colModel,
            h = e.depth,
            B = f.virtualX,
            z = f.virtualXHeader,
            v = !1 === z ? e.initHH : e.initH,
            z = !1 === z ? e.finalHH : e.finalH,
            s = e.headerCells,
            r = e.$header,
            x = e.$header_o;
        if (null == z) throw "finalH required for _createHeader";
        if (!1 === f.showHeader) r && r.empty(), x.css("display", "none");
        else {
            x.css("display", "");
            r = "pq-grid-header-table ";
            r = ["<table class='" + (b ? r + "pq-wrap " : r + "pq-no-wrap ") + "' cellpadding=0 cellspacing=0 >"];
            if (1 <= h) {
                r.push("<tr>");
                d.show && r.push("<td style='width:" + (d.width + 1) + "px;' ></td>");
                for (f = 0; f <= z; f++) {
                    if (f < v && f >= a && B && (f = v, f > z)) throw "initH>finalH";
                    b = g[f];
                    b.hidden || (b = b.outerWidth, r.push("<td style='width:" + b + "px;' pq-col-indx=" + f + "></td>"))
                }
                r.push("</tr>")
            }
            for (b = 0; b < h; b++) {
                r.push("<tr class='pq-grid-title-row'>");
                0 == b && d.show && r.push(["<td pq-col-indx='-1' class='pq-grid-number-col' rowspan='", h, "'><div class='pq-td-div'>", d.title ? d.title : "&nbsp;", "</div></td>"].join(""));
                for (f = 0; f <= z; f++) {
                    if (f < v && f >= a && B && (f = v, f > z)) throw "initH>finalH";
                    c.createHeaderCell(b, f, s, r, "pq-grid-col ",
                        a, v, h)
                }
                r.push("</tr>")
            }
            e.ovCreateHeader(r, "pq-grid-col ");
            r.push("</table>");
            d = r.join("");
            x.empty();
            l.vH ? x.append(["<span class='pq-grid-header pq-grid-header-left ui-state-default'>", d, "</span><span class='pq-grid-header ui-state-default'>", d, "</span>"].join("")) : x.append(["<span class='pq-grid-header ui-state-default'>", d, "</span>"].join(""));
            r = e.$header = k(".pq-grid-header", x);
            e.$tbl_header = r.children("table");
            b = m.call(e, -1, a);
            d = e.$header_left = k(r[0]);
            l.vH && (d = e.$header_left = k(r[0]), l = e.$header_right =
                k(r[1]), d.css({
                    width: b,
                    zIndex: 1
                }), a = m.call(e, a, v), l.css({
                    left: -1 * a + "px"
                }));
            r.click(function(a) {
                return c._onHeaderClick(a)
            });
            c._refreshResizeColumn(v, z, g);
            e._trigger("refreshHeader", null, null)
        }
    };
    g._onHeaderClick = function(e) {
        var c = this.that;
        if (!c.iDragColumns || "stop" == c.iDragColumns.status) {
            var f = k(e.target).closest("td.pq-grid-col");
            if (f.length && (e.stopImmediatePropagation(), f = c.getHeaderColumnFromTD(f), c = f.colIndx, !1 != f.leaf)) return this._onHeaderCellClick(c, e)
        }
    };
    g.createHeaderCell = function(e, c, f,
        b, l, a, d, g) {
        var h = f[e][c],
            k = h.colSpan,
            m = h.halign,
            v = h.align,
            s = h.title;
        if (!(0 < e && h == f[e - 1][c] || 0 < c && h == f[e][c - 1] || h.hidden)) {
            f = l;
            null != m ? f += " pq-align-" + m : null != v && (f += " pq-align-" + v);
            c == a - 1 && 1 == g && (f += " pq-last-frozen-col");
            c <= a - 1 ? f += " pq-left-col" : c >= d && (f += " pq-right-col");
            (a = h.cls) && (f = f + " " + a);
            if (null == h.colModel || 0 == h.colModel.length) f += " pq-grid-col-leaf";
            b.push(["<td  ", "pq-col-indx=" + c, " ", "pq-row-indx=" + e, "  class='", f, "' rowspan=", h.rowSpan, " colspan=", k, "><div class='pq-td-div'>", s ? s : "",
                "<span class='pq-col-sort-icon'>&nbsp;</span></div></td>"
            ].join(""))
        }
    };
    g._onHeaderCellClick = function(e, c) {
        var f = this.that,
            b = f.colModel[e],
            l = f.options,
            a = b.dataIndx;
        !1 !== f._trigger("headerCellClick", c, {
            column: b,
            colIndx: e,
            dataIndx: a
        }) && l.sortable && !1 != b.sortable && f.sort({
            colIndx: e,
            column: b,
            dataIndx: a
        })
    };
    g._refreshResizeColumn = function(e, c, f) {
        var b = this.that,
            l = b.options,
            a = l.filterModel.ficon ? !0 : !1,
            d = l.numberCell,
            l = parseInt(l.freezeCols),
            g = [],
            h = [],
            k = b.pqpanes.vH,
            m = 0,
            v = 0;
        d.show && (m = d.outerWidth, d.resizable &&
            g.push("<div pq-col-indx='-1' style='left:", m - 5, "px;'", " class='pq-grid-col-resize-handle'>&nbsp;</div>"));
        for (d = 0; d <= c; d++) {
            if (d < e && d >= l && (d = e, d > c)) throw "initH>finalH";
            v = f[d];
            if (!v.hidden) {
                var s = v.ficon,
                    r = s || null == s && a,
                    s = g,
                    m = m + v.outerWidth;
                if (!1 !== v.resizable || r) k && d >= l && (s = h), v = m - 5, s.push("<div pq-col-indx='", d, "' style='left:", v, "px;'", " class='pq-grid-col-resize-handle'>&nbsp;</div>")
            }
        }
        h.length && b.$header_right.append(h.join(""));
        b.$header_left.append(g.join(""))
    };
    g.refreshHeaderSortIcons = function() {
        var e =
            this.that,
            c = e.iSort.sorters,
            f = e.$header;
        if (f) {
            f.find(".pq-grid-col-leaf").removeClass("pq-col-sort-asc pq-col-sort-desc ui-state-active");
            f.find(".pq-col-sort-icon").removeClass("ui-icon ui-icon-triangle-1-n ui-icon-triangle-1-s");
            for (var b = 0; b < c.length; b++) {
                var l = c[b],
                    a = e.getColIndx({
                        dataIndx: l.dataIndx
                    }),
                    d = l.dir,
                    l = "ui-state-active pq-col-sort-" + ("up" == d ? "asc" : "desc"),
                    d = "ui-icon ui-icon-triangle-1-" + ("up" == d ? "n" : "s");
                f.find(".pq-grid-col-leaf[pq-col-indx=" + a + "]").addClass(l);
                f.find(".pq-grid-col-leaf[pq-col-indx=" +
                    a + "] .pq-col-sort-icon").addClass(d)
            }
        }
    };
    g = function(e) {
        this.that = e;
        var c = this;
        e.$header_o.on({
            mousedown: function(f) {
                if (!f.pq_composed) {
                    var b = k(f.target);
                    c.setDraggables(f);
                    f.pq_composed = !0;
                    f = k.Event("mousedown", f);
                    b.trigger(f)
                }
            }
        }, ".pq-grid-col-resize-handle")
    };
    k.paramquery.cResizeColumns = g;
    g = g.prototype;
    g.setDraggables = function(e) {
        var c = this,
            f, b, l;
        k(e.target).draggable({
            axis: "x",
            helper: function(a, b) {
                var f = k(a.target),
                    e = parseInt(f.attr("pq-col-indx"));
                c._setDragLimits(e);
                c._getDragHelper(a, b);
                return f
            },
            start: function(a, b) {
                f = b.position.left;
                l = parseInt(c.$cl[0].style.left)
            },
            drag: function(a, d) {
                b = d.position.left;
                c.$cl[0].style.left = l + (b - f) + "px"
            },
            stop: function(a, b) {
                return c.resizeStop(a, b, f)
            }
        })
    };
    g._getDragHelper = function(e) {
        var c = this.that,
            f = parseInt(c.options.freezeCols);
        e = k(e.target);
        this.$cl = k("<div class='pq-grid-drag-bar'></div>").appendTo(c.$grid_inner);
        this.$clleft = k("<div class='pq-grid-drag-bar'></div>").appendTo(c.$grid_inner);
        e = parseInt(e.attr("pq-col-indx"));
        var b = c.$grid_inner.outerHeight();
        this.$cl.height(b);
        this.$clleft.height(b);
        var b = k("td[pq-col-indx=" + e + "]", c.$header)[0],
            l = b.offsetLeft;
        c.pqpanes.vH ? e >= f && (l += c.$header[1].offsetLeft) : l += c.$header[0].offsetLeft;
        this.$clleft.css({
            left: l
        });
        l += b.offsetWidth;
        this.$cl.css({
            left: l
        })
    };
    g._setDragLimits = function(e) {
        if (!(0 > e)) {
            var c = this.that,
                f = c.colModel[e],
                b = c.$header_left;
            e >= c.options.freezeCols && c.pqpanes.vH && (b = c.$header_right);
            c = b.find("td[pq-col-indx='" + e + "']").offset().left + f._minWidth;
            f = c + f._maxWidth - f._minWidth;
            b.find("div.pq-grid-col-resize-handle[pq-col-indx=" +
                e + "]").draggable("option", "containment", [c, 0, f, 0])
        }
    };
    g.resizeStop = function(e, c, f) {
        var b = this.that,
            l = b.colModel,
            a = b.options.numberCell;
        this.$clleft.remove();
        this.$cl.remove();
        f = c.position.left - f;
        c = k(c.helper);
        c = parseInt(c.attr("pq-col-indx"));
        if (-1 == c) {
            var l = null,
                d = parseInt(a.width);
            a.width = d + f
        } else l = l[c], d = parseInt(l.width), l.width = d + f, l._resized = !0;
        b.refresh();
        b._trigger("columnResize", e, {
            colIndx: c,
            column: l,
            dataIndx: l ? l.dataIndx : null,
            oldWidth: d,
            newWidth: l ? l.width : a.width
        })
    };
    g = function(e) {
        this.that =
            e;
        this.$drag_helper = null;
        var c = e.options.dragColumns,
            f = c.topIcon,
            b = c.bottomIcon,
            l = this;
        this.status = "stop";
        this.$arrowTop = k("<div class='pq-arrow-down ui-icon " + f + "'></div>").appendTo(e.element);
        this.$arrowBottom = k("<div class='pq-arrow-up ui-icon " + b + "' ></div>").appendTo(e.element);
        this.hideArrows();
        if (c && c.enabled) e.$header_o.on("mousedown", "td.pq-grid-col", function(a, b) {
            if (!k(a.target).is("input,select,textarea") && !a.pq_composed) {
                l.setDraggables(a, b);
                a.pq_composed = !0;
                var c = k.Event("mousedown",
                    a);
                k(a.target).trigger(c)
            }
        })
    };
    k.paramquery.cDragColumns = g;
    g = g.prototype;
    g.showFeedback = function(e, c) {
        var f = this.that,
            b = e[0],
            l = b.offsetLeft + b.offsetParent.offsetParent.offsetLeft + (c ? 0 : b.offsetWidth) - 8,
            a = f.$grid_inner[0].offsetTop + f.$header[0].offsetHeight;
        this.$arrowTop.css({
            left: l,
            top: f.$grid_inner[0].offsetTop + b.offsetTop - 16,
            display: ""
        });
        this.$arrowBottom.css({
            left: l,
            top: a,
            display: ""
        })
    };
    g.showArrows = function() {
        this.$arrowTop.show();
        this.$arrowBottom.show()
    };
    g.hideArrows = function() {
        this.$arrowTop.hide();
        this.$arrowBottom.hide()
    };
    g.updateDragHelper = function(e) {
        var c = this.that.options.dragColumns,
            f = c.acceptIcon,
            c = c.rejectIcon,
            b = this.$drag_helper;
        b && (e ? (b.children("span.pq-drag-icon").addClass(f).removeClass(c), b.removeClass("ui-state-error")) : (b.children("span.pq-drag-icon").removeClass(f).addClass(c), b.addClass("ui-state-error")))
    };
    g.setDraggables = function(e, c) {
        var f = k(e.currentTarget),
            b = this.that,
            l = b.options.dragColumns.rejectIcon,
            a = this;
        f.hasClass("ui-draggable") || !1 !== b.getHeaderColumnFromTD(f).leaf &&
            f.draggable({
                distance: 10,
                cursorAt: {
                    top: -18,
                    left: -10
                },
                zIndex: "1000",
                appendTo: b.element,
                revert: "invalid",
                helper: function() {
                    var d = k(this);
                    a.status = "helper";
                    a.setDroppables(d);
                    b.$header.find(".pq-grid-col-resize-handle").hide();
                    var c = d.attr("pq-col-indx"),
                        f = d.attr("pq-row-indx");
                    d.droppable("destroy");
                    d = k("<div class='pq-col-drag-helper ui-widget-content ui-corner-all' ><span class='pq-drag-icon ui-icon " + l + "'></span>" + b.headerCells[f][c].title + "</div>");
                    a.$drag_helper = d;
                    return d[0]
                },
                drag: function(d,
                    c) {
                    a.status = "drag";
                    var f = k("td.pq-drop-hover", b.$header);
                    if (0 < f.length) {
                        a.showArrows();
                        a.updateDragHelper(!0);
                        var e = f.width();
                        d.clientX - f.offset().left + k(document).scrollLeft() < e / 2 ? (a.leftDrop = !0, a.showFeedback(f, !0)) : (a.leftDrop = !1, a.showFeedback(f, !1))
                    } else a.hideArrows(), b.$toolbar.hasClass("pq-drop-hover") ? a.updateDragHelper(!0) : a.updateDragHelper()
                },
                stop: function(d, c) {
                    a.status = "stop";
                    b.$header.find(".pq-grid-col-resize-handle").show();
                    a.hideArrows()
                }
            })
    };
    g._columnIndexOf = function(e, c) {
        for (var f =
                0, b = e.length; f < b; f++)
            if (e[f] == c) return f;
        return -1
    };
    g.setDroppables = function(e) {
        var c = this.that,
            f = this,
            b = {
                hoverClass: "pq-drop-hover ui-state-highlight",
                tolerance: "pointer",
                drop: function(a, b) {
                    if (!f.dropPending) {
                        var e = parseInt(b.draggable.attr("pq-col-indx")),
                            l = parseInt(b.draggable.attr("pq-row-indx")),
                            g = k(this),
                            h = parseInt(g.attr("pq-col-indx")),
                            m = parseInt(g.attr("pq-row-indx")),
                            s = c.options.colModel,
                            r = c.headerCells,
                            g = r[l][e],
                            l = 0 == l ? s : r[l - 1][e].colModel,
                            e = 0 == m ? s : r[m - 1][h].colModel,
                            h = r[m][h],
                            g = f._columnIndexOf(l,
                                g),
                            g = l.splice(g, 1)[0],
                            h = f._columnIndexOf(e, h);
                        e.splice(h + 1 - (f.leftDrop ? 1 : 0), 0, g);
                        f.dropPending = !0;
                        window.setTimeout(function() {
                            c._calcThisColModel();
                            c.refresh();
                            f.dropPending = !1
                        }, 0)
                    }
                }
            };
        e = c.$header_left.find("td.pq-left-col");
        var l = c.pqpanes.v || c.pqpanes.vH ? c.$header_right.find("td.pq-right-col") : c.$header_left.find("td.pq-right-col");
        e = e.add(l);
        e.each(function(a, d) {
            var c = k(d);
            c.hasClass("ui-droppable") || c.droppable(b)
        })
    }
})(jQuery);
(function(k) {
    function h(g) {
        var e = this;
        this.that = g;
        this.type = "detail";
        this.refreshComplete = !0;
        this.detachView = !1;
        var c = g.widgetEventPrefix.toLowerCase(),
            f = g.eventNamespace;
        g.element.on(c + "cellclick" + f, function(b, c) {
            if (e.belongs(b)) return e.toggle(b, c)
        }).on(c + "cellkeydown" + f, function(b, c) {
            if (e.belongs(b) && b.keyCode == k.ui.keyCode.ENTER) return e.toggle(b, c)
        }).on(c + "refresh" + f, function(b, c) {
            if (e.belongs(b)) return e.aftertable()
        }).on(c + "beforetableview" + f, function(b, c) {
            if (e.belongs(b)) return e.beforeTableView(b,
                c)
        }).on(c + "tablewidthchange" + f, function(b, c) {
            if (e.belongs(b)) return e.tableWidthChange(b, c)
        })
    }
    k.paramquery.cHierarchy = h;
    var m = h.prototype = new k.paramquery.cClass;
    m.tableWidthChange = function() {
        if (this.refreshComplete) {
            this.refreshComplete = !1;
            for (var g = this.that.$tbl.children("tbody").children("tr.pq-detail-child").children("td.pq-detail-child"), e = 0, c = g.length; e < c; e++)
                for (var f = k(g[e]).find(".pq-grid"), b = 0, l = f.length; b < l; b++) {
                    var a = k(f[b]);
                    a.is(":visible") && a.pqGrid("onWindowResize")
                }
            this.refreshComplete = !0
        }
    };
    m.aftertable = function(g) {
        var e = this.that,
            c = e.options.detailModel.init,
            f = e.pdata;
        if (this.refreshComplete) {
            this.refreshComplete = !1;
            g = g ? g : e.$tbl.children("tbody").children("tr.pq-detail-child");
            for (var b = 0, l = g.length; b < l; b++) {
                var a = k(g[b]),
                    d = a.attr("pq-row-indx"),
                    h = f[d],
                    d = !1,
                    m = h.pq_detail.child;
                m || "function" != typeof c || (d = !0, m = c.call(e.element[0], {
                    rowData: h
                }), h.pq_detail.child = m, h.pq_detail.height = 25);
                a = a.children("td.pq-detail-child");
                a.append(m);
                a = a.find(".pq-grid");
                m = 0;
                for (h = a.length; m < h; m++) {
                    var B =
                        k(a[m]);
                    d ? B.hasClass("pq-pending-refresh") && B.is(":visible") && (B.removeClass("pq-pending-refresh"), B.pqGrid("refresh")) : B.is(":visible") && B.pqGrid("onWindowResize")
                }
            }
            this.refreshComplete = !0;
            this.detachView = !1
        }
    };
    m.beforeTableView = function(g, e) {
        this.detachView || (this.detachInitView(), this.detachView = !0)
    };
    m.detachInitView = function(g) {
        var e = this.that.$tbl;
        if (e && e.length)
            for (g = g ? g : e.children("tbody").children("tr.pq-detail-child"), e = 0; e < g.length; e++) k(g[e]).children("td.pq-detail-child").children().detach()
    };
    m.toggle = function(g, e) {
        var c = this.that,
            f = e.column,
            b = e.rowData,
            l = e.rowIndx,
            a = this.type;
        f && f.type === a && (f = {
            rowIndx: l,
            focus: !0
        }, null == b.pq_detail ? c.rowExpand(f) : !1 === b.pq_detail.show ? c.rowExpand(f) : this.rowCollapse(f))
    };
    m.rowExpand = function(g) {
        this.normalize(g);
        var e = this.that,
            c = g.rowData,
            f = g.rowIndx,
            b = g.rowIndxPage,
            l = e.options.detailModel;
        if (null != c) {
            if (!1 === e._trigger("beforeRowExpand", null, g)) return !1;
            null == c.pq_detail ? c.pq_detail = {
                show: !0
            } : !1 === c.pq_detail.show && (c.pq_detail.show = !0);
            l.cache || this.rowInvalidate(g);
            e.refreshRow({
                rowIndx: f
            });
            l = [];
            e.iGenerateView._generateDetailRow(c, b, e.colModel, l, null, !1);
            c = e.getRow({
                rowIndxPage: b
            });
            c.after(l.join(""));
            this.aftertable(c.next());
            g.focus && e.getCell({
                rowIndx: f,
                dataIndx: "pq_detail"
            }).attr("tabindex", "0").focus();
            g.scrollRow && this.scrollRow({
                rowIndx: f
            })
        }
    };
    m.rowInvalidate = function(g) {
        g = this.that.getRowData(g);
        var e = g.pq_detail;
        if (e = e ? e.child : null) e.remove(), g.pq_detail.child = null, g.pq_detail.height = 0
    };
    m.normalize = function(g) {
        var e = this.that,
            c = g.rowIndx,
            f = g.rowIndxPage,
            b = e.rowIndxOffset;
        g.rowIndx = null == c ? f + b : c;
        g.rowIndxPage = null == f ? c - b : f;
        g.rowData = e.getRowData(g)
    };
    m.rowCollapse = function(g) {
        this.normalize(g);
        var e = this.that,
            c = e.options,
            f = g.rowData,
            b = g.rowIndx,
            l = g.rowIndxPage,
            a = c.detailModel;
        null != f && null != f.pq_detail && !0 === f.pq_detail.show && (a.cache || this.rowInvalidate(g), f.pq_detail.show = !1, c.virtualY ? e.refresh() : (c = e.getRow({
            rowIndxPage: l
        }).next("tr.pq-detail-child"), c.length && (this.detachInitView(c), c.remove(), e.refreshRow({
            rowIndx: b
        })), g.focus && e.getCell({
            rowIndx: b,
            dataIndx: "pq_detail"
        }).attr("tabindex", "0").focus()), g.scrollRow && (b = g.rowIndx, this.scrollRow({
            rowIndx: b
        })))
    }
})(jQuery);
(function(k) {
    var h = k.paramquery.pqgrid.calcWidthCols,
        m = function(g) {
            this.that = g
        };
    k.paramquery.cRefresh = m;
    m = m.prototype;
    m._computeOuterWidths = function() {
        for (var g = this.that, e = g.options, c = e.columnBorders ? 1 : 0, e = e.numberCell, g = g.colModel, f = g.length, b = 0; b < f; b++) {
            var l = g[b];
            l.outerWidth = l._width + c
        }
        e.show && (e.outerWidth = e.width + 1)
    };
    m.autoFit = function() {
        var g = this.that,
            e = g.colModel,
            c = e.length,
            g = h.call(g, -1, c, !0),
            f = this.contWd - this.getSBWidth();
        if (g !== f) {
            for (var g = g - f, b, f = [], l = 0; l < c; l++) {
                var a = e[l],
                    d = a._percent,
                    n = a._resized;
                a.hidden || d || n || (0 > g ? (d = a._maxWidth - a._width) && f.push({
                    availWd: -1 * d,
                    colIndx: l
                }) : (d = a._width - a._minWidth) && f.push({
                    availWd: d,
                    colIndx: l
                }));
                n && (b = a, delete a._resized)
            }
            f.sort(function(a, b) {
                return a.availWd > b.availWd ? 1 : a.availWd < b.availWd ? -1 : 0
            });
            l = 0;
            for (c = f.length; l < c; l++) {
                var a = f[l],
                    d = a.availWd,
                    a = a.colIndx,
                    n = Math.round(g / (c - l)),
                    a = e[a],
                    k;
                k = a._width;
                Math.abs(d) > Math.abs(n) ? (k -= n, g -= n) : (k -= d, g -= d);
                a.width = a._width = k
            }
            0 != g && b && (k = b._width - g, k > b._maxWidth ? k = b._maxWidth : k < b._minWidth && (k = b._minWidth),
                b.width = b._width = k)
        }
    };
    m.autoLastColumn = function() {
        var g = this.that,
            e = g.options,
            c = e.columnBorders ? 1 : 0,
            f = g.colModel,
            b = f.length,
            e = e.freezeCols,
            l = this.contWd - this.getSBWidth(),
            a = h.call(g, -1, e, !0),
            l = l - a,
            a = !1,
            g = g._getLastVisibleColIndx();
        if (null != g && (g = f[g], !g._percent)) {
            for (var d = g._width, n, k = g._minWidth, m = g._maxWidth, b = b - 1; b >= e; b--) {
                var z = f[b];
                if (!z.hidden && (z = z._width + c, l -= z, 0 > l)) {
                    a = !0;
                    n = d + l >= k ? d + l : d + z + l;
                    break
                }
            }
            a || (n = d + l);
            n > m ? n = m : n < k && (n = k);
            g.width = g._width = n
        }
    };
    m.numericVal = function(g, e) {
        var c;
        c = -1 < (g +
            "").indexOf("%") ? parseInt(g) * e / 100 : parseInt(g);
        return Math.round(c)
    };
    m.refreshColumnWidths = function() {
        var g = this.that,
            e = g.options,
            c = e.numberCell,
            f = "flex" === e.width,
            b = e.columnBorders ? 1 : 0,
            l = g.colModel,
            a = e.scrollModel,
            d = a.lastColumn,
            a = a.autoFit,
            h = this.contWd,
            k = l.length,
            m = this.getSBWidth(),
            z = e._minColWidth,
            v = e._maxColWidth,
            s = 0;
        c.show && (c.width < c.minWidth && (c.width = c.minWidth), c.outerWidth = c.width + 1, s = c.outerWidth);
        c = f ? null : h - m - s;
        z = Math.floor(this.numericVal(z, c));
        v = Math.ceil(this.numericVal(v, c));
        h = 0;
        if (!f && 5 > c || isNaN(c)) {
            if (e.debug) throw "availWidth N/A";
        } else {
            delete g.percentColumn;
            for (m = 0; m < k; m++)
                if (s = l[m], !s.hidden) {
                    var r = s.width,
                        x = -1 < (r + "").indexOf("%") ? !0 : null,
                        p = s.minWidth,
                        q = s.maxWidth,
                        p = p ? this.numericVal(p, c) : z,
                        q = q ? this.numericVal(q, c) : v;
                    q < p && (q = p);
                    if (void 0 != r) {
                        var t = 0;
                        !f && x ? (g.percentColumn = !0, s.resizable = !1, s._percent = !0, r = this.numericVal(r, c) - b, t = Math.floor(r), h += r - t, 1 <= h && (t += 1, h -= 1)) : r && (t = parseInt(r));
                        t < p ? t = p : !f && t > q && (t = q);
                        s._width = t
                    } else s._width = p;
                    x || (s.width = s._width);
                    s._minWidth =
                        p;
                    s._maxWidth = f ? 1E3 : q
                }!1 === f && (a && this.autoFit(), "auto" === d && e.virtualX && this.autoLastColumn());
            this._computeOuterWidths()
        }
    };
    m.estRowsInViewPort = function() {
        var g = Math.ceil(this.contHt / this.rowHt);
        return this.that.pageSize = g
    };
    m._refreshFrozenLine = function() {
        var g = this.that,
            e = g.options,
            c = e.numberCell,
            f = g.$cont_o,
            e = e.freezeCols;
        g.$freezeLine && g.$freezeLine.remove();
        e && (e = h.call(g, -1, e) - 1, isNaN(e) || 0 === e || 0 < e && c.show && e === c.width || (g.$freezeLine = k(["<div class='pq-grid-vert-frozen-line'  style = 'height:100%;top:0;left:",
            e, "px;' ></div>"
        ].join("")).appendTo(f)))
    };
    m._refreshHideArrHS = function() {
        for (var g = this.that, e = g.colModel, c = g.hidearrHS, f = g.initH, b = g.finalH, l = parseInt(g.options.freezeCols), g = 0; g < l; g++) c[g] = !1;
        for (g = l; g < f; g++) c[g] = !0;
        for (g = f; g <= b; g++) c[g] = !1;
        g = b + 1;
        for (e = e.length; g < e; g++) c[g] = !0
    };
    m._setScrollVNumEles = function() {
        var g = this.that,
            e = g.$vscroll,
            c = g.options;
        if ("flex" === c.height) return e.pqScrollBar("option", "num_eles", 0), 0;
        var f = g.iHierarchy ? !0 : !1,
            b = e.pqScrollBar("option"),
            l = parseInt(b.num_eles),
            b = parseInt(b.cur_pos),
            l = this.getSBHeight(),
            l = this.contHt - l + 1,
            c = (c.groupModel ? g.dataGM : g.pdata) ? g.totalVisibleRows : 0,
            a, d = 0;
        g.$tbl && 0 < g.$tbl.length && (g = g.$tbl[g.$tbl.length - 1], d = g.offsetHeight, a = k(g));
        if (0 < d && d > l) {
            g = a.children().children("tr");
            for (d = b = a = 0; d < g.length; d++) {
                var h = g[d];
                a += h.offsetHeight;
                if (a >= l) {
                    f && k(h).hasClass("pq-detail-child") ? (b--, b = 1 < b ? b - 1 : 1) : b = 1 < b ? b - 1 : 0;
                    break
                } else f ? !1 === k(h).hasClass("pq-detail-child") && b++ : b++
            }
            0 === b && (b = g.length - 1);
            l = c - b + 1
        } else l = b + 1;
        l > c && (l = c);
        e.pqScrollBar("option", "num_eles", l);
        return l
    };
    m._setScrollVLength = function() {
        var g = this.that;
        if ("flex" !== g.options.height) {
            var e = this.getSBHeight(),
                c = this.contHt - e;
            g.$vscroll.css("bottom", e).pqScrollBar("option", "length", c)
        }
    };
    m.setContAndHeaderHeight = function() {
        var g = this.that,
            e = g.options,
            c = g.$header,
            f, b, l;
        if (c && c.length) {
            if (1 < c.length) {
                if (f = c[0].offsetHeight, b = c[1].offsetHeight, l = Math.max(f, b), f !== b) {
                    var a = k(c[0]).find(".pq-grid-header-search-row"),
                        d = k(c[1]).find(".pq-grid-header-search-row");
                    a.css("height", "");
                    d.css("height", "");
                    f = c[0].offsetHeight;
                    b = c[1].offsetHeight;
                    l = Math.max(f, b);
                    f < l ? a.height(d[0].offsetHeight - 1) : d.height(a[0].offsetHeight - 1)
                }
            } else l = f = c[0].offsetHeight;
            g.$header_o.height(l - 2);
            this.headerHt = l
        } else g.$header_o.height(0), this.headerHt = 0;
        "flex" !== e.height && (e = this.height - g.$header_o[0].offsetHeight - (e.showTop ? g.$top[0].offsetHeight : 0) - g.$bottom[0].offsetHeight, g.$cont.height(e), this.contHt = e)
    };
    m.setContAndGridHeightFromTable = function() {
        var g = 0,
            e = this.that,
            c = this.getSBHeight(),
            g = (g = e.$tbl) && g.length ? k(g[0]).data("offsetHeight") :
            23;
        this.contHt = g + c - 1;
        e.$cont.height("");
        e.element.height("");
        e.$grid_inner.height("")
    };
    m.setContAndGridWidthFromTable = function() {
        var g = this.that,
            e = h.call(g, -1, g.colModel.length),
            g = g.element,
            c = this.getSBWidth();
        this.contWd = e + c;
        g.width(this.contWd + "px")
    };
    m.getTotalVisibleRows = function(g, e, c) {
        var f = this.that,
            b = this.estRowsInViewPort(),
            l = 0,
            a = c ? c.length : 0,
            d = e,
            h = 0,
            k = 0,
            m = null,
            z = !1,
            v = !1,
            s = f.iHierarchy ? !0 : !1,
            r = f.options,
            x = r.detailModel.offset,
            p = 0,
            q = this.rowHt,
            f = s ? f.$cont[0].offsetHeight : void 0;
        if (null == c ||
            0 == a) return {
            initV: null,
            finalV: null,
            tvRows: l,
            lastFrozenRow: null
        };
        for (var t = 0, w = a > e ? e : a; t < w; t++) {
            var y = c[t],
                u = y.pq_hidden;
            u || (m = t, l++, s && ((y = y.pq_detail) && y.show ? (y = y.height || 0, y > x && (y = x), p += y + q) : p += q))
        }
        if (a < e) return {
            initV: m,
            finalV: m,
            tvRows: l,
            lastFrozenRow: m
        };
        if (1E4 < a && null == r.groupModel) return h = g + b, h >= a && (h = a - 1), {
            initV: g + e,
            finalV: h,
            tvRows: a,
            lastFrozenRow: m
        };
        b -= l;
        t = e;
        for (w = a; t < w; t++) y = c[t], u = y.pq_hidden, z ? v || (u ? h++ : k === b ? v = !0 : (h++, k++)) : u ? d++ : k === g ? (z = !0, h = d, k = 0) : (d++, k++), u || (l++, s && z && ((y = y.pq_detail) &&
            y.show ? (y = y.height || 0, y > x && (y = x), p += y + q) : p += q, p > f && (v = !0)));
        d >= a && (d = a - 1);
        h < d && (h = d);
        return {
            initV: d,
            finalV: h,
            tvRows: l,
            lastFrozenRow: m
        }
    };
    m.calcInitFinal = function() {
        var g = this.that,
            e = g.options,
            c = e.virtualY,
            f = e.freezeRows,
            b = "flex" === e.height,
            e = e.groupModel ? g.dataGM : g.pdata;
        if (null == e || 0 === e.length) f = this.getTotalVisibleRows(l, f, e), g.totalVisibleRows = f.tvRows, g.initV = f.initV, g.finalV = f.finalV, g.lastFrozenRow = f.lastFrozenRow;
        else if (c) {
            var c = g.$vscroll.pqScrollBar("option"),
                l = parseInt(c.cur_pos);
            if (isNaN(l) ||
                0 > l) throw "cur_pos NA";
            g.scrollCurPos = l;
            f = this.getTotalVisibleRows(l, f, e);
            g.totalVisibleRows = f.tvRows;
            g.initV = f.initV;
            g.lastFrozenRow = f.lastFrozenRow;
            g.finalV = b ? e.length - 1 : f.finalV
        } else f = this.getTotalVisibleRows(0, f, e), g.lastFrozenRow = f.lastFrozenRow, g.totalVisibleRows = f.tvRows, g.initV = 0, g.finalV = e.length - 1
    };
    m.calcInitFinalH = function() {
        var g = this.that,
            e = g.options,
            c = e.virtualX,
            f = g.colModel,
            b = f.length;
        if (c) {
            !1 === e.virtualXHeader && (g.initHH = 0, g.finalHH = b - 1);
            for (var l = parseInt(g.$hscroll.pqScrollBar("option",
                    "cur_pos")), a = parseInt(e.freezeCols), d = "flex" === e.width, n = a, k = 0, m = a; m < b; m++)
                if (f[m].hidden) n++;
                else if (k === l) break;
            else n++, k++;
            n > b - 1 && (n = b - 1);
            g.initH = n;
            if (d || !c) g.finalH = b - 1;
            else {
                c = h.call(g, -1, a);
                l = this.getEContWd();
                for (m = n; m < b; m++)
                    if (n = f[m], !n.hidden) {
                        n = n.outerWidth;
                        if (!n && e.debug) throw "outerwidth N/A";
                        c += n;
                        if (c > l) break
                    }
                e = m;
                e > b - 1 && (e = b - 1);
                g.finalH = e
            }
        } else g.initH = 0, g.finalH = b - 1
    };
    m._calcOffset = function(g) {
        return (g = /(-|\+)([0-9]+)/.exec(g)) && 3 === g.length ? parseInt(g[1] + g[2]) : 0
    };
    m.refreshGridWidthAndHeight =
        function() {
            var g = this.that,
                e = g.options,
                c, f, b = -1 < (e.width + "").indexOf("%") ? !0 : !1,
                l = -1 < (e.height + "").indexOf("%") ? !0 : !1,
                g = g.element;
            if (b || l) {
                var a = g.parent();
                if (!a.length) return;
                var d, h;
                a[0] == document.body || "fixed" == g.css("position") ? (d = k(window).width(), h = window.innerHeight ? window.innerHeight : k(window).height()) : (d = a.width(), h = a.height());
                var m = null,
                    B = this._calcOffset,
                    z = b ? B(e.width) : 0,
                    B = l ? B(e.height) : 0;
                if (0 == d) {
                    for (;
                        "BODY" != a[0].tagName.toUpperCase();) {
                        var v = a.parent();
                        if (null == v[0]) {
                            m = a;
                            break
                        } else a =
                            v
                    }
                    if (m) {
                        var v = m.css("position"),
                            s = m.css("left"),
                            r = m.css("top");
                        m.css({
                            position: "absolute",
                            left: "-2000",
                            top: "-2000"
                        }).appendTo(k(document.body));
                        a = g.parent();
                        b && (d = a.width());
                        l && (h = a.height());
                        m.css({
                            position: v,
                            left: s,
                            top: r
                        })
                    }
                }
                b && (c = parseInt(e.width) * d / 100 + z);
                l && (f = parseInt(e.height) * h / 100 + B)
            }
            b || (c = e.width);
            l || (f = e.height);
            parseFloat(c) == c ? (c = c < e.minWidth ? e.minWidth : c, g.width(c)) : "auto" === c && g.width(c);
            parseFloat(f) == f && (f = f < e.minHeight ? e.minHeight : f, g.height(f));
            this.width = parseFloat(c) == c ? Math.round(c) :
                "auto" === c ? Math.round(g.width()) : null;
            this.height = parseFloat(f) == f ? Math.round(f) : null
        };
    m.decidePanes = function() {
        var g = this.that,
            e = g.pqpanes = {
                v: !1,
                h: !1,
                vH: !1
            },
            c = g.options,
            g = c.virtualX,
            f = c.virtualXHeader,
            b = c.virtualY,
            l = "flex" == c.height,
            a = "flex" == c.width,
            d = c.numberCell,
            h = c.freezeRows,
            c = c.freezeCols;
        !h || l || !c && !d.show || a ? h && !l ? b || (e.h = !0) : !c && !d.show || a || (g || (e.v = !0, e.vH = !0), !1 === f && (e.vH = !0)) : (b || (e.h = !0), g || (e.v = !0, e.vH = !0), !1 === f && (e.vH = !0))
    };
    m._storeColumnWidths = function(g) {
        var e = this.that,
            c = e.colModel,
            f = g ? c.length - 1 : e.finalH,
            b = [];
        for (g = g ? 0 : e.initH; g <= f; g++) b[g] = {
            outerWidth: c[g].outerWidth
        };
        return b
    };
    m._isColumnWidthChanged = function(g) {
        for (var e = this.that, c = e.colModel, f = e.finalH, e = e.initH; e <= f; e++)
            if (c[e].outerWidth !== g[e].outerWidth) return !0;
        return !1
    };
    m.refreshScrollbars = function() {
        var g = this.that,
            e = g.options,
            c = "flex" === e.height,
            f = "flex" === e.width;
        (c || this.contHt) && (f || this.contWd) && null !== g.totalVisibleRows && (f = this._setScrollVNumEles(!0), f = 1 < f ? !0 : !1, !c && f !== this.vscroll && (this.vscroll = f, e.scrollModel.autoFit ||
            e.virtualX) && (c = this._storeColumnWidths(), this.refreshColumnWidths(), this._isColumnWidthChanged(c) && (this.ignoreTResize = !0, this._refreshTableWidths(c, {
            table: !0,
            header: !0
        }), delete this.ignoreTResize, e.virtualX && (this.setContAndHeaderHeight(), g.iGenerateView.setPanes(), f = this._setScrollVNumEles(!0), this.vscroll = 1 < f ? !0 : !1))), f = this._setScrollHNumEles(), this.hscroll = 1 < f ? !0 : !1, this._setScrollHLength(), this._setScrollVLength(), this._setScrollHVLength())
    };
    m._setScrollHVLength = function() {
        var g = this.that;
        this.vscroll && this.hscroll || g.$hvscroll.css("visibility", "hidden")
    };
    m._setScrollHLength = function() {
        var g = this.that,
            e = g.$hscroll,
            c = g.$hvscroll;
        g.options.scrollModel.horizontal ? (e.css("visibility", ""), c.css("visibility", ""), g = this.contWd, c = this.getSBWidth(), e.css("right", 0 === c ? 0 : ""), e.pqScrollBar("option", "length", g - c)) : (e.css("visibility", "hidden"), c.css("visibility", "hidden"))
    };
    m.estVscroll = function() {
        var g = this.that;
        if (null == g.totalVisibleRows || null == this.contHt) throw "failed";
        var e = !0;
        g.totalVisibleRows *
            this.rowHt < this.contHt && (e = !1);
        this.vscroll = e
    };
    m.getSBWidth = function() {
        if ("flex" === this.that.options.height) return 0;
        null == this.vscroll && this.estVscroll();
        return this.vscroll ? 17 : 0
    };
    m.estHscroll = function() {
        var g = this.that;
        if (null == this.contWd) throw "failed";
        var e = !1;
        1 < this.calcColsOutsideCont(g.colModel) + 1 && (e = !0);
        this.hscroll = e
    };
    m.getSBHeight = function() {
        if ("flex" === this.that.options.width) return 0;
        null == this.hscroll && this.estHscroll();
        return this.hscroll ? 17 : 0
    };
    m.getEContHt = function() {
        if (null == this.contHt) throw "contHt N/A";
        return this.contHt - this.getSBHeight()
    };
    m.getEContWd = function() {
        if (null == this.contWd) throw "contWd N/A";
        return this.contWd - this.getSBWidth()
    };
    m.calcColsOutsideCont = function(g) {
        var e = this.that.options,
            c = e.numberCell,
            e = e.freezeCols,
            f = this.contWd - this.getSBWidth(),
            b = 0;
        c.show && (b += c.outerWidth);
        for (c = 0; c < g.length; c++) {
            var l = g[c];
            l.hidden || (b += l.outerWidth)
        }
        var a = 0,
            d = 0,
            l = Math.round(b);
        l > f && d++;
        for (c = e; c < g.length; c++)
            if (l = g[c], !l.hidden)
                if (a += l.outerWidth, l = b - a, l > f) d++;
                else break;
        return d
    };
    m._setScrollHNumEles =
        function() {
            var g = this.that,
                e = g.options,
                c = g.colModel,
                f = e.scrollModel,
                b = 0;
            "flex" !== e.width && (b = "fullScroll" === f.lastColumn ? c.length - e.freezeCols - g._calcNumHiddenUnFrozens() : this.calcColsOutsideCont(c) + 1);
            g.$hscroll.pqScrollBar("option", "num_eles", b);
            return b
        };
    m.init = function() {
        var g = this.that,
            e = g.options;
        this.hscroll = this.vscroll = this.contHt = this.contWd = null;
        g.initH = g.initV = g.finalH = g.finalV = null;
        g.totalVisibleRows = g.lastFrozenRow = null;
        this.rowHt = 22 + (e.rowBorders ? 1 : 0);
        this.headerHt = 0
    };
    m.initContHtAndWidth =
        function() {
            var g = this.that,
                e = g.options;
            "flex" !== e.width && (this.contWd = this.width);
            "flex" !== e.height && (this.contHt = this.height - (e.showHeader ? this.rowHt : 0) - (e.showTop ? g.$top[0].offsetHeight : 0) - (e.showBottom ? g.$bottom[0].offsetHeight : 0))
        };
    m._refresh = function(g) {
        g = g || {};
        var e = this.that,
            c = g.header;
        g = g.table;
        var f = e.element;
        if (f[0].offsetWidth) {
            e.iMouseSelection.resetMargins();
            this.init();
            e.$grid_inner[0].scrollTop = 0;
            f = e.options;
            this.decidePanes();
            f.collapsible._collapsed = !1;
            this.refreshGridWidthAndHeight();
            this.initContHtAndWidth();
            this.calcInitFinal();
            if (!1 === c || !1 === g) var b = this._storeColumnWidths(!0);
            this.refreshColumnWidths();
            this.calcInitFinalH();
            this._refreshHideArrHS();
            !1 !== c ? e._createHeader() : this._isColumnWidthChanged(b) && this._refreshTableWidths(b, {
                header: !0
            });
            e._refreshHeaderSortIcons();
            e._refreshPager();
            this.setContAndHeaderHeight();
            !1 !== g ? e.iGenerateView.generateView() : (this._refreshTableWidths(b, {
                table: !0
            }), e._saveDims(), e.iGenerateView.scrollView());
            this.refreshScrollbars();
            "flex" == f.height &&
                this.setContAndGridHeightFromTable();
            "flex" == f.width && this.setContAndGridWidthFromTable();
            this._refreshFrozenLine();
            e._createCollapse();
            f.dataModel.postDataOnce = void 0
        } else f.addClass("pq-pending-refresh")
    };
    m._refreshTableWidths = function(g, e) {
        for (var c = this.that, f = c.colModel, b = c.$tbl_header, l = e.header && b, a = c.$tbl, d = e.table && a, h = c.initH, k = c.finalH, b = l ? b.find("tr:nth-child(1):first") : null, m = l ? c.$header.find("div.pq-grid-col-resize-handle") : null, a = d ? a.find(".pq-row-hidden:first") : null, z, d = !1, v = 0; h <=
            k; h++) {
            var s = f[h],
                r = g[h];
            s.hidden || (r = r.outerWidth, s = s.outerWidth, s !== r && (l && (z = b.find("td[pq-col-indx=" + h + "]"), z.width(s)), a && (z = a.find("td[pq-col-indx=" + h + "]"), z.length && (d = !0, z.width(s)))), v += s - r, l && 0 !== v && (r = m.filter("[pq-col-indx=" + h + "]"), s = parseInt(r.css("left")), r.css("left", s + v)))
        }
        d && c._trigger("tableWidthChange");
        c._saveDims()
    }
})(jQuery);
(function(k) {
    var h = {
            getFocusElement: function() {
                var b = document.activeElement;
                if (b) {
                    var b = k(b),
                        c = b.closest(".pq-grid");
                    if (c.length) return c[0] == this.element[0] ? {
                        $ae: b,
                        $grid: c
                    } : {
                        $ae: b,
                        $childGrid: c
                    }
                }
            },
            rowExpand: function(b) {
                this.iHierarchy.rowExpand(b)
            },
            rowInvalidate: function(b) {
                this.iHierarchy.rowInvalidate(b)
            },
            rowCollapse: function(b) {
                this.iHierarchy.rowCollapse(b)
            }
        },
        m = function(b) {
            function c(a, d, f) {
                b.filter({
                    data: [{
                        dataIndx: a,
                        value: d,
                        value2: f
                    }]
                })
            }
            this.that = b;
            var a = this;
            this.dataHS = {};
            var d = b.widgetEventPrefix.toLowerCase(),
                f = b.eventNamespace;
            b.element.on(d + "headerkeydown" + f, function(b, d) {
                if (a.belongs(b)) {
                    var c = k(b.originalEvent.target);
                    return c.hasClass("pq-grid-hd-search-field") ? a.onKeyDown(b, d, c) : !0
                }
            });
            b.element.on(d + "createheader" + f, function(b, d) {
                if (a.belongs(b)) return a._onCreateHeader()
            });
            this.changeListener = {
                change: function(a, b) {
                    c(b.dataIndx, b.value, b.value2)
                }
            };
            this.keyupListener = {
                keyup: function(a, b) {
                    c(b.dataIndx, b.value, b.value2)
                }
            };
            this.clickListener = {
                click: function(a, b) {
                    c(b.dataIndx, b.value)
                }
            }
        },
        g = m.prototype =
        new k.paramquery.cClass;
    g.get$Ele = function(b, c) {
        var a = this.that,
            d = a.options.freezeCols,
            f = k(a.$tbl_header[0]),
            e = ".pq-grid-hd-search-field[name='" + c + "']",
            a = k(a.$tbl_header[2 == a.$tbl_header.length ? 1 : 0]);
        return b >= d ? a.find(e) : f.find(e)
    };
    g.onKeyDown = function(b, c, a) {
        c = this.that;
        if (b.keyCode === k.ui.keyCode.TAB) {
            var d = a.attr("name"),
                f = c.getColIndx({
                    dataIndx: d
                }),
                e = c.colModel,
                g, h = b.shiftKey,
                m = e[f];
            if ("between" == m.filter.condition && (c.scrollColumn({
                    colIndx: f
                }), d = this.get$Ele(f, d), d[0] == a[0] ? h || (g = d[1]) : h && (g =
                    d[0]), g)) return g.focus(), b.preventDefault(), !1;
            do {
                h ? f-- : f++;
                if (0 > f || f >= e.length) break;
                m = e[f];
                a = m.filter;
                if (!m.hidden && a) {
                    c.scrollColumn({
                        colIndx: f
                    });
                    d = m.dataIndx;
                    g = this.get$Ele(f, d);
                    "between" == a.condition && (g = h ? k(g[1]) : k(g[0]));
                    if (g) return g.focus(), b.preventDefault(), !1;
                    break
                }
            } while (1)
        } else return !0
    };
    g._bindFocus = function() {
        function b(b) {
            c._fixTableViewPort();
            b = k(b.target).closest(".pq-grid-hd-search-field").attr("name");
            if (c.scrollColumn({
                    dataIndx: b
                })) {
                var d = c.getColIndx({
                    dataIndx: b
                });
                a.get$Ele(d,
                    b).focus()
            }
        }
        for (var c = this.that, a = this, d = c.$header.find(".pq-grid-header-search-row"), f = 0; f < d.length; f++) k(d[f]).on("focusin", b)
    };
    g._onCreateHeader = function() {
        var b = this.that,
            c = b.options;
        if (c.filterModel.header) {
            this._bindFocus();
            var a = b.colModel,
                d = c.freezeCols,
                f = c.virtualX,
                e = c.virtualXHeader,
                c = !1 === e ? b.initHH : b.initH,
                e = !1 === e ? b.finalHH : b.finalH,
                g = b.$tbl_header,
                h = k(g[0]),
                m = k(g[1]),
                s = "input,select";
            if (1 < g.length) {
                h.find(s).css("visibility", "hidden");
                for (var r = 0; r < d; r++) {
                    var x = a[r],
                        s = "*[name='" + x.dataIndx +
                        "']";
                    h.find(s).css("visibility", "visible");
                    m.find(s).css("visibility", "hidden")
                }
            }
            for (r = 0; r <= e; r++) {
                if (r < c && r >= d && f && (r = c, r > e)) throw "initH>finalH";
                x = a[r];
                if (!x.hidden) {
                    var p = x.filter;
                    if (p) {
                        var s = x.dataIndx,
                            q = h;
                        r >= d && 1 < g.length && (q = m);
                        q = q.find("*[name='" + s + "']");
                        if (0 != q.length) {
                            var t = p.type,
                                w = p.value,
                                y = p.value2;
                            "checkbox" == t && "triple" == p.subtype ? q.pqval({
                                val: w
                            }) : "select" == t && null != w && q.val(w);
                            (t = p.init) && t.call(q, {
                                dataIndx: s,
                                column: x
                            });
                            if (x = p.listeners)
                                for (p = 0; p < x.length; p++) {
                                    t = x[p];
                                    "string" == typeof t &&
                                        (t = this[t + "Listener"]);
                                    for (var u in t)(function(a, d, c) {
                                        a.bind(u, function(f) {
                                            var e = b.getColumn({
                                                    dataIndx: c
                                                }),
                                                l = e.filter;
                                            "checkbox" == l.type ? w = "triple" == l.subtype ? a.pqval({
                                                incr: !0
                                            }) : a.is(":checked") ? !0 : !1 : "between" == l.condition ? (w = k(a[0]).val(), y = k(a[1]).val()) : w = a.val();
                                            return d.call(this, f, {
                                                column: e,
                                                dataIndx: c,
                                                value: w,
                                                value2: y
                                            })
                                        })
                                    })(q, t[u], s)
                                }
                        }
                    }
                }
            }
        }
    };
    g.createDOM = function(b, c) {
        var a = this.that,
            d = a.options,
            f = d.virtualX,
            e = d.virtualXHeader,
            g = !1 === e ? a.initHH : a.initH,
            e = !1 === e ? a.finalHH : a.finalH,
            h = d.freezeCols,
            m = a.colModel,
            s = d.numberCell,
            d = function(a, b) {
                return ["<div class='pq-from-div'>", a, "</div><span class='pq-from-to-center'>-</span><div class='pq-to-div'>", b, "</div>"].join("")
            };
        b.push("<tr class='pq-grid-header-search-row'>");
        s.show && b.push("<td pq-col-indx='-1' class='pq-grid-number-col' rowspan='1'><div class='pq-td-div'>&nbsp;</div></td>");
        for (s = 0; s <= e; s++) {
            if (s < g && s >= h && f && (s = g, s > e)) throw "initH>finalH";
            var r = m[s];
            if (!r.hidden) {
                var x = c,
                    p = r.halign;
                p || (p = r.align);
                "right" == p ? x += " pq-align-right" : "center" ==
                    p && (x += " pq-align-center");
                (p = r.cls) && (x = x + " " + p);
                if (p = r.filter) {
                    var q = r.dataIndx,
                        t = p.type,
                        w = p.value,
                        y = p.condition,
                        u = p.cls,
                        u = "pq-grid-hd-search-field " + (u ? u : ""),
                        A = p.style,
                        A = A ? A : "",
                        C = p.attr,
                        C = C ? C : "",
                        D = "";
                    if ("between" == y) var E = p.value2,
                        E = null != E ? E : "";
                    "textbox" === t ? (w = w ? w : "", u += " ui-corner-all pq-search-txt", D = "between" == y ? d(this._input(q, w, u + " pq-from", A, C), this._input(q, E, u + " pq-to", A, C)) : this._input(q, w, u, A, C)) : "textarea" === t ? (w = w ? w : "", u += " ui-corner-all pq-search-txt", D = "between" == y ? d(this._textarea(q,
                        w, u + " pq-from", A, C), this._textarea(q, E, u + " pq-to", A, C)) : this._textarea(q, w, u, A, C)) : "select" === t ? p.cache ? D = p.cache : (t = p.options, "function" === typeof t && (t = t.call(a.element[0], {
                        column: r,
                        value: w,
                        dataIndx: q,
                        cls: u,
                        style: A,
                        attr: C
                    })), u += " ui-corner-all", r = ["name='", q, "' class='", u, "' style='", A, "' ", C].join(""), D = k.paramquery.select({
                        options: t,
                        attr: r,
                        prepend: p.prepend,
                        valueIndx: p.valueIndx,
                        labelIndx: p.labelIndx,
                        groupIndx: p.groupIndx
                    }), p.cache = D) : "checkbox" == t ? D = ["<input ", null == w || !1 == w ? "" : "checked=checked",
                        " name='", q, "' type=checkbox class='" + u + "' style='" + A + "' " + C + "/>"
                    ].join("") : "string" == typeof t ? D = t : "function" == typeof t && (D = t.call(a.element[0], {
                        width: wd,
                        value: w,
                        value2: E,
                        column: r,
                        dataIndx: q,
                        cls: u,
                        attr: C,
                        style: A
                    }));
                    b.push(["<td class='", x, "'><div class='pq-td-div' >", D, "</div></td>"].join(""))
                } else b.push(["<td class='", x, "'><div class='pq-td-div' >&nbsp;</div></td>"].join(""))
            }
        }
        b.push("</tr>")
    };
    g._input = function(b, c, a, d, f) {
        return ['<input value="', c, "\" name='", b, "' type=text style='" + d + "' class='" +
            a + "' " + f + " />"
        ].join("")
    };
    g._textarea = function(b, c, a, d, f) {
        return ["<textarea name='", b, "' style='" + d + "' class='" + a + "' " + f + " >", c, "</textarea>"].join("")
    };
    k.paramquery.select = function(b) {
        var c = b.options,
            a = b.groupIndx,
            d = b.labelIndx,
            f = b.valueIndx,
            e = null != d && null != f,
            g = null != a,
            h = b.prepend,
            k = b.dataMap,
            m, r, x;
        b = ["<select ", b.attr, " >"];
        if (h)
            for (var p in h) b.push('<option value="', p, '">', h[p], "</option>");
        if (c && c.length) {
            for (var h = 0, q = c.length; h < q; h++) {
                var t = c[h];
                if (e) {
                    var w = t[f],
                        y = t.pq_disabled ? 'disabled="disabled" ' :
                        "",
                        u = t.pq_selected ? 'selected="selected" ' : "";
                    if (null != w) {
                        if (k) {
                            m = {};
                            for (x = 0; x < k.length; x++) {
                                var A = k[x];
                                m[A] = t[A]
                            }
                            m = "data-map='" + JSON.stringify(m) + "'"
                        } else m = "";
                        x = m;
                        g && (A = t.pq_disabled_group ? 'disabled="disabled" ' : "", m = t[a], r != m && (null != r && b.push("</optgroup>"), b.push('<optgroup label="', m, '" ', A, " >"), r = m));
                        d == f ? b.push("<option ", u, y, x, ">", w, "</option>") : b.push("<option ", u, y, x, ' value="', w, '">', t[d], "</option>")
                    }
                } else if ("object" == typeof t)
                    for (p in t) b.push('<option value="', p, '">', t[p], "</option>");
                else b.push("<option>", t, "</option>")
            }
            g && b.push("</optgroup>")
        }
        b.push("</select>");
        return b.join("")
    };
    k.fn.pqval = function(b) {
        if (b) {
            if (b.incr) return b = this.data("pq_value"), this.prop("indeterminate", !1), b ? (b = !1, this.prop("checked", !1)) : !1 === b ? (b = null, this.prop("indeterminate", !0), this.prop("checked", !1)) : (b = !0, this.prop("checked", !0)), this.data("pq_value", b), b;
            b = b.val;
            this.data("pq_value", b);
            this.prop("indeterminate", !1);
            null == b ? (this.prop("indeterminate", !0), this.prop("checked", !1)) : b ? this.prop("checked", !0) : this.prop("checked", !1);
            return this
        }
        return this.data("pq_value")
    };
    var e = {
            _generateTitleRow: function(b, c, a, d) {
                var f = this.that.options.numberCell;
                d = c.groupTitle;
                var e = c.level,
                    g = c.GMRowIndx,
                    h = b.title,
                    k = b.icon,
                    k = (k = k ? k[e] : null) && k.length && 2 == k.length && "function" === typeof k.push ? k : ["ui-icon-minus", "ui-icon-plus"];
                if (h && null != h[e]) {
                    h = h[e];
                    if (!1 === h) return;
                    "function" == typeof h ? d = h(c) : (d = h.replace("{0}", d), d = d.replace("{1}", c.items))
                } else d = d + " - " + c.items + " item(s)";
                h = 'pq-group-row pq-grid-row",(lastFrozenRow?" pq-last-frozen-row":""),"';
                (b = b.titleCls) && (b = b[e]) && (h += " " + b);
                a.push(["<tr class='", h, "' title=\"", c.groupTitle, "\" level='", e, "' GMRowIndx='", g, "'>"].join(""));
                f.show && a.push("<td class='pq-grid-number-cell ui-state-default'>&nbsp;</td>");
                b = k[0];
                c.collapsed && (b = k[1]);
                a.push("<td class='pq-grid-cell' colSpan='100' >", "<div class='pq-td-div' style='margin-left:", 16 * e, "px;'>", "<span class='ui-icon ", b, "'></span>", d, "</div></td>");
                a.push("</tr>")
            },
            _generateSummaryRow: function(b, c, a, d, f) {
                var e = c.level,
                    g = c.rowData,
                    h = "pq-summary-row pq-grid-row" +
                    (f ? " pq-last-frozen-row" : "");
                (b = b.summaryCls) && (b = b[e]) && (h += " " + b);
                b = this.that;
                var k = b.options;
                f = k.virtualX;
                var m = b.initH,
                    r = b.finalH,
                    x = k.freezeCols,
                    p = k.numberCell,
                    k = k.columnBorders;
                d.push("<tr class='" + h + "'>");
                p.show && d.push("<td class='pq-grid-number-cell ui-state-default'>&nbsp;</td>");
                for (h = 0; h <= r; h++) {
                    if (h < m && h >= x && f && (h = m, h > r)) throw "initH>finalH";
                    var p = a[h],
                        q = p.dataIndx;
                    if (!p.hidden) {
                        var t = "pq-grid-cell ";
                        "right" == p.align ? t += " pq-align-right" : "center" == p.align && (t += " pq-align-center");
                        h == x -
                            1 && k && (t += " pq-last-frozen-col");
                        p.cls && (t = t + " " + p.cls);
                        var w = g[q],
                            y;
                        w && (y = p.summary.title) && (y = y[e]) && ("function" == typeof y ? (c.dataIndx = q, c.cellData = w, w = y.call(b.element[0], c)) : w = y.replace("{0}", w));
                        w = null == w ? "&nbsp;" : w;
                        p = ["<td class='", t, "' style='' >", w, "</td>"].join("");
                        d.push(p)
                    }
                }
                d.push("</tr>");
                return d
            },
            _generateDetailRow: function(b, c, a, d, f, e) {
                a = "pq-grid-row pq-detail-child";
                e && (a += " pq-last-frozen-row");
                var g = this.that.options;
                e = g.numberCell;
                var h = "pq-grid-cell ";
                if (!g.wrap || f) h += "pq-wrap-text ";
                g.stripeRows && c / 2 == parseInt(c / 2) && (a += " pq-grid-oddRow");
                b.pq_rowselect && (a += " pq-row-select ui-state-highlight");
                b = b.pq_rowcls;
                null != b && (a += " " + b);
                d.push("<tr pq-row-indx='" + c + "' class='" + a + "' >");
                e.show && d.push("<td class='pq-grid-number-cell ui-state-default'>&nbsp;</td>");
                d.push("<td class='" + h + " pq-detail-child' colSpan='20'></td>");
                d.push("</tr>");
                return d
            }
        },
        c = function(b) {
            this.that = b
        },
        g = c.prototype;
    g._refreshDataFromDataModel = function() {
        this._groupData();
        this.initcollapsed()
    };
    g.bindEvents = function() {
        var b =
            this;
        this.that.$cont.on("click", "tr.pq-group-row", function(c) {
            return b.onClickGroupRow(c)
        })
    };
    g.showHideRows = function(b, c, a) {
        for (var d = [], f = this.that.dataGM, e = f.length; b < e; b++) {
            var g = f[b],
                h = g;
            if (h.groupSummary)
                if (g.level < c) break;
                else g.pq_hidden = a;
            else if (h.groupTitle)
                if (g.collapsed && d.push({
                        indx: b,
                        level: g.level
                    }), g.level <= c) break;
                else g.pq_hidden = a;
            else g.pq_hidden = a
        }
        return d
    };
    g.onClickGroupRow = function(b) {
        var c = k(b.currentTarget);
        b = this.that;
        var a = parseInt(c.attr("level")),
            c = parseInt(c.attr("GMRowIndx")),
            d = !0,
            d = b.dataGM[c];
        d = d.collapsed ? d.collapsed = !1 : d.collapsed = !0;
        if (d) this.showHideRows(c + 1, a, !0);
        else
            for (c = this.showHideRows(c + 1, a, !1), d = 0; d < c.length; d++) {
                var f = c[d].indx,
                    a = c[d].level;
                this.showHideRows(f + 1, a, !0)
            }
        b.refresh()
    };
    g.initcollapsed = function() {
        var b = this.that.dataGM;
        if (b)
            for (var c = 0, a = b.length; c < a; c++) {
                var d = b[c];
                if (void 0 !== d.groupTitle) {
                    var f = d.level;
                    d.collapsed && this.showHideRows(c + 1, f, !0)
                }
            }
    };
    g.max = function(b, c) {
        var a;
        "integer" == c || "float" == c ? (a = Math.max.apply(Math, b), "float" === c && (a = a.toFixed(2))) :
            (b = "date" == c ? b.sort(function(a, b) {
                a = Date.parse(a);
                b = Date.parse(b);
                return a - b
            }) : b.sort(), a = b[b.length - 1]);
        return a
    };
    g.min = function(b, c) {
        var a;
        "integer" == c || "float" == c ? (a = Math.min.apply(Math, b), "float" === c && (a = a.toFixed(2))) : (b = "date" == c ? b.sort(function(a, b) {
            a = Date.parse(a);
            b = Date.parse(b);
            return a - b
        }) : b.sort(), a = b[0]);
        return a
    };
    g.count = function(b) {
        return b.length
    };
    g.sum = function(b, c) {
        var a = 0,
            d;
        d = "float" === c ? parseFloat : "integer" === c ? parseInt : function(a) {
            return a
        };
        for (var f = 0, e = b.length; f < e; f++) a += d(b[f]);
        "float" === c && (a = a.toFixed(2));
        return a
    };
    g._groupData = function() {
        for (var b = this.that, c = b.pdata, a = b.options, d = a.groupModel, f = a.pageModel, a = b.colModel, f = f.type ? (f.curPage - 1) * f.rPP : 0, e = a.length, g = d.dataIndx, h = g.length, m = d.collapsed, s = [], r = 0; r < h; r++) {
            s[r] = !1;
            for (var x = 0; x < e; x++) {
                var p = a[x],
                    q = p.summary;
                if (q && (q = q.type) && "function" == typeof q.push && q[r]) {
                    s[r] = !0;
                    break
                }
            }
        }
        if (d && c && 0 < c.length) {
            for (var d = [], x = [], t = [], w = [], y = [], r = 0; r < h; r++) w[r] = "", t[r] = "", y[r] = {};
            for (var u = 0, A = c.length; u <= A; u++) {
                for (var C = c[u],
                        p = !1, D = null, r = 0; r < h; r++) t[r] = u < A ? k.trim(C[g[r]]) : "", w[r] != t[r] && (p = !0), p && null == D && (D = r);
                if (p) {
                    for (p = 0; p < h; p++) w[p] = t[p];
                    if (0 < u) {
                        for (r = h - 1; r >= D; r--)
                            if (s[r]) {
                                for (var E = [], G = 0; G < e; G++)
                                    if (p = a[G], q = (q = p.summary) ? q.type ? q.type[r] : null : null) {
                                        var I = p.dataIndx,
                                            H = "",
                                            H = "function" == typeof q ? q(y[r][I], p.dataType) : this[q](y[r][I], p.dataType);
                                        E[I] = H
                                    }
                                d.push({
                                    groupSummary: !0,
                                    level: r,
                                    prevRowData: c[u - 1],
                                    rowData: E
                                })
                            }
                        for (p = D; p < h; p++) d[x[p]].items = y[p][a[0].dataIndx].length
                    }
                    if (u == A) break;
                    for (r = h - 1; r >= D; r--)
                        for (q = 0; q <
                            e; q++) p = a[q], y[r][p.dataIndx] = [];
                    for (p = D; p < h; p++) d.push({
                        groupTitle: t[p],
                        level: p,
                        nextRowData: C,
                        GMRowIndx: d.length,
                        collapsed: m && null != m[p] ? m[p] : !1
                    }), x[p] = d.length - 1
                }
                if (u == A) break;
                C.rowIndx = u + f;
                C.pq_hidden = !1;
                d.push(C);
                for (D = 0; D < e; D++)
                    for (p = a[D], I = p.dataIndx, r = 0; r < h; r++) y[r][I].push(C[I])
            }
            b.dataGM = d
        } else b.dataGM = null
    };
    h.options = {
        detailModel: {
            cache: !0,
            offset: 100,
            expandIcon: "ui-icon-triangle-1-se",
            collapseIcon: "ui-icon-triangle-1-e"
        },
        dragColumns: {
            enabled: !0,
            acceptIcon: "ui-icon-check",
            rejectIcon: "ui-icon-closethick",
            topIcon: "ui-icon-circle-arrow-s",
            bottomIcon: "ui-icon-circle-arrow-n"
        },
        track: null,
        treeModel: {
            collapsed: !0,
            indent: 15,
            leafIcon: "ui-icon-radio-off",
            expandIcon: "ui-icon-triangle-1-se",
            collapseIcon: "ui-icon-triangle-1-e"
        },
        filterModel: {
            on: !0,
            mode: "AND",
            header: !1
        }
    };
    h._create = function() {
        k.extend(k.paramquery.cGenerateView.prototype, e);
        var b = this.options;
        this.iHistory = new k.paramquery.cHistory(this);
        this.iGroupView = new c(this);
        this.iHeaderSearch = new m(this);
        this.iUCData = new k.paramquery.cUCData(this);
        this.iMouseSelection =
            new k.paramquery.cMouseSelection(this);
        this._super();
        this.iGroupView.bindEvents();
        this.iDragColumns = new k.paramquery.cDragColumns(this);
        this._createToolbar();
        "remote" === b.dataModel.location && this.refresh({
            table: !0
        });
        this.refreshDataAndView({
            header: !0
        })
    };
    h._createToolbar = function() {
        var b = this.options,
            c = b.toolbar;
        if (c) {
            var a = c.cls,
                d = c.style,
                f = c.attr,
                c = c.items,
                a = k("<div class='" + (a ? a : "") + "' style='" + (d ? d : "") + "' " + (f ? f : "") + " ></div>").appendTo(k(".pq-grid-top", this.element));
            a.pqToolbar({
                items: c,
                gridInstance: this
            });
            b.showToolbar || a.css("display", "none");
            this.$toolbar = a
        }
    };
    h.isLeftOrRight = function(b) {
        return b > this.freezeCols ? "right" : "left"
    };
    h.ovCreateHeader = function(b, c) {
        this.options.filterModel.header && this.iHeaderSearch.createDOM(b, c)
    };
    h._createHeader = function() {
        this._super();
        this.options.showHeader && this._trigger("createHeader")
    };
    h.exportExcel = function(b) {
        b.format = "xml";
        return k.paramquery.pqgrid.exportToExcel.call(this, b)
    };
    h.exportCsv = function(b) {
        b.format = "csv";
        return k.paramquery.pqgrid.exportToExcel.call(this,
            b)
    };
    h.filter = function(b) {
        var c = this,
            a = this.options,
            d = void 0 === b.apply ? !0 : b.apply,
            f = void 0 === b.sort ? !0 : b.sort,
            e = a.dataModel,
            a = a.filterModel;
        if (void 0 != b) {
            var g = "replace" == b.oper ? !0 : !1;
            b = b.data;
            for (var h = this.colModel, h = d ? h : k.extend(!0, [], h), m = 0, s = h.length, r = b.length, x = 0; x < s; x++) {
                for (var p = h[x], q = !1, t = 0; t < r && m != r; t++) {
                    var w = b[t];
                    if (w.dataIndx == p.dataIndx) {
                        q = !0;
                        m++;
                        var t = p.filter,
                            y = w.condition,
                            u = w.value;
                        t ? t.on = !0 : t = p.filter = {
                            on: !0
                        };
                        y && (t.condition = y);
                        y = t.condition;
                        t.value = u;
                        if ("between" == y) t.value2 =
                            w.value2;
                        else if ("range" == y) {
                            w = [];
                            if (u)
                                if ("string" == typeof u) {
                                    var y = t.options,
                                        A = u.indexOf('"'),
                                        C = u.lastIndexOf('"'),
                                        u = u.substr(A, C + 1),
                                        u = JSON.parse("[" + u + "]");
                                    if (y)
                                        for (A = 0, C = y.length; A < C; A++) {
                                            var D = y[A]; - 1 != k.inArray(D, u) && w.push(D)
                                        } else w = u.split(",s*")
                                } else "function" == typeof u.push && (w = u);
                            t.value = w
                        }
                        break
                    }
                }
                g && !q && p.filter && (p.filter.on = !1)
            }
        }
        var E = {
            header: !1,
            apply: d,
            sort: f,
            CM: h
        };
        if ("remote" == e.location && "local" != a.type) this.remoteRequest({
            apply: d,
            CM: h,
            callback: function() {
                return c._onDataAvailable(E)
            }
        });
        else return E.source = "filter", c._onDataAvailable(E)
    };
    h._initTypeColumns = function() {
        for (var b = this.colModel, c = 0, a = b.length; c < a; c++) {
            var d = b[c],
                f = d.type;
            "checkBoxSelection" === f ? new k.paramquery.cCheckBoxColumn(this, d) : "detail" === f && (d.dataIndx = "pq_detail", this.iHierarchy = new k.paramquery.cHierarchy(this))
        }
    };
    h.refreshHeader = function() {
        this._createHeader()
    };
    h.refreshDataFromDataModel = function() {
        this._super.apply(this);
        this.options.groupModel && this.iGroupView._refreshDataFromDataModel()
    };
    g = (k.paramquery.cSort =
        function(b) {
            this.that = b
        }).prototype;
    g._refreshSorters = function(b, c) {
        var a = this.that.options,
            d = a.dataModel,
            f = d.sortIndx,
            e = k.isArray(f),
            g = a.groupModel,
            h = g ? g.dataIndx : null,
            m = g ? g.dir : null,
            s = -1,
            a = [];
        if (g)
            for (g = 0; g < h.length; g++) {
                var r = h[g];
                r == b && (s = g);
                a.push({
                    dataIndx: r,
                    dir: m && m[g] ? m[g] : "up"
                })
            } - 1 !== s ? (h = "up" === a[s].dir ? "down" : "up", a[s].dir = h, m[s] = h) : null != b && (e ? (m = k.inArray(b, d.sortIndx), -1 != m ? "up" == d.sortDir[m] ? d.sortDir[m] = "down" : 1 == f.length ? d.sortDir[m] = "up" : (d.sortIndx.splice(m, 1), d.sortDir.splice(m,
                1)) : (m = d.sortIndx.length, d.sortIndx[m] = b, d.sortDir[m] = "up")) : d.sortIndx == b ? d.sortDir = c ? c : "up" == d.sortDir ? "down" : "up" : (d.sortIndx = b, d.sortDir = c ? c : "up"));
        if (null != d.sortIndx)
            if (e)
                for (g = 0; g < f.length; g++) e = f[g], -1 == this.inSorters(a, e) && a.push({
                    dataIndx: e,
                    dir: d.sortDir[g]
                });
            else -1 == this.inSorters(a, d.sortIndx) && a.push({
                dataIndx: d.sortIndx,
                dir: d.sortDir
            });
        this.sorters = a
    };
    g.inSorters = function(b, c) {
        for (var a = -1, d = 0; d < b.length; d++)
            if (b[d].dataIndx == c) {
                a = d;
                break
            }
        return a
    };
    g.sortLocalData = function(b) {
        for (var c =
                this.that, a = c.colModel, d = this.sorters, f = 0; f < d.length; f++) {
            var e = d[f],
                g = c.getColIndx({
                    dataIndx: e.dataIndx
                }),
                g = a[g],
                h = g.sortType;
            e.dataType = g.dataType;
            e.sortType = h
        }
        return this._sortLocalData(d, b)
    };
    g._sortLocalData = function(b, c) {
        function a(a, b, c, d) {
            a = a[c];
            b = b[c];
            a = a ? parseInt(a, 10) : 0;
            b = b ? parseInt(b, 10) : 0;
            return (a - b) * d
        }

        function d(a, b, c, d) {
            a = a[c];
            b = b[c];
            a = a ? Date.parse(a) : 0;
            b = b ? Date.parse(b) : 0;
            return (a - b) * d
        }

        function f(a, b, c, d) {
            a = (a[c] + "").replace(/,/g, "");
            b = (b[c] + "").replace(/,/g, "");
            a = a ? parseFloat(a) : 0;
            b = b ? parseFloat(b) : 0;
            return (a - b) * d
        }

        function e(a, b, c, d) {
            a = a[c];
            b = b[c];
            a = a ? a : "";
            b = b ? b : "";
            c = 0;
            a > b ? c = 1 : a < b && (c = -1);
            return c * d
        }

        function g(a, b, c, d) {
            a = a[c];
            b = b[c];
            a = a ? a.toUpperCase() : "";
            b = b ? b.toUpperCase() : "";
            c = 0;
            a > b ? c = 1 : a < b && (c = -1);
            return c * d
        }

        function h(a, b, c, d) {
            a = a[c];
            b = b[c];
            c = 0;
            if (a && !b || !1 === a && null === b) c = 1;
            else if (b && !a || !1 === b && null === a) c = -1;
            return c * d
        }
        if (null == c || 0 == c.length) return [];
        if (!b || !b.length) return c;
        (function() {
            for (var k = [], m = [], r = [], x = b.length, p = 0; p < x; p++) {
                var q = b[p],
                    t = "up" == q.dir ? 1 : -1,
                    w = q.sortType,
                    y = q.dataType;
                m[p] = q.dataIndx;
                r[p] = t;
                k[p] = "integer" == y ? a : "float" == y ? f : "function" == typeof y ? function(a) {
                    return function(b, c, d, f) {
                        return a(b[d], c[d]) * f
                    }
                }(y) : w ? function(a) {
                    return function(b, c, d, f) {
                        return a(b, c, d) * f
                    }
                }(w) : "date" == y ? d : "stringi" == y ? g : "bool" == y ? h : e
            }
            c = c.sort(function(a, b) {
                for (var c = 0, d = 0; d < x && (c = k[d](a, b, m[d], r[d]), 0 == c); d++);
                return c
            })
        })();
        return c
    };
    h._refreshHeaderSortIcons = function() {
        this.iHeader.refreshHeaderSortIcons()
    };
    h.getIndxInSorters = function(b) {
        for (var c = this.sorters,
                a = 0, d = c.length; a < d; a++)
            if (c[a].dataIndx == b) return a;
        return -1
    };
    h.getLargestRowCol = function(b) {
        for (var c = 0; c < b.length; c++);
    };
    h.bringCellToView = function(b) {
        this._bringCellToView(b)
    };
    h._setUrl = function(b) {
        this.options.dataModel.getUrl = function() {
            return {
                url: this.url + (null != b ? b : "")
            }
        }
    };
    h.getDataPage = function() {
        return this.pdata
    };
    h.getData = function(b) {
        var c = b.dataIndx,
            a = c.length;
        b = b.data;
        var d = this.options.dataModel,
            f = d.data,
            d = d.dataUF,
            e = [],
            g = function(b) {
                for (var d = 0, f = b.length; d < f; d++) {
                    for (var g = b[d], h = {},
                            k = 0; k < a; k++) {
                        var n = c[k];
                        h[n] = g[n]
                    }
                    e.push(h)
                }
            };
        b ? g(b) : (f && g(f), d && g(d));
        b = [];
        for (f = 0; f < a; f++) d = c[f], g = this.getColumn({
            dataIndx: d
        }), b.push({
            dataIndx: d,
            dir: "up",
            dataType: g.dataType
        });
        e = this.iSort._sortLocalData(b, e);
        b = [];
        f = void 0;
        for (d = 0; d < e.length; d++) {
            var g = e[d],
                h = JSON.stringify(g);
            h !== f && (b.push(g), f = h)
        }
        return b
    };
    h.getFilterData = function(b) {
        var c = b.CM;
        if (!c) throw "CM N/A";
        var a = c.length,
            d = b.location;
        b = this.options.filterModel.multiple;
        for (var e = k.paramquery.filter.getAllConditions, g = k.paramquery.filter.getTRConditions,
                h = [], m = function(a, b, c) {
                    return "between" == a ? null != b && "" !== b || null != c && "" !== c ? !0 : !1 : -1 != k.inArray(a, e) ? null != b && "" !== b || -1 == k.inArray(a, g) ? !0 : !1 : !0
                }, v = function(a, b) {
                    return "remote" == d ? (null == a ? "" : a).toString() : f.convert(a, b)
                }, s = 0; s < a; s++) {
            var r = c[s],
                x = r.dataIndx,
                p = r.dataType,
                p = p && "function" != typeof p ? p : "string",
                q = r.filter;
            if (b) {
                if ((q = r.filterModel) && q.on) {
                    for (var t = [], w = q.mode, y = q.filters, r = 0; r < y.length; r++) {
                        var q = y[r],
                            u = q.value,
                            A = q.condition;
                        m(A, u) && (u = v(u, p), t.push({
                            value: u,
                            condition: A
                        }))
                    }
                    h.push({
                        dataIndx: x,
                        mode: w,
                        dataType: p,
                        filters: t
                    })
                }
            } else if (q && q.on && (u = q.value, t = q.value2, A = q.condition, m(A, u, t))) {
                if ("between" == A) "" === u || null == u ? (A = "lte", u = v(t, p)) : "" === t || null == t ? (A = "gte", u = v(u, p)) : (u = v(u, p), t = v(t, p));
                else if ("regexp" == A)
                    if ("remote" == d) u = u.toString();
                    else {
                        if ("string" == typeof u) try {
                            var C = q.modifiers,
                                C = C ? C : "gi",
                                u = new RegExp(u, C)
                        } catch (D) {
                            u = /.*/
                        }
                    } else if ("range" == A)
                    if (null == u) continue;
                    else if ("string" == typeof u) u = v(u, p), u = u.split(/\s*,\s*/);
                else {
                    if (u && "function" == typeof u.push) {
                        if (0 == u.length) continue;
                        u = u.slice();
                        r = 0;
                        for (q = u.length; r < q; r++) u[r] = v(u[r], p)
                    }
                } else u = v(u, p);
                h.push({
                    dataIndx: x,
                    value: u,
                    value2: t,
                    condition: A,
                    dataType: p,
                    cbFn: "remote" == d ? "" : f.conditions[A]
                })
            }
        }
        return h
    };
    var f = function(b) {
            this.that = b
        },
        g = f.prototype;
    f.conditions = {
        equal: function(b, c) {
            if (b == c) return !0
        },
        contain: function(b, c) {
            if (-1 != b.indexOf(c)) return !0
        },
        notcontain: function(b, c) {
            if (-1 == b.indexOf(c)) return !0
        },
        empty: function(b) {
            if (0 == b.length) return !0
        },
        notempty: function(b) {
            if (0 < b.length) return !0
        },
        begin: function(b, c) {
            if (0 == (b + "").indexOf(c)) return !0
        },
        notbegin: function(b, c) {
            if (0 != b.indexOf(c)) return !0
        },
        end: function(b, c) {
            var a = b.lastIndexOf(c);
            if (-1 != a && a + c.length == b.length) return !0
        },
        notend: function(b, c) {
            var a = b.lastIndexOf(c);
            if (-1 == a || a + c.length != b.length) return !0
        },
        regexp: function(b, c) {
            if (c.test(b)) return c.lastIndex = 0, !0
        },
        notequal: function(b, c) {
            if (b != c) return !0
        },
        great: function(b, c) {
            if (b > c) return !0
        },
        gte: function(b, c) {
            if (b >= c) return !0
        },
        between: function(b, c, a) {
            if (b >= c && b <= a) return !0
        },
        range: function(b, c) {
            if (-1 != k.inArray(b, c)) return !0
        },
        less: function(b,
            c) {
            if (b < c) return !0
        },
        lte: function(b, c) {
            if (b <= c) return !0
        }
    };
    f.convert = function(b, c) {
        b = null == b ? "" : b;
        "string" == c ? b = k.trim(b).toUpperCase() : "date" == c ? b = Date.parse(b) : "integer" == c ? b = parseInt(b) : "float" == c ? b = parseFloat(b) : "bool" == c && (b = String(b).toLowerCase());
        return b
    };
    g.isMatchCellSingle = function(b, c) {
        var a = b.dataType,
            d = b.value,
            e = b.value2,
            g = b.cbFn,
            h = c[b.dataIndx],
            h = "regexp" == b.condition ? null == h ? "" : h : f.convert(h, a);
        return g(h, d, e) ? !0 : !1
    };
    g.isMatchCellMultiple = function(b, c) {
        var a = b.dataIndx,
            d = b.dataType,
            f = b.mode,
            e = b.filters,
            g = e.length;
        if (0 == g) return !0;
        for (var h = 0; h < g; h++) {
            var k = e[h],
                k = this.isMatchRule(c[a], k.condition, k.value, d);
            if ("OR" == f && k) return !0;
            if ("AND" == f && !k) return !1
        }
        if (1 === g) return k;
        if ("AND" == f) return !0;
        if ("OR" == f) return !1
    };
    g.isMatchRow = function(b, c, a) {
        if (0 == c.length) return !0;
        for (var d = 0; d < c.length; d++) {
            var f = this.isMatchCell(c[d], b);
            if ("OR" == a && f) return !0;
            if ("AND" == a && !f) return !1
        }
        if ("AND" == a) return !0;
        if ("OR" == a) return !1
    };
    h.filterLocalData = function(b) {
        b = b ? b : {};
        var c = b.apply;
        b = !1 === c ? b.CM :
            this.colModel;
        var a = this.getFilterData({
                CM: b
            }),
            d = this.options,
            e = d.dataModel,
            g = e.data,
            h = e.dataUF,
            k = [],
            m = [],
            d = d.filterModel,
            s = d.multiple,
            r = d ? d.mode : null,
            x = new f;
        x.isMatchCell = s ? x.isMatchCellMultiple : x.isMatchCellSingle;
        if (d.on && r) {
            if (g)
                for (var s = 0, p = g.length; s < p; s++) {
                    var q = g[s];
                    x.isMatchRow(q, a, r) ? k.push(q) : m.push(q)
                }
            if (h)
                for (s = 0, p = h.length; s < p; s++) q = h[s], x.isMatchRow(q, a, r) ? k.push(q) : m.push(q)
        } else {
            if (g)
                for (s = 0, p = g.length; s < p; s++) q = g[s], k.push(q);
            if (h)
                for (s = 0, p = h.length; s < p; s++) q = h[s], k.push(q)
        }
        c &&
            (e.data = k, e.dataUF = m, this._trigger("filter", null, {
                type: "local",
                dataModel: e,
                colModel: b,
                filterModel: d
            }));
        return {
            data: k,
            dataUF: m
        }
    };
    h._onDataAvailable = function(b) {
        b = b ? b : {};
        var c = this.options,
            a = b.apply,
            d = b.source,
            f = b.sort,
            e = [],
            e = c.filterModel,
            c = c.dataModel,
            g = c.location;
        !1 !== a && this._trigger("dataAvailable", b.evt, {
            dataModel: c,
            source: d
        });
        e = e && e.on && ("local" == g && "remote" != e.type || "remote" == g && "local" == e.type) ? this.filterLocalData(b).data : c.data;
        c.sorting && "local" == c.sorting && !1 !== f && (e = this.iSort.sortLocalData(e));
        if (!1 === a) return e;
        c.data = e;
        this.refreshView(b)
    };
    h.sort = function(b) {
        b = b ? b : {};
        var c = this,
            a = this.options,
            d = b.colIndx,
            f = a.editModel,
            e = b.dataIndx,
            g = b.dir,
            h = b.evt,
            k = a.dataModel;
        if (null == d && null == e && (e = k.sortIndx, null == e)) return;
        var d = null == d ? this.getColIndx({
                dataIndx: e
            }) : d,
            m = this.colModel[d],
            e = null == e ? m.dataIndx : e;
        !1 != c._trigger("beforeSort", h, {
            dataModel: k,
            column: m,
            dataIndx: e
        }) && (f.indices && c.blurEditor({
            force: !0
        }), this.iSort._refreshSorters(e, g), "local" == k.sorting ? (this.iSort.sortLocalData(k.data), c._trigger("sort",
            h, {
                dataModel: k,
                column: m,
                dataIndx: e
            }), this.refreshView()) : "remote" == k.sorting && this.remoteRequest({
            callback: function() {
                c._trigger("sort", h, {
                    dataModel: k,
                    column: m,
                    dataIndx: e
                });
                c._onDataAvailable()
            }
        }))
    };
    k.widget("paramquery.pqGrid", k.paramquery._pqGrid, h);
    k.paramquery.pqGrid.regional = {};
    k.paramquery.pqGrid.regional.en = h._regional
})(jQuery);
(function(k) {
    k.paramquery = null == k.paramquery ? {} : k.paramquery;
    k.paramquery.pqgrid = null == k.paramquery.pqgrid ? {} : k.paramquery.pqgrid;
    k.paramquery.pqgrid.exportToExcel = function(h) {
        var m = this,
            g = void 0 === h.urlPost ? h.url : h.urlPost,
            e = h.url,
            c = null == h.sheetName ? "pqGrid" : h.sheetName;
        h = h.format;
        var f = function() {
                for (var b = m.colModel, c = b.length, a = m.options.dataModel.data, d = a.length, f = [], e = [], g = [], h = 0; h < c; h++) {
                    var k = b[h];
                    !1 !== k.copy && (k = k.title.replace(/\"/g, '""'), e.push('"' + k + '"'))
                }
                f.push(e.join(","));
                for (h = 0; h <
                    d; h++) {
                    for (var e = a[h], s = 0; s < c; s++) k = b[s], !1 !== k.copy && (k = e[k.dataIndx] + "", k = k.replace(/\"/g, '""'), g.push('"' + k + '"'));
                    f.push(g.join(","));
                    g = []
                }
                return f.join("\n")
            },
            f = "xml" == h ? function() {
                for (var b = m.colModel, f = b.length, a = m.options.dataModel.data, d = a.length, e, g = [], h = [], k = 0; k < f; k++) {
                    var v = b[k];
                    !1 !== v.copy && (e = v._width, e || (e = parseInt(v.width)) || (e = 100), h.push('<Column ss:AutoFitWidth="1"  ss:Width="' + e + '" />'))
                }
                h.push("<Row>");
                for (k = 0; k < f; k++) v = b[k], !1 !== v.copy && h.push('<Cell><Data ss:Type="String">' +
                    v.title + "</Data></Cell>");
                h.push("</Row>");
                h = h.join("\n");
                for (k = 0; k < d; k++) {
                    e = a[k];
                    g.push("<Row>");
                    for (var s = 0; s < f; s++) v = b[s], !1 !== v.copy && g.push('<Cell><Data ss:Type="String"><![CDATA[' + e[v.dataIndx] + "]]\x3e</Data></Cell>");
                    g.push("</Row>")
                }
                g = g.join("\n");
                return ['<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n xmlns:o="urn:schemas-microsoft-com:office:office"\n xmlns:x="urn:schemas-microsoft-com:office:excel"\n xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n xmlns:html="http://www.w3.org/TR/REC-html40">\n<Worksheet ss:Name="',
                    c, '">\n<Table>', h, g, "</Table>\n</Worksheet>\n</Workbook>"
                ].join("\n")
            }() : f();
        k.ajax({
            url: g,
            type: "POST",
            cache: !1,
            data: {
                extension: h,
                excel: f
            },
            success: function(b) {
                b = e + ((0 < e.indexOf("?") ? "&" : "?") + "filename=" + b);
                k(document.body).append("<iframe height='0' width='0' frameborder='0'  src=" + b + "></iframe>")
            }
        })
    }
})(jQuery);
(function(k) {
    var h = k.paramquery.pqGrid.prototype.options,
        m = {
            on: !1,
            dirtyClass: "pq-cell-dirty"
        };
    h.trackModel = h.trackModel || m;
    h = (k.paramquery.cUCData = function(g) {
        this.that = g;
        this.udata = [];
        this.ddata = [];
        this.adata = [];
        this.options = g.options;
        var e = this,
            c = g.eventNamespace,
            f = g.widgetEventPrefix.toLowerCase();
        g.element.on(f + "dataavailable" + c, function(b, c) {
            e.belongs(b) && "filter" != c.source && (e.udata = [], e.ddata = [], e.adata = [])
        })
    }).prototype = new k.paramquery.cClass;
    h.add = function(g) {
        var e = this.that,
            c = this.adata;
        g = g.rowData;
        for (var f = this.options.trackModel.dirtyClass, b = e.getRecId({
                rowData: g
            }), h = 0, a = c.length; h < a; h++) {
            var d = c[h];
            if (null != b && d.recId == b) throw "primary key violation";
            if (d.rowData == g) throw "same data can't be added twice.";
        }
        var h = [],
            k;
        for (k in g) h.push(k);
        e.removeClass({
            rowData: g,
            dataIndx: h,
            cls: f
        });
        g = {
            recId: b,
            rowData: g
        };
        c.push(g)
    };
    h.update = function(g) {
        var e = this.that,
            c = this.options.trackModel.dirtyClass,
            f = g.rowData || e.getRowData(g),
            b = e.getRecId({
                rowData: f
            }),
            h = g.dataIndx,
            a = g.refresh,
            d = e.columns,
            n = k.paramquery.getValueFromDataType;
        g = g.row;
        var m = this.udata,
            B = m.slice(0),
            z = !1;
        if (null != b) {
            for (var v = 0, s = m.length; v < s; v++) {
                var r = m[v],
                    x = r.oldRow;
                if (r.rowData == f) {
                    z = !0;
                    for (h in g) m = d[h].dataType, s = g[h], s = n(s, m), r = x[h], r = n(r, m), x.hasOwnProperty(h) && r === s ? (m = {
                        rowData: f,
                        dataIndx: h,
                        refresh: a,
                        cls: c
                    }, e.removeClass(m), delete x[h]) : (m = {
                        rowData: f,
                        dataIndx: h,
                        refresh: a,
                        cls: c
                    }, e.addClass(m), x.hasOwnProperty(h) || (x[h] = f[h]));
                    k.isEmptyObject(x) && B.splice(v, 1);
                    break
                }
            }
            if (!z) {
                x = {};
                for (h in g) x[h] = f[h], m = {
                    rowData: f,
                    dataIndx: h,
                    refresh: a,
                    cls: c
                }, e.addClass(m);
                m = {
                    rowData: f,
                    recId: b,
                    oldRow: x
                };
                B.push(m)
            }
            this.udata = B
        }
    };
    h["delete"] = function(g) {
        var e = this.that,
            c = g.rowIndx,
            f = g.rowIndxPage,
            b = e.rowIndxOffset,
            c = null == c ? f + b : c,
            f = "remote" == e.options.pageModel.type ? null == f ? c - b : f : c,
            b = this.adata,
            h = this.ddata;
        g = e.getRowData(g);
        for (var e = 0, a = b.length; e < a; e++)
            if (b[e].rowData == g) {
                b.splice(e, 1);
                return
            }
        h.push({
            indx: f,
            rowData: g,
            rowIndx: c
        })
    };
    h.isDirty = function(g) {
        var e = this.udata,
            c = this.adata,
            f = this.ddata,
            b = !1;
        if (g = this.that.getRowData(g))
            for (c =
                0; c < e.length; c++) {
                if (g == e[c].rowData) {
                    b = !0;
                    break
                }
            } else if (e.length || c.length || f.length) b = !0;
        return b
    };
    h.getChangesValue = function() {
        for (var g = this.udata, e = this.adata, c = this.ddata, f = {
                updateList: [],
                addList: [],
                deleteList: []
            }, b = [], h = [], a = [], d = [], n = [], m = 0, B = c.length; m < B; m++) {
            var z = c[m],
                z = z.rowData,
                v = {};
            d.push(z);
            for (var s in z) 0 != s.indexOf("pq_") && (v[s] = z[s]);
            n.push(v)
        }
        for (m = 0; m < g.length; m++)
            if (z = g[m], z = z.rowData, -1 == k.inArray(z, d) && -1 == k.inArray(z, b)) {
                v = {};
                for (s in z) 0 != s.indexOf("pq_") && (v[s] = z[s]);
                b.push(z);
                h.push(v)
            }
        for (m = 0; m < e.length; m++) {
            z = e[m];
            z = z.rowData;
            v = {};
            for (s in z) 0 != s.indexOf("pq_") && (v[s] = z[s]);
            a.push(v)
        }
        f.updateList = h;
        f.addList = a;
        f.deleteList = n;
        return f
    };
    h.getChanges = function() {
        for (var g = this.udata, e = this.adata, c = this.ddata, f = {
                updateList: [],
                addList: [],
                deleteList: []
            }, b = [], h = [], a = [], d = 0, n = c.length; d < n; d++) {
            var m = c[d],
                m = m.rowData;
            a.push(m)
        }
        d = 0;
        for (n = g.length; d < n; d++) m = g[d], m = m.rowData, -1 == k.inArray(m, a) && -1 == k.inArray(m, b) && b.push(m);
        d = 0;
        for (n = e.length; d < n; d++) m = e[d], m = m.rowData, h.push(m);
        f.updateList = b;
        f.addList = h;
        f.deleteList = a;
        return f
    };
    h.getChangesRaw = function() {
        var g = this.adata,
            e = this.ddata,
            c = {
                updateList: [],
                addList: [],
                deleteList: []
            };
        c.updateList = this.udata;
        c.addList = g;
        c.deleteList = e;
        return c
    };
    h.commitAdd = function(g, e) {
        for (var c = this.that.colModel, f = c.length, b = this.adata, h = k.inArray, a = b.length, d = k.paramquery.getValueFromDataType, n = [], m = g.length, B = [], z = 0; z < m; z++)
            for (var v = g[z], s = 0; s < a; s++) {
                var r = b[s].rowData,
                    x = !0;
                if (-1 == h(r, B)) {
                    for (var p = 0; p < f; p++) {
                        var q = c[p],
                            t = q.dataType,
                            w = q.dataIndx;
                        if (!q.hidden && w != e && (q = r[w], q = d(q, t), w = v[w], w = d(w, t), q !== w)) {
                            x = !1;
                            break
                        }
                    }
                    if (x) {
                        s = {};
                        x = {};
                        s[e] = v[e];
                        x[e] = r[e];
                        n.push({
                            type: "update",
                            rowData: r,
                            oldRow: x,
                            newRow: s
                        });
                        B.push(r);
                        break
                    }
                }
            }
        c = [];
        for (s = 0; s < a; s++) r = b[s].rowData, -1 == h(r, B) && c.push(b[s]);
        this.adata = c;
        return n
    };
    h.commitUpdate = function(g, e) {
        for (var c = this.that, f = this.options.trackModel.dirtyClass, b = c.colModel, h = b.length, a = this.udata, d = a.length, n = g.length, m = [], B = 0; B < d; B++) {
            var z = a[B],
                v = z.rowData,
                z = z.oldRow;
            if (-1 == k.inArray(v, m))
                for (var s = 0; s < n; s++)
                    if (v[e] ==
                        g[s][e]) {
                        m.push(v);
                        for (var r = 0; r < h; r++) var x = b[r].dataIndx;
                        for (x in z) c.removeClass({
                            rowData: v,
                            dataIndx: x,
                            cls: f
                        })
                    }
        }
        c = [];
        for (B = 0; B < d; B++) v = a[B].rowData, -1 == k.inArray(v, m) && c.push(a[B]);
        this.udata = c;
        return []
    };
    h.commitDelete = function(g, e) {
        for (var c = this.ddata, f = c.length, b = g.length, h = [], a = 0; a < f; a++)
            for (var d = c[a].rowData, n = 0; n < b; n++) d[e] == g[n][e] && h.push(d);
        b = [];
        for (a = 0; a < f; a++) d = c[a].rowData, -1 == k.inArray(d, h) && b.push(c[a]);
        this.ddata = b
    };
    h.commitUpdateAll = function() {
        for (var g = this.that, e = this.options.trackModel.dirtyClass,
                c = this.udata, f = 0, b = c.length; f < b; f++) {
            var h = c[f],
                a = h.oldRow,
                h = h.rowData,
                d;
            for (d in a) g.removeClass({
                rowData: h,
                dataIndx: d,
                cls: e
            })
        }
        this.udata = []
    };
    h.commitAddAll = function() {
        this.adata = []
    };
    h.commitDeleteAll = function() {
        this.ddata = []
    };
    h.commit = function(g) {
        var e = this.that,
            c = g ? g.history : null,
            c = null == c ? !1 : c,
            f = [],
            f = [],
            b = [],
            h = e.options.dataModel.recIndx;
        if (null == g) this.commitAddAll(), this.commitUpdateAll(), this.commitDeleteAll();
        else {
            var a = g.type;
            g = g.rows;
            "add" == a ? g ? f = this.commitAdd(g, h) : this.commitAddAll() :
                "update" == a ? g ? b = this.commitUpdate(g, h) : this.commitUpdateAll() : "delete" == a && (g ? this.commitDelete(g, h) : this.commitDeleteAll())
        }
        f = f.concat(b);
        f.length && (e._digestData({
            source: "commit",
            checkEditable: !1,
            track: !1,
            history: c,
            rowList: f
        }), e.refreshView())
    };
    h.rollbackAdd = function(g, e) {
        for (var c = this.adata, f = [], b = 0, h = c.length; b < h; b++) f.push({
            type: "delete",
            rowData: c[b].rowData
        });
        this.adata = [];
        return f
    };
    h.rollbackDelete = function(g, e) {
        for (var c = this.ddata, f = [], b = c.length - 1; 0 <= b; b--) {
            var h = c[b];
            f.push({
                type: "add",
                rowIndx: h.rowIndx,
                newRow: h.rowData
            })
        }
        this.ddata = [];
        return f
    };
    h.rollbackUpdate = function(g, e) {
        for (var c = this.that, f = this.options.trackModel.dirtyClass, b = this.udata, h = [], a = 0, d = b.length; a < d; a++) {
            var k = b[a],
                m = k.rowData,
                B = {},
                z = k.oldRow;
            if (null != k.recId) {
                var k = [],
                    v;
                for (v in z) B[v] = m[v], k.push(v);
                c.removeClass({
                    rowData: m,
                    dataIndx: k,
                    cls: f,
                    refresh: !1
                });
                h.push({
                    type: "update",
                    rowData: m,
                    newRow: z,
                    oldRow: B
                })
            }
        }
        this.udata = [];
        return h
    };
    h.rollback = function(g) {
        var e = this.that,
            c = e.options.pageModel,
            f = g && null != g.refresh ?
            g.refresh : !0;
        g = g && null != g.type ? g.type : null;
        var b = [],
            b = [],
            h = [],
            a = [],
            d = e.options.dataModel.data;
        if (null == g || "update" == g) h = this.rollbackUpdate(c, d);
        if (null == g || "delete" == g) b = this.rollbackDelete(c, d);
        if (null == g || "add" == g) a = this.rollbackAdd(c, d);
        b = b.concat(a, h);
        e._digestData({
            history: !1,
            allowInvalid: !0,
            checkEditable: !1,
            source: "rollback",
            track: !1,
            rowList: b
        });
        f && e.refreshView()
    };
    h = k.paramquery.pqGrid.prototype;
    h.getChanges = function(g) {
        this.blurEditor({
            force: !0
        });
        if (g && (g = g.format)) {
            if ("byVal" == g) return this.iUCData.getChangesValue();
            if ("raw" == g) return this.iUCData.getChangesRaw()
        }
        return this.iUCData.getChanges()
    };
    h.rollback = function(g) {
        this.blurEditor({
            force: !0
        });
        this.iUCData.rollback(g)
    };
    h.isDirty = function(g) {
        return this.iUCData.isDirty(g)
    };
    h.commit = function(g) {
        this.iUCData.commit(g)
    };
    h._getRowIndx = function() {
        var g = this.selection({
            type: "row",
            method: "getSelection"
        });
        if (g && 0 < g.length) {
            var g = g[0].rowIndx,
                e = this.options.pageModel,
                c = g - this.rowIndxOffset,
                f = e.rPP;
            if (e.type) {
                if (0 <= c && c < f) return g
            } else return g
        } else return null
    };
    h.updateRow =
        function(g) {
            var e = g.rowIndx,
                c = g.row,
                f = g.rowData || this.getRowData({
                    rowIndx: e
                });
            if (!f) return !1;
            var b = {},
                h;
            for (h in c) b[h] = f[h];
            if (!1 === this._digestData({
                    source: g.source || "update",
                    history: g.history,
                    checkEditable: g.checkEditable,
                    track: g.track,
                    allowInvalid: g.allowInvalid,
                    rowList: [{
                        newRow: c,
                        oldRow: b,
                        rowData: f,
                        rowIndx: e,
                        type: "update"
                    }]
                })) return !1;
            !1 !== g.refresh && this.refreshRow({
                rowIndx: e
            })
        };
    h.updateElseAdd = function(g) {
        var e = g.row;
        null == this.getRowData({
            rowIndx: g.rowIndx
        }) ? (g.rowData = e, this.addRow(g)) : this.updateRow(g)
    };
    h._fillForm = function(g) {
        var e = this.colModel,
            c = this.rowIndxOffset,
            f = null == g.rowIndxPage ? g.rowIndx - c : g.rowIndxPage;
        g = null == g.rowIndx ? f + c : g.rowIndx;
        this.rowData = f = this.options.dataModel.data["remote" == this.options.pageModel.type ? f : g];
        this.$crudDialog.dialog("option", "title", "Edit Record (" + (g + 1) + ")");
        g = this.$crudForm;
        for (c = 0; c < e.length; c++) {
            var b = e[c].dataIndx,
                h = f[b];
            g.find("*[name='" + b + "']").val(h)
        }
    };
    h.getRecId = function(g) {
        g.dataIndx = this.options.dataModel.recIndx;
        g = this.getCellData(g);
        return null ==
            g ? null : g
    };
    h.getCellData = function(g) {
        var e = g.rowData || this.getRowData(g);
        g = g.dataIndx;
        return e ? e[g] : null
    };
    h.getRowData = function(g) {
        if (!g) return null;
        var e = g.rowData;
        if (null != e) return e;
        var c = this.options,
            e = c.dataModel,
            c = c.pageModel.type,
            f = e.recIndx,
            b = g.recId,
            e = e.data;
        if (null != b)
            for (g = 0, c = e.length; g < c; g++) {
                var h = e[g];
                if (h[f] == b) return h
            } else return f = g.rowIndx, g = g.rowIndxPage, b = this.rowIndxOffset, f = null != f ? f : g + b, g = "remote" == c ? null != g ? g : f - b : f, h = e ? e[g] : null;
        return null
    };
    h.deleteRow = function(g) {
        var e =
            g.rowIndx,
            c = g.rowIndxPage,
            f = this.rowIndxOffset,
            e = null != c ? c + f : e;
        null != e && (c = g.rowData || this.getRowData({
            rowIndx: e
        }), this._digestData({
            source: g.source || "delete",
            history: g.history,
            track: g.track,
            rowList: [{
                rowIndx: e,
                rowData: c,
                oldRow: c,
                type: "delete"
            }]
        }), !1 !== g.refresh && this.refreshView())
    };
    h.addRow = function(g) {
        var e = g.rowData || g.row,
            c = g.rowIndx,
            f = g.rowIndxPage,
            b = this.rowIndxOffset,
            c = null != f ? f + b : c,
            f = this.options.dataModel,
            b = f.data;
        if (null == e) return null;
        null == b && (f.data = [], b = f.data);
        if (!1 === this._digestData({
                source: g.source ||
                    "add",
                history: g.history,
                track: g.track,
                checkEditable: g.checkEditable,
                rowList: [{
                    newRow: e,
                    rowIndx: c,
                    type: "add"
                }]
            })) return !1;
        !1 !== g.refresh && this.refreshView();
        return null == c ? b.length - 1 : c
    }
})(jQuery);
(function(k) {
    k.widget("paramquery.pqToolbar", {
        options: {
            items: [],
            gridInstance: null
        },
        _create: function() {
            var h = this.options,
                m = h.gridInstance,
                g = m.colModel,
                e = h.items,
                c = this.element;
            c.closest(".pq-grid");
            c.addClass("pq-toolbar");
            for (var f = 0, b = e.length; f < b; f++) {
                var l = e[f],
                    h = l.type,
                    a = l.icon,
                    d = l.label,
                    n = l.listener,
                    N = n ? [n] : l.listeners,
                    n = l.cls,
                    n = "ui-corner-all " + (n ? n : ""),
                    B = l.style,
                    B = B ? 'style="' + B + '"' : "",
                    z = l.attr,
                    z = z ? z : "",
                    v;
                "textbox" == h ? v = k("<input type='text' class='" + n + "' " + z + " " + B + ">").appendTo(c) : "checkbox" ==
                    h ? v = k("<input type='checkbox' class='" + n + "' " + z + " " + B + ">").appendTo(c) : "separator" == h ? k("<span class='pq-separator '" + n + "' " + z + " " + B + "></span>").appendTo(c) : "button" == h ? (h = l.options ? l.options : {}, k.extend(h, {
                        text: d ? !0 : !1,
                        icons: {
                            primary: a
                        }
                    }), v = k("<button type='button' class='" + n + "' " + z + " " + B + ">" + d + "</button>").button(h).appendTo(c)) : "select" == h ? (h = l.options ? l.options : [], "function" === typeof h && (h = h.call(m.element[0], {
                        colModel: g
                    })), v = k.paramquery.select({
                        options: h,
                        attr: " class='" + n + "' " + z + " " + B,
                        prepend: l.prepend,
                        groupIndx: l.groupIndx,
                        valueIndx: l.valueIndx,
                        labelIndx: l.labelIndx
                    }), v = k(v).appendTo(c)) : "string" == typeof h ? v = k(h).appendTo(c) : "function" == typeof h && (v = h.call(m.element[0], {
                        colModel: g,
                        cls: n
                    }), v = k(v).appendTo(c));
                if (N)
                    for (l = 0; l < N.length; l++) {
                        var n = N[l],
                            s;
                        for (s in n) v.bind(s, n[s])
                    }
            }
        },
        _destroy: function() {
            this.element.empty().removeClass("pq-toolbar").enableSelection()
        },
        _disable: function() {
            null == this.$disable && (this.$disable = k("<div class='pq-grid-disable'></div>").css("opacity", .2).appendTo(this.element))
        },
        _enable: function() {
            this.$disable && (this.element[0].removeChild(this.$disable[0]), this.$disable = null)
        },
        _setOption: function(h, k) {
            "disabled" == h && (!0 == k ? this._disable() : this._enable())
        }
    })
})(jQuery);
(function(k) {
    var h = function() {
            this.focusSelection = null
        },
        m = h.prototype;
    m.triggerSelectChange = function(c) {
        var f = this.that;
        if (f.options.selectionModel.fireSelectChange) {
            var b = f.iRows.getSelection(),
                e = f.iCells.getSelection(),
                a = c.evt;
            c = c.ui;
            b = {
                rows: b,
                cells: e
            };
            c = null == c ? b : k.extend(b, c);
            f._trigger("selectChange", a, c)
        }
    };
    m.getOldRowSel = function() {
        var c = this.that,
            f;
        if ((f = this.focusSelection) && this.isSelected(f)) return c = c.getRowIndx(f), c.rowData = f.rowData, c
    };
    m.getOldCellSel = function() {
        var c = this.that,
            f;
        if ((f =
                this.focusSelection) && this.isSelected(f)) {
            var b = f.rowData,
                c = c.getRowIndx({
                    rowData: b
                });
            c.rowData = b;
            c.dataIndx = f.dataIndx;
            return c
        }
    };
    m.getNewRowSel = function() {
        var c = this.that,
            f = document.activeElement ? k(document.activeElement) : null;
        if (f && f.hasClass("pq-grid-row") && f.closest(".pq-grid")[0] == c.element[0]) return c = c.getRowIndx({
            $tr: f
        }), c.$tr = f, c
    };
    m.getNewCellSel = function() {
        var c = this.that,
            f = document.activeElement ? k(document.activeElement) : null;
        if (f && f.hasClass("pq-grid-cell") && f.closest(".pq-grid")[0] ==
            c.element[0]) return c = c.getCellIndices({
            $td: f
        }), c.$td = f, c
    };
    m.getFocusSelection = function(c) {
        if (this instanceof g) return c && !0 === c.old ? this.getOldRowSel() : this.getNewRowSel();
        if (this instanceof e) return c && !0 === c.old ? this.getOldCellSel() : this.getNewCellSel()
    };
    m.getFirstSelection = function() {
        var c = this.firstSelection;
        if (c && this.isSelected(c)) return c;
        this.refresh();
        c = this.selection;
        if (c.length) return this.firstSelection = c[0], c[0]
    };
    m.getLastSelection = function() {
        var c = this.lastSelection;
        if (c) {
            var f = c.rowData,
                b = this.that.getRowData({
                    rowIndx: rowIndx
                });
            return f == b && this.isSelected(c) ? c : !1
        }
        return null
    };
    m.getLastSelectionCurPage = function() {
        var c = this.lastSelection;
        if (c && this.isSelected(c)) {
            var f = c.rowIndx,
                b = this.that.options.pageModel;
            if (b.type) {
                var e = b.curPage;
                return Math.ceil((f + 1) / b.rPP) == e ? c : null
            }
            return c
        }
        return null
    };
    m.getSelection = function() {
        this.refresh();
        return this.selection
    };
    m.getSelectionCurPage = function() {
        var c = this.that,
            f = this.getSelection(),
            b = [],
            e = c.options.pageModel;
        if (e.type) {
            for (var c = e.curPage,
                    e = e.rPP, a = 0; a < f.length; a++) {
                var d = f[a];
                Math.ceil((d.rowIndx + 1) / e) == c && b.push(d)
            }
            return b
        }
        return f
    };
    m.inViewRow = function(c) {
        var f = this.that,
            b = this.options,
            e = f.rowIndxOffset,
            a = f.initV,
            d = f.finalV;
        if (c < b.freezeRows) return !0;
        if (b.groupModel) {
            if ((f = f.dataGM) && f.length)
                for (; a <= d; a++)
                    if (b = f[a].rowIndx - e, null != b && b == c) return !0;
            return !1
        }
        return c >= a && c <= d
    };
    m.setDirty = function() {};
    var g = function(c) {
        this.that = c;
        this.options = c.options;
        this.selection = []
    };
    k.paramquery.cRows = g;
    var e = function(c) {
        this.options = c.options;
        this.that = c;
        this.selection = []
    };
    k.paramquery.cCells = e;
    m = e.prototype = new h;
    h = g.prototype = new h;
    h.extendSelection = function(c) {
        var f = this.that,
            b = c.rowIndx,
            e = f.options.selectionModel.mode;
        c = c.evt;
        var a = this.getFirstSelection();
        null == a ? f.setSelection({
            rowIndx: b
        }) : "single" != e && (e = f = a.rowIndx, a = b, f > b && (e = b, a = f), this.selectRange({
            initRowIndx: e,
            finalRowIndx: a,
            evt: c
        }), this.add({
            rowIndx: b
        }))
    };
    h.refresh = function() {
        this.selection = [];
        var c = this.that,
            f = c.options,
            b = "remote" == f.pageModel.type ? !0 : !1,
            c = c.rowIndxOffset,
            e = [];
        if (f = f.dataModel.data) {
            for (var a = 0, d = f.length; a < d; a++) {
                var g = f[a];
                g.pq_rowselect && e.push({
                    rowIndx: b ? a + c : a,
                    rowData: g
                })
            }
            this.selection = e
        }
    };
    h.replace = function(c) {
        var f = c.rowIndx,
            b = null == c.offset ? this.that.getRowIndxOffset() : c.offset;
        c.offset = b;
        c.rowIndxPage = f - b;
        this.removeAll({
            raiseEvent: !0
        });
        this.add(c)
    };
    h.indexOf = function(c) {
        this.refresh();
        c = c.rowIndx;
        for (var f = this.selection, b = 0; b < f.length; b++)
            if (f[b].rowIndx == c) return b;
        return -1
    };
    h.isSelected = function(c) {
        var f = this.that;
        return (c = c.rowData ||
            f.getRowData(c)) ? null == c.pq_rowselect ? !1 : c.pq_rowselect : null
    };
    h._boundRow = function(c) {
        var f = c.rowIndxPage,
            b = this.that;
        c = null == c.$tr ? b.getRow({
            rowIndxPage: f
        }) : c.$tr;
        if (null == c || 0 == c.length) return !1;
        c.addClass("pq-row-select ui-state-highlight");
        return c
    };
    h.selectRange = function(c) {
        var f = c.initRowIndx,
            b = c.finalRowIndx;
        c = c.evt;
        for (var e = this.getSelection().slice(0), a = [], d = 0; d < e.length; d++) {
            var g = e[d],
                h = g.rowIndx;
            (h < f || h > b) && a.push({
                rowIndx: h,
                rowData: g.rowData
            })
        }
        this.remove({
            rows: a,
            evt: c
        });
        a = [];
        f > b && (e =
            f, f = b, b = e);
        for (h = f; h <= b; h++) a.push({
            rowIndx: h,
            evt: c
        });
        this.add({
            rows: a,
            evt: c
        })
    };
    m._addToData = function(c) {
        var f = c.dataIndx;
        c = this.that.getRowData(c);
        c.pq_cellselect || (c.pq_cellselect = {});
        c.pq_cellselect[f] = !0
    };
    m.extendSelection = function(c) {
        var f = this.that,
            b = this.getFirstSelection(),
            e = c.rowIndx,
            a = c.colIndx,
            d = f.options.selectionModel.mode;
        c = c.evt;
        if (null == b) f.setSelection({
            rowIndx: e,
            colIndx: a
        });
        else {
            var g = b.rowIndx,
                f = f.getColIndx({
                    dataIndx: b.dataIndx
                }),
                b = g,
                h = e,
                k = f,
                m = a;
            g > e && (b = e, h = g);
            "range" == d ? (g > e &&
                (k = a, m = f), e == g && a < f && (k = a, m = f), this.selectRange({
                    initRowIndx: b,
                    initColIndx: k,
                    finalRowIndx: h,
                    finalColIndx: m,
                    evt: c
                }), this.add({
                    rowIndx: e,
                    colIndx: a
                })) : "block" == d && (f > a && (k = a, m = f), this.selectBlock({
                initRowIndx: b,
                initColIndx: k,
                finalRowIndx: h,
                finalColIndx: m,
                evt: c
            }), this.add({
                rowIndx: e,
                colIndx: a
            }))
        }
    };
    m._removeFromData = function(c) {
        var f = c.rowData;
        f && f.pq_cellselect && delete f.pq_cellselect[c.dataIndx]
    };
    m.removeAll = function() {
        this.refresh();
        var c = this.selection.slice(0);
        this.remove({
            cells: c
        });
        this.lastSelection =
            null
    };
    h.removeAll = function(c) {
        if (c && null != c.page) throw "objP.page not supported in removeAll";
        var f = this.that,
            b = c && null != c.all ? c.all : !0;
        this.refresh();
        c = this.selection.slice(0);
        if (b) this.remove({
            rows: c
        }), this.lastSelection = null;
        else {
            for (var b = [], e = f.rowIndxOffset, f = (f = f.pdata) ? f.length : 0, a = 0, d = c.length; a < d; a++) {
                var g = c[a],
                    h = g.rowIndx - e;
                if (0 <= h)
                    if (h < f) b.push(g);
                    else break
            }
            this.remove({
                rows: b
            })
        }
    };
    m.isSelected = function(c) {
        var f = this.that,
            b = c.rowData || f.getRowData(c),
            e = c.dataIndx;
        c = c.colIndx;
        if (null ==
            c && null == e || null == b) return null;
        e = null == e ? f.colModel[c].dataIndx : e;
        return b.pq_cellselect && b.pq_cellselect[e] ? !0 : !1
    };
    m.refresh = function() {
        this.selection = [];
        var c = this.that,
            e = c.options.dataModel.data,
            b = [],
            g = "remote" == c.options.pageModel.type ? !0 : !1,
            c = c.rowIndxOffset,
            a = this.that.colModel,
            d = a.length;
        if (e) {
            for (var h = [], k = 0; k < d; k++) {
                var m = a[k].dataIndx;
                h[k] = m
            }
            for (var k = 0, z = e.length; k < z; k++) {
                var v = e[k],
                    s = v.pq_cellselect;
                if (s)
                    for (var r = g ? k + c : k, x = 0; x < d; x++) m = h[x], s[m] && b.push({
                        rowIndx: r,
                        rowData: v,
                        dataIndx: m,
                        colIndx: x,
                        column: a[x]
                    })
            }
            this.selection = b
        }
    };
    m.replace = function(c) {
        var e = c.rowIndx,
            b = null == c.offset ? this.that.getRowIndxOffset() : c.offset;
        c.rowIndxPage = e - b;
        c.offset = b;
        this.removeAll({
            raiseEvent: !0
        });
        this.add(c)
    };
    m.inViewCell = function(c, e) {
        var b = this.that,
            g = this.options.freezeCols;
        return this.inViewRow(c) ? e < g || e >= b.initH && e <= b.finalH : !1
    };
    m._add = function(c) {
        var e = this.that,
            b = c.rowIndx,
            g = c.rowIndxPage,
            a = c.rowData || e.getRowData(c),
            d = e.rowIndxOffset,
            h, b = null == b ? g + d : b,
            g = null == g ? b - d : g,
            d = c.colIndx,
            k = c.dataIndx,
            d = null == d ? e.getColIndx({
                dataIndx: k
            }) : d,
            m = e.colModel[d],
            k = null == k ? m.dataIndx : k,
            z = c.evt,
            v = this.isSelected({
                rowData: a,
                dataIndx: k
            });
        if (null == v) return !1;
        var s = this.inViewCell(g, d);
        if (!1 === v) {
            if (s) {
                var r = e.getCell({
                    rowIndxPage: g,
                    colIndx: d
                });
                r && r.addClass("pq-state-select ui-state-highlight")
            }
            this._addToData({
                rowData: a,
                dataIndx: k
            });
            !1 !== c.trigger && e._trigger("cellSelect", z, {
                rowIndx: b,
                rowIndxPage: g,
                colIndx: d,
                dataIndx: k,
                column: m,
                rowData: a
            });
            h = !0
        }
        this.lastSelection = {
            rowIndx: b,
            dataIndx: k,
            rowData: a
        };
        !1 !== c.focus &&
            s && (r && r.length || (r = e.getCell({
                rowIndxPage: g,
                dataIndx: k
            })), r && r.length && (r.attr("tabindex", "0"), r.focus(), e._fixTableViewPort(), this.focusSelection = {
                rowData: a,
                rowIndx: b,
                dataIndx: k
            }));
        c.setFirst && (this.firstSelection = {
            rowIndx: b,
            rowData: a,
            dataIndx: k
        });
        if (h) return {
            rowIndx: b,
            rowData: a,
            dataIndx: k,
            colIndx: d,
            column: m
        }
    };
    h._add = function(c) {
        var e = this.that,
            b, g = c.rowIndx,
            a = c.rowIndxPage,
            d = e.rowIndxOffset,
            g = null == g ? a + d : g,
            a = null == a ? g - d : a,
            h = null == h ? e.getRowData(c) : h,
            d = c.$tr,
            m = c.evt,
            B = this.isSelected({
                rowData: h
            });
        c.rowIndxPage = a;
        if (null == B) return !1;
        var z = this.inViewRow(a);
        !1 === B && (z && (d = this._boundRow(c)), h.pq_rowselect = !0, !1 !== c.trigger && e._trigger("rowSelect", m, {
            rowIndx: g,
            rowIndxPage: a,
            rowData: h,
            $tr: d
        }), b = !0);
        this.lastSelection = {
            rowIndx: g,
            rowData: h
        };
        !1 !== c.focus && z && (d && d.length || (d = e.getRow({
            rowIndxPage: a
        })), d && (d = k(d[0]), d.attr("tabindex", "0"), d.focus(), e._fixTableViewPort(), this.focusSelection = {
            rowData: h,
            rowIndx: g
        }));
        c.setFirst && (this.firstSelection = {
            rowIndx: g,
            rowData: h
        });
        if (b) return {
            rowIndx: g,
            rowData: h
        }
    };
    m.add = function(c) {
        var e = this.that,
            b = c.evt,
            g = c.cells,
            a = !1,
            d = [];
        if (g && "function" == typeof g.push) {
            c = 0;
            for (var h = g.length; c < h; c++) a = g[c], a.trigger = !1, (a = this._add(a)) && d.push(a);
            d.length && (a = !0, e._trigger("cellSelect", b, {
                cells: d
            }))
        } else a = this._add(c);
        a && (e._fixIE(), this.triggerSelectChange({
            evt: b
        }))
    };
    h.add = function(c) {
        var e = this.that,
            b = c.evt,
            g = c.rows,
            a = !1,
            d = [];
        if (g && "function" == typeof g.push) {
            c = 0;
            for (var h = g.length; c < h; c++) a = g[c], a.trigger = !1, (a = this._add(a)) && d.push(a);
            d.length && (a = !0, e._trigger("rowSelect",
                b, {
                    rows: d
                }))
        } else a = this._add(c);
        a && (e._fixIE(), this.triggerSelectChange({
            evt: b
        }))
    };
    m._remove = function(c) {
        var e = this.that,
            b = c.rowIndx,
            g = c.rowIndxPage,
            a = e.rowIndxOffset,
            b = null == b ? g + a : b,
            g = null == g ? b - a : g,
            a = c.rowData || e.getRowData(c),
            d = c.colIndx,
            h = c.dataIndx,
            d = null == d ? e.getColIndx({
                dataIndx: h
            }) : d,
            k = c.column,
            k = null == k ? e.colModel[d] : k,
            h = null == h ? k.dataIndx : h,
            m = c.evt;
        if (this.isSelected({
                rowData: a,
                dataIndx: h
            })) return this.inViewCell(g, d) && (g = e.getCell({
            rowIndxPage: g,
            colIndx: d,
            all: !0
        })) && (g.removeClass("pq-state-select ui-state-highlight"),
            g.removeAttr("tabindex")), this._removeFromData({
            rowData: a,
            dataIndx: h
        }), !1 !== c.trigger && e._trigger("cellUnSelect", m, {
            rowIndx: b,
            colIndx: d,
            dataIndx: h,
            rowData: a
        }), {
            rowIndx: b,
            rowData: a,
            dataIndx: h,
            colIndx: d,
            column: k
        }
    };
    h._remove = function(c) {
        var e = this.that,
            b = c.rowIndx,
            g = c.rowIndxPage,
            a = e.rowIndxOffset,
            b = null == b ? g + a : b,
            g = null == g ? b - a : g,
            a = c.rowData,
            a = null == a ? e.getRowData(c) : a,
            d = c.$tr,
            h = c.evt;
        if (this.isSelected({
                rowData: a
            })) return this.inViewRow(g) && (d = e.getRow({
            rowIndxPage: g
        })) && (d.removeClass("pq-row-select ui-state-highlight"),
            d.removeAttr("tabindex")), a.pq_rowselect = !1, !1 !== c.trigger && e._trigger("rowUnSelect", h, {
            rowIndx: b,
            rowData: a,
            $tr: d
        }), {
            rowIndx: b,
            rowData: a
        }
    };
    m.remove = function(c) {
        var e = c.cells,
            b = c.evt,
            g = !1;
        if (e && "function" == typeof e.push) {
            c = [];
            for (var a = 0, d = e.length; a < d; a++) g = e[a], g.trigger = !1, (g = this._remove(g)) && c.push(g);
            c.length && (g = !0, this.that._trigger("cellUnSelect", b, {
                cells: c
            }))
        } else g = this._remove(c);
        g && this.triggerSelectChange({
            evt: b
        })
    };
    h.remove = function(c) {
        var e = c.rows,
            b = c.evt,
            g = !1;
        if (e && "function" == typeof e.push) {
            c = [];
            for (var a = 0, d = e.length; a < d; a++) g = e[a], g.trigger = !1, (g = this._remove(g)) && c.push(g);
            c.length && (g = !0, this.that._trigger("rowUnSelect", b, {
                rows: c
            }))
        } else g = this._remove(c);
        g && this.triggerSelectChange({
            evt: b
        })
    };
    m.indexOf = function(c) {
        this.refresh();
        var e = c.rowIndx,
            b = this.that,
            b = null == c.dataIndx ? b.colModel[c.colIndx].dataIndx : c.dataIndx;
        c.dataIndx = b;
        c = this.selection;
        for (var g = 0; g < c.length; g++) {
            var a = c[g];
            if (a.rowIndx == e && a.dataIndx == b) return g
        }
        return -1
    };
    m.selectAll = function(c) {
        var e = this.that,
            b = c && c.all ?
            !0 : !1;
        c = b ? this.options.dataModel.data : e.pdata;
        var g = e.rowIndxOffset,
            a = e.colModel,
            d = a.length,
            h = [],
            e = function(b, c) {
                for (var e = 0; e < d; e++) {
                    var f = a[e];
                    f.hidden || h.push({
                        rowIndx: c,
                        rowData: b,
                        colIndx: e,
                        dataIndx: f.dataIndx,
                        focus: !1
                    })
                }
            };
        if (c) {
            for (var k = 0, m = c.length; k < m; k++) var z = c[k];
            if (b)
                for (b = "remote" == this.options.pageModel.type ? !0 : !1, k = 0, m = c.length; k < m; k++) {
                    var z = c[k],
                        v = k;
                    b && (v = k + g);
                    e(z, v)
                } else
                    for (k = 0, m = c.length; k < m; k++) z = c[k], v = k + g, e(z, v);
            this.add({
                cells: h
            })
        }
    };
    h.selectAll = function(c) {
        var e = this.that,
            b =
            c && c.all ? !0 : !1,
            e = b ? this.options.dataModel.data : e.pdata;
        c = [];
        if (e) {
            if (b)
                for (var b = "remote" == this.options.pageModel.type ? !0 : !1, g = 0, a = e.length; g < a; g++) {
                    var d = {
                        rowData: e[g],
                        focus: !1
                    };
                    b ? d.rowIndxPage = g : d.rowIndx = g;
                    c.push(d)
                } else
                    for (g = 0, a = e.length; g < a; g++) c.push({
                        rowIndxPage: g,
                        rowData: e[g],
                        focus: !1
                    });
            this.add({
                rows: c
            })
        }
    };
    m.selectRange = function(c) {
        var e = this.that,
            b = c.initRowIndx,
            g = c.initColIndx,
            a = c.finalRowIndx;
        c = c.finalColIndx;
        for (var d = e.colModel, h = d.length, k = this.getSelection().slice(0), m = [], z = 0; z < k.length; z++) {
            var v =
                k[z],
                s = v.rowIndx,
                r = v.dataIndx,
                v = e.getColIndx({
                    dataIndx: r
                });
            s < b || s > a ? m.push({
                rowIndx: s,
                colIndx: v,
                dataIndx: r
            }) : s == b && v < g ? m.push({
                rowIndx: s,
                colIndx: v,
                dataIndx: r
            }) : s == a && v > c && m.push({
                rowIndx: s,
                colIndx: v,
                dataIndx: r
            })
        }
        this.remove({
            cells: m
        });
        m = [];
        for (v = 0; v < h; v++)
            if (e = d[v], !e.hidden) {
                r = e.dataIndx;
                s = b;
                do {
                    if (!(s == b && v < g))
                        if (s == a && v > c) break;
                        else m.push({
                            rowIndx: s,
                            colIndx: v,
                            dataIndx: r,
                            focus: !1
                        });
                    s++
                } while (s <= a)
            }
        this.add({
            cells: m
        })
    };
    m.selectBlock = function(c) {
        var e = this.that,
            b = c.initRowIndx,
            g = c.initColIndx,
            a = c.finalRowIndx,
            d = c.finalColIndx;
        c = c.evt;
        for (var h = this.getSelection().slice(0), k = e.colModel, m = [], z = 0; z < h.length; z++) {
            var v = h[z],
                s = v.rowIndx,
                v = v.dataIndx,
                r = e.getColIndx({
                    dataIndx: v
                });
            r < g || r > d ? m.push({
                rowIndx: s,
                colIndx: r,
                dataIndx: v
            }) : (s < b || s > a) && m.push({
                rowIndx: s,
                colIndx: r,
                dataIndx: v
            })
        }
        this.remove({
            cells: m
        });
        m = [];
        for (r = g; r <= d; r++)
            if (e = k[r], v = e.dataIndx, !e.hidden) {
                s = b;
                do m.push({
                    rowIndx: s,
                    colIndx: r,
                    dataIndx: v,
                    focus: !1
                }), s++; while (s <= a)
            }
        this.add({
            cells: m,
            evt: c
        })
    }
})(jQuery);
(function(k) {
    var h = (k.paramquery.cCheckBoxColumn = function(h, g) {
        var e = this;
        this.that = h;
        this.options = h.options;
        this.column = g;
        this.cb = g.cb = g.cb || {
            all: !1,
            header: !0
        };
        this.dataIndx = g.dataIndx;
        var c = h.widgetEventPrefix.toLowerCase(),
            f = h.element,
            b = h.eventNamespace;
        f.on(c + "dataavailable" + b, function(b, a) {
            if (e.belongs(b)) return e._onDataAvailable(b, a)
        });
        f.on(c + "cellclick" + b, function(b, a) {
            if (e.belongs(b)) return e.cellClick(b, a)
        });
        this.cb.reverse && (f.on(c + "rowselect" + b, function(b, a) {
            if (e.belongs(b)) return e.rowSelect(b,
                a)
        }), f.on(c + "rowunselect" + b, function(b, a) {
            if (e.belongs(b)) return e.rowUnSelect(b, a)
        }));
        f.on(c + "cellkeydown" + b, function(b, a) {
            if (e.belongs(b)) return e.cellKeyDown(b, a)
        });
        f.on(c + "refresh" + b + " " + c + "refreshrow" + b, function(b, a) {
            if (e.belongs(b)) return e.refreshHeader(b, a)
        })
    }).prototype = new k.paramquery.cClass;
    h.hasHeaderChkBox = function() {
        return this.cb.header
    };
    h.setValCBox = function() {
        if (this.hasHeaderChkBox()) {
            for (var h = this.that, g = this.options, e = this.dataIndx, h = this.cb.all ? g.dataModel.data : h.pdata, g = null,
                    c = 0, f = 0, b = 0, k = h.length; b < k; b++) h[b][e] ? c++ : f++;
            c == k ? g = !0 : f == k && (g = !1);
            this.$inp.pqval({
                val: g
            })
        }
    };
    h.onHeaderClick = function(h) {
        var g = this.that,
            e = k(h.currentTarget).find("input"),
            c = this.column,
            f = c.dataIndx,
            b = g.getColIndx({
                dataIndx: f
            }),
            l = this.cb.all ? g.options.dataModel.data : g.pdata,
            c = {
                column: c,
                dataIndx: f,
                source: "header"
            },
            a = k(h.target).is("input") ? !0 : !1,
            d = e.is(":checked"),
            n = d;
        a || (n = !d);
        if (n) {
            if (!1 === g._trigger("beforeCheck", h, c)) return !1;
            a || e.pqval({
                val: !0
            });
            e = 0;
            for (a = l.length; e < a; e++) d = l[e], d[f] = !0;
            g.$cont.find("td[pq-col-indx=" +
                b + "] input").prop("checked", !0);
            !1 !== g._trigger("check", h, c) && this.selectAllRows()
        } else {
            if (!1 === g._trigger("beforeunCheck", h, c)) return !1;
            a || e.pqval({
                val: !1
            });
            e = 0;
            for (a = l.length; e < a; e++) d = l[e], d[f] = !1;
            g.$cont.find("td[pq-col-indx=" + b + "] input").prop("checked", !1);
            !1 !== g._trigger("unCheck", h, c) && this.unSelectAllRows()
        }
    };
    h.refreshHeader = function(h, g) {
        if (this.hasHeaderChkBox()) {
            var e = this.that;
            if (e.pdata) {
                var c = this;
                if (e = e.getCellHeader({
                        dataIndx: this.dataIndx
                    })) e.html("<input type='checkbox'/>"), this.$inp =
                    e.find("input"), e.click(function(e) {
                        return c.onHeaderClick(e)
                    }), this.setValCBox()
            }
        }
    };
    h.selectAllRows = function() {
        this.that.iRows.selectAll({
            all: this.cb.all
        })
    };
    h.unSelectAllRows = function() {
        this.that.iRows.removeAll({
            all: this.cb.all
        })
    };
    h._onDataAvailable = function() {
        var h = this.that,
            g = this.options,
            e = g.dataModel.data,
            g = "remote" == g.pageModel.type ? h.rowIndxOffset : 0,
            c = this.column,
            f = c.dataIndx;
        if (null != f && e) {
            for (var b = [], k = 0, a = e.length; k < a; k++) {
                var d = e[k];
                d[f] && b.push({
                    rowIndx: k + g,
                    rowData: d
                })
            }
            if (!1 !== h._trigger("check",
                    null, {
                        rows: b,
                        column: c,
                        dataIndx: f,
                        source: "dataAvailable"
                    }))
                for (k = 0; k < a; k++) d = e[k], d[f] && (d.pq_rowselect = !0)
        }
    };
    h.cellClick = function(h, g) {
        if (g.dataIndx === this.dataIndx) return this.raiseEvent(h, g)
    };
    h.rowSelect = function(h, g) {
        var e = this.that,
            c = g.rows,
            f = g.rowData,
            b = this.dataIndx;
        if (c)
            for (var k = 0, a = c.length; k < a; k++) {
                var f = c[k],
                    d = f.rowIndx,
                    f = f.rowData;
                f[b] = !0;
                e.refreshCell({
                    rowIndx: d,
                    dataIndx: b
                })
            } else f && (f[b] = !0, d = g.rowIndx, e.refreshCell({
                rowIndx: d,
                dataIndx: b
            }));
        this.setValCBox()
    };
    h.rowUnSelect = function(h,
        g) {
        var e = this.that,
            c = g.rows,
            f = g.rowData,
            b = this.dataIndx;
        if (c)
            for (var k = 0, a = c.length; k < a; k++) {
                var f = c[k],
                    d = f.rowIndx,
                    f = f.rowData;
                f[b] = !1;
                e.refreshCell({
                    rowIndx: d,
                    dataIndx: b
                })
            } else f && (f[b] = !1, d = g.rowIndx, e.refreshCell({
                rowIndx: d,
                dataIndx: b
            }));
        this.setValCBox()
    };
    h.raiseEvent = function(h, g) {
        var e = this.that,
            c = g.rowData,
            f = k(h.originalEvent.target).is("input") ? !0 : !1,
            b = g.rowIndx,
            l = g.dataIndx;
        if (c[l]) {
            if (!1 === e._trigger("beforeunCheck", h, g)) return !1;
            c[l] = !1;
            f || (c = e.getCell(g).find("input"), c.pqval({
                val: !1
            }));
            !1 !== e._trigger("unCheck", h, g) && e.iRows.remove({
                rowIndx: b
            })
        } else {
            if (!1 === e._trigger("beforeCheck", h, g)) return !1;
            c[l] = !0;
            f || (c = e.getCell(g).find("input"), c.pqval({
                val: !0
            }));
            !1 !== e._trigger("check", h, g) && e.iRows.add({
                rowIndx: b
            })
        }
        this.setValCBox();
        if (!f) return !1
    };
    h.cellKeyDown = function(h, g) {
        if (g.dataIndx = this.dataIndx)
            if (13 == h.keyCode || 32 == h.keyCode) return this.raiseEvent(h, g)
    }
})(jQuery);
(function() {
    for (var k = 0, h = ["moz", "webkit"], m = 0; !window.requestAnimationFrame && m < h.length; m++) window.requestAnimationFrame = window[h[m] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[h[m] + "CancelAnimationFrame"] || window[h[m] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(g) {
        var e = (new Date).getTime(),
            e = Math.max(0, 16 - (e - k));
        return window.setTimeout(function() {
            k = (new Date).getTime();
            g()
        }, e)
    });
    window.cancelAnimationFrame || (window.cancelAnimationFrame =
        function(g) {
            clearTimeout(g)
        })
})();
(function(k) {
    function h(e) {
        this.that = e;
        var c = this,
            f = e.element,
            b = e.widgetEventPrefix.toLowerCase();
        e = e.eventNamespace;
        this.scrollLeft = this.scrollTop = 0;
        f.on(b + "contmousedown" + e, function(b, a) {
            if (c.belongs(b)) return c._onContMouseDown(b, a)
        }).on(b + "mousedrag" + e, function(b, a) {
            if (c.belongs(b) && c.swipedown) return c._onMouseDrag(b, a)
        }).on(b + "mousestop" + e, function(b, a) {
            return c._onMouseStop(b, a)
        }).on(b + "mousepqup" + e, function(b, a) {
            return c._onMousePQUp(b, a)
        }).on(b + "rowmousedown" + e, function(b, a) {
            if (c.belongs(b)) return c._onRowMouseDown(b,
                a)
        }).on(b + "cellmousedown" + e, function(b, a) {
            if (c.belongs(b)) return c._onCellMouseDown(b, a)
        }).on(b + "beforetableview" + e, function(b, a) {
            if (c.belongs(b)) return c._beforeTableView(b, a)
        }).on(b + "refresh" + e, function(b, a) {
            if (c.belongs(b)) return c._onRefresh(b, a)
        }).on(b + "cellmouseenter" + e, function(b, a) {
            if (c.belongs(b)) return c._onCellMouseEnter(b, a)
        }).on(b + "rowmouseenter" + e, function(b, a) {
            if (c.belongs(b)) return c._onRowMouseEnter(b, a)
        })
    }
    var m = k.paramquery.pqgrid.calcWidthCols;
    k.paramquery.cMouseSelection = h;
    var g =
        h.prototype = new k.paramquery.cClass;
    g._beforeTableView = function(e, c) {
        var f = this.that,
            b = f.getFocusElement();
        this.lastFocus = null;
        b && b.$grid && (b = b.$ae, b.hasClass("pq-grid-row") ? this.lastFocus = f = f.getRowIndx({
            $tr: b
        }) : b.hasClass("pq-grid-cell") && (this.lastFocus = f = f.getCellIndices({
            $td: b
        })))
    };
    g.inViewPort = function(e) {
        var c = this.that.iRefresh,
            f = c.getEContHt(),
            c = c.getEContWd() + 1;
        e = e[0];
        var b = this.scrollLeft;
        if (f >= e.offsetTop + e.offsetHeight + this.marginTop)
            if ("TD" == e.nodeName.toUpperCase()) {
                if (c >= e.offsetLeft +
                    e.offsetWidth + b) return !0
            } else return !0
    };
    g._onRefresh = function(e, c) {
        var f = this.that,
            b = this.lastFocus;
        b && (f = null != b.dataIndx ? f.getCell(b) : f.getRow(b)) && f.length && f.attr("tabindex", "0").focus()
    };
    g._onCellMouseDown = function(e, c) {
        var f = this.that,
            b = c.rowIndx,
            g = c.colIndx,
            a = f.options.selectionModel,
            d = a.mode;
        if ("cell" == a.type && null != g) return e.shiftKey ? (f.iCells.extendSelection({
                rowIndx: b,
                colIndx: g,
                mode: d,
                evt: e
            }), e.preventDefault()) : (e.ctrlKey || e.metaKey) && "single" != d ? f.iCells.isSelected({
                rowIndx: b,
                colIndx: g
            }) ?
            f.iCells.remove({
                rowIndx: b,
                colIndx: g
            }) : f.setSelection({
                rowIndx: b,
                colIndx: g
            }) : (this.mousedown = {
                r1: b,
                c1: g
            }, f.setSelection(null), f.setSelection({
                rowIndx: b,
                colIndx: g,
                setFirst: !0
            })), !0
    };
    g._onCellMouseEnter = function(e, c) {
        var f = this.that;
        if ("cell" == f.options.selectionModel.type && this.mousedown) {
            var b = this.mousedown,
                g = b.c1,
                a = c.rowIndx,
                d = c.colIndx;
            if (b.r1 != a || g != d)
                if (b.r2 != a || b.c2 != d) this.mousedown.r2 = a, this.mousedown.c2 = d, f.scrollCell({
                    rowIndx: a,
                    colIndx: d
                }), f.iCells.extendSelection({
                    rowIndx: a,
                    colIndx: d,
                    evt: e
                })
        }
    };
    g._onRowMouseEnter = function(e, c) {
        var f = this.that;
        if ("row" == f.options.selectionModel.type && this.mousedown) {
            var b = c.rowIndx;
            this.mousedown.r1 != b && this.mousedown.r2 != b && (this.mousedown.r2 = b, f.scrollRow({
                rowIndx: b
            }), f.iRows.extendSelection({
                rowIndx: b,
                evt: e
            }))
        }
    };
    g._onRowMouseDown = function(e, c) {
        var f = this.that,
            b = c.rowIndx,
            g = f.options.selectionModel,
            a = g.mode;
        if ("row" == g.type && null != b) return e.shiftKey ? (f.iRows.extendSelection({
                rowIndx: b,
                evt: e
            }), e.preventDefault()) : (e.ctrlKey || e.metaKey) && "single" != a ? f.iRows.isSelected({
                rowIndx: b
            }) ?
            f.iRows.remove({
                rowIndx: b
            }) : f.setSelection({
                rowIndx: b
            }) : (this.mousedown = {
                r1: b,
                y1: e.pageY,
                x1: e.pageX
            }, f.setSelection(null), f.setSelection({
                rowIndx: b,
                setFirst: !0
            })), !0
    };
    g._onContMouseDown = function(e, c) {
        this.that.options.swipeModel.on && (this._stopSwipe(!0), this.swipedown = {
            x: e.pageX,
            y: e.pageY
        });
        return !0
    };
    g._onMousePQUp = function(e, c) {
        this.mousedown = null
    };
    g._stopSwipe = function(e) {
        e && (this.swipedownPrev = this.swipedown = null);
        window.clearInterval(this.intID);
        window.cancelAnimationFrame(this.intID);
        this.intID =
            null
    };
    g._onMouseStop = function(e, c) {
        var f = this,
            b = this.that;
        if (this.swipedownPrev) {
            var g = b.options.swipeModel,
                b = this.swipedownPrev,
                a = b.ts,
                d = (new Date).getTime() - a,
                h = e.pageX,
                k = e.pageY,
                m = h - b.x,
                z = k - b.y;
            if (Math.sqrt(m * m + z * z) / d > g.ratio) {
                var v = 0,
                    s = g.repeat;
                f._stopSwipe();
                var r = function() {
                    v += g.speed;
                    s--;
                    f._onMouseDrag({
                        pageX: h + v * m / d,
                        pageY: k + v * z / d
                    });
                    0 < s ? f.intID = window.requestAnimationFrame(r) : f._stopSwipe(!0)
                };
                r()
            } else f.swipedown = null, f.swipedownPrev = null
        }
    };
    g._onMouseDrag = function(e, c) {
        var f = this.that.options;
        if (this.swipedown) {
            var b = this.swipedown,
                g = b.x,
                a = b.y,
                d = e.pageX,
                h = e.pageY;
            this.swipedownPrev = {
                x: g,
                y: a,
                ts: (new Date).getTime()
            };
            f.virtualY || "flex" === f.height || (this.scrollVertSmooth(a, h), this.syncScrollBarVert());
            f.virtualX || "flex" === f.width || (this.scrollHorSmooth(g, d), this.syncScrollBarHor());
            b.x = d;
            b.y = h
        }
        return !0
    };
    g.updateTableY = function(e) {
        if (0 == e) return !1;
        var c = this.that,
            f = this.getTableForVertScroll(),
            c = c.iRefresh.getEContHt();
        if (!f || !f.length) return !1;
        var b = f.data("offsetHeight") - 1,
            g = this.scrollTop -
            e;
        this.setScrollTop(0 > g ? 0 : 0 > e && 0 < c - b + g ? b - c : g, f);
        return !0
    };
    g.setScrollTop = function(e, c) {
        0 <= e && (this.scrollTop = e = Math.round(e), c.parent("div").scrollTop(e))
    };
    g.getScrollLeft = function() {
        return this.scrollLeft
    };
    g.getScrollTop = function() {
        return this.scrollTop
    };
    g.setScrollLeft = function(e, c, f) {
        0 <= e && (this.scrollLeft = e = Math.round(e), f && f.css({
            marginLeft: -1 * e
        }), c && c.parent("div").scrollLeft(e))
    };
    g.scrollVertSmooth = function(e, c) {
        e != c && this.updateTableY(c - e)
    };
    g.scrollHorSmooth = function(e, c) {
        if (e != c) {
            var f = this.that,
                b = c - e,
                g = this.getTableForHorScroll(),
                a = this.getTableHeaderForHorScroll(),
                f = f.iRefresh.getEContWd();
            if (g || a) {
                var d = (g ? g : a).data("scrollWidth"),
                    b = this.scrollLeft - b;
                this.setScrollLeft(0 > b ? 0 : 0 > d - f - b ? d - f : b, g, a)
            }
        }
    };
    g.syncViewWithScrollBarVert = function(e) {
        if (null != e) {
            var c = this.that,
                f = this.getTableForVertScroll();
            if (f && f.length) {
                var b = c.options;
                b.editModel.indices && c.blurEditor({
                    force: !0
                });
                var g = f.data("offsetHeight") - 1,
                    c = c.iRefresh.getEContHt();
                e *= g - c;
                if ((!g || !c) && b.debug) throw "_syncViewWithScrollBarVert !tblHt || !contHt";
                0 > e && (e = 0);
                this.setScrollTop(e, f)
            }
        }
    };
    g.syncViewWithScrollBarHor = function(e) {
        if (null != e) {
            var c = this.that,
                f = this.getTableForHorScroll(),
                b = this.getTableHeaderForHorScroll();
            if (f || b) {
                c.options.editModel.indices && c.blurEditor({
                    force: !0
                });
                var g = (f ? f : b).data("scrollWidth"),
                    c = c.iRefresh.getEContWd();
                e *= g - c;
                g && c && (0 > e && (e = 0), this.setScrollLeft(e, f, b))
            }
        }
    };
    g.resetMargins = function() {
        this.scrollTop = this.scrollLeft = 0
    };
    g.syncHeaderViewWithScrollBarHor = function(e) {
        if (null != e) {
            var c = this.that,
                f = this.getTableHeaderForHorScroll();
            if (f) {
                var b = c.options,
                    g = b.freezeCols;
                b.editModel.indices && c.blurEditor({
                    force: !0
                });
                var b = f.data("scrollWidth"),
                    a = c.iRefresh.getEContWd();
                e = m.call(c, g, e + g);
                b && a && (0 > e && (e = 0), f.css("marginLeft", -e))
            }
        }
    };
    g.syncScrollBarVert = function() {
        var e = this.that,
            c = this.getTableForVertScroll();
        if (c && c.length) {
            var c = c.data("offsetHeight"),
                f = e.iRefresh.getEContHt(),
                c = this.scrollTop / (c - f);
            0 <= c && 1 >= c && e.$vscroll.hasClass("pq-sb-vert") && e.$vscroll.pqScrollBar("option", "ratio", c)
        }
    };
    g.syncScrollBarHor = function() {
        var e = this.that,
            c = this.getTableForHorScroll(),
            f = this.getTableHeaderForHorScroll();
        if (c || f) c = (c ? c : f).data("scrollWidth"), f = e.iRefresh.getEContWd(), c = this.scrollLeft / (c - f), 0 <= c && 1 >= c && e.$hscroll.hasClass("pq-sb-horiz") && e.$hscroll.pqScrollBar("option", "ratio", c)
    };
    g.getTableForVertScroll = function() {
        var e = this.that,
            c = e.pqpanes;
        if ((e = e.$tbl) && e.length) return c.h && c.v ? e = k([e[2], e[3]]) : c.v ? e = k([e[0], e[1]]) : c.h && (e = k(e[1])), e
    };
    g.getTableForHorScroll = function() {
        var e = this.that,
            c = e.pqpanes,
            f = [],
            b = e.$tbl;
        if (b && b.length) return c.h &&
            c.v ? f.push(b[1], b[3]) : c.v ? f.push(b[1]) : c.h ? f.push(b[0], b[1]) : f.push(b[0]), e.tables.length && (e = e.tables[0].$tbl, c.v ? f.push(e[1]) : f.push(e[0])), k(f)
    };
    g.getTableHeaderForHorScroll = function() {
        var e = this.that,
            c = e.pqpanes;
        if ((e = e.$tbl_header) && e.length) return e = c.vH ? k(e[1]) : k(e[0]), e.parent()
    };
    g.scrollRowNonVirtual = function(e) {
        var c = this.that,
            f = c.options,
            b = e.rowIndxPage,
            g = e.rowIndx;
        e = c.iRefresh.getEContHt();
        b = null == b ? g - c.rowIndxOffset : b;
        f = parseInt(f.freezeRows);
        if (!(b < f) && (f = c.get$Tbl(b), g = c.getRow({
                rowIndxPage: b
            })[0])) {
            var c =
                g.offsetHeight,
                b = this.getScrollTop(),
                g = g.offsetTop,
                a = parseInt(f.css("marginTop"));
            0 > g - b + a ? (this.setScrollTop(g + a, f), this.syncScrollBarVert()) : g + c - b > e && (this.setScrollTop(c + g - e, f), this.syncScrollBarVert())
        }
    };
    g.scrollColumnNonVirtual = function(e) {
        var c = this.that,
            f = e.colIndx,
            f = null == f ? c.getColIndx({
                dataIndx: e.dataIndx
            }) : f,
            b = c.options.freezeCols;
        if (!(f < b)) {
            e = c._calcRightEdgeCol(f).width;
            var f = c._calcRightEdgeCol(f - 1).width,
                b = c._calcRightEdgeCol(b - 1).width,
                g = this.getTableForHorScroll(),
                a = this.getTableHeaderForHorScroll(),
                c = c.iRefresh.getEContWd(),
                d = this.scrollLeft;
            e - d > c ? (this.setScrollLeft(e - c, g, a), this.syncScrollBarHor()) : f - b < d && (this.setScrollLeft(f - b, g, a), this.syncScrollBarHor())
        }
    }
})(jQuery);
(function(k) {
    var h = null,
        m = !1,
        g = "",
        e = k.paramquery.pqGrid.prototype,
        c = e.options,
        f = {
            on: !0,
            header: !0,
            zIndex: 1E4
        },
        b = {
            on: !0,
            compare: "byVal",
            select: !0,
            validate: !0,
            allowInvalid: !0,
            type: "replace"
        };
    e.copy = function() {
        h = new l(this);
        h.copy();
        h = null
    };
    e.paste = function() {
        h = new l(this);
        h.paste();
        h = null
    };
    c.pasteModel = c.pasteModel || b;
    c.copyModel = c.copyModel || f;
    var l = function(a, b) {
            var c;
            this.that = a;
            b && b.hasClass("pq-grid-row") ? (this.rowIndx = a.getRowIndx({
                    $tr: b
                }).rowIndx, this.dataIndx = null) : b && b.hasClass("pq-grid-cell") ?
                (c = a.getCellIndices({
                    $td: b
                }), this.rowIndx = c.rowIndx, this.dataIndx = c.dataIndx) : this.dataIndx = this.rowIndx = null
        },
        e = l.prototype;
    e.createClipBoard = function() {
        var a = k("#pq-grid-excel-div"),
            a = this.that.options.copyModel,
            b = k("#pq-grid-excel");
        0 == b.length && (a = k("<div id='pq-grid-excel-div'  style='position:fixed;top:20px;left:20px;height:1px;width:1px;overflow:hidden;z-index:" + a.zIndex + ";'/>").appendTo(document.body), b = k("<textarea id='pq-grid-excel' autocomplete='off'  style='overflow:hidden;height:10000px;width:10000px;opacity:0' />").appendTo(a),
            b.css({
                opacity: 0
            }));
        b.select()
    };
    e.destroyClipBoard = function() {
        var a = this.that,
            b, c = a.iCells.getFocusSelection({
                old: !0
            });
        c ? b = a.getCell({
            rowIndx: c.rowIndx,
            dataIndx: c.dataIndx
        }) : (c = a.iRows.getFocusSelection({
            old: !0
        })) && (b = a.getRow({
            rowIndx: c.rowIndx
        }));
        var c = k(window).scrollTop(),
            e = k(window).scrollLeft();
        b ? b.attr("tabindex", 0).focus() : a.$cont.focus();
        a = k(window).scrollTop();
        b = k(window).scrollLeft();
        c == a && e == b || window.scrollTo(e, c)
    };
    e.clearClipBoard = function() {
        k("#pq-grid-excel").val("")
    };
    e.copy = function() {
        var a =
            k("#pq-grid-excel"),
            b = this.that,
            c = b.colModel,
            e = c.length,
            f = [],
            h = [];
        if (b.options.copyModel.on) {
            for (var f = b.iRows.getSelection(), l = 0, m = f.length; l < m; l++) {
                for (var r = f[l], x = r.rowData, p = [], r = 0; r < e; r++) {
                    var q = c[r];
                    !1 !== q.copy && p.push(x[q.dataIndx])
                }
                q = p.join("\t");
                h.push(q)
            }
            f = b.iCells.getSelection();
            c = b = null;
            p = [];
            l = 0;
            for (m = f.length; l < m; l++) r = f[l], b = r.rowIndx, x = r.rowData, q = r.column, e = r.dataIndx, !1 !== q.copy && (null != c && b != c ? (q = p.join("\t"), p = [], h.push(q), c = b) : null == c && (c = b), p.push(x[e]));
            h.push(p.join("\t"));
            q = h.join("\n");
            a.length && (a.val(q), a.select());
            g = q
        }
    };
    e.paste = function() {
        var a = this.that,
            b = k("#pq-grid-excel"),
            c = b.length ? b.val() : g,
            c = c.replace(/\n$/, ""),
            b = c.split("\n"),
            e = b.length,
            f, h = a.colModel,
            l = a.options.pasteModel,
            m = "row",
            r = h.length;
        if (l.on && 0 != c.length && 0 != e) {
            c = {
                rows: b
            };
            if (!1 === a._trigger("beforePaste", null, c)) return !1;
            var c = l.type,
                x, p, q, t, w = a.iRows.getSelectionCurPage();
            w && w.length || (m = "cell", w = a.iCells.getSelectionCurPage());
            w && w.length ? (x = w[0].rowIndx, q = w[w.length - 1].rowIndx, "cell" == m && (p =
                a.getColIndx({
                    dataIndx: w[0].dataIndx
                }), t = a.getColIndx({
                    dataIndx: w[w.length - 1].dataIndx
                }))) : t = p = q = x = 0;
            var y, u;
            "replace" == c ? (y = x, u = q - x + 1 < e ? "extend" : "repeat") : "append" == c ? (y = q + 1, u = "extend") : "prepend" == c && (y = x, u = "extend");
            var A;
            x = "extend" == u ? e : q - x + 1;
            var C;
            q = 0;
            for (var w = [], D = e = 0; D < x; D++) {
                var E = b[q],
                    G = D + y,
                    I = "replace" == c ? a.getRowData({
                        rowIndx: G
                    }) : null,
                    H = I ? {} : null,
                    F = {};
                void 0 === E && "repeat" === u && (q = 0, E = b[q]);
                q++;
                var M = E.split("\t");
                if (!f)
                    if ("cell" == m) {
                        f = M.length;
                        A = t - p + 1 < M.length ? "extend" : "repeat";
                        f = "extend" ==
                            A ? f : t - p + 1;
                        if (isNaN(f)) throw "lenH NaN. assert failed.";
                        f + p > r && (f = r - p)
                    } else f = r, p = 0;
                var J = 0,
                    Q = 0,
                    E = 0;
                C = f;
                for (Q = 0; Q < C; Q++) {
                    var O = h[Q + p],
                        R = M[J],
                        K = O.dataIndx;
                    O.hidden ? "extend" == A && C + p < r && C++ : (void 0 === R && "repeat" === A && (J = 0, R = M[J]), J++, F[K] = R, H && (H[K] = I[K]))
                }!1 == k.isEmptyObject(F) && (M = "update", null == I && (M = "add"), w.push({
                    newRow: F,
                    rowIndx: G,
                    rowData: I,
                    oldRow: H,
                    type: M
                }), e++)
            }
            c = {
                rowList: w,
                source: "paste",
                allowInvalid: l.allowInvalid,
                validate: l.validate
            };
            a._digestData(c);
            l.select && ("cell" == m ? a.iCells.selectBlock({
                initRowIndx: y,
                finalRowIndx: y + e - 1,
                initColIndx: p,
                finalColIndx: "extend" == A ? p + f - 1 + E : t
            }) : a.iRows.selectRange({
                initRowIndx: y,
                finalRowIndx: y + e - 1
            }));
            a.refreshView();
            c = {
                rows: b
            };
            a._trigger("paste", null, c)
        }
    };
    k(document).unbind(".pqExcel").bind("keydown.pqExcel", function(a) {
        if (a.ctrlKey || a.metaKey) {
            var b = k(a.target);
            if (b.hasClass("pq-grid-row") || b.hasClass("pq-grid-cell") || b.is("#pq-grid-excel") || b.is("div.pq-grid-cont")) {
                var c = b.closest(".pq-grid");
                if (h || b.length && c.length) {
                    if (!h) {
                        try {
                            var e = c.pqGrid("getInstance").grid
                        } catch (f) {
                            return !0
                        }
                        h =
                            new l(e, b);
                        h.createClipBoard()
                    }
                    "67" == a.keyCode || "99" == a.keyCode ? h.copy() : "86" == a.keyCode || "118" == a.keyCode ? (m = !0, h.clearClipBoard(), window.setTimeout(function() {
                        h && (h.paste(), h.destroyClipBoard(), h = null);
                        m = !1
                    }, 0)) : (b = k("#pq-grid-excel"), b.length && document.activeElement == b[0] && h.that._onKeyPressDown(a))
                }
            }
        }
    }).bind("keyup.pqExcel", function(a) {
        var b = a.keyCode;
        m || !h || a.ctrlKey || a.metaKey || -1 == k.inArray(b, [17, 91, 93, 224]) || (h.destroyClipBoard(), h = null)
    })
})(jQuery);
(function(k) {
    var h = k.paramquery.pqGrid.prototype.options,
        m = {
            on: !0,
            checkEditable: !0,
            checkEditableAdd: !1,
            allowInvalid: !0
        };
    h.historyModel = h.historyModel || m;
    h = (k.paramquery.cHistory = function(g) {
            var e = this;
            this.that = g;
            this.options = g.options;
            this.records = [];
            this.id = this.counter = 0;
            var c = g.eventNamespace,
                f = g.widgetEventPrefix.toLowerCase();
            g.element.on(f + "keydown" + c, function(b, c) {
                if (e.belongs(b)) return e._onKeyDown(b, c)
            });
            g.element.on(f + "dataavailable" + c, function(b, c) {
                e.belongs(b) && "filter" != c.source && e.reset()
            })
        }).prototype =
        new k.paramquery.cClass;
    h._onKeyDown = function(g, e) {
        var c = g.ctrlKey || g.metaKey;
        if (c && "90" == g.keyCode) return this.undo(), !1;
        if (c && "89" == g.keyCode) return this.redo(), !1
    };
    h.resetUndo = function() {
        if (0 == this.counter) return !1;
        this.counter = 0;
        this.that._trigger("history", null, {
            type: "resetUndo",
            num_undo: 0,
            num_redo: this.records.length - this.counter,
            canUndo: !1,
            canRedo: !0
        })
    };
    h.reset = function() {
        if (0 == this.counter && 0 == this.records.length) return !1;
        this.records = [];
        this.id = this.counter = 0;
        this.that._trigger("history",
            null, {
                num_undo: 0,
                num_redo: 0,
                type: "reset",
                canUndo: !1,
                canRedo: !1
            })
    };
    h.increment = function() {
        var g = this.records,
            e = g.length;
        this.id = e ? g[e - 1].id + 1 : 0
    };
    h.push = function(g) {
        var e = this.canRedo(),
            c = this.records,
            f = this.counter;
        c.length > f && c.splice(f, c.length - f);
        c[f] = k.extend({
            id: this.id
        }, g);
        this.counter++;
        g = this.that;
        var b, h;
        1 == this.counter && (b = !0);
        e && this.counter == c.length && (h = !1);
        g._trigger("history", null, {
            type: "add",
            canUndo: b,
            canRedo: h,
            num_undo: this.counter,
            num_redo: 0
        })
    };
    h.canUndo = function() {
        return 0 < this.counter ?
            !0 : !1
    };
    h.canRedo = function() {
        return this.counter < this.records.length ? !0 : !1
    };
    h.undo = function() {
        var g = this.canRedo(),
            e = this.that,
            c = this.options.historyModel,
            f = this.records;
        if (0 < this.counter) this.counter--;
        else return !1;
        for (var f = f[this.counter].rowList, b = [], h = 0, a = f.length; h < a; h++) {
            var d = f[h],
                k = d.newRow,
                m = d.rowData,
                B = d.type,
                z = d.oldRow,
                d = d.rowIndx;
            "update" == B ? (d = e.getRowIndx({
                    rowData: m
                }).rowIndx, b.push({
                    type: B,
                    rowIndx: d,
                    rowData: m,
                    oldRow: k,
                    newRow: z
                })) : "add" == B ? b.push({
                    type: "delete",
                    rowData: k
                }) : "delete" ==
                B && b.push({
                    type: "add",
                    rowIndx: d,
                    newRow: m
                })
        }
        e._digestData({
            history: !1,
            source: "undo",
            checkEditable: c.checkEditable,
            checkEditableAdd: c.checkEditableAdd,
            allowInvalid: c.allowInvalid,
            rowList: b
        });
        e.refreshView();
        var v, s;
        !1 === g && (v = !0);
        0 == this.counter && (s = !1);
        e._trigger("history", null, {
            canUndo: s,
            canRedo: v,
            type: "undo",
            num_undo: this.counter,
            num_redo: this.records.length - this.counter
        });
        return !0
    };
    h.redo = function() {
        var g = this.canUndo(),
            e = this.that,
            c = this.options.historyModel,
            f = this.counter,
            b = this.records;
        if (f ==
            b.length) return !1;
        for (var f = b[f].rowList, h = [], a = 0, d = f.length; a < d; a++) {
            var k = f[a],
                m = k.newRow,
                B = k.rowData,
                z = k.type,
                v = k.oldRow,
                k = k.rowIndx;
            "update" == z ? (k = e.getRowIndx({
                rowData: B
            }).rowIndx, h.push({
                type: z,
                rowIndx: k,
                rowData: B,
                oldRow: v,
                newRow: m
            })) : "add" == z ? h.push({
                type: "add",
                rowIndx: k,
                newRow: m
            }) : "delete" == z && h.push({
                type: "delete",
                rowData: B
            })
        }
        e._digestData({
            history: !1,
            source: "redo",
            checkEditable: c.checkEditable,
            checkEditableAdd: c.checkEditableAdd,
            allowInvalid: c.allowInvalid,
            rowList: h
        });
        e.refreshView();
        this.counter <
            b.length && this.counter++;
        var s, r;
        !1 == g && (s = !0);
        this.counter == this.records.length && (r = !1);
        e._trigger("history", null, {
            canUndo: s,
            canRedo: r,
            type: "redo",
            num_undo: this.counter,
            num_redo: this.records.length - this.counter
        });
        return !0
    };
    k.paramquery.pqGrid.prototype.history = function(g) {
        return this.iHistory[g.method](g)
    }
})(jQuery);
(function(k) {
    var h = k.ui.autocomplete.prototype,
        m = h._renderMenu,
        g = h._renderItem;
    h._renderMenu = function(e, c) {
        m.call(this, e, c);
        var f = this.options.selectItem;
        if (f && f.on) {
            var f = f.cls,
                f = void 0 === f ? "ui-state-highlight" : f,
                b = this.element.val();
            b && f && k("a", e).filter(function() {
                return k(this).text() === b
            }).addClass(f)
        }
    };
    h._renderItem = function(e, c) {
        var f = g.call(this, e, c),
            b = this.options.highlightText;
        if (b && b.on) {
            var h = this.element.val();
            if (h) {
                var h = new RegExp("(" + h + ")", "i"),
                    a = c.label;
                if (h.test(a)) {
                    var d = b.style,
                        b = b.cls,
                        a = a.replace(h, "<span style='" + (void 0 === d ? "font-weight:bold;" : d) + "' class='" + (void 0 === b ? "" : b) + "'>$1</span>");
                    f.find("a").html(a)
                }
            }
        }
        return f
    };
    k.widget("paramquery.pqTooltip", k.ui.tooltip, {
        options: {
            items: "td.pq-has-tooltip,td[title]",
            position: {
                my: "center top",
                at: "center bottom"
            },
            content: function() {
                var e = k(this),
                    c = e.closest(".pq-grid").pqGrid("getInstance").grid,
                    f = c.getCellIndices({
                        $td: e
                    });
                return (c = c.data({
                    rowIndx: f.rowIndx,
                    dataIndx: f.dataIndx,
                    data: "pq_valid"
                }).data) ? (e = c.icon, c = c.msg, ("" ==
                    e ? "" : "<span class='ui-icon " + e + " pq-tooltip-icon'></span>") + (null != c ? c : "")) : e.attr("title")
            }
        },
        _create: function() {
            this._super();
            var e = this.element,
                c = this.eventNamespace;
            e.on("pqtooltipopen" + c, function(c, b) {
                var e = k(c.target),
                    a = k(c.originalEvent.target);
                a.on("remove", function(a) {
                    e.pqTooltip("close", a, !0)
                });
                b.tooltip.css("zIndex", a.zIndex() + 5);
                if (e.is(".pq-grid")) {
                    var d = e.pqGrid("getCellIndices", {
                            $td: a
                        }),
                        g = d.dataIndx,
                        h;
                    (h = e.pqGrid("getRowData", {
                        rowIndx: d.rowIndx
                    })) && (h = h.pq_celldata) && (h = h[g]) && (h = h.pq_valid) &&
                    (g = h, d = g.style, b.tooltip.addClass(g.cls), g = b.tooltip.attr("style"), b.tooltip.attr("style", g + ";" + d));
                    e.find("div.pq-sb-horiz,div.pq-sb-vert").on("pqscrollbardrag", function(b, c) {
                        b.currentTarget = a[0];
                        e.pqTooltip("close", b, !0)
                    })
                }
            });
            e.on("pqtooltipclose" + c, function(c, b) {
                var e = k(c.target);
                k(c.originalEvent.target).off("remove");
                e.is(".pq-grid") && e.find("div.pq-sb-horiz,div.pq-sb-vert").off("pqscrollbardrag")
            })
        }
    })
})(jQuery);