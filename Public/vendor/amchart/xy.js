"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
(self.webpackChunk_am5 = self.webpackChunk_am5 || []).push([[6450], {
  6515: function _(t, e, i) {
    i.d(e, {
      R: function R() {
        return u;
      }
    });
    var s = i(9361),
      a = i(8777),
      n = i(6245),
      r = i(7144),
      o = i(7142),
      l = i(5071),
      h = i(5040),
      g = i(7652);
    var u = /*#__PURE__*/function (_s$w) {
      function u() {
        var _this;
        _classCallCheck(this, u);
        _this = _callSuper(this, u, arguments), Object.defineProperty(_assertThisInitialized(_this), "_series", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: []
        }), Object.defineProperty(_assertThisInitialized(_this), "_isPanning", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1
        }), Object.defineProperty(_assertThisInitialized(_this), "minorDataItems", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: []
        }), Object.defineProperty(_assertThisInitialized(_this), "labelsContainer", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: _this.children.push(a.W["new"](_this._root, {}))
        }), Object.defineProperty(_assertThisInitialized(_this), "gridContainer", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: a.W["new"](_this._root, {
            width: n.AQ,
            height: n.AQ
          })
        }), Object.defineProperty(_assertThisInitialized(_this), "topGridContainer", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: a.W["new"](_this._root, {
            width: n.AQ,
            height: n.AQ
          })
        }), Object.defineProperty(_assertThisInitialized(_this), "bulletsContainer", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: _this.children.push(a.W["new"](_this._root, {
            isMeasured: !1,
            width: n.AQ,
            height: n.AQ,
            position: "absolute"
          }))
        }), Object.defineProperty(_assertThisInitialized(_this), "chart", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), Object.defineProperty(_assertThisInitialized(_this), "_rangesDirty", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1
        }), Object.defineProperty(_assertThisInitialized(_this), "_panStart", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 0
        }), Object.defineProperty(_assertThisInitialized(_this), "_panEnd", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 1
        }), Object.defineProperty(_assertThisInitialized(_this), "_sAnimation", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), Object.defineProperty(_assertThisInitialized(_this), "_eAnimation", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), Object.defineProperty(_assertThisInitialized(_this), "_skipSync", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1
        }), Object.defineProperty(_assertThisInitialized(_this), "axisRanges", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: new r.aV()
        }), Object.defineProperty(_assertThisInitialized(_this), "_seriesAxisRanges", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: []
        }), Object.defineProperty(_assertThisInitialized(_this), "ghostLabel", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), Object.defineProperty(_assertThisInitialized(_this), "_cursorPosition", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: -1
        }), Object.defineProperty(_assertThisInitialized(_this), "_snapToSeries", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), Object.defineProperty(_assertThisInitialized(_this), "_seriesValuesDirty", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1
        }), Object.defineProperty(_assertThisInitialized(_this), "_seriesAdded", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1
        }), Object.defineProperty(_assertThisInitialized(_this), "axisHeader", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: _this.children.push(a.W["new"](_this._root, {
            themeTags: ["axis", "header"],
            position: "absolute",
            background: o.A["new"](_this._root, {
              themeTags: ["header", "background"],
              fill: _this._root.interfaceColors.get("background")
            })
          }))
        }), Object.defineProperty(_assertThisInitialized(_this), "_bullets", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: {}
        });
        return _this;
      }
      _inherits(u, _s$w);
      return _createClass(u, [{
        key: "_dispose",
        value: function _dispose() {
          this.gridContainer.dispose(), this.topGridContainer.dispose(), this.bulletsContainer.dispose(), this.labelsContainer.dispose(), this.axisHeader.dispose(), _superPropGet(u, "_dispose", this, 3)([]);
        }
      }, {
        key: "_afterNew",
        value: function _afterNew() {
          var _this2 = this;
          _superPropGet(u, "_afterNew", this, 3)([]), this.setPrivate("updateScrollbar", !0), this._disposers.push(this.axisRanges.events.onAll(function (t) {
            if ("clear" === t.type) l.each(t.oldValues, function (t) {
              t.dispose();
            });else if ("push" === t.type) _this2._processAxisRange(t.newValue, ["range"]);else if ("setIndex" === t.type) _this2._processAxisRange(t.newValue, ["range"]);else if ("insertIndex" === t.type) _this2._processAxisRange(t.newValue, ["range"]);else if ("removeIndex" === t.type) _this2.disposeDataItem(t.oldValue);else {
              if ("moveIndex" !== t.type) throw new Error("Unknown IStreamEvent type");
              _this2._processAxisRange(t.value, ["range"]);
            }
          }));
          var t = this.get("renderer");
          t && (t.axis = this, t.processAxis()), this.children.push(t), this.ghostLabel = t.makeLabel(new s.z(this, void 0, {}), []), this.ghostLabel.adapters.disable("text"), this.ghostLabel.setAll({
            opacity: 0,
            tooltipText: void 0,
            tooltipHTML: void 0,
            interactive: !1
          }), this.ghostLabel.events.disable();
        }
      }, {
        key: "_updateFinals",
        value: function _updateFinals(t, e) {}
      }, {
        key: "zoom",
        value: function zoom(t, e, i, s) {
          if (this.get("zoomable", !0)) if (this._updateFinals(t, e), this.get("start") !== t || this.get("end") != e) {
            var _ref;
            var _a = this._sAnimation,
              _n = this._eAnimation,
              _r = this.get("maxDeviation", .5) * Math.min(1, e - t);
            t < -_r && (t = -_r), e > 1 + _r && (e = 1 + _r), t > e && (_ref = [e, t], t = _ref[0], e = _ref[1], _ref), h.isNumber(i) || (i = this.get("interpolationDuration", 0)), s || (s = "end");
            var _o = this.getPrivate("maxZoomFactor", this.get("maxZoomFactor", 100)),
              _l = _o;
            1 === e && 0 !== t && (s = t < this.get("start", 0) ? "start" : "end"), 0 === t && 1 !== e && (s = e > this.get("end", 1) ? "end" : "start");
            var _g = this.get("minZoomCount", 0),
              _u = this.get("maxZoomCount", 1 / 0);
            h.isNumber(_g) && (_o = _l / _g);
            var c = 1;
            if (h.isNumber(_u) && (c = _l / _u), "start" === s ? (_u > 0 && 1 / (e - t) < c && (e = t + 1 / c), 1 / (e - t) > _o && (e = t + 1 / _o), e > 1 && e - t < 1 / _o && (t = e - 1 / _o)) : (_u > 0 && 1 / (e - t) < c && (t = e - 1 / c), 1 / (e - t) > _o && (t = e - 1 / _o), t < 0 && e - t < 1 / _o && (e = t + 1 / _o)), 1 / (e - t) > _o && (e = t + 1 / _o), 1 / (e - t) > _o && (t = e - 1 / _o), null != _u && null != _g && t == this.get("start") && e == this.get("end")) {
              var _t = this.chart;
              _t && _t._handleAxisSelection(this, !0);
            }
            if ((_a && _a.playing && _a.to == t || this.get("start") == t) && (_n && _n.playing && _n.to == e || this.get("end") == e)) return;
            if (i > 0) {
              var _s,
                _a2,
                _n2 = this.get("interpolationEasing");
              if (this.get("start") != t && (_s = this.animate({
                key: "start",
                to: t,
                duration: i,
                easing: _n2
              })), this.get("end") != e && (_a2 = this.animate({
                key: "end",
                to: e,
                duration: i,
                easing: _n2
              })), this._sAnimation = _s, this._eAnimation = _a2, _s) return _s;
              if (_a2) return _a2;
            } else this.set("start", t), this.set("end", e);
          } else this._sAnimation && this._sAnimation.stop(), this._eAnimation && this._eAnimation.stop();
        }
      }, {
        key: "series",
        get: function get() {
          return this._series;
        }
      }, {
        key: "_processAxisRange",
        value: function _processAxisRange(t, e) {
          t.setRaw("isRange", !0), this._createAssets(t, e), this._rangesDirty = !0, this._prepareDataItem(t);
          var i = t.get("above"),
            s = this.topGridContainer,
            a = t.get("grid");
          i && a && s.children.moveValue(a);
          var n = t.get("axisFill");
          i && n && s.children.moveValue(n);
        }
      }, {
        key: "_prepareDataItem",
        value: function _prepareDataItem(t, e) {}
      }, {
        key: "markDirtyExtremes",
        value: function markDirtyExtremes() {}
      }, {
        key: "markDirtySelectionExtremes",
        value: function markDirtySelectionExtremes() {}
      }, {
        key: "_calculateTotals",
        value: function _calculateTotals() {}
      }, {
        key: "_updateAxisRanges",
        value: function _updateAxisRanges() {
          var _this3 = this;
          this._bullets = {}, this.axisRanges.each(function (t) {
            _this3._prepareDataItem(t);
          }), l.each(this._seriesAxisRanges, function (t) {
            _this3._prepareDataItem(t);
          });
        }
      }, {
        key: "_prepareChildren",
        value: function _prepareChildren() {
          if (_superPropGet(u, "_prepareChildren", this, 3)([]), this.get("fixAxisSize") ? this.ghostLabel.set("visible", !0) : this.ghostLabel.set("visible", !1), this.isDirty("start") || this.isDirty("end")) {
            var _t2 = this.chart;
            _t2 && _t2._updateCursor();
            var _e = this.get("start", 0),
              _i = this.get("end", 1),
              _s2 = this.get("maxDeviation", .5) * Math.min(1, _i - _e);
            if (_e < -_s2) {
              var _t3 = _e + _s2;
              _e = -_s2, this.setRaw("start", _e), this.isDirty("end") && this.setRaw("end", _i - _t3);
            }
            if (_i > 1 + _s2) {
              var _t4 = _i - 1 - _s2;
              _i = 1 + _s2, this.setRaw("end", _i), this.isDirty("start") && this.setRaw("start", _e - _t4);
            }
          }
          var t = this.get("renderer");
          if (t._start = this.get("start"), t._end = this.get("end"), t._inversed = t.get("inversed", !1), t._axisLength = t.axisLength() / (t._end - t._start), t._updateLC(), this.isDirty("tooltip")) {
            var _e2 = this.get("tooltip");
            if (_e2) {
              var _i2 = t.get("themeTags");
              _e2.addTag("axis"), _e2.addTag(this.className.toLowerCase()), _e2._applyThemes(), _i2 && (_e2.set("themeTags", g.mergeTags(_e2.get("themeTags"), _i2)), _e2.label._applyThemes());
            }
          }
        }
      }, {
        key: "_updateTooltipBounds",
        value: function _updateTooltipBounds() {
          var t = this.get("tooltip");
          t && this.get("renderer").updateTooltipBounds(t);
        }
      }, {
        key: "_updateBounds",
        value: function _updateBounds() {
          _superPropGet(u, "_updateBounds", this, 3)([]), this._updateTooltipBounds();
        }
      }, {
        key: "processChart",
        value: function processChart(t) {
          var _this4 = this;
          this.chart = t, this.get("renderer").chart = t, t.gridContainer.children.push(this.gridContainer), t.topGridContainer.children.push(this.topGridContainer), t.axisHeadersContainer.children.push(this.axisHeader), this.on("start", function () {
            t._handleAxisSelection(_this4);
          }), this.on("end", function () {
            t._handleAxisSelection(_this4);
          }), t.plotContainer.onPrivate("width", function () {
            _this4.markDirtySize();
          }), t.plotContainer.onPrivate("height", function () {
            _this4.markDirtySize();
          }), t.processAxis(this);
        }
      }, {
        key: "hideDataItem",
        value: function hideDataItem(t) {
          return this._toggleFHDataItem(t, !0), _superPropGet(u, "hideDataItem", this, 3)([t]);
        }
      }, {
        key: "showDataItem",
        value: function showDataItem(t) {
          return this._toggleFHDataItem(t, !1), _superPropGet(u, "showDataItem", this, 3)([t]);
        }
      }, {
        key: "_toggleFHDataItem",
        value: function _toggleFHDataItem(t, e) {
          var i = "forceHidden",
            s = t.get("label");
          s && s.set(i, e);
          var a = t.get("grid");
          a && a.set(i, e);
          var n = t.get("tick");
          n && n.set(i, e);
          var r = t.get("axisFill");
          r && r.set(i, e);
          var o = t.get("bullet");
          if (o) {
            var _t5 = o.get("sprite");
            _t5 && _t5.set(i, e);
          }
        }
      }, {
        key: "_toggleDataItem",
        value: function _toggleDataItem(t, e) {
          var i = t.get("label"),
            s = "visible";
          i && i.setPrivate(s, e);
          var a = t.get("grid");
          a && a.setPrivate(s, e);
          var n = t.get("tick");
          n && n.setPrivate(s, e);
          var r = t.get("axisFill");
          r && r.setPrivate(s, e);
          var o = t.get("bullet");
          if (o) {
            var _t6 = o.get("sprite");
            _t6 && _t6.setPrivate(s, e);
          }
        }
      }, {
        key: "_createAssets",
        value: function _createAssets(t, e, i) {
          var s, a, n;
          var r = this.get("renderer");
          var o = "minor";
          var l = t.get("label");
          if (l) {
            var _a3 = l.get("themeTags"),
              _n3 = !1;
            i ? -1 == (null == _a3 ? void 0 : _a3.indexOf(o)) && (_n3 = !0) : -1 != (null == _a3 ? void 0 : _a3.indexOf(o)) && (_n3 = !0), _n3 && (null === (s = l.parent) || void 0 === s || s.children.removeValue(l), r.makeLabel(t, e), l.dispose(), r.labels.removeValue(l));
          } else r.makeLabel(t, e);
          var h = t.get("grid");
          if (h) {
            var _s3 = h.get("themeTags"),
              _n4 = !1;
            i ? -1 == (null == _s3 ? void 0 : _s3.indexOf(o)) && (_n4 = !0) : -1 != (null == _s3 ? void 0 : _s3.indexOf(o)) && (_n4 = !0), _n4 && (null === (a = h.parent) || void 0 === a || a.children.removeValue(h), r.makeGrid(t, e), h.dispose(), r.grid.removeValue(h));
          } else r.makeGrid(t, e);
          var g = t.get("tick");
          if (g) {
            var _s4 = !1,
              _a4 = g.get("themeTags");
            i ? -1 == (null == _a4 ? void 0 : _a4.indexOf(o)) && (_s4 = !0) : -1 != (null == _a4 ? void 0 : _a4.indexOf(o)) && (_s4 = !0), _s4 && (null === (n = g.parent) || void 0 === n || n.children.removeValue(g), r.makeTick(t, e), g.dispose(), r.ticks.removeValue(g));
          } else r.makeTick(t, e);
          i || t.get("axisFill") || r.makeAxisFill(t, e), this._processBullet(t);
        }
      }, {
        key: "_processBullet",
        value: function _processBullet(t) {
          var e = t.get("bullet"),
            i = this.get("bullet");
          if (e || !i || t.get("isRange") || (e = i(this._root, this, t)), e) {
            e.axis = this;
            var _i3 = e.get("sprite");
            _i3 && (_i3._setDataItem(t), t.setRaw("bullet", e), _i3.parent || this.bulletsContainer.children.push(_i3));
          }
        }
      }, {
        key: "_afterChanged",
        value: function _afterChanged() {
          _superPropGet(u, "_afterChanged", this, 3)([]);
          var t = this.chart;
          t && (t._updateChartLayout(), t.axisHeadersContainer.markDirtySize()), this.get("renderer")._updatePositions(), this._seriesAdded = !1;
        }
      }, {
        key: "disposeDataItem",
        value: function disposeDataItem(t) {
          _superPropGet(u, "disposeDataItem", this, 3)([t]);
          var e = this.get("renderer"),
            i = t.get("label");
          i && (e.labels.removeValue(i), i.dispose());
          var s = t.get("tick");
          s && (e.ticks.removeValue(s), s.dispose());
          var a = t.get("grid");
          a && (e.grid.removeValue(a), a.dispose());
          var n = t.get("axisFill");
          n && (e.axisFills.removeValue(n), n.dispose());
          var r = t.get("bullet");
          r && r.dispose();
        }
      }, {
        key: "_updateGhost",
        value: function _updateGhost() {
          this.setPrivate("cellWidth", this.getCellWidthPosition() * this.get("renderer").axisLength());
          var t = this.ghostLabel;
          if (!t.isHidden()) {
            var _e3 = t.localBounds(),
              _i4 = Math.ceil(_e3.right - _e3.left);
            var _s5 = t.get("text");
            l.each(this.dataItems, function (t) {
              var e = t.get("label");
              if (e && !e.isHidden()) {
                var _t7 = e.localBounds();
                Math.ceil(_t7.right - _t7.left) > _i4 && (_s5 = e.text._getText());
              }
            }), t.set("text", _s5);
          }
          var e = this.get("start", 0),
            i = this.get("end", 1);
          this.get("renderer").updateLabel(t, e + .5 * (i - e));
        }
      }, {
        key: "_handleCursorPosition",
        value: function _handleCursorPosition(t, e) {
          t = this.get("renderer").toAxisPosition(t), this._cursorPosition = t, this._snapToSeries = e, this.updateTooltip();
        }
      }, {
        key: "updateTooltip",
        value: function updateTooltip() {
          var _this5 = this;
          var t = this._snapToSeries;
          var e = this._cursorPosition;
          var i = this.get("tooltip"),
            s = this.get("renderer");
          h.isNumber(e) && (l.each(this.series, function (i) {
            if (i.get("baseAxis") === _this5) {
              var _s6 = _this5.getSeriesItem(i, e, _this5.get("tooltipLocation"));
              t && -1 != t.indexOf(i) ? (i.updateLegendMarker(_s6), i.updateLegendValue(_s6), i._settings.tooltipDataItem = _s6) : (i.showDataItemTooltip(_s6), i.setRaw("tooltipDataItem", _s6));
            }
          }), this.get("snapTooltip") && (e = this.roundAxisPosition(e, this.get("tooltipLocation", .5))), this.setPrivateRaw("tooltipPosition", e), i && (s.updateTooltipBounds(i), h.isNaN(e) ? i.hide(0) : (this._updateTooltipText(i, e), s.positionTooltip(i, e), e < this.get("start", 0) || e > this.get("end", 1) ? i.hide(0) : i.show(0))));
        }
      }, {
        key: "_updateTooltipText",
        value: function _updateTooltipText(t, e) {
          t.label.set("text", this.getTooltipText(e));
        }
      }, {
        key: "roundAxisPosition",
        value: function roundAxisPosition(t, e) {
          return t;
        }
      }, {
        key: "_handleSeriesRemoved",
        value: function _handleSeriesRemoved() {}
      }, {
        key: "handleCursorShow",
        value: function handleCursorShow() {
          var t = this.get("tooltip");
          t && t.show();
        }
      }, {
        key: "handleCursorHide",
        value: function handleCursorHide() {
          var t = this.get("tooltip");
          t && t.hide();
        }
      }, {
        key: "processSeriesDataItem",
        value: function processSeriesDataItem(t, e) {}
      }, {
        key: "_clearDirty",
        value: function _clearDirty() {
          _superPropGet(u, "_clearDirty", this, 3)([]), this._sizeDirty = !1, this._rangesDirty = !1;
        }
      }, {
        key: "coordinateToPosition",
        value: function coordinateToPosition(t) {
          var e = this.get("renderer");
          return e.toAxisPosition(t / e.axisLength());
        }
      }, {
        key: "toAxisPosition",
        value: function toAxisPosition(t) {
          return this.get("renderer").toAxisPosition(t);
        }
      }, {
        key: "toGlobalPosition",
        value: function toGlobalPosition(t) {
          return this.get("renderer").toGlobalPosition(t);
        }
      }, {
        key: "fixPosition",
        value: function fixPosition(t) {
          return this.get("renderer").fixPosition(t);
        }
      }, {
        key: "shouldGap",
        value: function shouldGap(t, e, i, s) {
          return !1;
        }
      }, {
        key: "createAxisRange",
        value: function createAxisRange(t) {
          return this.axisRanges.push(t);
        }
      }, {
        key: "_groupSeriesData",
        value: function _groupSeriesData(t) {}
      }, {
        key: "getCellWidthPosition",
        value: function getCellWidthPosition() {
          return .05;
        }
      }]);
    }(s.w);
    Object.defineProperty(u, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Axis"
    }), Object.defineProperty(u, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: s.w.classNames.concat([u.className])
    });
  },
  2586: function _(t, e, i) {
    i.d(e, {
      _: function _() {
        return n;
      }
    });
    var s = i(6331),
      a = i(256);
    var n = /*#__PURE__*/function (_s$JH) {
      function n() {
        var _this6;
        _classCallCheck(this, n);
        _this6 = _callSuper(this, n, arguments), Object.defineProperty(_assertThisInitialized(_this6), "axis", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        });
        return _this6;
      }
      _inherits(n, _s$JH);
      return _createClass(n, [{
        key: "_beforeChanged",
        value: function _beforeChanged() {
          _superPropGet(n, "_beforeChanged", this, 3)([]);
          var t = this.get("sprite");
          if (this.isDirty("sprite") && t && (t.setAll({
            position: "absolute",
            role: "figure"
          }), this._disposers.push(t)), this.isDirty("location")) {
            var _e4 = t.dataItem;
            this.axis && t && _e4 && this.axis._prepareDataItem(_e4);
          }
        }
      }, {
        key: "_dispose",
        value: function _dispose() {
          var _this7 = this;
          var t = this.axis;
          t && a.each(t._bullets, function (e, i) {
            i.uid == _this7.uid && delete t._bullets[e];
          }), _superPropGet(n, "_dispose", this, 3)([]);
        }
      }]);
    }(s.JH);
    Object.defineProperty(n, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "AxisBullet"
    }), Object.defineProperty(n, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: s.JH.classNames.concat([n.className])
    });
  },
  6284: function _(t, e, i) {
    i.d(e, {
      n: function n() {
        return l;
      }
    });
    var s = i(6275),
      a = i(6245),
      n = i(5040),
      r = i(7652),
      o = i(7142);
    var l = /*#__PURE__*/function (_s$Y) {
      function l() {
        var _this8;
        _classCallCheck(this, l);
        _this8 = _callSuper(this, l, arguments), Object.defineProperty(_assertThisInitialized(_this8), "thumb", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: o.A["new"](_this8._root, {
            width: a.AQ,
            isMeasured: !1,
            themeTags: ["axis", "x", "thumb"]
          })
        });
        return _this8;
      }
      _inherits(l, _s$Y);
      return _createClass(l, [{
        key: "_afterNew",
        value: function _afterNew() {
          this._settings.themeTags = r.mergeTags(this._settings.themeTags, ["renderer", "x"]), _superPropGet(l, "_afterNew", this, 3)([]), this.setPrivateRaw("letter", "X");
          var t = this.grid.template;
          t.set("height", a.AQ), t.set("width", 0), t.set("draw", function (t, e) {
            t.moveTo(0, 0), t.lineTo(0, e.height());
          }), this.set("draw", function (t, e) {
            t.moveTo(0, 0), t.lineTo(e.width(), 0);
          });
        }
      }, {
        key: "_changed",
        value: function _changed() {
          _superPropGet(l, "_changed", this, 3)([]);
          var t = this.axis;
          t.ghostLabel.setPrivate("visible", !this.get("inside")), t.ghostLabel.set("x", -1e3);
          var e = "opposite",
            i = "inside";
          if (this.isDirty(e) || this.isDirty(i)) {
            var _s7 = this.chart,
              _a5 = t.children;
            if (this.get(i) ? t.addTag(i) : t.removeTag(i), _s7) {
              if (this.get(e)) {
                var _i5 = _s7.topAxesContainer.children;
                -1 == _i5.indexOf(t) && _i5.insertIndex(0, t), t.addTag(e), _a5.moveValue(this);
              } else {
                var _i6 = _s7.bottomAxesContainer.children;
                -1 == _i6.indexOf(t) && _i6.moveValue(t), t.removeTag(e), _a5.moveValue(this, 0);
              }
              t.ghostLabel._applyThemes(), this.labels.each(function (t) {
                t._applyThemes();
              }), this.root._markDirtyRedraw();
            }
            t.markDirtySize();
          }
          this.thumb.setPrivate("height", t.labelsContainer.height());
        }
      }, {
        key: "_getPan",
        value: function _getPan(t, e) {
          return (e.x - t.x) / this.width();
        }
      }, {
        key: "toAxisPosition",
        value: function toAxisPosition(t) {
          var e = this._start || 0,
            i = this._end || 1;
          return t = (t -= this._ls) * (i - e) / this._lc, this.get("inversed") ? i - t : e + t;
        }
      }, {
        key: "toGlobalPosition",
        value: function toGlobalPosition(t) {
          var e = this._start || 0,
            i = this._end || 1;
          return this.get("inversed") ? t = i - t : t -= e, (t = t / (i - e) * this._lc) + this._ls;
        }
      }, {
        key: "_updateLC",
        value: function _updateLC() {
          var t = this.axis,
            e = t.parent;
          if (e) {
            var _i7 = e.innerWidth();
            this._lc = this.axisLength() / _i7, this._ls = (t.x() - e.get("paddingLeft", 0)) / _i7;
          }
        }
      }, {
        key: "_updatePositions",
        value: function _updatePositions() {
          var t = this.axis,
            e = t.x() - r.relativeToValue(t.get("centerX", 0), t.width()) - t.parent.get("paddingLeft", 0);
          t.gridContainer.set("x", e), t.topGridContainer.set("x", e), t.bulletsContainer.set("y", this.y());
          var i = t.chart;
          if (i) {
            var _e5 = i.plotContainer,
              _s8 = t.axisHeader;
            var _a6 = t.get("marginLeft", 0),
              _n5 = t.x() - _a6;
            var _r2 = t.parent;
            _r2 && (_n5 -= _r2.get("paddingLeft", 0)), _s8.children.length > 0 ? (_a6 = t.axisHeader.width(), t.set("marginLeft", _a6 + 1)) : _s8.set("width", _a6), _s8.setAll({
              x: _n5,
              y: -1,
              height: _e5.height() + 2
            });
          }
        }
      }, {
        key: "processAxis",
        value: function processAxis() {
          _superPropGet(l, "processAxis", this, 3)([]);
          var t = this.axis;
          null == t.get("width") && t.set("width", a.AQ);
          var e = this._root.verticalLayout;
          t.set("layout", e), t.labelsContainer.set("width", a.AQ), t.axisHeader.setAll({
            layout: e
          });
        }
      }, {
        key: "axisLength",
        value: function axisLength() {
          return this.axis.width();
        }
      }, {
        key: "positionToPoint",
        value: function positionToPoint(t) {
          return {
            x: this.positionToCoordinate(t),
            y: 0
          };
        }
      }, {
        key: "updateTick",
        value: function updateTick(t, e, i, s) {
          if (t) {
            n.isNumber(e) || (e = 0);
            var _r3 = .5;
            _r3 = n.isNumber(s) && s > 1 ? t.get("multiLocation", _r3) : t.get("location", _r3), n.isNumber(i) && i != e && (e += (i - e) * _r3), t.set("x", this.positionToCoordinate(e));
            var _o2 = t.get("length", 0);
            var _l2 = t.get("inside", this.get("inside", !1));
            this.get("opposite") ? (t.set("y", a.AQ), _l2 || (_o2 *= -1)) : (t.set("y", 0), _l2 && (_o2 *= -1)), t.set("draw", function (t) {
              t.moveTo(0, 0), t.lineTo(0, _o2);
            }), this.toggleVisibility(t, e, t.get("minPosition", 0), t.get("maxPosition", 1));
          }
        }
      }, {
        key: "updateLabel",
        value: function updateLabel(t, e, i, s) {
          if (t) {
            var _r4 = .5;
            _r4 = n.isNumber(s) && s > 1 ? t.get("multiLocation", _r4) : t.get("location", _r4), n.isNumber(e) || (e = 0);
            var _o3 = t.get("inside", this.get("inside", !1));
            this.get("opposite") ? _o3 ? (t.set("position", "absolute"), t.set("y", 0)) : (t.set("position", "relative"), t.set("y", a.AQ)) : _o3 ? (t.set("y", 0), t.set("position", "absolute")) : (t.set("y", void 0), t.set("position", "relative")), n.isNumber(i) && i != e && (e += (i - e) * _r4), t.set("x", this.positionToCoordinate(e)), this.toggleVisibility(t, e, t.get("minPosition", 0), t.get("maxPosition", 1));
          }
        }
      }, {
        key: "updateGrid",
        value: function updateGrid(t, e, i) {
          if (t) {
            n.isNumber(e) || (e = 0);
            var _s9 = t.get("location", .5);
            n.isNumber(i) && i != e && (e += (i - e) * _s9), t.set("x", this.positionToCoordinate(e)), this.toggleVisibility(t, e, 0, 1);
          }
        }
      }, {
        key: "updateBullet",
        value: function updateBullet(t, e, i) {
          if (t) {
            var _s0 = t.get("sprite");
            if (_s0) {
              n.isNumber(e) || (e = 0);
              var _a7 = t.get("location", .5);
              n.isNumber(i) && i != e && (e += (i - e) * _a7);
              var _r5 = this.axis.roundAxisPosition(e, _a7),
                _o4 = this.axis._bullets[_r5],
                _l3 = -1;
              if (this.get("opposite") && (_l3 = 1), t.get("stacked")) if (_o4) {
                var _t8 = _o4.get("sprite");
                _t8 && _s0.set("y", _t8.y() + _t8.height() * _l3);
              } else _s0.set("y", 0);
              this.axis._bullets[_r5] = t, _s0.set("x", this.positionToCoordinate(e)), this.toggleVisibility(_s0, e, 0, 1);
            }
          }
        }
      }, {
        key: "updateFill",
        value: function updateFill(t, e, i) {
          if (t) {
            n.isNumber(e) || (e = 0), n.isNumber(i) || (i = 1);
            var _s1 = this.positionToCoordinate(e),
              _a8 = this.positionToCoordinate(i);
            this.fillDrawMethod(t, _s1, _a8);
          }
        }
      }, {
        key: "fillDrawMethod",
        value: function fillDrawMethod(t, e, i) {
          var _this9 = this;
          t.set("draw", function (t) {
            var _ref2;
            var s = _this9.axis.gridContainer.height(),
              a = _this9.width();
            i < e && (_ref2 = [e, i], i = _ref2[0], e = _ref2[1], _ref2), e > a || i < 0 || (t.moveTo(e, 0), t.lineTo(i, 0), t.lineTo(i, s), t.lineTo(e, s), t.lineTo(e, 0));
          });
        }
      }, {
        key: "positionTooltip",
        value: function positionTooltip(t, e) {
          this._positionTooltip(t, {
            x: this.positionToCoordinate(e),
            y: 0
          });
        }
      }, {
        key: "updateTooltipBounds",
        value: function updateTooltipBounds(t) {
          var e = this.get("inside"),
            i = 1e5;
          var s = this._display.toGlobal({
              x: 0,
              y: 0
            }),
            a = s.x,
            n = 0,
            o = this.axisLength(),
            _l4 = i,
            h = "up";
          this.get("opposite") ? e ? (h = "up", n = s.y, _l4 = i) : (h = "down", n = s.y - i, _l4 = i) : e ? (h = "down", n = s.y - i, _l4 = i) : (h = "up", n = s.y, _l4 = i);
          var g = {
              left: a,
              right: a + o,
              top: n,
              bottom: n + _l4
            },
            u = t.get("bounds");
          r.sameBounds(g, u) || (t.set("bounds", g), t.set("pointerOrientation", h));
        }
      }]);
    }(s.Y);
    Object.defineProperty(l, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "AxisRendererX"
    }), Object.defineProperty(l, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: s.Y.classNames.concat([l.className])
    });
  },
  7909: function _(t, e, i) {
    i.d(e, {
      j: function j() {
        return l;
      }
    });
    var s = i(6275),
      a = i(6245),
      n = i(5040),
      r = i(7652),
      o = i(7142);
    var l = /*#__PURE__*/function (_s$Y2) {
      function l() {
        var _this0;
        _classCallCheck(this, l);
        _this0 = _callSuper(this, l, arguments), Object.defineProperty(_assertThisInitialized(_this0), "_downY", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), Object.defineProperty(_assertThisInitialized(_this0), "thumb", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: o.A["new"](_this0._root, {
            height: a.AQ,
            isMeasured: !1,
            themeTags: ["axis", "y", "thumb"]
          })
        });
        return _this0;
      }
      _inherits(l, _s$Y2);
      return _createClass(l, [{
        key: "_afterNew",
        value: function _afterNew() {
          this._settings.themeTags = r.mergeTags(this._settings.themeTags, ["renderer", "y"]), this._settings.opposite && this._settings.themeTags.push("opposite"), _superPropGet(l, "_afterNew", this, 3)([]), this.setPrivateRaw("letter", "Y");
          var t = this.grid.template;
          t.set("width", a.AQ), t.set("height", 0), t.set("draw", function (t, e) {
            t.moveTo(0, 0), t.lineTo(e.width(), 0);
          }), this.set("draw", function (t, e) {
            t.moveTo(0, 0), t.lineTo(0, e.height());
          });
        }
      }, {
        key: "_getPan",
        value: function _getPan(t, e) {
          return (t.y - e.y) / this.height();
        }
      }, {
        key: "_changed",
        value: function _changed() {
          _superPropGet(l, "_changed", this, 3)([]);
          var t = this.axis;
          t.ghostLabel.setPrivate("visible", !this.get("inside")), t.ghostLabel.set("y", -1e3);
          var e = this.thumb,
            i = "opposite",
            s = "inside",
            a = this.chart;
          if (this.isDirty(i) || this.isDirty(s)) {
            var _e6 = t.children;
            if (this.get(s) ? t.addTag(s) : t.removeTag(s), a) {
              if (this.get(i)) {
                var _s10 = a.rightAxesContainer.children;
                -1 == _s10.indexOf(t) && _s10.moveValue(t, 0), t.addTag(i), _e6.moveValue(this, 0);
              } else {
                var _s11 = a.leftAxesContainer.children;
                -1 == _s11.indexOf(t) && _s11.moveValue(t), t.removeTag(i), _e6.moveValue(this);
              }
              t.ghostLabel._applyThemes(), this.labels.each(function (t) {
                t._applyThemes();
              }), this.root._markDirtyRedraw();
            }
            t.markDirtySize();
          }
          var n = t.labelsContainer.width();
          a && (this.get(i) ? e.set("centerX", 0) : e.set("centerX", n)), e.setPrivate("width", n);
        }
      }, {
        key: "processAxis",
        value: function processAxis() {
          _superPropGet(l, "processAxis", this, 3)([]);
          var t = this.axis;
          null == t.get("height") && t.set("height", a.AQ);
          var e = this._root.horizontalLayout;
          t.set("layout", e), t.labelsContainer.set("height", a.AQ), t.axisHeader.set("layout", e);
        }
      }, {
        key: "_updatePositions",
        value: function _updatePositions() {
          var t = this.axis,
            e = t.y() - r.relativeToValue(t.get("centerY", 0), t.height());
          t.gridContainer.set("y", e), t.topGridContainer.set("y", e), t.bulletsContainer.set("x", this.x());
          var i = t.chart;
          if (i) {
            var _e7 = i.plotContainer,
              _s12 = t.axisHeader;
            var _a9 = t.get("marginTop", 0);
            _s12.children.length > 0 ? (_a9 = t.axisHeader.height(), t.set("marginTop", _a9 + 1)) : _s12.set("height", _a9), _s12.setAll({
              y: t.y() - _a9,
              x: -1,
              width: _e7.width() + 2
            });
          }
        }
      }, {
        key: "axisLength",
        value: function axisLength() {
          return this.axis.innerHeight();
        }
      }, {
        key: "positionToPoint",
        value: function positionToPoint(t) {
          return {
            x: 0,
            y: this.positionToCoordinate(t)
          };
        }
      }, {
        key: "updateLabel",
        value: function updateLabel(t, e, i, s) {
          if (t) {
            n.isNumber(e) || (e = 0);
            var _a0 = .5;
            _a0 = n.isNumber(s) && s > 1 ? t.get("multiLocation", _a0) : t.get("location", _a0);
            var _r6 = this.get("opposite"),
              _o5 = t.get("inside", this.get("inside", !1));
            _r6 ? (t.set("x", 0), _o5 ? t.set("position", "absolute") : t.set("position", "relative")) : _o5 ? (t.set("x", 0), t.set("position", "absolute")) : (t.set("x", void 0), t.set("position", "relative")), n.isNumber(i) && i != e && (e += (i - e) * _a0), t.set("y", this.positionToCoordinate(e)), this.toggleVisibility(t, e, t.get("minPosition", 0), t.get("maxPosition", 1));
          }
        }
      }, {
        key: "updateGrid",
        value: function updateGrid(t, e, i) {
          if (t) {
            n.isNumber(e) || (e = 0);
            var _s13 = t.get("location", .5);
            n.isNumber(i) && i != e && (e += (i - e) * _s13), t.set("y", this.positionToCoordinate(e)), this.toggleVisibility(t, e, 0, 1);
          }
        }
      }, {
        key: "updateTick",
        value: function updateTick(t, e, i, s) {
          if (t) {
            n.isNumber(e) || (e = 0);
            var _a1 = .5;
            _a1 = n.isNumber(s) && s > 1 ? t.get("multiLocation", _a1) : t.get("location", _a1), n.isNumber(i) && i != e && (e += (i - e) * _a1), t.set("y", this.positionToCoordinate(e));
            var _r7 = t.get("length", 0);
            var _o6 = t.get("inside", this.get("inside", !1));
            this.get("opposite") ? (t.set("x", 0), _o6 && (_r7 *= -1)) : _o6 || (_r7 *= -1), t.set("draw", function (t) {
              t.moveTo(0, 0), t.lineTo(_r7, 0);
            }), this.toggleVisibility(t, e, t.get("minPosition", 0), t.get("maxPosition", 1));
          }
        }
      }, {
        key: "updateBullet",
        value: function updateBullet(t, e, i) {
          if (t) {
            var _s14 = t.get("sprite");
            if (_s14) {
              n.isNumber(e) || (e = 0);
              var _a10 = t.get("location", .5);
              n.isNumber(i) && i != e && (e += (i - e) * _a10);
              var _r8 = this.axis.roundAxisPosition(e, _a10),
                _o7 = this.axis._bullets[_r8],
                _l5 = 1;
              if (this.get("opposite") && (_l5 = -1), t.get("stacked")) if (_o7) {
                var _t9 = _o7.get("sprite");
                _t9 && _s14.set("x", _t9.x() + _t9.width() * _l5);
              } else _s14.set("x", 0);
              this.axis._bullets[_r8] = t, _s14.set("y", this.positionToCoordinate(e)), this.toggleVisibility(_s14, e, 0, 1);
            }
          }
        }
      }, {
        key: "updateFill",
        value: function updateFill(t, e, i) {
          if (t) {
            n.isNumber(e) || (e = 0), n.isNumber(i) || (i = 1);
            var _s15 = this.positionToCoordinate(e),
              _a11 = this.positionToCoordinate(i);
            this.fillDrawMethod(t, _s15, _a11);
          }
        }
      }, {
        key: "fillDrawMethod",
        value: function fillDrawMethod(t, e, i) {
          var _this1 = this;
          t.set("draw", function (t) {
            var _ref3;
            var s = _this1.axis.gridContainer.width(),
              a = _this1.height();
            i < e && (_ref3 = [e, i], i = _ref3[0], e = _ref3[1], _ref3), e > a || i < 0 || (t.moveTo(0, e), t.lineTo(s, e), t.lineTo(s, i), t.lineTo(0, i), t.lineTo(0, e));
          });
        }
      }, {
        key: "positionToCoordinate",
        value: function positionToCoordinate(t) {
          return this._inversed ? (t - this._start) * this._axisLength : (this._end - t) * this._axisLength;
        }
      }, {
        key: "positionTooltip",
        value: function positionTooltip(t, e) {
          this._positionTooltip(t, {
            x: 0,
            y: this.positionToCoordinate(e)
          });
        }
      }, {
        key: "updateTooltipBounds",
        value: function updateTooltipBounds(t) {
          var e = this.get("inside"),
            i = 1e5;
          var s = this._display.toGlobal({
              x: 0,
              y: 0
            }),
            a = s.y,
            n = 0,
            o = this.axisLength(),
            _l6 = i,
            h = "right";
          this.get("opposite") ? e ? (h = "right", n = s.x - i, _l6 = i) : (h = "left", n = s.x, _l6 = i) : e ? (h = "left", n = s.x, _l6 = i) : (h = "right", n = s.x - i, _l6 = i);
          var g = {
              left: n,
              right: n + _l6,
              top: a,
              bottom: a + o
            },
            u = t.get("bounds");
          r.sameBounds(g, u) || (t.set("bounds", g), t.set("pointerOrientation", h));
        }
      }, {
        key: "_updateLC",
        value: function _updateLC() {
          var t = this.axis,
            e = t.parent;
          if (e) {
            var _i8 = e.innerHeight();
            this._lc = this.axisLength() / _i8, this._ls = t.y() / _i8;
          }
        }
      }, {
        key: "toAxisPosition",
        value: function toAxisPosition(t) {
          var e = this._start || 0,
            i = this._end || 1;
          return t = (t -= this._ls) * (i - e) / this._lc, this.get("inversed") ? e + t : i - t;
        }
      }, {
        key: "toGlobalPosition",
        value: function toGlobalPosition(t) {
          var e = this._start || 0,
            i = this._end || 1;
          return this.get("inversed") ? t -= e : t = i - t, (t = t / (i - e) * this._lc) + this._ls;
        }
      }, {
        key: "fixPosition",
        value: function fixPosition(t) {
          return this.get("inversed") ? t : 1 - t;
        }
      }]);
    }(s.Y);
    Object.defineProperty(l, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "AxisRendererY"
    }), Object.defineProperty(l, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: s.Y.classNames.concat([l.className])
    });
  },
  5638: function _(t, e, i) {
    i.d(e, {
      S: function S() {
        return c;
      }
    });
    var s = i(9361),
      a = i(7261),
      n = i(5040),
      r = i(751),
      o = i(3540),
      l = i(5071),
      h = i(256),
      g = i(7652),
      u = i(1926);
    var c = /*#__PURE__*/function (_a$m) {
      function c() {
        var _this10;
        _classCallCheck(this, c);
        _this10 = _callSuper(this, c, arguments), Object.defineProperty(_assertThisInitialized(_this10), "_dataGrouped", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1
        }), Object.defineProperty(_assertThisInitialized(_this10), "_seriesDataGrouped", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1
        }), Object.defineProperty(_assertThisInitialized(_this10), "_groupingCalculated", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1
        }), Object.defineProperty(_assertThisInitialized(_this10), "_intervalDuration", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 1
        }), Object.defineProperty(_assertThisInitialized(_this10), "_baseDuration", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 1
        }), Object.defineProperty(_assertThisInitialized(_this10), "_intervalMax", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: {}
        }), Object.defineProperty(_assertThisInitialized(_this10), "_intervalMin", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: {}
        });
        return _this10;
      }
      _inherits(c, _a$m);
      return _createClass(c, [{
        key: "_afterNew",
        value: function _afterNew() {
          var _this11 = this;
          this._settings.themeTags = g.mergeTags(this._settings.themeTags, ["axis"]), _superPropGet(c, "_afterNew", this, 3)([]), this._setBaseInterval(this.get("baseInterval")), this.on("baseInterval", function () {
            _this11._setBaseInterval(_this11.get("baseInterval"));
          });
        }
      }, {
        key: "_setBaseInterval",
        value: function _setBaseInterval(t) {
          this.setPrivateRaw("baseInterval", t), this._baseDuration = u.getIntervalDuration(t);
        }
      }, {
        key: "_fixZoomFactor",
        value: function _fixZoomFactor() {
          var t = this.get("maxZoomFactor");
          null != t && t != 1 / 0 ? this.setPrivateRaw("maxZoomFactor", t) : this.setPrivateRaw("maxZoomFactor", Math.round((this.getPrivate("max", 0) - this.getPrivate("min", 0)) / this.baseMainDuration()));
        }
      }, {
        key: "_groupData",
        value: function _groupData() {
          var _this12 = this;
          var t = this.getPrivate("min"),
            e = this.getPrivate("max");
          if (n.isNumber(t) && n.isNumber(e)) {
            this._fixZoomFactor();
            var _t0 = this.getPrivate("groupInterval");
            if (_t0 ? this._setBaseInterval(_t0) : this._setBaseInterval(this.get("baseInterval")), this.isDirty("groupInterval")) {
              var _t1 = this.get("groupInterval");
              _t1 && (this.setRaw("groupIntervals", [_t1]), this._handleRangeChange());
            }
            if (this.isDirty("groupData") && !this._dataGrouped) {
              if (this.get("groupData")) l.each(this.series, function (t) {
                _this12._groupSeriesData(t);
              }), this._handleRangeChange();else {
                var _t10 = this.get("baseInterval"),
                  _e8 = _t10.timeUnit + _t10.count;
                l.each(this.series, function (t) {
                  t.setDataSet(_e8), t.resetGrouping();
                }), this._setBaseInterval(_t10), this.setPrivateRaw("groupInterval", void 0), this.markDirtyExtremes();
              }
              this._dataGrouped = !0;
            }
          }
        }
      }, {
        key: "_groupSeriesData",
        value: function _groupSeriesData(t) {
          var _this13 = this;
          if (this.get("groupData") && !t.get("groupDataDisabled")) {
            this._dataGrouped = !0, this._seriesDataGrouped = !0;
            var _e9 = [],
              _i9 = this.baseMainDuration(),
              _a12 = this.get("groupIntervals");
            l.each(_a12, function (t) {
              u.getIntervalDuration(t) > _i9 && _e9.push(t);
            }), t._dataSets = {};
            var _r9 = this.getPrivate("name") + this.get("renderer").getPrivate("letter");
            var _o8;
            var _g2 = t.get("baseAxis");
            t.get("xAxis") === _g2 ? _o8 = t._valueYFields : t.get("yAxis") === _g2 && (_o8 = t._valueXFields);
            var _c = t._mainDataItems,
              d = this.get("baseInterval"),
              m = d.timeUnit + d.count;
            t._dataSets[m] = _c;
            var p = t.get("groupDataCallback");
            var b = t.get("groupDataWithOriginals", !1);
            p && (b = !0), l.each(_e9, function (e) {
              var i,
                a = -1 / 0,
                g = e.timeUnit + e.count;
              t._dataSets[g] = [];
              var d = {},
                m = {},
                x = {},
                _ = {};
              l.each(_o8, function (e) {
                d[e] = 0, m[e] = 0, x[e] = t.get(e + "Grouped"), _[e] = e + "Working";
              });
              var v,
                f,
                P = u.getDuration(e.timeUnit);
              _c[0] && (v = _c[0].get(_r9)), l.each(_c, function (_c2) {
                var y,
                  D = _c2.get(_r9),
                  M = u.roun(D, e.timeUnit, e.count, _this13._root, v);
                a < M - P / 24 ? (y = h.copy(_c2.dataContext), i = new s.z(t, y, t._makeDataItem(y)), i.setRaw(_r9, M), t._dataSets[g].push(i), l.each(_o8, function (t) {
                  var e = _c2.get(t);
                  n.isNumber(e) ? (i.setRaw(t, e), i.setRaw(_[t], e), m[t] = 1, d[t] = e) : (d[t] = 0, m[t] = 0);
                }), b && i.set("originals", [_c2]), p && f && p(f, e), f = i) : (l.each(_o8, function (t) {
                  var e = x[t],
                    s = _c2.get(t);
                  if (null != s) {
                    var _a13 = i.get(t);
                    switch (e) {
                      case "close":
                        i.setRaw(t, s);
                        break;
                      case "sum":
                        i.setRaw(t, _a13 + s);
                        break;
                      case "open":
                        break;
                      case "low":
                        s < _a13 && i.setRaw(t, s);
                        break;
                      case "high":
                        s > _a13 && i.setRaw(t, s);
                        break;
                      case "average":
                        m[t]++, d[t] += s;
                        var _e0 = d[t] / m[t];
                        i.setRaw(t, _e0);
                        break;
                      case "extreme":
                        Math.abs(s) > Math.abs(_a13) && i.setRaw(t, s);
                    }
                    i.setRaw(_[t], i.get(t));
                    var _n6 = h.copy(_c2.dataContext);
                    _n6[_r9] = M, i.dataContext = _n6;
                  }
                }), b && i.get("originals").push(_c2)), a = M;
              }), p && f && p(f, e);
            }), t._dataSetId && t.setDataSet(t._dataSetId), this.markDirtySize(), this._seriesAdded && this._root.events.once("frameended", function () {
              _this13.markDirtySize();
            });
          }
        }
      }, {
        key: "_clearDirty",
        value: function _clearDirty() {
          _superPropGet(c, "_clearDirty", this, 3)([]), this._groupingCalculated = !1, this._dataGrouped = !1;
        }
      }, {
        key: "getGroupInterval",
        value: function getGroupInterval(t) {
          var e = this.get("baseInterval"),
            i = u.chooseInterval(0, t, this.get("groupCount", 1 / 0), this.get("groupIntervals"));
          return u.getIntervalDuration(i) < u.getIntervalDuration(e) && (i = Object.assign({}, e)), i;
        }
      }, {
        key: "getIntervalMax",
        value: function getIntervalMax(t) {
          return this._intervalMax[t.timeUnit + t.count];
        }
      }, {
        key: "getIntervalMin",
        value: function getIntervalMin(t) {
          return this._intervalMin[t.timeUnit + t.count];
        }
      }, {
        key: "_handleRangeChange",
        value: function _handleRangeChange() {
          var _this14 = this;
          _superPropGet(c, "_handleRangeChange", this, 3)([]);
          var t = Math.round(this.getPrivate("selectionMin")),
            e = Math.round(this.getPrivate("selectionMax"));
          if (n.isNumber(t) && n.isNumber(e)) {
            if (0 == this.get("endLocation") && (e += 1), this.get("groupData") && !this._groupingCalculated) {
              this._groupingCalculated = !0;
              var _i0 = this.get("groupInterval"),
                _s16 = this.getPrivate("groupInterval"),
                _a14 = e - t + (this.get("startLocation", 0) + (1 - this.get("endLocation", 1)) * this.baseDuration());
              if (_s16) {
                var _t11 = u.getIntervalDuration(_s16);
                _a14 = Math.ceil(_a14 / _t11) * _t11;
              }
              if (_i0 || (_i0 = this.getGroupInterval(_a14)), _i0 && (!_s16 || _s16.timeUnit !== _i0.timeUnit || _s16.count !== _i0.count || this._seriesDataGrouped)) {
                this._seriesDataGrouped = !1, this.setPrivateRaw("groupInterval", _i0), this._setBaseInterval(_i0);
                var _t12 = _i0.timeUnit + _i0.count;
                l.each(this.series, function (e) {
                  e.get("baseAxis") === _this14 && e.setDataSet(_t12);
                }), this.markDirtyExtremes(), this._root.events.once("frameended", function () {
                  _this14._root.events.once("frameended", function () {
                    var t = "groupintervalchanged";
                    _this14.events.isEnabled(t) && _this14.events.dispatch(t, {
                      type: t,
                      target: _this14
                    });
                  });
                });
              }
            }
            l.each(this.series, function (i) {
              if (i.get("baseAxis") === _this14) {
                var _s17 = _this14.getPrivate("name") + _this14.get("renderer").getPrivate("letter"),
                  _a15 = l.getFirstSortedIndex(i.dataItems, function (e) {
                    return o.qu(e.get(_s17), t);
                  }).index;
                _a15 > 0 && (_a15 -= 1), e += _this14.baseDuration() * (1 - _this14.get("endLocation", 1));
                var _n7 = l.getSortedIndex(i.dataItems, function (t) {
                    return o.qu(t.get(_s17), e);
                  }).index,
                  _r0 = _n7;
                _r0 > 1 && _r0--;
                var _h = i.dataItems[_a15],
                  _g3 = i.dataItems[_r0];
                var _u2, _c3;
                _h && (_c3 = _h.get(_s17)), _g3 && (_u2 = _g3.get(_s17));
                var d = !1;
                null != _u2 && null != _c3 && (_u2 < t || _c3 > e) && (d = !0), i.setPrivate("outOfSelection", d), i.setPrivate("startIndex", _a15), i.setPrivate("adjustedStartIndex", i._adjustStartIndex(_a15)), i.setPrivate("endIndex", _n7), _this14.root.events.once("frameended", function () {
                  i._markDirtyPrivateKey("adjustedStartIndex");
                });
              }
            });
          }
        }
      }, {
        key: "_adjustMinMax",
        value: function _adjustMinMax(t, e, i, s) {
          return {
            min: t,
            max: e,
            step: (e - t) / i
          };
        }
      }, {
        key: "intervalDuration",
        value: function intervalDuration() {
          return this._intervalDuration;
        }
      }, {
        key: "_saveMinMax",
        value: function _saveMinMax(t, e) {
          var i = this.getPrivate("groupInterval");
          i || (i = this.get("baseInterval"));
          var s = i.timeUnit + i.count;
          this._intervalMin[s] = t, this._intervalMax[s] = e;
        }
      }, {
        key: "_getM",
        value: function _getM(t) {
          return "month" == t || "year" == t || "day" == t ? 1.05 : 1.01;
        }
      }, {
        key: "_getMinorInterval",
        value: function _getMinorInterval(t) {
          var e;
          var i,
            s = t.count,
            a = t.timeUnit;
          return s > 1 && (10 == s || 15 == s ? s = 5 : 12 == s ? s = 2 : 6 == s ? s = 1 : 30 == s ? s = 10 : s < 10 && (s = 1), i = {
            timeUnit: a,
            count: s
          }), "week" == a && (i = "week" != (null === (e = this.getPrivate("baseInterval")) || void 0 === e ? void 0 : e.timeUnit) ? {
            timeUnit: "day",
            count: 1
          } : {
            timeUnit: "week",
            count: 1
          }), i;
        }
      }, {
        key: "_prepareAxisItems",
        value: function _prepareAxisItems() {
          var t = this.getPrivate("min"),
            e = this.getPrivate("max");
          if (n.isNumber(t) && n.isNumber(e)) {
            var _e1 = this._root,
              _i1 = Math.round(this.getPrivate("selectionMin")),
              _a16 = Math.round(this.getPrivate("selectionMax")),
              _r1 = this.get("renderer"),
              _o9 = this.getPrivate("baseInterval");
            var _h2 = _i1,
              _g4 = 0;
            var _c4 = this.get("gridIntervals");
            var d = u.chooseInterval(0, _a16 - _i1, _r1.gridCount(), _c4);
            u.getIntervalDuration(d) < this.baseDuration() && (d = Object.assign({}, _o9));
            var m = u.getIntervalDuration(d);
            this._intervalDuration = m;
            var p = u.getNextUnit(d.timeUnit),
              b = _e1.utc,
              x = _e1.timezone;
            _h2 = u.roun(_i1 - m, d.timeUnit, d.count, _e1, t);
            var _,
              v = _h2 - m;
            var f = this.get("dateFormats");
            this.setPrivateRaw("gridInterval", d);
            var P = _r1.get("minorLabelsEnabled"),
              y = _r1.get("minorGridEnabled", P);
            var D,
              M = 0;
            y && (D = this._getMinorInterval(d), M = u.getIntervalDuration(D));
            var w = 0;
            for (; _h2 < _a16 + m;) {
              var _t13 = void 0;
              this.dataItems.length < _g4 + 1 ? (_t13 = new s.z(this, void 0, {}), this._dataItems.push(_t13), this.processDataItem(_t13)) : _t13 = this.dataItems[_g4], this._createAssets(_t13, []), this._toggleDataItem(_t13, !0), _t13.setRaw("value", _h2), _t13.setRaw("labelEndValue", void 0);
              var _i10 = _h2 + u.getDuration(d.timeUnit, d.count * this._getM(d.timeUnit));
              _i10 = u.roun(_i10, d.timeUnit, 1, _e1), _t13.setRaw("endValue", _i10);
              var _a17 = new Date(_h2);
              _ = f[d.timeUnit], p && this.get("markUnitChange") && n.isNumber(v) && "year" != d.timeUnit && u.checkChange(_h2, v, p, b, x) && (_ = this.get("periodChangeDateFormats")[d.timeUnit]);
              var _r10 = _t13.get("label");
              _r10 && _r10.set("text", _e1.dateFormatter.format(_a17, _));
              var _o0 = d.count;
              if ("week" == d.timeUnit && _t13.setRaw("labelEndValue", _h2), y) {
                _o0 = 1;
                var _i11 = d.timeUnit;
                "week" == _i11 && (_i11 = "day");
                var _s18 = _h2 + u.getDuration(_i11, this._getM(_i11));
                _s18 = u.roun(_s18, _i11, 1, _e1), _t13.setRaw("labelEndValue", _s18);
              }
              if (this._prepareDataItem(_t13, _o0), v = _h2, _h2 = _i10, D) {
                var _t14 = D.timeUnit,
                  _i12 = D.count,
                  _a18 = this._getM(_t14);
                var _n8 = void 0,
                  _r11 = u.roun(v + M * _a18, _t14, _i12, _e1, v),
                  _o1 = this.get("minorDateFormats", this.get("dateFormats"));
                for (; _r11 < _h2 - .01 * M;) {
                  var _l7 = void 0;
                  this.minorDataItems.length < w + 1 ? (_l7 = new s.z(this, void 0, {}), this.minorDataItems.push(_l7), this.processDataItem(_l7)) : _l7 = this.minorDataItems[w], this._createAssets(_l7, ["minor"], !0), this._toggleDataItem(_l7, !0), _l7.setRaw("value", _r11);
                  var _h3 = _r11 + u.getDuration(_t14, _i12 * _a18);
                  _h3 = u.roun(_h3, _t14, 1, _e1), _l7.setRaw("endValue", _h3);
                  var _g5 = new Date(_r11);
                  _ = _o1[_t14];
                  var _c5 = _l7.get("label");
                  if (_c5 && (P ? _c5.set("text", _e1.dateFormatter.format(_g5, _)) : _c5.setPrivate("visible", !1)), this._prepareDataItem(_l7, 1), _r11 == _n8) break;
                  _n8 = _r11, _r11 = _h3, w++;
                }
              }
              if (_h2 == v) break;
              _g4++;
            }
            for (var _t15 = _g4; _t15 < this.dataItems.length; _t15++) this._toggleDataItem(this.dataItems[_t15], !1);
            for (var _t16 = w; _t16 < this.minorDataItems.length; _t16++) this._toggleDataItem(this.minorDataItems[_t16], !1);
            l.each(this.series, function (t) {
              t.inited && t._markDirtyAxes();
            });
          }
          this._updateGhost();
        }
      }, {
        key: "_updateFinals",
        value: function _updateFinals(t, e) {
          this.setPrivateRaw("selectionMinFinal", this.positionToValue(t)), this.setPrivateRaw("selectionMaxFinal", this.positionToValue(e));
        }
      }, {
        key: "_getDelta",
        value: function _getDelta() {
          this._deltaMinMax = this.baseDuration() / 2;
        }
      }, {
        key: "_fixMin",
        value: function _fixMin(t) {
          var e = this.getPrivate("baseInterval"),
            i = e.timeUnit;
          var s = u.roun(t, i, e.count, this._root),
            a = s + u.getDuration(i, e.count * this._getM(i));
          return a = u.roun(a, i, 1, this._root), s + (a - s) * this.get("startLocation", 0);
        }
      }, {
        key: "_fixMax",
        value: function _fixMax(t) {
          var e = this.getPrivate("baseInterval"),
            i = e.timeUnit;
          var s = u.roun(t, i, e.count, this._root),
            a = s + u.getDuration(i, e.count * this._getM(i));
          return a = u.roun(a, i, 1, this._root), s + (a - s) * this.get("endLocation", 1);
        }
      }, {
        key: "_updateDates",
        value: function _updateDates(t, e) {}
      }, {
        key: "_handleSeriesRemoved",
        value: function _handleSeriesRemoved() {
          this.setPrivate("baseInterval", this.get("baseInterval")), this.setPrivate("min", void 0), this.setPrivate("minFinal", void 0);
        }
      }, {
        key: "baseDuration",
        value: function baseDuration() {
          return this._baseDuration;
        }
      }, {
        key: "baseMainDuration",
        value: function baseMainDuration() {
          return u.getIntervalDuration(this.get("baseInterval"));
        }
      }, {
        key: "processSeriesDataItem",
        value: function processSeriesDataItem(t, e) {
          var _this15 = this;
          var i = this.getPrivate("baseInterval");
          t.open || (t.open = {}), t.close || (t.close = {}), l.each(e, function (e) {
            var s = t.get(e);
            if (n.isNumber(s)) {
              var _a19 = t.open[e],
                _n9 = t.close[e];
              if (s >= _a19 && s <= _n9) ;else {
                var _r12 = i.timeUnit,
                  _o10 = i.count;
                _a19 = u.roun(s, _r12, _o10, _this15._root), _n9 = _a19 + u.getDuration(_r12, _o10 * _this15._getM(_r12)), _n9 = u.roun(_n9, _r12, 1, _this15._root), t.open[e] = _a19, t.close[e] = _n9;
              }
              _this15._updateDates(_a19, t.component);
            }
          });
        }
      }, {
        key: "_handleSizeDirty",
        value: function _handleSizeDirty() {}
      }, {
        key: "getDataItemPositionX",
        value: function getDataItemPositionX(t, e, i, s) {
          var a, n;
          t.open && t.close ? (a = t.open[e], n = t.close[e]) : (a = t.get(e), n = a);
          var r = a + (n - a) * i;
          return r = this._baseValue + (r - this._baseValue) * s, this.valueToPosition(r);
        }
      }, {
        key: "getDataItemCoordinateX",
        value: function getDataItemCoordinateX(t, e, i, s) {
          return this._settings.renderer.positionToCoordinate(this.getDataItemPositionX(t, e, i, s));
        }
      }, {
        key: "getDataItemPositionY",
        value: function getDataItemPositionY(t, e, i, s) {
          var a, n;
          t.open && t.close ? (a = t.open[e], n = t.close[e]) : (a = t.get(e), n = a);
          var r = a + (n - a) * i;
          return r = this._baseValue + (r - this._baseValue) * s, this.valueToPosition(r);
        }
      }, {
        key: "getDataItemCoordinateY",
        value: function getDataItemCoordinateY(t, e, i, s) {
          return this._settings.renderer.positionToCoordinate(this.getDataItemPositionY(t, e, i, s));
        }
      }, {
        key: "roundAxisPosition",
        value: function roundAxisPosition(t, e) {
          var i = this.positionToValue(t);
          i -= (e - .5) * this.baseDuration();
          var s = this.getPrivate("baseInterval");
          if (!n.isNaN(i)) {
            var _t17 = this._root.locale.firstDayOfWeek,
              _a20 = s.timeUnit,
              _n0 = this._root.utc,
              _r13 = this._root.timezone,
              _o11 = s.count;
            i = u.roun(i, _a20, _o11, this._root, this.getPrivate("min", 0));
            var _l8 = u.getDateIntervalDuration(s, new Date(i), _t17, _n0, _r13);
            return _r13 && (i = u.roun(i + .05 * this.baseDuration(), _a20, _o11, this._root, this.getPrivate("min", 0)), _l8 = u.getDateIntervalDuration(s, new Date(i + _l8 * e), _t17, _n0, _r13)), this.valueToPosition(i + _l8 * e);
          }
          return NaN;
        }
      }, {
        key: "getTooltipText",
        value: function getTooltipText(t, e) {
          if (null != this.getPrivate("min")) {
            var _i13 = this.get("tooltipDateFormats")[this.getPrivate("baseInterval").timeUnit],
              _s19 = this.positionToValue(t);
            if (n.isNumber(_s19)) {
              var _t18 = new Date(_s19),
                _a21 = this.getPrivate("baseInterval"),
                _n1 = u.getDateIntervalDuration(_a21, _t18, this._root.locale.firstDayOfWeek, this._root.utc, this._root.timezone);
              return !1 !== e && (_t18 = new Date(_s19 + this.get("tooltipIntervalOffset", -this.get("tooltipLocation", .5)) * _n1)), this._root.dateFormatter.format(_t18, this.get("tooltipDateFormat", _i13));
            }
          }
          return "";
        }
      }, {
        key: "getSeriesItem",
        value: function getSeriesItem(t, e, i, s) {
          var a = this.getPrivate("name") + this.get("renderer").getPrivate("letter"),
            n = this.positionToValue(e);
          null == i && (i = .5), n -= (i - .5) * this.baseDuration();
          var r = l.getSortedIndex(t.dataItems, function (t) {
            var e = 0;
            return t.open && (e = t.open[a]), o.qu(e, n);
          });
          if (s || t.get("snapTooltip")) {
            var _e10 = t.dataItems[r.index - 1],
              _i14 = t.dataItems[r.index];
            if (_e10 && _i14 && _e10.open && _i14.close) {
              var _t19 = _e10.open[a],
                _s20 = _i14.close[a];
              if (Math.abs(n - _t19) > Math.abs(n - _s20)) return _i14;
            }
            if (_e10) return _e10;
            if (_i14) return _i14;
          } else {
            var _e11 = t.dataItems[r.index - 1];
            if (_e11 && _e11.open && _e11.close) {
              var _t20 = _e11.open[a],
                _i15 = _e11.close[a];
              if (n >= _t20 && n <= _i15) return _e11;
            }
          }
        }
      }, {
        key: "shouldGap",
        value: function shouldGap(t, e, i, s) {
          var a = t.get(s);
          return e.get(s) - a > this.baseDuration() * i;
        }
      }, {
        key: "zoomToDates",
        value: function zoomToDates(t, e, i) {
          this.zoomToValues(t.getTime(), e.getTime(), i);
        }
      }, {
        key: "zoomToValues",
        value: function zoomToValues(t, e, i) {
          var s = this.getPrivate("minFinal", 0),
            a = this.getPrivate("maxFinal", 0);
          if (null != this.getPrivate("min") && null != this.getPrivate("max")) if (this.get("groupData")) {
            var _s21 = this.getGroupInterval(e - t),
              _a22 = this.get("baseInterval");
            var _n10 = this.getIntervalMin(_a22),
              _r14 = this.getIntervalMax(_a22) - 1;
            _r14 = u.roun(_r14, _s21.timeUnit, _s21.count, this.root), _r14 += this._getM(_s21.timeUnit) * u.getIntervalDuration(_s21), _r14 = u.roun(_r14, _s21.timeUnit, _s21.count, this.root);
            var _o12 = u.roun(_n10, _s21.timeUnit, _s21.count, this.root),
              _l9 = u.roun(_r14, _s21.timeUnit, _s21.count, this.root),
              _h4 = (t - _o12) / (_l9 - _o12),
              _g6 = (e - _o12) / (_l9 - _o12);
            this.zoom(_h4, _g6, i);
          } else this.zoom((t - s) / (a - s), (e - s) / (a - s), i);
        }
      }, {
        key: "positionToDate",
        value: function positionToDate(t) {
          return new Date(this.positionToValue(t));
        }
      }, {
        key: "dateToPosition",
        value: function dateToPosition(t) {
          return this.valueToPosition(t.getTime());
        }
      }, {
        key: "getCellWidthPosition",
        value: function getCellWidthPosition() {
          var t = this.getPrivate("selectionMax", this.getPrivate("max")),
            e = this.getPrivate("selectionMin", this.getPrivate("min"));
          return n.isNumber(t) && n.isNumber(e) ? this._intervalDuration / (t - e) : .05;
        }
      }, {
        key: "nextPosition",
        value: function nextPosition(t) {
          null == t && (t = 1);
          var e = this.get("tooltipLocation", .5) * this.baseDuration();
          "Y" == this.get("renderer").getPrivate("letter") && (t *= -1);
          var i = this.positionToValue(this.getPrivate("tooltipPosition", 0));
          var s = this.getPrivate("baseInterval");
          var a = this._nextTime(i, t, s),
            n = this.getPrivate("selectionMin", 0),
            o = this.getPrivate("selectionMax", 0),
            l = u.roun(n, s.timeUnit, s.count, this._root),
            h = u.roun(o, s.timeUnit, s.count, this._root);
          return a += e, a = r.fitToRange(a, l + e, h - e), this.toGlobalPosition(this.valueToPosition(a));
        }
      }, {
        key: "_nextTime",
        value: function _nextTime(t, e, i) {
          return u.roun(t + e * this.baseDuration(), i.timeUnit, i.count, this._root);
        }
      }]);
    }(a.m);
    Object.defineProperty(c, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "DateAxis"
    }), Object.defineProperty(c, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: a.m.classNames.concat([c.className])
    });
  },
  8701: function _(t, e, i) {
    i.d(e, {
      J: function J() {
        return g;
      }
    });
    var s = i(5638),
      a = i(9361),
      n = i(5071),
      r = i(3540),
      o = i(1926),
      l = i(5040),
      h = i(751);
    var g = /*#__PURE__*/function (_s$S) {
      function g() {
        var _this16;
        _classCallCheck(this, g);
        _this16 = _callSuper(this, g, arguments), Object.defineProperty(_assertThisInitialized(_this16), "_frequency", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 1
        }), Object.defineProperty(_assertThisInitialized(_this16), "_m", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 0
        }), Object.defineProperty(_assertThisInitialized(_this16), "_dates", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: []
        }), Object.defineProperty(_assertThisInitialized(_this16), "_customDates", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        });
        return _this16;
      }
      _inherits(g, _s$S);
      return _createClass(g, [{
        key: "_afterNew",
        value: function _afterNew() {
          this.valueFields.push("date"), _superPropGet(g, "_afterNew", this, 3)([]);
        }
      }, {
        key: "_getDates",
        value: function _getDates() {
          return this._customDates ? this._customDates : this._dates;
        }
      }, {
        key: "_updateDates",
        value: function _updateDates(t, e) {
          if (!e.get("ignoreMinMax")) {
            var _e12 = this._getDates(),
              _i16 = n.getSortedIndex(_e12, function (e) {
                return r.qu(e, t);
              });
            _i16.found || n.insertIndex(_e12, _i16.index, t);
          }
        }
      }, {
        key: "_updateAllDates",
        value: function _updateAllDates() {
          var _this17 = this;
          if (!this._customDates) {
            var _t21 = this._dates;
            _t21.length = 0, n.each(this.series, function (t) {
              var e = "valueX";
              t.get("yAxis") == _this17 && (e = "valueY"), n.each(t.dataItems, function (i) {
                var s = i.get(e);
                l.isNumber(s) && i.open && _this17._updateDates(i.open[e], t);
              });
            });
            var _e13 = this.get("extraMax", 0),
              _i17 = this.get("extraMin", 0);
            var _s22 = _t21.length;
            var _a23 = this.getPrivate("baseInterval"),
              _r15 = _a23.count,
              _h5 = _a23.timeUnit;
            if (_e13 > 0) {
              var _i18 = _s22 * _e13;
              var _a24 = _t21[_s22 - 1];
              if (l.isNumber(_a24)) for (var _e14 = _s22 - 1; _e14 < _s22 + _i18; _e14++) _a24 += o.getDuration(_h5, _r15 * this._getM(_h5)), _a24 = o.roun(_a24, _h5, _r15, this._root), _t21.push(_a24);
            }
            if (_i17 > 0) {
              var _e15 = _s22 * _i17;
              var _a25 = _t21[0];
              if (l.isNumber(_a25)) for (var _i19 = 0; _i19 < _e15; _i19++) _a25 -= o.getDuration(_h5, _r15), _a25 = o.roun(_a25, _h5, _r15, this._root), _t21.unshift(_a25);
            }
          }
        }
      }, {
        key: "valueToPosition",
        value: function valueToPosition(t) {
          var e = this._getDates(),
            i = this.get("startLocation", 0),
            s = this.get("endLocation", 1),
            a = e.length - i - (1 - s),
            o = n.getSortedIndex(e, function (e) {
              return r.qu(e, t);
            });
          var l = o.index;
          if (o.found) return (l - i) / a;
          {
            l > 0 && (l -= 1);
            var _s23 = e[l];
            var _n11 = e[l + 1];
            if (_n11) {
              var _e16 = _n11;
              Math.abs(_e16 - t) < Math.abs(_s23 - t) && (_s23 = _e16, l++);
            }
            return (l - i) / a + (t - _s23) / this.baseDuration() / a;
          }
        }
      }, {
        key: "valueToIndex",
        value: function valueToIndex(t) {
          var e = this._getDates(),
            i = n.getSortedIndex(e, function (e) {
              return r.qu(e, t);
            });
          var s = i.index;
          return i.found || s > 0 && (s -= 1), s;
        }
      }, {
        key: "positionToValue",
        value: function positionToValue(t) {
          var e = this.get("startLocation", 0),
            i = this.get("endLocation", 1),
            s = this._getDates();
          var a = Math.round(s.length - e - (1 - i)),
            n = t * a,
            r = Math.floor(n);
          return r < 0 && (r = 0), r > a - 1 && (r = a - 1), s[r] + (n - r + e) * this.baseDuration();
        }
      }, {
        key: "_fixZoomFactor",
        value: function _fixZoomFactor() {
          this.setPrivateRaw("maxZoomFactor", this._getDates().length - this.get("startLocation", 0) - (1 - this.get("endLocation", 1)));
        }
      }, {
        key: "zoomToDates",
        value: function zoomToDates(t, e, i) {
          var s = this._getDates(),
            a = s.length;
          var o = n.getSortedIndex(s, function (e) {
              return r.qu(e, t.getTime());
            }),
            l = s[Math.min(o.index, a - 1)];
          o = n.getSortedIndex(s, function (t) {
            return r.qu(t, e.getTime());
          });
          var h = s[o.index];
          o.index >= a && (h = s[a - 1] + this.baseDuration()), this.zoomToValues(l, h, i);
        }
      }, {
        key: "zoomToValues",
        value: function zoomToValues(t, e, i) {
          var s = this.getPrivate("min", 0),
            a = this.getPrivate("max", 0);
          t = h.fitToRange(t, s, a), e = h.fitToRange(e, s, a), this.zoom(this.valueToPosition(t), this.valueToPosition(e), i);
        }
      }, {
        key: "_prepareAxisItems",
        value: function _prepareAxisItems() {
          var _this18 = this;
          var t = this.getPrivate("selectionMin", 0),
            e = this.getPrivate("selectionMax", 0);
          if (l.isNumber(t) && l.isNumber(e)) {
            this._seriesValuesDirty && (this._seriesValuesDirty = !1, this._updateAllDates());
            var _i20 = this._root,
              _s24 = _i20.utc,
              _r16 = _i20.timezone,
              _h6 = this._getDates(),
              _g7 = this.get("renderer"),
              u = _h6.length,
              c = this.baseDuration();
            var d = this.valueToIndex(t);
            d > 0 && d--;
            var m = this.valueToIndex(e);
            m < u - 1 && m++;
            var p = _g7.axisLength() / Math.max(_g7.get("minGridDistance"), 1 / Number.MAX_SAFE_INTEGER),
              b = Math.min(u, Math.ceil((m - d) / p));
            b = Math.max(1, b), d = Math.floor(d / b) * b, this._frequency = b, n.each(this.dataItems, function (t) {
              _this18._toggleDataItem(t, !1);
            }), n.each(this.minorDataItems, function (t) {
              _this18._toggleDataItem(t, !1);
            });
            var x = e - t - ((e - t) / c - (m - d)) * c,
              _ = o.chooseInterval(0, x, p, this.get("gridIntervals"));
            var v = this.getPrivate("baseInterval");
            var f = o.getIntervalDuration(_);
            f < c && (_ = Object.assign({}, v), f = o.getIntervalDuration(_)), this._intervalDuration = f;
            var P = _.timeUnit,
              y = this.get("dateFormats");
            var D = Date.now();
            _h6[0] && (D = _h6[0]);
            var M = o.roun(this.getPrivate("selectionMin", 0), P, _.count, _i20, D);
            var w = _g7.get("minorLabelsEnabled"),
              I = _g7.get("minorGridEnabled", w);
            var T,
              N,
              A = 0;
            I && (T = this._getMinorInterval(_), A = o.getIntervalDuration(T));
            var C = this._getIndexes(M, this.getPrivate("selectionMax", M) + f, _, this.getPrivate("min", M));
            if (C.length > 0) {
              var _t22 = 0;
              this._m = 0;
              var _e17 = M - 10 * f;
              var _u3 = o.getNextUnit(P);
              if (T) {
                var _t23 = _h6[C[0]];
                this._addMinorGrid(_t23 - f, _t23, A, T);
              }
              var _c6 = _g7.axisLength() / _g7.gridCount() * .5;
              n.each(C, function (n) {
                var d;
                var m;
                _this18.dataItems.length < _t22 + 1 ? (m = new a.z(_this18, void 0, {}), _this18._dataItems.push(m), _this18.processDataItem(m)) : m = _this18.dataItems[_t22];
                var p = _h6[n],
                  b = new Date(p),
                  x = p;
                _t22 < C.length - 1 ? x = _h6[C[_t22 + 1]] : x += f, m.setRaw("value", p), m.setRaw("endValue", x), m.setRaw("index", _t22), m.setRaw("labelEndValue", void 0);
                var v = y[P];
                _u3 && _this18.get("markUnitChange") && l.isNumber(_e17) && "year" != P && o.checkChange(p, _e17, _u3, _s24, _r16) && (v = _this18.get("periodChangeDateFormats")[P]), _this18._createAssets(m, []);
                var D = m.get("label");
                D && D.set("text", _i20.dateFormatter.format(b, v)), _this18._toggleDataItem(m, !0);
                var M = _.count;
                if ("week" == P && m.setRaw("labelEndValue", p), I) {
                  var _t24 = _.timeUnit;
                  if ("week" == _t24 && (_t24 = "day"), M > 1 || "week" == _.timeUnit) {
                    var _e18 = o.roun(p, _t24, 1, _i20) + o.getDuration(_t24, _this18._getM(_t24)),
                      _s25 = _this18.valueToIndex(_e18);
                    if (_e18 = _h6[_s25], _e18 == p) {
                      var _t25 = _h6[_s25 + 1];
                      _t25 ? _e18 = _t25 : _e18 += A;
                    }
                    m.setRaw("labelEndValue", _e18);
                  }
                  M = 1;
                }
                if (_this18._prepareDataItem(m, M), D && N && "X" == _g7.getPrivate("letter")) {
                  var _t26 = N.get("label");
                  if (_t26 && D.x() - _t26.x() < _c6) {
                    var _t27 = _this18._pickWorse(N, m, _);
                    _t27 && (null === (d = _t27.get("label")) || void 0 === d || d.setPrivate("visible", !1));
                  }
                }
                T && _this18._addMinorGrid(p, x, A, T), _t22++, D && D.getPrivate("visible") && (N = m), _e17 = p;
              });
            }
            n.each(this.series, function (t) {
              t.inited && t._markDirtyAxes();
            });
          }
          this._updateGhost();
        }
      }, {
        key: "_pickWorse",
        value: function _pickWorse(t, e, i) {
          var s = i.timeUnit,
            a = t.get("value", 0),
            n = e.get("value", 0);
          return "hour" == s && new Date(a).getDate() != new Date(n).getDate() ? t : e;
        }
      }, {
        key: "_addMinorGrid",
        value: function _addMinorGrid(t, e, i, s) {
          var _this19 = this;
          var r = this.get("minorDateFormats", this.get("dateFormats")),
            l = s.timeUnit;
          var h = t + o.getDuration(l, this._getM(l));
          h = o.roun(h, l, 1, this._root);
          var _g8 = e - .5 * i,
            u = this._getIndexes(h, _g8, s, h);
          var c = this._getDates();
          n.each(u, function (t) {
            var e;
            _this19.minorDataItems.length < _this19._m + 1 ? (e = new a.z(_this19, void 0, {}), _this19.minorDataItems.push(e), _this19.processDataItem(e)) : e = _this19.minorDataItems[_this19._m], h = c[t], e.setRaw("value", h), e.setRaw("endValue", h + i), e.setRaw("index", t), _this19._createAssets(e, ["minor"], !0);
            var s = e.get("label");
            if (s) if (_this19.get("renderer").get("minorLabelsEnabled")) {
              var _t28 = new Date(h),
                _e19 = r[l];
              s.set("text", _this19._root.dateFormatter.format(_t28, _e19));
            } else s.setPrivate("visible", !1);
            _this19._toggleDataItem(e, !0), _this19._prepareDataItem(e, 1), _this19._m++;
          });
        }
      }, {
        key: "_getIndexes",
        value: function _getIndexes(t, e, i, s) {
          var a = [],
            r = i.timeUnit,
            l = i.count,
            h = this._getM(r),
            _g9 = this.getPrivate("baseInterval"),
            u = this._root,
            c = this._getDates();
          var d = l - 1,
            m = -1 / 0,
            p = o.getDuration(r, h),
            b = o.getDuration(r, l * h),
            x = t;
          for ("day" == r && (t = s); t <= e;) {
            t = o.roun(t, r, l, u);
            var _e20 = this.valueToIndex(t),
              _i21 = c[_e20];
            if ("day" == r && "day" == _g9.timeUnit) this._hasDate(t) && d++, d == l && (t >= x - 2 * b && n.move(a, _e20), d = 0), t += p, t = o.roun(t, r, 1, u);else {
              if (_i21 < t) for (var _s26 = _e20, _a26 = c.length; _s26 < _a26; _s26++) if (_i21 = c[_s26], _i21 >= t) {
                _e20 = _s26;
                break;
              }
              n.move(a, _e20), t += b, t = o.roun(t, r, l, u);
            }
            if (t == m && (t += b + p, t = o.roun(t, r, l, u)), t == m) break;
            m = t;
          }
          return a;
        }
      }, {
        key: "_hasDate",
        value: function _hasDate(t) {
          return n.getSortedIndex(this._getDates(), function (e) {
            return r.HO(e, t);
          }).found;
        }
      }, {
        key: "_nextTime",
        value: function _nextTime(t, e, i) {
          var s = h.fitToRange(this.valueToIndex(t) + e, 0, this._dates.length - 1);
          return this._dates[s];
        }
      }]);
    }(s.S);
    Object.defineProperty(g, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "GaplessDateAxis"
    }), Object.defineProperty(g, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: s.S.classNames.concat([g.className])
    });
  },
  7261: function _(t, e, i) {
    i.d(e, {
      m: function m() {
        return g;
      }
    });
    var s = i(9361),
      a = i(6515),
      n = i(7449),
      r = i(5040),
      o = i(5071),
      l = i(751),
      h = i(7652);
    var g = /*#__PURE__*/function (_a$R) {
      function g() {
        var _this20;
        _classCallCheck(this, g);
        _this20 = _callSuper(this, g, arguments), Object.defineProperty(_assertThisInitialized(_this20), "_dirtyExtremes", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1
        }), Object.defineProperty(_assertThisInitialized(_this20), "_dirtySelectionExtremes", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1
        }), Object.defineProperty(_assertThisInitialized(_this20), "_dseHandled", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1
        }), Object.defineProperty(_assertThisInitialized(_this20), "_deltaMinMax", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 1
        }), Object.defineProperty(_assertThisInitialized(_this20), "_minReal", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), Object.defineProperty(_assertThisInitialized(_this20), "_maxReal", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), Object.defineProperty(_assertThisInitialized(_this20), "_minRealLog", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), Object.defineProperty(_assertThisInitialized(_this20), "_baseValue", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 0
        }), Object.defineProperty(_assertThisInitialized(_this20), "_syncDp", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }), Object.defineProperty(_assertThisInitialized(_this20), "_minLogAdjusted", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 1
        });
        return _this20;
      }
      _inherits(g, _a$R);
      return _createClass(g, [{
        key: "markDirtyExtremes",
        value: function markDirtyExtremes() {
          this._dirtyExtremes = !0, this.markDirty();
        }
      }, {
        key: "markDirtySelectionExtremes",
        value: function markDirtySelectionExtremes() {
          this._dirtySelectionExtremes = !0, this.markDirty();
        }
      }, {
        key: "_afterNew",
        value: function _afterNew() {
          this._settings.themeTags = h.mergeTags(this._settings.themeTags, ["axis"]), this.setPrivateRaw("name", "value"), this.addTag("value"), _superPropGet(g, "_afterNew", this, 3)([]);
        }
      }, {
        key: "_prepareChildren",
        value: function _prepareChildren() {
          var _this21 = this;
          if (_superPropGet(g, "_prepareChildren", this, 3)([]), this.isDirty("syncWithAxis")) {
            this._prevSettings.syncWithAxis && this._syncDp && this._syncDp.dispose();
            var _t29 = this.get("syncWithAxis");
            _t29 && (this._syncDp = new n.FV([_t29.onPrivate("selectionMinFinal", function () {
              _this21._dirtySelectionExtremes = !0;
            }), _t29.onPrivate("selectionMaxFinal", function () {
              _this21._dirtySelectionExtremes = !0;
            })]));
          }
          var t = !1;
          if ((this.isDirty("min") || this.isDirty("max") || this.isDirty("maxPrecision") || this.isDirty("numberFormat")) && (t = !0, this.ghostLabel.set("text", "")), (this._sizeDirty || this._dirtyExtremes || this._valuesDirty || t || this.isPrivateDirty("width") || this.isPrivateDirty("height") || this.isDirty("extraMin") || this.isDirty("extraMax") || this.isDirty("logarithmic") || this.isDirty("treatZeroAs") || this.isDirty("baseValue") || this.isDirty("strictMinMax") || this.isDirty("strictMinMaxSelection")) && (this._getMinMax(), this._dirtyExtremes = !1), this._handleSizeDirty(), this._dirtySelectionExtremes && !this._isPanning && this.get("autoZoom", !0)) {
            var _t30 = this.chart;
            var _e21 = !1;
            if (_t30) {
              var _i22 = this.get("renderer").getPrivate("letter");
              "Y" == _i22 ? _t30.xAxes.each(function (t) {
                "ValueAxis" != t.className && (_e21 = !0);
              }) : "X" == _i22 && _t30.yAxes.each(function (t) {
                "ValueAxis" != t.className && (_e21 = !0);
              });
            }
            _e21 && this._getSelectionMinMax(), this._dirtySelectionExtremes = !1;
          }
          this._groupData(), (this._sizeDirty || this._valuesDirty || this.isDirty("start") || this.isDirty("end") || this.isPrivateDirty("min") || this.isPrivateDirty("selectionMax") || this.isPrivateDirty("selectionMin") || this.isPrivateDirty("max") || this.isPrivateDirty("step") || this.isPrivateDirty("width") || this.isPrivateDirty("height") || this.isDirty("logarithmic")) && (this._handleRangeChange(), this._prepareAxisItems(), this._updateAxisRanges()), this._baseValue = this.baseValue();
        }
      }, {
        key: "_handleSizeDirty",
        value: function _handleSizeDirty() {
          this._sizeDirty && !this._dseHandled && (this._dirtySelectionExtremes = !0, this._dseHandled = !0, this.getPrivate("selectionMinFinal") == this.getPrivate("selectionMin") && this.getPrivate("selectionMaxFinal") == this.getPrivate("selectionMax") || (this._dirtySelectionExtremes = !1));
        }
      }, {
        key: "_clearDirty",
        value: function _clearDirty() {
          _superPropGet(g, "_clearDirty", this, 3)([]), this._dseHandled = !1;
        }
      }, {
        key: "_groupData",
        value: function _groupData() {}
      }, {
        key: "_formatText",
        value: function _formatText(t) {
          var e = this.get("numberFormat"),
            i = this.getNumberFormatter();
          var s = "";
          return s = e ? i.format(t, e) : i.format(t, void 0, this.getPrivate("stepDecimalPlaces")), s;
        }
      }, {
        key: "_prepareAxisItems",
        value: function _prepareAxisItems() {
          var t = this.getPrivate("min"),
            e = this.getPrivate("max");
          if (r.isNumber(t) && r.isNumber(e)) {
            var _e22 = this.get("logarithmic"),
              _i23 = this.getPrivate("step"),
              _a27 = this.getPrivate("selectionMin"),
              _n12 = this.getPrivate("selectionMax") + _i23;
            var _h7 = _a27 - _i23,
              _g0 = 1,
              u = t;
            if (_e22) {
              if (_h7 = this._minLogAdjusted, _h7 < _a27) for (; _h7 < _a27;) _h7 += _i23;
              u = _h7, u <= 0 && (u = 1, _i23 < 1 && (u = r.isNumber(this._minRealLog) ? this._minRealLog : Math.pow(10, -50))), _g0 = Math.log(_n12 - _i23) * Math.LOG10E - Math.log(u) * Math.LOG10E, _g0 > 2 && (_h7 = Math.pow(10, Math.log(u) * Math.LOG10E - 50));
            }
            var c = this.get("renderer"),
              d = c.get("minorLabelsEnabled"),
              m = c.get("minorGridEnabled", d);
            var p = Math.pow(10, Math.floor(Math.log(Math.abs(_i23)) * Math.LOG10E));
            var b = Math.round(_i23 / p);
            var x = 2;
            l.round(b / 5, 10) % 1 == 0 && (x = 5), l.round(b / 10, 10) % 1 == 0 && (x = 10);
            var _ = _i23 / x,
              v = 0,
              f = 0,
              P = -1 / 0;
            for (; _h7 < _n12;) {
              var _t31 = void 0;
              this.dataItems.length < v + 1 ? (_t31 = new s.z(this, void 0, {}), this._dataItems.push(_t31), this.processDataItem(_t31)) : _t31 = this.dataItems[v], this._createAssets(_t31, []), this._toggleDataItem(_t31, !0), _t31.setRaw("value", _h7);
              var _a28 = _t31.get("label");
              _a28 && _a28.set("text", this._formatText(_h7)), this._prepareDataItem(_t31);
              var _n13 = _h7;
              if (_e22 && _g0 > 2 ? _n13 = Math.pow(10, Math.log(u) * Math.LOG10E + v - 50) : _n13 += _i23, m) {
                var _t32 = _h7 + _;
                for (_e22 && (_g0 > 2 && (_ = this._adjustMinMax(_h7, _n13, 10).step), _t32 = _h7 + _); _t32 < _n13 - 1e-11 * _i23;) {
                  var _e23 = void 0;
                  this.minorDataItems.length < f + 1 ? (_e23 = new s.z(this, void 0, {}), this.minorDataItems.push(_e23), this.processDataItem(_e23)) : _e23 = this.minorDataItems[f], this._createAssets(_e23, ["minor"], !0), this._toggleDataItem(_e23, !0), _e23.setRaw("value", _t32);
                  var _i24 = _e23.get("label");
                  _i24 && (d ? _i24.set("text", this._formatText(_t32)) : _i24.setPrivate("visible", !1)), this._prepareDataItem(_e23), _t32 += _, f++;
                }
              }
              if (_h7 = _n13, P == _h7) break;
              var _r17 = Math.pow(10, Math.floor(Math.log(Math.abs(_i23)) * Math.LOG10E));
              if (_r17 < 1 && !_e22) {
                var _t33 = Math.round(Math.abs(Math.log(Math.abs(_r17)) * Math.LOG10E)) + 2;
                _h7 = l.round(_h7, _t33);
              }
              v++, P = _h7;
            }
            for (var _t34 = v; _t34 < this.dataItems.length; _t34++) this._toggleDataItem(this.dataItems[_t34], !1);
            for (var _t35 = f; _t35 < this.minorDataItems.length; _t35++) this._toggleDataItem(this.minorDataItems[_t35], !1);
            o.each(this.series, function (t) {
              t.inited && t._markDirtyAxes();
            }), this._updateGhost();
          }
        }
      }, {
        key: "_prepareDataItem",
        value: function _prepareDataItem(t, e) {
          var i = this.get("renderer"),
            s = t.get("value"),
            a = t.get("endValue"),
            n = this.valueToPosition(s),
            o = n,
            l = this.valueToPosition(s + this.getPrivate("step"));
          r.isNumber(a) && (o = this.valueToPosition(a), l = o), t.get("isRange") && null == a && (l = n);
          var h = o,
            _g1 = t.get("labelEndValue");
          null != _g1 && (h = this.valueToPosition(_g1)), i.updateLabel(t.get("label"), n, h, e);
          var u = t.get("grid");
          if (i.updateGrid(u, n, o), u && (s == this.get("baseValue", 0) ? (u.addTag("base"), u._applyThemes()) : u.hasTag("base") && (u.removeTag("base"), u._applyThemes())), i.updateTick(t.get("tick"), n, h, e), i.updateFill(t.get("axisFill"), n, l), this._processBullet(t), i.updateBullet(t.get("bullet"), n, o), !t.get("isRange")) {
            var _e24 = this.get("fillRule");
            _e24 && _e24(t);
          }
        }
      }, {
        key: "_handleRangeChange",
        value: function _handleRangeChange() {
          var t = this.positionToValue(this.get("start", 0)),
            e = this.positionToValue(this.get("end", 1));
          var i = this.get("renderer").gridCount();
          var s = this._adjustMinMax(t, e, i, !0),
            a = h.decimalPlaces(s.step);
          this.setPrivateRaw("stepDecimalPlaces", a), t = l.round(t, a), e = l.round(e, a), s = this._adjustMinMax(t, e, i, !0);
          var n = s.step;
          t = s.min, e = s.max, this.getPrivate("selectionMin") === t && this.getPrivate("selectionMax") === e && this.getPrivate("step") === n || (this.setPrivateRaw("selectionMin", t), this.setPrivateRaw("selectionMax", e), this.setPrivateRaw("step", n));
        }
      }, {
        key: "positionToValue",
        value: function positionToValue(t) {
          var e = this.getPrivate("min"),
            i = this.getPrivate("max");
          return this.get("logarithmic") ? Math.pow(Math.E, (t * (Math.log(i) * Math.LOG10E - Math.log(e) * Math.LOG10E) + Math.log(e) * Math.LOG10E) / Math.LOG10E) : t * (i - e) + e;
        }
      }, {
        key: "valueToPosition",
        value: function valueToPosition(t) {
          var e = this.getPrivate("min"),
            i = this.getPrivate("max");
          if (this.get("logarithmic")) {
            if (t <= 0) {
              var _e25 = this.get("treatZeroAs");
              r.isNumber(_e25) && (t = _e25);
            }
            return (Math.log(t) * Math.LOG10E - Math.log(e) * Math.LOG10E) / (Math.log(i) * Math.LOG10E - Math.log(e) * Math.LOG10E);
          }
          return (t - e) / (i - e);
        }
      }, {
        key: "valueToFinalPosition",
        value: function valueToFinalPosition(t) {
          var e = this.getPrivate("minFinal"),
            i = this.getPrivate("maxFinal");
          if (this.get("logarithmic")) {
            if (t <= 0) {
              var _e26 = this.get("treatZeroAs");
              r.isNumber(_e26) && (t = _e26);
            }
            return (Math.log(t) * Math.LOG10E - Math.log(e) * Math.LOG10E) / (Math.log(i) * Math.LOG10E - Math.log(e) * Math.LOG10E);
          }
          return (t - e) / (i - e);
        }
      }, {
        key: "getX",
        value: function getX(t, e, i) {
          t = i + (t - i) * e;
          var s = this.valueToPosition(t);
          return this._settings.renderer.positionToCoordinate(s);
        }
      }, {
        key: "getY",
        value: function getY(t, e, i) {
          t = i + (t - i) * e;
          var s = this.valueToPosition(t);
          return this._settings.renderer.positionToCoordinate(s);
        }
      }, {
        key: "getDataItemCoordinateX",
        value: function getDataItemCoordinateX(t, e, i, s) {
          return this._settings.renderer.positionToCoordinate(this.getDataItemPositionX(t, e, i, s));
        }
      }, {
        key: "getDataItemPositionX",
        value: function getDataItemPositionX(t, e, i, s) {
          var a = t.get(e);
          return a = t.get("stackToItemX") ? a * s + t.component.getStackedXValueWorking(t, e) : this._baseValue + (a - this._baseValue) * s, this.valueToPosition(a);
        }
      }, {
        key: "getDataItemCoordinateY",
        value: function getDataItemCoordinateY(t, e, i, s) {
          return this._settings.renderer.positionToCoordinate(this.getDataItemPositionY(t, e, i, s));
        }
      }, {
        key: "getDataItemPositionY",
        value: function getDataItemPositionY(t, e, i, s) {
          var a = t.get(e);
          return a = t.get("stackToItemY") ? a * s + t.component.getStackedYValueWorking(t, e) : this._baseValue + (a - this._baseValue) * s, this.valueToPosition(a);
        }
      }, {
        key: "basePosition",
        value: function basePosition() {
          return this.valueToPosition(this.baseValue());
        }
      }, {
        key: "baseValue",
        value: function baseValue() {
          var t = Math.min(this.getPrivate("minFinal", -1 / 0), this.getPrivate("selectionMin", -1 / 0)),
            e = Math.max(this.getPrivate("maxFinal", 1 / 0), this.getPrivate("selectionMax", 1 / 0));
          var i = this.get("baseValue", 0);
          return i < t && (i = t), i > e && (i = e), i;
        }
      }, {
        key: "cellEndValue",
        value: function cellEndValue(t) {
          return t;
        }
      }, {
        key: "fixSmallStep",
        value: function fixSmallStep(t) {
          return 1 + t === 1 ? (t *= 2, this.fixSmallStep(t)) : t;
        }
      }, {
        key: "_fixMin",
        value: function _fixMin(t) {
          return t;
        }
      }, {
        key: "_fixMax",
        value: function _fixMax(t) {
          return t;
        }
      }, {
        key: "_calculateTotals",
        value: function _calculateTotals() {
          var _this22 = this;
          if (this.get("calculateTotals")) {
            var _t36 = this.series[0];
            if (_t36) {
              var _e27 = _t36.startIndex();
              if (_t36.dataItems.length > 0) {
                _e27 > 0 && _e27--;
                var _i25,
                  _s27,
                  _a29 = _t36.endIndex();
                _a29 < _t36.dataItems.length && _a29++, _t36.get("yAxis") == this ? (_i25 = "valueY", _s27 = "vcy") : _t36.get("xAxis") == this && (_i25 = "valueX", _s27 = "vcx");
                var _n14 = _i25 + "Working";
                if (_i25) {
                  var _loop = function _loop(_t37) {
                    var e = 0,
                      a = 0;
                    o.each(_this22.series, function (i) {
                      if (!i.get("excludeFromTotal")) {
                        var _o13 = i.dataItems[_t37];
                        if (_o13) {
                          var _t38 = _o13.get(_n14) * i.get(_s27);
                          r.isNaN(_t38) || (e += _t38, a += Math.abs(_t38));
                        }
                      }
                    }), o.each(_this22.series, function (o) {
                      if (!o.get("excludeFromTotal")) {
                        var _l0 = o.dataItems[_t37];
                        if (_l0) {
                          var _t39 = _l0.get(_n14) * o.get(_s27);
                          r.isNaN(_t39) || (_l0.set(_i25 + "Total", a), _l0.set(_i25 + "Sum", e), _l0.set(_i25 + "TotalPercent", _t39 / a * 100));
                        }
                      }
                    });
                  };
                  for (var _t37 = _e27; _t37 < _a29; _t37++) {
                    _loop(_t37);
                  }
                }
              }
            }
          }
        }
      }, {
        key: "_getSelectionMinMax",
        value: function _getSelectionMinMax() {
          var _this23 = this;
          var t = this.getPrivate("minFinal"),
            e = this.getPrivate("maxFinal"),
            i = this.get("min"),
            s = this.get("max");
          var a = this.get("extraMin", 0),
            n = this.get("extraMax", 0);
          this.get("logarithmic") && (null == this.get("extraMin") && (a = .1), null == this.get("extraMax") && (n = .2));
          var h = this.get("renderer").gridCount(),
            _g10 = this.get("strictMinMaxSelection");
          var u = this.get("strictMinMax");
          if (r.isNumber(t) && r.isNumber(e)) {
            var _ref4;
            var c = e,
              d = t;
            if (o.each(this.series, function (t) {
              if (!t.get("ignoreMinMax")) {
                var _e28, _i26;
                var _s28 = t.getPrivate("outOfSelection");
                if (t.get("xAxis") === _this23) {
                  if (!_s28) {
                    var _s29 = t.getPrivate("minX"),
                      _a30 = t.getPrivate("maxX");
                    0 == t.startIndex() && t.endIndex() == t.dataItems.length || (_s29 = void 0, _a30 = void 0), _e28 = t.getPrivate("selectionMinX", _s29), _i26 = t.getPrivate("selectionMaxX", _a30);
                  }
                } else if (t.get("yAxis") === _this23 && !_s28) {
                  var _s30 = t.getPrivate("minY"),
                    _a31 = t.getPrivate("maxY");
                  0 == t.startIndex() && t.endIndex() == t.dataItems.length || (_s30 = void 0, _a31 = void 0), _e28 = t.getPrivate("selectionMinY", _s30), _i26 = t.getPrivate("selectionMaxY", _a31);
                }
                t.isHidden() || t.isShowing() || (r.isNumber(_e28) && (c = Math.min(c, _e28)), r.isNumber(_i26) && (d = Math.max(d, _i26)));
              }
            }), this.axisRanges.each(function (t) {
              if (t.get("affectsMinMax")) {
                var _e29 = t.get("value");
                null != _e29 && (c = Math.min(c, _e29), d = Math.max(d, _e29)), _e29 = t.get("endValue"), null != _e29 && (c = Math.min(c, _e29), d = Math.max(d, _e29));
              }
            }), c > d && (_ref4 = [d, c], c = _ref4[0], d = _ref4[1], _ref4), r.isNumber(i) ? c = u ? i : t : u && r.isNumber(this._minReal) && (c = this._minReal), r.isNumber(s) ? d = u ? s : e : u && r.isNumber(this._maxReal) && (d = this._maxReal), c === d) {
              var _e30 = c;
              if (c -= this._deltaMinMax, d += this._deltaMinMax, c < t) {
                var _i27 = _e30 - t;
                0 == _i27 && (_i27 = this._deltaMinMax), c = _e30 - _i27, d = _e30 + _i27, u = !0;
              }
              var _i28 = this._adjustMinMax(c, d, h, u);
              c = _i28.min, d = _i28.max;
            }
            var m = c,
              p = d,
              b = d - c;
            c -= b * a, d += b * n;
            var x = this._adjustMinMax(c, d, h);
            c = x.min, d = x.max, c = l.fitToRange(c, t, e), d = l.fitToRange(d, t, e), x = this._adjustMinMax(c, d, h, !0), u || (c = x.min, d = x.max);
            var _ = this.get("syncWithAxis");
            if (_ && (x = this._syncAxes(c, d, x.step, _.getPrivate("selectionMinFinal", _.getPrivate("minFinal", 0)), _.getPrivate("selectionMaxFinal", _.getPrivate("maxFinal", 1)), _.getPrivate("selectionStepFinal", _.getPrivate("step", 1))), x.min < t && (x.min = t), x.max > e && (x.max = e), c = x.min, d = x.max), u && (r.isNumber(i) && (c = Math.max(c, i)), r.isNumber(s) && (d = Math.min(d, s))), _g10 && (c = m - (p - m) * a, d = p + (p - m) * n), u) {
              c = r.isNumber(i) ? i : m, d = r.isNumber(s) ? s : p, d - c <= 1e-8 && (c -= this._deltaMinMax, d += this._deltaMinMax);
              var _t40 = d - c;
              c -= _t40 * a, d += _t40 * n;
            }
            this.get("logarithmic") && (c <= 0 && (c = m * (1 - Math.min(a, .99))), c < t && (c = t), d > e && (d = e));
            var v = Math.min(20, Math.ceil(Math.log(this.getPrivate("maxZoomFactor", 100) + 1) / Math.LN10) + 2),
              f = l.round(this.valueToFinalPosition(c), v),
              P = l.round(this.valueToFinalPosition(d), v);
            this.setPrivateRaw("selectionMinFinal", c), this.setPrivateRaw("selectionMaxFinal", d), this.setPrivateRaw("selectionStepFinal", x.step), this.zoom(f, P);
          }
        }
      }, {
        key: "_getMinMax",
        value: function _getMinMax() {
          var _this24 = this,
            _ref5;
          var t = this.get("min"),
            e = this.get("max"),
            i = 1 / 0,
            s = -1 / 0,
            a = this.get("extraMin", 0),
            n = this.get("extraMax", 0);
          this.get("logarithmic") && (null == this.get("extraMin") && (a = .1), null == this.get("extraMax") && (n = .2));
          var h = 1 / 0;
          if (o.each(this.series, function (t) {
            if (!t.get("ignoreMinMax")) {
              var _e31, _a32;
              if (t.get("xAxis") === _this24 ? (_e31 = t.getPrivate("minX"), _a32 = t.getPrivate("maxX")) : t.get("yAxis") === _this24 && (_e31 = t.getPrivate("minY"), _a32 = t.getPrivate("maxY")), r.isNumber(_e31) && r.isNumber(_a32)) {
                i = Math.min(i, _e31), s = Math.max(s, _a32);
                var _t41 = _a32 - _e31;
                _t41 <= 0 && (_t41 = Math.abs(_a32 / 100)), _t41 < h && (h = _t41);
              }
            }
          }), this.axisRanges.each(function (t) {
            if (t.get("affectsMinMax")) {
              var _e32 = t.get("value");
              null != _e32 && (i = Math.min(i, _e32), s = Math.max(s, _e32)), _e32 = t.get("endValue"), null != _e32 && (i = Math.min(i, _e32), s = Math.max(s, _e32));
            }
          }), this.get("logarithmic")) {
            var _t42 = this.get("treatZeroAs");
            r.isNumber(_t42) && i <= 0 && (i = _t42), i <= 0 && new Error("Logarithmic value axis can not have values <= 0.");
          }
          if (0 === i && 0 === s && (s = .9, i = -.9), r.isNumber(t) && (i = t), r.isNumber(e) && (s = e), i === 1 / 0 || s === -1 / 0) return this.setPrivate("minFinal", void 0), void this.setPrivate("maxFinal", void 0);
          i > s && (_ref5 = [s, i], i = _ref5[0], s = _ref5[1], _ref5);
          var _g11 = i,
            u = s;
          var c = this.adapters.fold("min", i),
            d = this.adapters.fold("max", s);
          this._minRealLog = i, r.isNumber(c) && (i = c), r.isNumber(d) && (s = d), i = this._fixMin(i), s = this._fixMax(s), s - i <= 1 / Math.pow(10, 15) && (s - i != 0 ? this._deltaMinMax = (s - i) / 2 : this._getDelta(s), i -= this._deltaMinMax, s += this._deltaMinMax), i -= (s - i) * a, s += (s - i) * n, this.get("logarithmic") && (i < 0 && _g11 >= 0 && (i = 0), s > 0 && u <= 0 && (s = 0)), this._minReal = i, this._maxReal = s;
          var m = this.get("strictMinMax"),
            p = this.get("strictMinMaxSelection", !1);
          p && (m = p);
          var b = m;
          r.isNumber(e) && (b = !0);
          var x = this.get("renderer").gridCount(),
            _ = this._adjustMinMax(i, s, x, b);
          if (i = _.min, s = _.max, _ = this._adjustMinMax(i, s, x, !0), i = _.min, s = _.max, m) {
            i = r.isNumber(t) ? t : this._minReal, s = r.isNumber(e) ? e : this._maxReal, s - i <= 1e-8 && (i -= this._deltaMinMax, s += this._deltaMinMax);
            var _o14 = s - i;
            i -= _o14 * a, s += _o14 * n;
          }
          c = this.adapters.fold("min", i), d = this.adapters.fold("max", s), r.isNumber(c) && (i = c), r.isNumber(d) && (s = d), h == 1 / 0 && (h = s - i);
          var v = Math.round(Math.abs(Math.log(Math.abs(s - i)) * Math.LOG10E)) + 5;
          i = l.round(i, v), s = l.round(s, v);
          var f = this.get("syncWithAxis");
          if (f && (_ = this._syncAxes(i, s, _.step, f.getPrivate("minFinal", f.getPrivate("min", 0)), f.getPrivate("maxFinal", f.getPrivate("max", 1)), f.getPrivate("step", 1)), i = _.min, s = _.max), this.setPrivateRaw("maxZoomFactor", Math.max(1, Math.ceil((s - i) / h * this.get("maxZoomFactor", 100)))), this._fixZoomFactor(), this.get("logarithmic") && (this._minLogAdjusted = i, i = this._minReal, s = this._maxReal, i <= 0 && (i = _g11 * (1 - Math.min(a, .99)))), r.isNumber(i) && r.isNumber(s) && (this.getPrivate("minFinal") !== i || this.getPrivate("maxFinal") !== s)) {
            this.setPrivate("minFinal", i), this.setPrivate("maxFinal", s), this._saveMinMax(i, s);
            var _t43 = this.get("interpolationDuration", 0),
              _e33 = this.get("interpolationEasing");
            this.animatePrivate({
              key: "min",
              to: i,
              duration: _t43,
              easing: _e33
            }), this.animatePrivate({
              key: "max",
              to: s,
              duration: _t43,
              easing: _e33
            });
          }
        }
      }, {
        key: "_fixZoomFactor",
        value: function _fixZoomFactor() {}
      }, {
        key: "_getDelta",
        value: function _getDelta(t) {
          var e = Math.log(Math.abs(t)) * Math.LOG10E,
            i = Math.pow(10, Math.floor(e));
          i /= 10, this._deltaMinMax = i;
        }
      }, {
        key: "_saveMinMax",
        value: function _saveMinMax(t, e) {}
      }, {
        key: "_adjustMinMax",
        value: function _adjustMinMax(t, e, i, s) {
          i <= 1 && (i = 1), i = Math.round(i);
          var a = t,
            n = e,
            o = e - t;
          0 === o && (o = Math.abs(e));
          var h = Math.log(Math.abs(o)) * Math.LOG10E,
            _g12 = Math.pow(10, Math.floor(h));
          _g12 /= 10;
          var u = _g12;
          s && (u = 0), s ? (t = Math.floor(t / _g12) * _g12, e = Math.ceil(e / _g12) * _g12) : (t = Math.ceil(t / _g12) * _g12 - u, e = Math.floor(e / _g12) * _g12 + u), t < 0 && a >= 0 && (t = 0), e > 0 && n <= 0 && (e = 0), h = Math.log(Math.abs(o)) * Math.LOG10E, _g12 = Math.pow(10, Math.floor(h)), _g12 /= 100;
          var c = Math.ceil(o / i / _g12) * _g12,
            d = Math.pow(10, Math.floor(Math.log(Math.abs(c)) * Math.LOG10E)),
            m = Math.ceil(c / d);
          m > 5 ? m = 10 : m <= 5 && m > 2 && (m = 5), c = Math.ceil(c / (d * m)) * d * m;
          var p = this.get("maxPrecision");
          if (r.isNumber(p)) {
            var _t44 = l.ceil(c, p);
            p < Number.MAX_VALUE && c !== _t44 && (c = _t44, 0 == c && (c = 1));
          }
          var b = 0;
          d < 1 && (b = Math.round(Math.abs(Math.log(Math.abs(d)) * Math.LOG10E)) + 1, c = l.round(c, b));
          var x,
            _ = Math.floor(t / c);
          return t = l.round(c * _, b), x = s ? Math.floor(e / c) : Math.ceil(e / c), x === _ && x++, (e = l.round(c * x, b)) < n && (e += c), t > a && (t -= c), c = this.fixSmallStep(c), {
            min: t,
            max: e,
            step: c
          };
        }
      }, {
        key: "getTooltipText",
        value: function getTooltipText(t, e) {
          var i = this.get("tooltipNumberFormat", this.get("numberFormat")),
            s = this.getNumberFormatter(),
            a = this.get("extraTooltipPrecision", 0),
            n = this.getPrivate("stepDecimalPlaces", 0) + a,
            r = l.round(this.positionToValue(t), n);
          return i ? s.format(r, i) : s.format(r, void 0, n);
        }
      }, {
        key: "getSeriesItem",
        value: function getSeriesItem(t, e) {
          var i,
            s,
            a = this.getPrivate("name") + this.get("renderer").getPrivate("letter"),
            n = this.positionToValue(e);
          if (o.each(t.dataItems, function (t, e) {
            var r = Math.abs(t.get(a) - n);
            (void 0 === i || r < s) && (i = e, s = r);
          }), null != i) return t.dataItems[i];
        }
      }, {
        key: "zoomToValues",
        value: function zoomToValues(t, e, i) {
          var s = this.getPrivate("minFinal", 0),
            a = this.getPrivate("maxFinal", 0);
          null != this.getPrivate("min") && null != this.getPrivate("max") && this.zoom((t - s) / (a - s), (e - s) / (a - s), i);
        }
      }, {
        key: "_syncAxes",
        value: function _syncAxes(t, e, i, s, a, n) {
          if (this.get("syncWithAxis")) {
            var _o15 = Math.round(a - s) / n,
              _l1 = Math.round((e - t) / i),
              _h8 = this.get("renderer").gridCount();
            if (r.isNumber(_o15) && r.isNumber(_l1)) {
              var _s31 = !1,
                _a33 = 0,
                _n15 = .01 * (e - t),
                _r18 = t,
                _l10 = e,
                _g13 = i;
              for (; 1 != _s31;) if (_s31 = this._checkSync(_r18, _l10, _g13, _o15), _a33++, _a33 > 500 && (_s31 = !0), _s31) t = _r18, e = _l10, i = _g13;else {
                _a33 / 3 == Math.round(_a33 / 3) ? (_r18 = t - _n15 * _a33, t >= 0 && _r18 < 0 && (_r18 = 0)) : (_l10 = e + _n15 * _a33, _l10 <= 0 && _l10 > 0 && (_l10 = 0));
                var _i29 = this._adjustMinMax(_r18, _l10, _h8, !0);
                _r18 = _i29.min, _l10 = _i29.max, _g13 = _i29.step;
              }
            }
          }
          return {
            min: t,
            max: e,
            step: i
          };
        }
      }, {
        key: "_checkSync",
        value: function _checkSync(t, e, i, s) {
          var a = (e - t) / i;
          for (var _t45 = 1; _t45 < s; _t45++) if (l.round(a / _t45, 1) == s || a * _t45 == s) return !0;
          return !1;
        }
      }, {
        key: "getCellWidthPosition",
        value: function getCellWidthPosition() {
          var t = this.getPrivate("selectionMax", this.getPrivate("max")),
            e = this.getPrivate("selectionMin", this.getPrivate("min"));
          return r.isNumber(t) && r.isNumber(e) ? this.getPrivate("step", 1) / (t - e) : .05;
        }
      }, {
        key: "nextPosition",
        value: function nextPosition(t) {
          null == t && (t = 1), "Y" == this.get("renderer").getPrivate("letter") && (t *= -1);
          var e = this.positionToValue(this.getPrivate("tooltipPosition", 0));
          return e += this.getPrivate("step", 1) * t, e = l.fitToRange(e, this.getPrivate("selectionMin", 0), this.getPrivate("selectionMax", 1)), this.toGlobalPosition(this.valueToPosition(e));
        }
      }]);
    }(a.R);
    Object.defineProperty(g, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "ValueAxis"
    }), Object.defineProperty(g, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: a.R.classNames.concat([g.className])
    });
  },
  2976: function _(t, e, i) {
    i.d(e, {
      j: function j() {
        return a;
      }
    });
    var s = i(3497);
    var a = /*#__PURE__*/function (_s$c) {
      function a() {
        _classCallCheck(this, a);
        return _callSuper(this, a, arguments);
      }
      _inherits(a, _s$c);
      return _createClass(a, [{
        key: "_beforeChanged",
        value: function _beforeChanged() {
          _superPropGet(a, "_beforeChanged", this, 3)([]), (this.isDirty("lowX0") || this.isDirty("lowY0") || this.isDirty("lowX1") || this.isDirty("lowY1") || this.isDirty("highX0") || this.isDirty("highX1") || this.isDirty("highY0") || this.isDirty("highY1")) && (this._clear = !0);
        }
      }, {
        key: "_draw",
        value: function _draw() {
          _superPropGet(a, "_draw", this, 3)([]);
          var t = this._display;
          t.moveTo(this.get("lowX0", 0), this.get("lowY0", 0)), t.lineTo(this.get("lowX1", 0), this.get("lowY1", 0)), t.moveTo(this.get("highX0", 0), this.get("highY0", 0)), t.lineTo(this.get("highX1", 0), this.get("highY1", 0));
        }
      }]);
    }(s.c);
    Object.defineProperty(a, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "Candlestick"
    }), Object.defineProperty(a, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: s.c.classNames.concat([a.className])
    });
  },
  2312: function _(t, e, i) {
    i.d(e, {
      $: function $() {
        return h;
      }
    });
    var s = i(62),
      a = i(2976),
      n = i(5769),
      r = i(7144),
      o = i(7652),
      l = i(5071);
    var h = /*#__PURE__*/function (_s$d) {
      function h() {
        var _this25;
        _classCallCheck(this, h);
        _this25 = _callSuper(this, h, arguments), Object.defineProperty(_assertThisInitialized(_this25), "columns", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: _this25.addDisposer(new r.o(n.YS["new"]({
            themeTags: ["autocolor"]
          }), function () {
            return a.j._new(_this25._root, {
              themeTags: o.mergeTags(_this25.columns.template.get("themeTags", []), ["candlestick", "series", "column"])
            }, [_this25.columns.template]);
          }))
        });
        return _this25;
      }
      _inherits(h, _s$d);
      return _createClass(h, [{
        key: "makeColumn",
        value: function makeColumn(t, e) {
          var i = this.mainContainer.children.push(e.make());
          return i._setDataItem(t), e.push(i), i;
        }
      }, {
        key: "_updateGraphics",
        value: function _updateGraphics(t, e) {
          _superPropGet(h, "_updateGraphics", this, 3)([t, e]);
          var i = this.getRaw("xAxis"),
            s = this.getRaw("yAxis"),
            a = this.getRaw("baseAxis");
          var n,
            r,
            o,
            l,
            _h9,
            g,
            u,
            c,
            d,
            m = this.get("vcy", 1),
            p = this.get("vcx", 1),
            b = this.get("locationX", t.get("locationX", .5)),
            x = this.get("locationY", t.get("locationY", .5)),
            _ = this.get("openLocationX", t.get("openLocationX", b)),
            v = this.get("openLocationY", t.get("openLocationY", x));
          if (s === a) {
            var _e34 = i.getDataItemPositionX(t, this._xOpenField, 1, p),
              _a34 = i.getDataItemPositionX(t, this._xField, 1, p);
            r = i.getDataItemPositionX(t, this._xLowField, 1, p), g = i.getDataItemPositionX(t, this._xHighField, 1, p), _h9 = Math.max(_e34, _a34), n = Math.min(_e34, _a34);
            var _b = this._aLocationY0 + v - .5,
              _2 = this._aLocationY1 + x - .5;
            o = s.getDataItemPositionY(t, this._yField, _b + (_2 - _b) / 2, m), l = o, u = o, c = o, d = "horizontal";
          } else {
            var _e35 = s.getDataItemPositionY(t, this._yOpenField, 1, m),
              _a35 = s.getDataItemPositionY(t, this._yField, 1, m);
            l = s.getDataItemPositionY(t, this._yLowField, 1, m), c = s.getDataItemPositionY(t, this._yHighField, 1, m), u = Math.max(_e35, _a35), o = Math.min(_e35, _a35);
            var _x = this._aLocationX0 + _ - .5,
              _v = this._aLocationX1 + b - .5;
            n = i.getDataItemPositionX(t, this._xField, _x + (_v - _x) / 2, p), r = n, _h9 = n, g = n, d = "vertical";
          }
          this._updateCandleGraphics(t, n, r, o, l, _h9, g, u, c, d);
        }
      }, {
        key: "_updateCandleGraphics",
        value: function _updateCandleGraphics(t, e, i, s, a, n, r, o, _h0, g) {
          var u = t.get("graphics");
          if (u) {
            var c = this.getPoint(e, s),
              d = this.getPoint(i, a),
              m = this.getPoint(n, o),
              p = this.getPoint(r, _h0),
              b = u.x(),
              x = u.y();
            u.set("lowX0", c.x - b), u.set("lowY0", c.y - x), u.set("lowX1", d.x - b), u.set("lowY1", d.y - x), u.set("highX0", m.x - b), u.set("highY0", m.y - x), u.set("highX1", p.x - b), u.set("highY1", p.y - x), u.set("orientation", g);
            var _ = t.get("rangeGraphics");
            _ && l.each(_, function (t) {
              t.set("lowX0", c.x - b), t.set("lowY0", c.y - x), t.set("lowX1", d.x - b), t.set("lowY1", d.y - x), t.set("highX0", m.x - b), t.set("highY0", m.y - x), t.set("highX1", p.x - b), t.set("highY1", p.y - x), t.set("orientation", g);
            });
          }
        }
      }, {
        key: "_processAxisRange",
        value: function _processAxisRange(t) {
          var _this26 = this;
          _superPropGet(h, "_processAxisRange", this, 3)([t]), t.columns = new r.o(n.YS["new"]({}), function () {
            return a.j._new(_this26._root, {
              themeTags: o.mergeTags(t.columns.template.get("themeTags", []), ["candlestick", "series", "column"])
            }, [_this26.columns.template, t.columns.template]);
          });
        }
      }]);
    }(s.d);
    Object.defineProperty(h, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "CandlestickSeries"
    }), Object.defineProperty(h, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: s.d.classNames.concat([h.className])
    });
  },
  62: function _(t, e, i) {
    i.d(e, {
      d: function d() {
        return l;
      }
    });
    var s = i(757),
      a = i(5769),
      n = i(7144),
      r = i(3497),
      o = i(7652);
    var l = /*#__PURE__*/function (_s$d2) {
      function l() {
        var _this27;
        _classCallCheck(this, l);
        _this27 = _callSuper(this, l, arguments), Object.defineProperty(_assertThisInitialized(_this27), "columns", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: _this27.addDisposer(new n.o(a.YS["new"]({}), function () {
            return r.c._new(_this27._root, {
              position: "absolute",
              themeTags: o.mergeTags(_this27.columns.template.get("themeTags", []), ["series", "column"])
            }, [_this27.columns.template]);
          }))
        });
        return _this27;
      }
      _inherits(l, _s$d2);
      return _createClass(l, [{
        key: "makeColumn",
        value: function makeColumn(t, e) {
          var i = this.mainContainer.children.push(e.make());
          return i._setDataItem(t), e.push(i), i;
        }
      }, {
        key: "_processAxisRange",
        value: function _processAxisRange(t) {
          var _this28 = this;
          _superPropGet(l, "_processAxisRange", this, 3)([t]), t.columns = new n.o(a.YS["new"]({}), function () {
            return r.c._new(_this28._root, {
              position: "absolute",
              themeTags: o.mergeTags(t.columns.template.get("themeTags", []), ["series", "column"])
            }, [_this28.columns.template, t.columns.template]);
          });
        }
      }]);
    }(s.d);
    Object.defineProperty(l, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "ColumnSeries"
    }), Object.defineProperty(l, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: s.d.classNames.concat([l.className])
    });
  },
  3405: function _(t, e, i) {
    i.r(e), i.d(e, {
      Axis: function Axis() {
        return g.R;
      },
      AxisBullet: function AxisBullet() {
        return y._;
      },
      AxisLabel: function AxisLabel() {
        return D.k;
      },
      AxisLabelRadial: function AxisLabelRadial() {
        return M.p;
      },
      AxisRenderer: function AxisRenderer() {
        return T.Y;
      },
      AxisRendererX: function AxisRendererX() {
        return N.n;
      },
      AxisRendererY: function AxisRendererY() {
        return A.j;
      },
      AxisTick: function AxisTick() {
        return w.T;
      },
      BaseColumnSeries: function BaseColumnSeries() {
        return h.d;
      },
      Candlestick: function Candlestick() {
        return O.j;
      },
      CandlestickSeries: function CandlestickSeries() {
        return F.$;
      },
      CategoryAxis: function CategoryAxis() {
        return b;
      },
      CategoryDateAxis: function CategoryDateAxis() {
        return _;
      },
      ColumnSeries: function ColumnSeries() {
        return S.d;
      },
      DateAxis: function DateAxis() {
        return v.S;
      },
      DefaultTheme: function DefaultTheme() {
        return q.l;
      },
      DurationAxis: function DurationAxis() {
        return P;
      },
      GaplessDateAxis: function GaplessDateAxis() {
        return f.J;
      },
      Grid: function Grid() {
        return I.r;
      },
      LineSeries: function LineSeries() {
        return V.e;
      },
      OHLC: function OHLC() {
        return L;
      },
      OHLCSeries: function OHLCSeries() {
        return j;
      },
      SmoothedXLineSeries: function SmoothedXLineSeries() {
        return E;
      },
      SmoothedXYLineSeries: function SmoothedXYLineSeries() {
        return z;
      },
      SmoothedYLineSeries: function SmoothedYLineSeries() {
        return G;
      },
      StepLineSeries: function StepLineSeries() {
        return Z;
      },
      ValueAxis: function ValueAxis() {
        return p.m;
      },
      XYChart: function XYChart() {
        return s.z;
      },
      XYChartScrollbar: function XYChartScrollbar() {
        return o;
      },
      XYCursor: function XYCursor() {
        return l.L;
      },
      XYSeries: function XYSeries() {
        return C.o;
      }
    });
    var s = i(6901),
      a = i(6001),
      n = i(1479),
      r = i(7652);
    var o = /*#__PURE__*/function (_a$L) {
      function o() {
        var _this29;
        _classCallCheck(this, o);
        _this29 = _callSuper(this, o, arguments), Object.defineProperty(_assertThisInitialized(_this29), "chart", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: _this29.children.push(s.z["new"](_this29._root, {
            themeTags: ["chart"],
            interactive: !1,
            interactiveChildren: !1,
            panX: !1,
            panY: !1,
            wheelX: "none",
            wheelY: "none"
          }))
        }), Object.defineProperty(_assertThisInitialized(_this29), "overlay", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: _this29.children.push(n.T["new"](_this29._root, {
            themeTags: ["overlay"],
            interactive: !1
          }))
        });
        return _this29;
      }
      _inherits(o, _a$L);
      return _createClass(o, [{
        key: "_afterNew",
        value: function _afterNew() {
          this._addOrientationClass(), this._settings.themeTags = r.mergeTags(this._settings.themeTags, ["scrollbar", "xy", "chart", this._settings.orientation]);
          var t = this.children;
          t.moveValue(this.thumb), t.moveValue(this.startGrip), t.moveValue(this.endGrip), this.thumb.set("opacity", 0), this.thumb.states.create("hover", {
            opacity: .2
          });
          var e = this.chart.plotContainer;
          e.set("interactive", !1), e.remove("background"), e.children.removeValue(this.chart.zoomOutButton), _superPropGet(o, "_afterNew", this, 3)([]);
        }
      }, {
        key: "_updateThumb",
        value: function _updateThumb() {
          var _this30 = this;
          _superPropGet(o, "_updateThumb", this, 3)([]), this.overlay.set("draw", function (t) {
            var _ref6, _ref7;
            var e = _this30.startGrip,
              i = _this30.endGrip;
            var s = e.x(),
              a = e.y(),
              n = i.x(),
              r = i.y();
            var _o16 = _this30.height(),
              l = _this30.width();
            s > n && (_ref6 = [n, s], s = _ref6[0], n = _ref6[1], _ref6), a > r && (_ref7 = [r, a], a = _ref7[0], r = _ref7[1], _ref7), "horizontal" === _this30.get("orientation") ? (t.moveTo(0, 0), t.lineTo(s, 0), t.lineTo(s, _o16), t.lineTo(0, _o16), t.lineTo(0, 0), t.moveTo(n, 0), t.lineTo(l, 0), t.lineTo(l, _o16), t.lineTo(n, _o16), t.lineTo(n, 0)) : (t.moveTo(0, 0), t.lineTo(0, a), t.lineTo(l, a), t.lineTo(l, 0), t.lineTo(0, 0), t.moveTo(0, r), t.lineTo(0, _o16), t.lineTo(l, _o16), t.lineTo(l, r), t.lineTo(0, r));
          });
        }
      }]);
    }(a.L);
    Object.defineProperty(o, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "XYChartScrollbar"
    }), Object.defineProperty(o, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: a.L.classNames.concat([o.className])
    });
    var l = i(3355),
      h = i(757),
      g = i(6515),
      u = i(5071),
      c = i(5040),
      d = i(751),
      m = i(2132),
      p = i(7261);
    var b = /*#__PURE__*/function (_g$R) {
      function b() {
        var _this31;
        _classCallCheck(this, b);
        _this31 = _callSuper(this, b, arguments), Object.defineProperty(_assertThisInitialized(_this31), "_frequency", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 1
        }), Object.defineProperty(_assertThisInitialized(_this31), "_itemMap", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: {}
        });
        return _this31;
      }
      _inherits(b, _g$R);
      return _createClass(b, [{
        key: "_afterNew",
        value: function _afterNew() {
          this._settings.themeTags = r.mergeTags(this._settings.themeTags, ["axis"]), this.fields.push("category"), this.setPrivateRaw("name", "category"), this.addTag("category"), _superPropGet(b, "_afterNew", this, 3)([]);
        }
      }, {
        key: "_prepareChildren",
        value: function _prepareChildren() {
          var _this32 = this;
          _superPropGet(b, "_prepareChildren", this, 3)([]);
          var t = this.dataItems.length;
          var e = 0;
          this._valuesDirty && (this._itemMap = {}, u.each(this.dataItems, function (t) {
            t.setRaw("index", e), _this32._itemMap[t.get("category")] = t, e++;
          }), this.setPrivateRaw("maxZoomFactor", t)), this.setPrivateRaw("startIndex", Math.max(Math.round(this.get("start", 0) * t), 0)), this.setPrivateRaw("endIndex", Math.min(Math.round(this.get("end", 1) * t), t)), (this._sizeDirty || this._valuesDirty || this.isDirty("start") || this.isDirty("end") || this.isPrivateDirty("endIndex") || this.isPrivateDirty("startIndex") || this.isPrivateDirty("width") || this.isPrivateDirty("height")) && this.dataItems.length > 0 && (this._handleRangeChange(), this._prepareAxisItems(), this._updateAxisRanges());
        }
      }, {
        key: "_handleRangeChange",
        value: function _handleRangeChange() {
          var _this33 = this;
          u.each(this.series, function (t) {
            var e = _this33.dataItems[_this33.startIndex()].get("category"),
              i = _this33.dataItems[_this33.endIndex() - 1].get("category"),
              s = t.get("baseAxis"),
              a = t.get("xAxis"),
              n = t.get("yAxis");
            if (a instanceof b && n instanceof b) t._markDirtyAxes();else if (s === _this33) {
              var _r19,
                _o17,
                _l11 = n;
              if (a === s ? (t.get("categoryXField") && (_r19 = "categoryX"), t.get("openCategoryXField") && (_o17 = "openCategoryX")) : n === s && (t.get("categoryYField") && (_r19 = "categoryY"), t.get("openCategoryYField") && (_o17 = "openCategoryY"), _l11 = a), _l11 instanceof p.m && (_r19 || _o17)) {
                var _s32, _a36;
                for (var _i30 = 0, _a37 = t.dataItems.length; _i30 < _a37; _i30++) {
                  var _a38 = t.dataItems[_i30];
                  if (_r19 && _a38.get(_r19) === e) {
                    _s32 = _a38;
                    break;
                  }
                  if (_o17 && _a38.get(_o17) === e) {
                    _s32 = _a38;
                    break;
                  }
                }
                for (var _e36 = t.dataItems.length - 1; _e36 >= 0; _e36--) {
                  var _s33 = t.dataItems[_e36];
                  if (_r19 && _s33.get(_r19) === i) {
                    _a36 = _s33;
                    break;
                  }
                  if (_o17 && _s33.get(_o17) === i) {
                    _a36 = _s33;
                    break;
                  }
                }
                var _n16 = 0,
                  _l12 = t.dataItems.length;
                _s32 && (_n16 = t.dataItems.indexOf(_s32)), _a36 && (_l12 = t.dataItems.indexOf(_a36) + 1), t.setPrivate("startIndex", _n16), t.setPrivate("endIndex", _l12);
                var _h1 = !1;
                var _loop2 = function _loop2() {
                  var i = t.dataItems[_e37];
                  if (u.each(t.__valueXShowFields, function (t) {
                    null != i.get(t) && (_h1 = !0);
                  }), u.each(t.__valueYShowFields, function (t) {
                    null != i.get(t) && (_h1 = !0);
                  }), _h1) return 1; // break
                };
                for (var _e37 = _n16; _e37 < _l12; _e37++) {
                  if (_loop2()) break;
                }
                t.setPrivate("outOfSelection", !_h1);
              }
              t._markDirtyAxes();
            }
          });
        }
      }, {
        key: "_prepareAxisItems",
        value: function _prepareAxisItems() {
          var t;
          var e = this.get("renderer"),
            i = this.dataItems.length;
          var s = this.startIndex();
          s > 0 && s--;
          var a = this.endIndex();
          a < i && a++;
          var n = e.get("minorLabelsEnabled"),
            r = e.get("minorGridEnabled", n);
          var o = e.axisLength() / Math.max(e.get("minGridDistance"), 1),
            l = Math.max(1, Math.min(i, Math.ceil((a - s) / o)));
          s = Math.floor(s / l) * l, this._frequency = l;
          for (var _t46 = 0; _t46 < i; _t46++) this._toggleDataItem(this.dataItems[_t46], !1);
          var h = this.dataItems[s].get("index", 0);
          for (var _t47 = s; _t47 < a; _t47 += l) {
            var _e38 = this.dataItems[_t47];
            this._createAssets(_e38, []), this._toggleDataItem(_e38, !0);
            var _i31 = l;
            r && (_i31 = 1), this._prepareDataItem(_e38, h, _i31), h++;
          }
          if (e.get("minorGridEnabled")) for (var _e39 = s; _e39 < a; _e39++) {
            var _i32 = this.dataItems[_e39];
            _e39 % l != 0 && (this._createAssets(_i32, ["minor"], !0), this._toggleDataItem(_i32, !0), this._prepareDataItem(_i32, 0, 1), n || null === (t = _i32.get("label")) || void 0 === t || t.setPrivate("visible", !1));
          }
          this._updateGhost();
        }
      }, {
        key: "_prepareDataItem",
        value: function _prepareDataItem(t, e, i) {
          var s = this.get("renderer"),
            a = t.get("categoryLocation", 0),
            n = t.get("endCategoryLocation", 1),
            r = t.get("index");
          c.isNumber(r) || (r = this.categoryToIndex(t.get("category")));
          var o,
            l = this.indexToPosition(r, a),
            h = t.get("endCategory");
          h ? (o = this.categoryToIndex(h), c.isNumber(o) || (o = r)) : o = r;
          var g,
            u,
            d = this.indexToPosition(o, n);
          g = t.get("isRange") ? o : r + this._frequency - 1, u = this.indexToPosition(g, n), s.updateLabel(t.get("label"), l, d, i), s.updateGrid(t.get("grid"), l, d), s.updateTick(t.get("tick"), l, d, i), s.updateFill(t.get("axisFill"), l, u), this._processBullet(t), s.updateBullet(t.get("bullet"), l, d);
          var m = this.get("fillRule");
          m && m(t, e);
        }
      }, {
        key: "startIndex",
        value: function startIndex() {
          var t = this.dataItems.length;
          return Math.min(Math.max(this.getPrivate("startIndex", 0), 0), t - 1);
        }
      }, {
        key: "endIndex",
        value: function endIndex() {
          var t = this.dataItems.length;
          return Math.max(1, Math.min(this.getPrivate("endIndex", t), t));
        }
      }, {
        key: "baseValue",
        value: function baseValue() {}
      }, {
        key: "basePosition",
        value: function basePosition() {
          return 0;
        }
      }, {
        key: "getX",
        value: function getX(t) {
          var e = this._itemMap[t];
          return e ? this._settings.renderer.positionToCoordinate(this.indexToPosition(e.get("index", 0))) : NaN;
        }
      }, {
        key: "getY",
        value: function getY(t) {
          var e = this._itemMap[t];
          return e ? this._settings.renderer.positionToCoordinate(this.indexToPosition(e.get("index", 0))) : NaN;
        }
      }, {
        key: "getDataItemPositionX",
        value: function getDataItemPositionX(t, e, i, s) {
          var a = t.get(e),
            n = this._itemMap[a];
          return n ? this.indexToPosition(n.get("index", 0), i) : NaN;
        }
      }, {
        key: "getDataItemCoordinateX",
        value: function getDataItemCoordinateX(t, e, i, s) {
          return this._settings.renderer.positionToCoordinate(this.getDataItemPositionX(t, e, i, s));
        }
      }, {
        key: "getDataItemPositionY",
        value: function getDataItemPositionY(t, e, i, s) {
          var a = t.get(e),
            n = this._itemMap[a];
          return n ? this.indexToPosition(n.get("index", 0), i) : NaN;
        }
      }, {
        key: "getDataItemCoordinateY",
        value: function getDataItemCoordinateY(t, e, i, s) {
          return this._settings.renderer.positionToCoordinate(this.getDataItemPositionY(t, e, i, s));
        }
      }, {
        key: "indexToPosition",
        value: function indexToPosition(t, e) {
          c.isNumber(e) || (e = .5);
          var i = this.dataItems.length,
            s = this.get("startLocation", 0);
          i -= s, i -= 1 - this.get("endLocation", 1);
          var a = (t + e - s) / i,
            n = this.dataItems[t];
          return n && (a += n.get("deltaPosition", 0)), a;
        }
      }, {
        key: "categoryToIndex",
        value: function categoryToIndex(t) {
          var e = this._itemMap[t];
          return e ? e.get("index") : NaN;
        }
      }, {
        key: "dataItemToPosition",
        value: function dataItemToPosition(t) {
          return this.indexToPosition(t.get("index"));
        }
      }, {
        key: "roundAxisPosition",
        value: function roundAxisPosition(t, e) {
          return t += (.5 - e) / this.dataItems.length, this.indexToPosition(this.axisPositionToIndex(t), e);
        }
      }, {
        key: "axisPositionToIndex",
        value: function axisPositionToIndex(t) {
          var e = this.dataItems.length;
          return d.fitToRange(Math.floor(t * e), 0, e - 1);
        }
      }, {
        key: "getTooltipText",
        value: function getTooltipText(t, e) {
          var i = this.dataItems[this.axisPositionToIndex(t)];
          if (i) {
            var _t48 = i.get("label");
            if (_t48) return (0, m.q)(_t48, this.get("tooltipText", ""));
          }
        }
      }, {
        key: "_updateTooltipText",
        value: function _updateTooltipText(t, e) {
          t._setDataItem(this.dataItems[this.axisPositionToIndex(e)]), t.label.text.markDirtyText();
        }
      }, {
        key: "getSeriesItem",
        value: function getSeriesItem(t, e) {
          if (this.dataItems.length > 0) {
            var _i33 = this.getPrivate("name") + this.get("renderer").getPrivate("letter"),
              _s34 = this.axisPositionToIndex(e),
              _a39 = t.dataItems[_s34],
              _n17 = this.dataItems[_s34],
              _r20 = _n17.get("category");
            if (_a39 && _n17 && _a39.get(_i33) === _r20) return _a39;
            for (var _e40 = 0, _s35 = t.dataItems.length; _e40 < _s35; _e40++) {
              var _s36 = t.dataItems[_e40];
              if (_s36.get(_i33) === _r20) return _s36;
            }
          }
        }
      }, {
        key: "zoomToIndexes",
        value: function zoomToIndexes(t, e, i) {
          var s = this.dataItems.length;
          this.zoom(t / s, e / s, i);
        }
      }, {
        key: "zoomToCategories",
        value: function zoomToCategories(t, e, i) {
          this.zoomToIndexes(this.categoryToIndex(t), this.categoryToIndex(e) + 1, i);
        }
      }, {
        key: "getCellWidthPosition",
        value: function getCellWidthPosition() {
          return this._frequency / this.dataItems.length / (this.get("end", 1) - this.get("start", 0));
        }
      }, {
        key: "nextPosition",
        value: function nextPosition(t) {
          null == t && (t = 1), "Y" == this.get("renderer").getPrivate("letter") && (t *= -1);
          var e = this.getPrivate("tooltipPosition", 0),
            i = d.fitToRange(this.axisPositionToIndex(e) + t, 0, this.dataItems.length - 1);
          return this.toGlobalPosition(this.indexToPosition(i));
        }
      }]);
    }(g.R);
    Object.defineProperty(b, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "CategoryAxis"
    }), Object.defineProperty(b, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: g.R.classNames.concat([b.className])
    });
    var x = i(1926);
    var _ = /*#__PURE__*/function (_b2) {
      function _() {
        var _this34;
        _classCallCheck(this, _);
        _this34 = _callSuper(this, _, arguments), Object.defineProperty(_assertThisInitialized(_this34), "_frequency", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 1
        }), Object.defineProperty(_assertThisInitialized(_this34), "_itemMap", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: {}
        });
        return _this34;
      }
      _inherits(_, _b2);
      return _createClass(_, [{
        key: "_afterNew",
        value: function _afterNew() {
          this._settings.themeTags = r.mergeTags(this._settings.themeTags, ["axis"]), this.fields.push("category"), _superPropGet(_, "_afterNew", this, 3)([]);
        }
      }, {
        key: "_prepareAxisItems",
        value: function _prepareAxisItems() {
          var _this35 = this;
          this.setPrivateRaw("baseInterval", this.get("baseInterval"));
          var t = this.get("renderer"),
            e = this.dataItems.length;
          var i = this.startIndex();
          i > 0 && i--;
          var s = this.endIndex();
          s < e && s++;
          var a = t.axisLength() / Math.max(t.get("minGridDistance"), 1 / Number.MAX_SAFE_INTEGER),
            n = Math.min(e, Math.ceil((s - i) / a));
          i = Math.floor(i / n) * n, this._frequency = n;
          for (var _t49 = 0; _t49 < e; _t49++) this._toggleDataItem(this.dataItems[_t49], !1);
          var r = Number(this.dataItems[i].get("category")),
            o = Number(this.dataItems[s - 1].get("category")),
            l = o - r;
          s - i < a && (l = o - r - ((o - r) / this.baseDuration() - (s - i)) * this.baseDuration());
          var h = x.chooseInterval(0, l, a, this.get("gridIntervals"));
          var g = x.getNextUnit(h.timeUnit),
            d = this.getPrivate("baseInterval");
          x.getIntervalDuration(h) < this.baseDuration() && (h = Object.assign({}, d));
          var m = this.get("dateFormats");
          var p,
            b = -1 / 0,
            _3 = -1 / 0,
            v = -1 / 0,
            f = [],
            P = !1;
          for (var _t50 = i; _t50 < s; _t50++) {
            var _e41 = this.dataItems[_t50],
              _i34 = _e41.get("index"),
              _s37 = !1,
              _a40 = Number(_e41.get("category")),
              _r21 = new Date(_a40),
              _o18 = x.getUnitValue(_r21, h.timeUnit);
            p = m[h.timeUnit];
            var _l13 = !1;
            "year" != h.timeUnit && "week" != h.timeUnit && g && this.get("markUnitChange") && c.isNumber(b) && x.checkChange(_a40, b, g, this._root.utc) && (p = this.get("periodChangeDateFormats")[h.timeUnit], _i34 - .5 * n < _3 && f.pop(), f.push({
              format: p,
              dataItem: _e41
            }), P = !0, _l13 = !0, _3 = _i34, v = _o18);
            var _u4 = !1;
            "day" === h.timeUnit || "week" === h.timeUnit ? _i34 - _3 >= n && (_u4 = !0) : _o18 % h.count == 0 && _o18 != v && (_u4 = !0), !_l13 && _u4 && (_i34 - .7 * n < _3 && P && (_s37 = !0), _s37 || (f.push({
              format: p,
              dataItem: _e41
            }), _3 = _i34, v = _o18), P = !1), b = _a40;
          }
          if (f.length > 0) {
            var _t51 = f[0].dataItem.get("index", 0);
            u.each(f, function (e) {
              var i = e.dataItem,
                s = e.format;
              _this35._createAssets(i, []), _this35._toggleDataItem(i, !0);
              var a = Number(i.get("category")),
                r = new Date(a);
              var o = i.get("label");
              o && o.set("text", _this35._root.dateFormatter.format(r, s)), _t51++, _this35._prepareDataItem(i, _t51, n);
            });
          }
        }
      }, {
        key: "baseDuration",
        value: function baseDuration() {
          return x.getIntervalDuration(this.getPrivate("baseInterval"));
        }
      }, {
        key: "getTooltipText",
        value: function getTooltipText(t, e) {
          var i = this.dataItems[this.axisPositionToIndex(t)];
          if (i) {
            var _t52 = this.get("dateFormats")[this.getPrivate("baseInterval").timeUnit];
            return this._root.dateFormatter.format(new Date(i.get("category", 0)), this.get("tooltipDateFormat", _t52));
          }
        }
      }, {
        key: "_updateTooltipText",
        value: function _updateTooltipText(t, e) {
          t.label.set("text", this.getTooltipText(e));
        }
      }]);
    }(b);
    Object.defineProperty(_, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "CategoryDateAxis"
    }), Object.defineProperty(_, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: b.classNames.concat([_.className])
    });
    var v = i(5638),
      f = i(8701);
    var P = /*#__PURE__*/function (_p$m) {
      function P() {
        var _this36;
        _classCallCheck(this, P);
        _this36 = _callSuper(this, P, arguments), Object.defineProperty(_assertThisInitialized(_this36), "_dataGrouped", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1
        }), Object.defineProperty(_assertThisInitialized(_this36), "_groupingCalculated", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1
        }), Object.defineProperty(_assertThisInitialized(_this36), "_intervalDuration", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 1
        });
        return _this36;
      }
      _inherits(P, _p$m);
      return _createClass(P, [{
        key: "_afterNew",
        value: function _afterNew() {
          this._settings.themeTags = r.mergeTags(this._settings.themeTags, ["axis"]), _superPropGet(P, "_afterNew", this, 3)([]);
        }
      }, {
        key: "_adjustMinMax",
        value: function _adjustMinMax(t, e, i, s) {
          var a;
          var n = this.getDurationFormatter(),
            r = this.get("baseUnit");
          if (this.setRaw("maxPrecision", 0), "millisecond" == r || "second" == r || "minute" == r || "hour" == r) {
            i <= 1 && (i = 1), i = Math.round(i);
            var _s38 = e - t;
            0 === _s38 && (_s38 = Math.abs(e));
            var _n18 = _s38 / i,
              _o19 = [60, 30, 20, 15, 10, 2, 1],
              _l14 = 1;
            "hour" == r && (_o19 = [24, 12, 6, 4, 2, 1]);
            for (var _i35 = 0, _o20 = _o19; _i35 < _o20.length; _i35++) {
              var _t53 = _o20[_i35];
              if (_s38 / _t53 > i) {
                _l14 = _t53;
                break;
              }
            }
            var _h10 = Math.ceil((e - t) / _l14 / i),
              _g14 = Math.log(Math.abs(_h10)) * Math.LOG10E,
              _u5 = Math.pow(10, Math.floor(_g14)) / 10,
              _c7 = _h10 / _u5;
            _h10 = d.closest(_o19, _c7) * _u5, _n18 = _l14 * _h10, a = {
              min: t = Math.floor(t / _n18) * _n18,
              max: e = Math.ceil(e / _n18) * _n18,
              step: _n18
            };
          } else a = _superPropGet(P, "_adjustMinMax", this, 3)([t, e, i, s]);
          return this.setPrivateRaw("durationFormat", n.getFormat(a.step, a.max, r)), a;
        }
      }, {
        key: "_formatText",
        value: function _formatText(t) {
          return this.getDurationFormatter().format(t, this.getPrivate("durationFormat"), this.get("baseUnit"));
        }
      }, {
        key: "getTooltipText",
        value: function getTooltipText(t, e) {
          var i = this.getDurationFormatter(),
            s = this.get("extraTooltipPrecision", 0),
            a = this.getPrivate("stepDecimalPlaces", 0) + s,
            n = d.round(this.positionToValue(t), a);
          return i.format(n, this.getPrivate("durationFormat"), this.get("baseUnit"));
        }
      }]);
    }(p.m);
    Object.defineProperty(P, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "DurationAxis"
    }), Object.defineProperty(P, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: p.m.classNames.concat([P.className])
    });
    var y = i(2586),
      D = i(6293),
      M = i(9084),
      w = i(4714),
      I = i(8943),
      T = i(6275),
      N = i(6284),
      A = i(7909),
      C = i(4604),
      O = i(2976),
      F = i(2312);
    var L = /*#__PURE__*/function (_O$j) {
      function L() {
        _classCallCheck(this, L);
        return _callSuper(this, L, arguments);
      }
      _inherits(L, _O$j);
      return _createClass(L, [{
        key: "_draw",
        value: function _draw() {
          var t = this._display;
          t.moveTo(this.get("lowX1", 0), this.get("lowY1", 0)), t.lineTo(this.get("highX1", 0), this.get("highY1", 0));
          var e = this.width(),
            i = this.height();
          if ("vertical" == this.get("orientation")) {
            var _s39 = i,
              _a41 = 0;
            t.moveTo(0, _s39), t.lineTo(e / 2, _s39), t.moveTo(e / 2, _a41), t.lineTo(e, _a41);
          } else {
            var _s40 = 0,
              _a42 = e;
            t.moveTo(_s40, 0), t.lineTo(_s40, i / 2), t.moveTo(_a42, i / 2), t.lineTo(_a42, i);
          }
        }
      }]);
    }(O.j);
    Object.defineProperty(L, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "OHLC"
    }), Object.defineProperty(L, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: O.j.classNames.concat([L.className])
    });
    var R = i(5769),
      k = i(7144);
    var j = /*#__PURE__*/function (_F$$) {
      function j() {
        var _this37;
        _classCallCheck(this, j);
        _this37 = _callSuper(this, j, arguments), Object.defineProperty(_assertThisInitialized(_this37), "columns", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: _this37.addDisposer(new k.o(R.YS["new"]({
            themeTags: ["autocolor"]
          }), function () {
            return L._new(_this37._root, {
              themeTags: r.mergeTags(_this37.columns.template.get("themeTags", []), ["ohlc", "series", "column"])
            }, [_this37.columns.template]);
          }))
        });
        return _this37;
      }
      _inherits(j, _F$$);
      return _createClass(j, [{
        key: "makeColumn",
        value: function makeColumn(t, e) {
          var i = this.mainContainer.children.push(e.make());
          return i._setDataItem(t), e.push(i), i;
        }
      }, {
        key: "_processAxisRange",
        value: function _processAxisRange(t) {
          var _this38 = this;
          _superPropGet(j, "_processAxisRange", this, 3)([t]), t.columns = new k.o(R.YS["new"]({}), function () {
            return L._new(_this38._root, {
              themeTags: r.mergeTags(t.columns.template.get("themeTags", []), ["ohlc", "series", "column"])
            }, [_this38.columns.template, t.columns.template]);
          });
        }
      }]);
    }(F.$);
    Object.defineProperty(j, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "OHLCSeries"
    }), Object.defineProperty(j, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: F.$.classNames.concat([j.className])
    });
    var S = i(62),
      V = i(2338),
      Y = i(5892);
    var G = /*#__PURE__*/function (_V$e) {
      function G() {
        _classCallCheck(this, G);
        return _callSuper(this, G, arguments);
      }
      _inherits(G, _V$e);
      return _createClass(G, [{
        key: "_afterNew",
        value: function _afterNew() {
          this._setDefault("curveFactory", (0, Y.$)(this.get("tension", .5))), _superPropGet(G, "_afterNew", this, 3)([]);
        }
      }, {
        key: "_updateChildren",
        value: function _updateChildren() {
          this.isDirty("tension") && (this.set("curveFactory", (0, Y.$)(this.get("tension", .5))), this._valuesDirty = !0), _superPropGet(G, "_updateChildren", this, 3)([]);
        }
      }]);
    }(V.e);
    Object.defineProperty(G, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "SmoothedYLineSeries"
    }), Object.defineProperty(G, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: V.e.classNames.concat([G.className])
    });
    var X = i(8289);
    var E = /*#__PURE__*/function (_V$e2) {
      function E() {
        _classCallCheck(this, E);
        return _callSuper(this, E, arguments);
      }
      _inherits(E, _V$e2);
      return _createClass(E, [{
        key: "_afterNew",
        value: function _afterNew() {
          this._setDefault("curveFactory", (0, X.G)(this.get("tension", .5))), _superPropGet(E, "_afterNew", this, 3)([]);
        }
      }, {
        key: "_updateChildren",
        value: function _updateChildren() {
          this.isDirty("tension") && (this.set("curveFactory", (0, X.G)(this.get("tension", .5))), this._valuesDirty = !0), _superPropGet(E, "_updateChildren", this, 3)([]);
        }
      }]);
    }(V.e);
    Object.defineProperty(E, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "SmoothedXLineSeries"
    }), Object.defineProperty(E, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: V.e.classNames.concat([E.className])
    });
    var U = i(2818);
    var z = /*#__PURE__*/function (_V$e3) {
      function z() {
        _classCallCheck(this, z);
        return _callSuper(this, z, arguments);
      }
      _inherits(z, _V$e3);
      return _createClass(z, [{
        key: "_afterNew",
        value: function _afterNew() {
          this._setDefault("curveFactory", U.ZP.tension(this.get("tension", .5))), _superPropGet(z, "_afterNew", this, 3)([]);
        }
      }, {
        key: "_updateChildren",
        value: function _updateChildren() {
          this.isDirty("tension") && (this.set("curveFactory", U.ZP.tension(this.get("tension", .5))), this._valuesDirty = !0), _superPropGet(z, "_updateChildren", this, 3)([]);
        }
      }]);
    }(V.e);
    Object.defineProperty(z, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "SmoothedXYLineSeries"
    }), Object.defineProperty(z, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: V.e.classNames.concat([z.className])
    });
    var H = i(6245);
    function B(t, e) {
      this._context = t, this._t = e;
    }
    function W(t) {
      return new B(t, 1);
    }
    B.prototype = {
      areaStart: function areaStart() {
        this._line = 0;
      },
      areaEnd: function areaEnd() {
        this._line = NaN;
      },
      lineStart: function lineStart() {
        this._x = this._y = NaN, this._point = 0;
      },
      lineEnd: function lineEnd() {
        0 < this._t && this._t < 1 && 2 === this._point && this._context.lineTo(this._x, this._y), (this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
      },
      point: function point(t, e) {
        switch (t = +t, e = +e, this._point) {
          case 0:
            this._point = 1, this._line ? this._context.lineTo(t, e) : this._context.moveTo(t, e);
            break;
          case 1:
            this._point = 2;
          default:
            if (this._t <= 0) this._context.lineTo(this._x, e), this._context.lineTo(t, e);else {
              var i = this._x * (1 - this._t) + t * this._t;
              this._context.lineTo(i, this._y), this._context.lineTo(i, e);
            }
        }
        this._x = t, this._y = e;
      }
    };
    var Z = /*#__PURE__*/function (_V$e4) {
      function Z() {
        _classCallCheck(this, Z);
        return _callSuper(this, Z, arguments);
      }
      _inherits(Z, _V$e4);
      return _createClass(Z, [{
        key: "_afterNew",
        value: function _afterNew() {
          this._setDefault("curveFactory", W), _superPropGet(Z, "_afterNew", this, 3)([]);
        }
      }, {
        key: "_getPoints",
        value: function _getPoints(t, e) {
          var i = e.points,
            s = this.get("stepWidth", H.AQ).value / 2,
            a = t.get("locationX", e.locationX),
            n = t.get("locationY", e.locationY),
            r = a,
            o = n;
          e.baseAxis === e.xAxis ? (a -= s, r += s) : e.baseAxis === e.yAxis && (n -= s, o += s);
          var l = e.xAxis.getDataItemPositionX(t, e.xField, a, e.vcx),
            h = e.yAxis.getDataItemPositionY(t, e.yField, n, e.vcy),
            g = e.xAxis.getDataItemPositionX(t, e.xField, r, e.vcx),
            u = e.yAxis.getDataItemPositionY(t, e.yField, o, e.vcy);
          if (this._shouldInclude(l)) {
            var _c8 = this.getPoint(l, h),
              _d = [_c8.x, _c8.y],
              _m = this.getPoint(g, u),
              _p = [_m.x, _m.y];
            if (e.fillVisible) {
              var _i36 = l,
                _c9 = h,
                _m2 = g,
                _b3 = u;
              if (e.baseAxis === e.xAxis ? (_c9 = e.basePosY, _b3 = e.basePosY) : e.baseAxis === e.yAxis && (_i36 = e.basePosX, _m2 = e.basePosX), e.getOpen) {
                var _l15 = t.get(e.xOpenField),
                  _h11 = t.get(e.yOpenField);
                if (null != _l15 && null != _h11) if (a = t.get("openLocationX", e.openLocationX), n = t.get("openLocationY", e.openLocationY), r = a, o = n, e.baseAxis === e.xAxis ? (a -= s, r += s) : e.baseAxis === e.yAxis && (n -= s, o += s), e.stacked) {
                  var _s41 = t.get("stackToItemX"),
                    _l16 = t.get("stackToItemY");
                  _s41 ? (_i36 = e.xAxis.getDataItemPositionX(_s41, e.xField, a, _s41.component.get("vcx")), _m2 = e.xAxis.getDataItemPositionX(_s41, e.xField, r, _s41.component.get("vcx"))) : e.yAxis === e.baseAxis ? (_i36 = e.basePosX, _m2 = e.basePosX) : e.baseAxis === e.yAxis && (_i36 = e.xAxis.getDataItemPositionX(t, e.xOpenField, a, e.vcx), _m2 = e.xAxis.getDataItemPositionX(t, e.xOpenField, r, e.vcx)), _l16 ? (_c9 = e.yAxis.getDataItemPositionY(_l16, e.yField, n, _l16.component.get("vcy")), _b3 = e.yAxis.getDataItemPositionY(_l16, e.yField, o, _l16.component.get("vcy"))) : e.xAxis === e.baseAxis ? (_c9 = e.basePosY, _b3 = e.basePosY) : e.baseAxis === e.yAxis && (_c9 = e.yAxis.getDataItemPositionY(t, e.yOpenField, n, e.vcy), _b3 = e.yAxis.getDataItemPositionY(t, e.yOpenField, o, e.vcy));
                } else _i36 = e.xAxis.getDataItemPositionX(t, e.xOpenField, a, e.vcx), _c9 = e.yAxis.getDataItemPositionY(t, e.yOpenField, n, e.vcy), _m2 = e.xAxis.getDataItemPositionX(t, e.xOpenField, r, e.vcx), _b3 = e.yAxis.getDataItemPositionY(t, e.yOpenField, o, e.vcy);
              }
              var _x2 = this.getPoint(_i36, _c9),
                _4 = this.getPoint(_m2, _b3);
              _d[2] = _x2.x, _d[3] = _x2.y, _p[2] = _4.x, _p[3] = _4.y;
            }
            i.push(_d), i.push(_p), t.set("point", {
              x: _d[0] + (_p[0] - _d[0]) / 2,
              y: _d[1] + (_p[1] - _d[1]) / 2
            });
          }
          this.get("noRisers") && (e.points = [], e.segments.push(i));
        }
      }]);
    }(V.e);
    Object.defineProperty(Z, "className", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: "StepLineSeries"
    }), Object.defineProperty(Z, "classNames", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: V.e.classNames.concat([Z.className])
    });
    var q = i(55);
  },
  7825: function _(t, e, i) {
    i.r(e), i.d(e, {
      am5xy: function am5xy() {
        return s;
      }
    });
    var s = i(3405);
  },
  2818: function _(t, e, i) {
    function s(t, e, i) {
      t._context.bezierCurveTo(t._x1 + t._k * (t._x2 - t._x0), t._y1 + t._k * (t._y2 - t._y0), t._x2 + t._k * (t._x1 - e), t._y2 + t._k * (t._y1 - i), t._x2, t._y2);
    }
    function a(t, e) {
      this._context = t, this._k = (1 - e) / 6;
    }
    i.d(e, {
      xm: function xm() {
        return s;
      }
    }), a.prototype = {
      areaStart: function areaStart() {
        this._line = 0;
      },
      areaEnd: function areaEnd() {
        this._line = NaN;
      },
      lineStart: function lineStart() {
        this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
      },
      lineEnd: function lineEnd() {
        switch (this._point) {
          case 2:
            this._context.lineTo(this._x2, this._y2);
            break;
          case 3:
            s(this, this._x1, this._y1);
        }
        (this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line = 1 - this._line;
      },
      point: function point(t, e) {
        switch (t = +t, e = +e, this._point) {
          case 0:
            this._point = 1, this._line ? this._context.lineTo(t, e) : this._context.moveTo(t, e);
            break;
          case 1:
            this._point = 2, this._x1 = t, this._y1 = e;
            break;
          case 2:
            this._point = 3;
          default:
            s(this, t, e);
        }
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = t, this._y0 = this._y1, this._y1 = this._y2, this._y2 = e;
      }
    }, e.ZP = function t(e) {
      function i(t) {
        return new a(t, e);
      }
      return i.tension = function (e) {
        return t(+e);
      }, i;
    }(0);
  }
}, function (t) {
  var e = (7825, t(t.s = 7825)),
    i = window;
  for (var s in e) i[s] = e[s];
  e.__esModule && Object.defineProperty(i, "__esModule", {
    value: !0
  });
}]);
