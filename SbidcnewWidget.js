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
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/** @jsx spandrel.jsx */

/**
 * A module defining `SbidcnewWidget`.
 *
 * @module nmodule/sbidcnew/rc/SbidcnewWidget
 */
define(['bajaux/spandrel', 'bajaux/mixin/subscriberMixIn', 'jquery', 'Promise'], function (spandrel, subscriberMixIn, $, Promise) {
  'use strict';

  var SELECTED_CLASS = 'active';
  var BUTTON_CLASS = 'SbidcnewWidget-button';
  var TITLE_TEXT = 'These are the slots on your component.';
  var SELECTED_SLOT_TEXT = "You've selected slot: ";
  var widgetDefaults = function widgetDefaults() {
    return {
      properties: {
        selectedSlot: ' '
      }
    };
  };

  /**
   * A demonstration Widget. This builds a list of buttons from the slots of a
   * Complex value, allowing the user to select a slot.
   *
   * @class
   * @extends module:nmodule/webEditors/rc/fe/baja/BaseEditor
   * @alias module:nmodule/sbidcnew/rc/SbidcnewWidget
   */
  var SbidcnewWidget = /*#__PURE__*/function (_spandrel) {
    function SbidcnewWidget(params) {
      var _this;
      _classCallCheck(this, SbidcnewWidget);
      _this = _callSuper(this, SbidcnewWidget, [{
        params: params,
        defaults: widgetDefaults()
      }]);
      subscriberMixIn(_this);
      _this.getSubscriber().attach('added removed renamed', function () {
        return _this.rerender();
      });
      return _this;
    }

    /**
     * Arm event handlers for the Widget.
     *
     * @param {jQuery} element the DOM element into which to load this widget
     */
    _inherits(SbidcnewWidget, _spandrel);
    return _createClass(SbidcnewWidget, [{
      key: "doInitialize",
      value: function doInitialize(dom) {
        var _this2 = this;
        dom.on('click', '.SbidcnewWidget-content button', function (e) {
          var target = $(e.target);
          target.siblings().removeClass(SELECTED_CLASS);
          target.addClass(SELECTED_CLASS);
          _this2.$updateSlotText();
          _this2.setModified(true);
        });
      }

      /**
       * @returns {string} the name of the currently selected slot
       */
    }, {
      key: "getSelectedSlotName",
      value: function getSelectedSlotName() {
        var selectedButton = this.jq().find('.SbidcnewWidget-content .' + BUTTON_CLASS + '.' + SELECTED_CLASS);
        return selectedButton.data('slot');
      }

      /**
       * Reads the currently selected slot and update the display accordingly.
       *
       * @private
       */
    }, {
      key: "$updateSlotText",
      value: function $updateSlotText() {
        var selectedSlot = this.getSelectedSlotName();
        this.properties().setValue('selectedSlot', selectedSlot);
      }
    }]);
  }(spandrel(function (comp, _ref) {
    var properties = _ref.properties;
    var selectedSlot = properties.selectedSlot;
    return spandrel.jsx("div", {
      "class": "SbidcnewWidget"
    }, spandrel.jsx("div", {
      "class": "SbidcnewWidget-header"
    }, spandrel.jsx("p", null, TITLE_TEXT), spandrel.jsx("p", null, spandrel.jsx("span", {
      className: "SbidcnewWidget-selected-slot-text"
    }, SELECTED_SLOT_TEXT), spandrel.jsx("span", {
      className: "SbidcnewWidget-selected-slot"
    }, selectedSlot))), spandrel.jsx("div", {
      "class": "SbidcnewWidget-content"
    }, spandrel.jsx("div", {
      className: "SbidcnewWidget-button-container"
    }, comp.getSlots().toArray().map(function (slot) {
      return spandrel.jsx("button", {
        className: "SbidcnewWidget-button",
        type: "button",
        "data-slot": slot.getName()
      }, comp.getDisplayName(slot));
    }))));
  }));
  return SbidcnewWidget;
});
