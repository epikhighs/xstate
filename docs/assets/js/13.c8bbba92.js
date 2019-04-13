(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{169:function(e,t,s){"use strict";s.r(t);var n=s(0),i=Object(n.a)({},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"content"},[e._m(0),e._v(" "),s("p",[e._v('In statecharts, "side-effects" can be grouped into two categories:')]),e._v(" "),e._m(1),e._v(" "),s("ul",[s("li",[s("router-link",{attrs:{to:"./actions.html"}},[e._v("Actions")]),e._v(" - single, discrete effects")],1),e._v(" "),s("li",[s("router-link",{attrs:{to:"./activities.html"}},[e._v("Activities")]),e._v(" - continuous effects that are disposed when the state they were started in are exited")],1)]),e._v(" "),e._m(2),e._v(" "),s("ul",[s("li",[s("router-link",{attrs:{to:"./communication.html#invoking-promises"}},[e._v("Invoked Promises")]),e._v(" - single, discrete effects over time that may "),s("code",[e._v("resolve")]),e._v(" or "),s("code",[e._v("reject")]),e._v(" once, which are sent as events to the parent machine")],1),e._v(" "),s("li",[s("router-link",{attrs:{to:"./communication.html#invoking-callbacks"}},[e._v("Invoked Callbacks")]),e._v(" - continuous effects over time that may send multiple events, as well as listen for events sent directly to it, to/from the parent machine")],1),e._v(" "),s("li",[s("router-link",{attrs:{to:"./communication.html"}},[e._v("Invoked Machines")]),e._v(" - continuous effects represented by "),s("code",[e._v("Machine")]),e._v(" instances that can send/receive events, but also notify the parent machine when it has reached its "),s("router-link",{attrs:{to:"./final.html"}},[e._v("final state")])],1)])])},[function(){var e=this.$createElement,t=this._self._c||e;return t("h1",{attrs:{id:"effects"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#effects","aria-hidden":"true"}},[this._v("#")]),this._v(" Effects")])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[t("strong",[this._v('"Fire-and-forget" effects')]),this._v(", which execute a side-effect and do "),t("em",[this._v("not")]),this._v(" send any events back to the statechart:")])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[t("strong",[this._v("Invoked effects")]),this._v(", which executes a side-effect that can send and receive events:")])}],!1,null,null,null);t.default=i.exports}}]);