var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../../animations/animation', '../../transitions/transition'], factory);
    }
})(function (require, exports) {
    "use strict";
    var animation_1 = require('../../animations/animation');
    var transition_1 = require('../../transitions/transition');
    var ActionSheetSlideIn = (function (_super) {
        __extends(ActionSheetSlideIn, _super);
        function ActionSheetSlideIn() {
            _super.apply(this, arguments);
        }
        ActionSheetSlideIn.prototype.init = function () {
            var ele = this.enteringView.pageRef().nativeElement;
            var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
            var wrapper = new animation_1.Animation(ele.querySelector('.action-sheet-wrapper'));
            backdrop.fromTo('opacity', 0.01, 0.4);
            wrapper.fromTo('translateY', '100%', '0%');
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
        };
        return ActionSheetSlideIn;
    }(transition_1.Transition));
    exports.ActionSheetSlideIn = ActionSheetSlideIn;
    var ActionSheetSlideOut = (function (_super) {
        __extends(ActionSheetSlideOut, _super);
        function ActionSheetSlideOut() {
            _super.apply(this, arguments);
        }
        ActionSheetSlideOut.prototype.init = function () {
            var ele = this.leavingView.pageRef().nativeElement;
            var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
            var wrapper = new animation_1.Animation(ele.querySelector('.action-sheet-wrapper'));
            backdrop.fromTo('opacity', 0.4, 0);
            wrapper.fromTo('translateY', '0%', '100%');
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(300).add(backdrop).add(wrapper);
        };
        return ActionSheetSlideOut;
    }(transition_1.Transition));
    exports.ActionSheetSlideOut = ActionSheetSlideOut;
    var ActionSheetMdSlideIn = (function (_super) {
        __extends(ActionSheetMdSlideIn, _super);
        function ActionSheetMdSlideIn() {
            _super.apply(this, arguments);
        }
        ActionSheetMdSlideIn.prototype.init = function () {
            var ele = this.enteringView.pageRef().nativeElement;
            var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
            var wrapper = new animation_1.Animation(ele.querySelector('.action-sheet-wrapper'));
            backdrop.fromTo('opacity', 0.01, 0.26);
            wrapper.fromTo('translateY', '100%', '0%');
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
        };
        return ActionSheetMdSlideIn;
    }(transition_1.Transition));
    exports.ActionSheetMdSlideIn = ActionSheetMdSlideIn;
    var ActionSheetMdSlideOut = (function (_super) {
        __extends(ActionSheetMdSlideOut, _super);
        function ActionSheetMdSlideOut() {
            _super.apply(this, arguments);
        }
        ActionSheetMdSlideOut.prototype.init = function () {
            var ele = this.leavingView.pageRef().nativeElement;
            var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
            var wrapper = new animation_1.Animation(ele.querySelector('.action-sheet-wrapper'));
            backdrop.fromTo('opacity', 0.26, 0);
            wrapper.fromTo('translateY', '0%', '100%');
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(backdrop).add(wrapper);
        };
        return ActionSheetMdSlideOut;
    }(transition_1.Transition));
    exports.ActionSheetMdSlideOut = ActionSheetMdSlideOut;
    var ActionSheetWpSlideIn = (function (_super) {
        __extends(ActionSheetWpSlideIn, _super);
        function ActionSheetWpSlideIn() {
            _super.apply(this, arguments);
        }
        ActionSheetWpSlideIn.prototype.init = function () {
            var ele = this.enteringView.pageRef().nativeElement;
            var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
            var wrapper = new animation_1.Animation(ele.querySelector('.action-sheet-wrapper'));
            backdrop.fromTo('opacity', 0.01, 0.16);
            wrapper.fromTo('translateY', '100%', '0%');
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
        };
        return ActionSheetWpSlideIn;
    }(transition_1.Transition));
    exports.ActionSheetWpSlideIn = ActionSheetWpSlideIn;
    var ActionSheetWpSlideOut = (function (_super) {
        __extends(ActionSheetWpSlideOut, _super);
        function ActionSheetWpSlideOut() {
            _super.apply(this, arguments);
        }
        ActionSheetWpSlideOut.prototype.init = function () {
            var ele = this.leavingView.pageRef().nativeElement;
            var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
            var wrapper = new animation_1.Animation(ele.querySelector('.action-sheet-wrapper'));
            backdrop.fromTo('opacity', 0.1, 0);
            wrapper.fromTo('translateY', '0%', '100%');
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(backdrop).add(wrapper);
        };
        return ActionSheetWpSlideOut;
    }(transition_1.Transition));
    exports.ActionSheetWpSlideOut = ActionSheetWpSlideOut;
});
//# sourceMappingURL=action-sheet-transitions.js.map