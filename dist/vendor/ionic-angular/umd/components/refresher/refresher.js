(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '@angular/core', '../content/content', '../../util/dom', '../../gestures/gesture-controller', '../../util/util', '../../util/ui-event-manager'], factory);
    }
})(function (require, exports) {
    "use strict";
    var core_1 = require('@angular/core');
    var content_1 = require('../content/content');
    var dom_1 = require('../../util/dom');
    var gesture_controller_1 = require('../../gestures/gesture-controller');
    var util_1 = require('../../util/util');
    var ui_event_manager_1 = require('../../util/ui-event-manager');
    /**
     * @name Refresher
     * @description
     * The Refresher provides pull-to-refresh functionality on a content component.
     * Place the `ion-refresher` as the first child of your `ion-content` element.
     *
     * Pages can then listen to the refresher's various output events. The
     * `refresh` output event is fired when the user has pulled down far
     * enough to kick off the refreshing process. Once the async operation
     * has completed and the refreshing should end, call `complete()`.
     *
     * Note: Do not wrap the `ion-refresher` in a `*ngIf`. It will not render
     * properly this way. Please use the `enabled` property instead to
     * display or hide the refresher.
     *
     * @usage
     * ```html
     * <ion-content>
     *
     *   <ion-refresher (ionRefresh)="doRefresh($event)">
     *     <ion-refresher-content></ion-refresher-content>
     *   </ion-refresher>
     *
     * </ion-content>
     * ```
     *
     * ```ts
     * @Component({...})
     * export class NewsFeedPage {
     *
     *   doRefresh(refresher) {
     *     console.log('Begin async operation', refresher);
     *
     *     setTimeout(() => {
     *       console.log('Async operation has ended');
     *       refresher.complete();
     *     }, 2000);
     *   }
     *
     * }
     * ```
     *
     *
     * ## Refresher Content
     *
     * By default, Ionic provides the pulling icon and refreshing spinner that
     * looks best for the platform the user is on. However, you can change the
     * default icon and spinner, along with adding text for each state by
     * adding properties to the child `ion-refresher-content` component.
     *
     *  ```html
     *  <ion-content>
     *
     *    <ion-refresher (ionRefresh)="doRefresh($event)">
     *      <ion-refresher-content
     *        pullingIcon="arrow-dropdown"
     *        pullingText="Pull to refresh"
     *        refreshingSpinner="circles"
     *        refreshingText="Refreshing...">
     *      </ion-refresher-content>
     *    </ion-refresher>
     *
     *  </ion-content>
     *  ```
     *
     *
     * ## Further Customizing Refresher Content
     *
     * The `ion-refresher` component holds the refresh logic.
     * It requires a child component in order to display the content.
     * Ionic uses `ion-refresher-content` by default. This component
     * displays the refresher and changes the look depending
     * on the refresher's state. Separating these components
     * allows developers to create their own refresher content
     * components. You could replace our default content with
     * custom SVG or CSS animations.
     *
     * @demo /docs/v2/demos/src/refresher/
     *
     */
    var Refresher = (function () {
        function Refresher(_content, _zone, gestureCtrl) {
            this._content = _content;
            this._zone = _zone;
            this._appliedStyles = false;
            this._lastCheck = 0;
            this._isEnabled = true;
            this._events = new ui_event_manager_1.UIEventManager(false);
            this._top = '';
            /**
             * The current state which the refresher is in. The refresher's states include:
             *
             * - `inactive` - The refresher is not being pulled down or refreshing and is currently hidden.
             * - `pulling` - The user is actively pulling down the refresher, but has not reached the point yet that if the user lets go, it'll refresh.
             * - `cancelling` - The user pulled down the refresher and let go, but did not pull down far enough to kick off the `refreshing` state. After letting go, the refresher is in the `cancelling` state while it is closing, and will go back to the `inactive` state once closed.
             * - `ready` - The user has pulled down the refresher far enough that if they let go, it'll begin the `refreshing` state.
             * - `refreshing` - The refresher is actively waiting on the async operation to end. Once the refresh handler calls `complete()` it will begin the `completing` state.
             * - `completing` - The `refreshing` state has finished and the refresher is in the process of closing itself. Once closed, the refresher will go back to the `inactive` state.
             */
            this.state = STATE_INACTIVE;
            /**
             * The Y coordinate of where the user started to the pull down the content.
             */
            this.startY = null;
            /**
             * The current touch or mouse event's Y coordinate.
             */
            this.currentY = null;
            /**
             * The distance between the start of the pull and the current touch or
             * mouse event's Y coordinate.
             */
            this.deltaY = null;
            /**
             * A number representing how far down the user has pulled.
             * The number `0` represents the user hasn't pulled down at all. The
             * number `1`, and anything greater than `1`, represents that the user
             * has pulled far enough down that when they let go then the refresh will
             * happen. If they let go and the number is less than `1`, then the
             * refresh will not happen, and the content will return to it's original
             * position.
             */
            this.progress = 0;
            /**
             * @input {number} The min distance the user must pull down until the
             * refresher can go into the `refreshing` state. Default is `60`.
             */
            this.pullMin = 60;
            /**
             * @input {number} The maximum distance of the pull until the refresher
             * will automatically go into the `refreshing` state. By default, the pull
             * maximum will be the result of `pullMin + 60`.
             */
            this.pullMax = this.pullMin + 60;
            /**
             * @input {number} How many milliseconds it takes to close the refresher. Default is `280`.
             */
            this.closeDuration = 280;
            /**
             * @input {number} How many milliseconds it takes the refresher to to snap back to the `refreshing` state. Default is `280`.
             */
            this.snapbackDuration = 280;
            /**
             * @output {event} When the user lets go and has pulled down far enough, which would be
             * farther than the `pullMin`, then your refresh hander if fired and the state is
             * updated to `refreshing`. From within your refresh handler, you must call the
             * `complete()` method when your async operation has completed.
             */
            this.ionRefresh = new core_1.EventEmitter();
            /**
             * @output {event} While the user is pulling down the content and exposing the refresher.
             */
            this.ionPull = new core_1.EventEmitter();
            /**
             * @output {event} When the user begins to start pulling down.
             */
            this.ionStart = new core_1.EventEmitter();
            _content.setElementClass('has-refresher', true);
            this._gesture = gestureCtrl.createGesture({
                name: gesture_controller_1.GESTURE_REFRESHER,
                priority: 0 /* Refresher */,
            });
        }
        Object.defineProperty(Refresher.prototype, "enabled", {
            /**
             * @input {boolean} If the refresher is enabled or not. This should be used in place of an `ngIf`. Default is `true`.
             */
            get: function () {
                return this._isEnabled;
            },
            set: function (val) {
                this._isEnabled = util_1.isTrueProperty(val);
                this._setListeners(this._isEnabled);
            },
            enumerable: true,
            configurable: true
        });
        Refresher.prototype._onStart = function (ev) {
            // if multitouch then get out immediately
            if (ev.touches && ev.touches.length > 1) {
                return false;
            }
            if (this.state !== STATE_INACTIVE) {
                return false;
            }
            var scrollHostScrollTop = this._content.getContentDimensions().scrollTop;
            // if the scrollTop is greater than zero then it's
            // not possible to pull the content down yet
            if (scrollHostScrollTop > 0) {
                return false;
            }
            if (!this._gesture.canStart()) {
                return false;
            }
            var coord = dom_1.pointerCoord(ev);
            (void 0) /* console.debug */;
            if (this._content.contentTop > 0) {
                var newTop = this._content.contentTop + 'px';
                if (this._top !== newTop) {
                    this._top = newTop;
                }
            }
            this.startY = this.currentY = coord.y;
            this.progress = 0;
            this.state = STATE_INACTIVE;
            return true;
        };
        Refresher.prototype._onMove = function (ev) {
            // this method can get called like a bazillion times per second,
            // so it's built to be as efficient as possible, and does its
            // best to do any DOM read/writes only when absolutely necessary
            var _this = this;
            // if multitouch then get out immediately
            if (ev.touches && ev.touches.length > 1) {
                return 1;
            }
            if (!this._gesture.canStart()) {
                return 0;
            }
            // do nothing if it's actively refreshing
            // or it's in the process of closing
            // or this was never a startY
            if (this.startY === null || this.state === STATE_REFRESHING || this.state === STATE_CANCELLING || this.state === STATE_COMPLETING) {
                return 2;
            }
            // if we just updated stuff less than 16ms ago
            // then don't check again, just chillout plz
            var now = Date.now();
            if (this._lastCheck + 16 > now) {
                return 3;
            }
            // remember the last time we checked all this
            this._lastCheck = now;
            // get the current pointer coordinates
            var coord = dom_1.pointerCoord(ev);
            this.currentY = coord.y;
            // it's now possible they could be pulling down the content
            // how far have they pulled so far?
            this.deltaY = (coord.y - this.startY);
            // don't bother if they're scrolling up
            // and have not already started dragging
            if (this.deltaY <= 0) {
                // the current Y is higher than the starting Y
                // so they scrolled up enough to be ignored
                this.progress = 0;
                if (this.state !== STATE_INACTIVE) {
                    this._zone.run(function () {
                        _this.state = STATE_INACTIVE;
                    });
                }
                if (this._appliedStyles) {
                    // reset the styles only if they were applied
                    this._setCss(0, '', false, '');
                    return 5;
                }
                return 6;
            }
            if (this.state === STATE_INACTIVE) {
                // this refresh is not already actively pulling down
                // get the content's scrollTop
                var scrollHostScrollTop = this._content.getContentDimensions().scrollTop;
                // if the scrollTop is greater than zero then it's
                // not possible to pull the content down yet
                if (scrollHostScrollTop > 0) {
                    this.progress = 0;
                    this.startY = null;
                    return 7;
                }
                // content scrolled all the way to the top, and dragging down
                this.state = STATE_PULLING;
            }
            // prevent native scroll events
            ev.preventDefault();
            // the refresher is actively pulling at this point
            // move the scroll element within the content element
            this._setCss(this.deltaY, '0ms', true, '');
            if (!this.deltaY) {
                // don't continue if there's no delta yet
                this.progress = 0;
                return 8;
            }
            // so far so good, let's run this all back within zone now
            this._zone.run(function () {
                _this._onMoveInZone();
            });
        };
        Refresher.prototype._onMoveInZone = function () {
            // set pull progress
            this.progress = (this.deltaY / this.pullMin);
            // emit "start" if it hasn't started yet
            if (!this._didStart) {
                this._didStart = true;
                this.ionStart.emit(this);
            }
            // emit "pulling" on every move
            this.ionPull.emit(this);
            // do nothing if the delta is less than the pull threshold
            if (this.deltaY < this.pullMin) {
                // ensure it stays in the pulling state, cuz its not ready yet
                this.state = STATE_PULLING;
                return 2;
            }
            if (this.deltaY > this.pullMax) {
                // they pulled farther than the max, so kick off the refresh
                this._beginRefresh();
                return 3;
            }
            // pulled farther than the pull min!!
            // it is now in the `ready` state!!
            // if they let go then it'll refresh, kerpow!!
            this.state = STATE_READY;
            return 4;
        };
        Refresher.prototype._onEnd = function () {
            // only run in a zone when absolutely necessary
            var _this = this;
            if (this.state === STATE_READY) {
                this._zone.run(function () {
                    // they pulled down far enough, so it's ready to refresh
                    _this._beginRefresh();
                });
            }
            else if (this.state === STATE_PULLING) {
                this._zone.run(function () {
                    // they were pulling down, but didn't pull down far enough
                    // set the content back to it's original location
                    // and close the refresher
                    // set that the refresh is actively cancelling
                    _this.cancel();
                });
            }
            // reset on any touchend/mouseup
            this.startY = null;
        };
        Refresher.prototype._beginRefresh = function () {
            // assumes we're already back in a zone
            // they pulled down far enough, so it's ready to refresh
            this.state = STATE_REFRESHING;
            // place the content in a hangout position while it thinks
            this._setCss(this.pullMin, (this.snapbackDuration + 'ms'), true, '');
            // emit "refresh" because it was pulled down far enough
            // and they let go to begin refreshing
            this.ionRefresh.emit(this);
        };
        /**
         * Call `complete()` when your async operation has completed.
         * For example, the `refreshing` state is while the app is performing
         * an asynchronous operation, such as receiving more data from an
         * AJAX request. Once the data has been received, you then call this
         * method to signify that the refreshing has completed and to close
         * the refresher. This method also changes the refresher's state from
         * `refreshing` to `completing`.
         */
        Refresher.prototype.complete = function () {
            this._close(STATE_COMPLETING, '120ms');
        };
        /**
         * Changes the refresher's state from `refreshing` to `cancelling`.
         */
        Refresher.prototype.cancel = function () {
            this._close(STATE_CANCELLING, '');
        };
        Refresher.prototype._close = function (state, delay) {
            var timer;
            function close(ev) {
                // closing is done, return to inactive state
                if (ev) {
                    clearTimeout(timer);
                }
                this.state = STATE_INACTIVE;
                this.progress = 0;
                this._didStart = this.startY = this.currentY = this.deltaY = null;
                this._setCss(0, '0ms', false, '');
            }
            // create fallback timer incase something goes wrong with transitionEnd event
            timer = setTimeout(close.bind(this), 600);
            // create transition end event on the content's scroll element
            this._content.onScrollElementTransitionEnd(close.bind(this));
            // reset set the styles on the scroll element
            // set that the refresh is actively cancelling/completing
            this.state = state;
            this._setCss(0, '', true, delay);
            if (this._pointerEvents) {
                this._pointerEvents.stop();
            }
        };
        Refresher.prototype._setCss = function (y, duration, overflowVisible, delay) {
            this._appliedStyles = (y > 0);
            var content = this._content;
            content.setScrollElementStyle(dom_1.CSS.transform, ((y > 0) ? 'translateY(' + y + 'px) translateZ(0px)' : 'translateZ(0px)'));
            content.setScrollElementStyle(dom_1.CSS.transitionDuration, duration);
            content.setScrollElementStyle(dom_1.CSS.transitionDelay, delay);
            content.setScrollElementStyle('overflow', (overflowVisible ? 'hidden' : ''));
        };
        Refresher.prototype._setListeners = function (shouldListen) {
            this._events.unlistenAll();
            this._pointerEvents = null;
            if (shouldListen) {
                this._pointerEvents = this._events.pointerEvents({
                    element: this._content.getScrollElement(),
                    pointerDown: this._onStart.bind(this),
                    pointerMove: this._onMove.bind(this),
                    pointerUp: this._onEnd.bind(this)
                });
            }
        };
        /**
         * @private
         */
        Refresher.prototype.ngOnInit = function () {
            // bind event listeners
            // save the unregister listener functions to use onDestroy
            this._setListeners(this._isEnabled);
        };
        /**
         * @private
         */
        Refresher.prototype.ngOnDestroy = function () {
            this._gesture.destroy();
            this._setListeners(false);
        };
        Refresher.decorators = [
            { type: core_1.Directive, args: [{
                        selector: 'ion-refresher',
                        host: {
                            '[class.refresher-active]': 'state !== "inactive"',
                            '[style.top]': '_top'
                        }
                    },] },
        ];
        /** @nocollapse */
        Refresher.ctorParameters = [
            { type: content_1.Content, decorators: [{ type: core_1.Host },] },
            { type: core_1.NgZone, },
            { type: gesture_controller_1.GestureController, },
        ];
        Refresher.propDecorators = {
            'pullMin': [{ type: core_1.Input },],
            'pullMax': [{ type: core_1.Input },],
            'closeDuration': [{ type: core_1.Input },],
            'snapbackDuration': [{ type: core_1.Input },],
            'enabled': [{ type: core_1.Input },],
            'ionRefresh': [{ type: core_1.Output },],
            'ionPull': [{ type: core_1.Output },],
            'ionStart': [{ type: core_1.Output },],
        };
        return Refresher;
    }());
    exports.Refresher = Refresher;
    var STATE_INACTIVE = 'inactive';
    var STATE_PULLING = 'pulling';
    var STATE_READY = 'ready';
    var STATE_REFRESHING = 'refreshing';
    var STATE_CANCELLING = 'cancelling';
    var STATE_COMPLETING = 'completing';
});
//# sourceMappingURL=refresher.js.map