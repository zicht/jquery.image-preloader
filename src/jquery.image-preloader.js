/*global jQuery*/
// jscs:disable requireEnhancedObjectLiterals, requireTemplateStrings

(function ($) {
    'use strict';

    /**
     * @typedef {Object} Status
     * @property {number} loaded
     * @property {number} failed
     * @property {number} total
     */

    /**
     * @typedef {Object} Listeners
     * @property {Function} progress
     * @property {Function} load
     * @property {Function} error
     * @property {Function} finish
     */

    var /** @type {Listeners} */
        defaultListeners = {
            progress: function () {},
            load: function () {},
            error: function () {},
            finish: function () {}
        },
        loadImage,
        onProgress,
        onImageLoad,
        onImageError;

    /**
     * @param {jQuery} $image
     * @param {Function} success
     * @param {Function} error
     */
    loadImage = function ($image, success, error) {
        var img = $image.get(0),
            $newImage;

        // If complete is true and browser supports natural sizes,
        // try to check for image status manually.
        if (img.complete && (typeof img.naturalWidth !== 'undefined')) {
            success($image);
        } else {
            $newImage = $('<img>');
            $newImage.on({
                load: function () {
                    success($image);
                },

                error: function () {
                    error($image);
                }
            });
            $newImage.prop('src', $image.prop('src'));
        }
    };

    /**
     * @param {Status} status
     * @param {Listeners} listeners
     */
    onProgress = function (status, listeners) {
        listeners.progress(status);

        if (status.loaded + status.failed === status.total) {
            listeners.finish(status);
        }
    };

    /**
     * @param {jQuery} $image
     * @param {Status} status
     * @param {Listeners} listeners
     */
    onImageLoad = function ($image, status, listeners) {
        status.loaded += 1;

        listeners.load($image);

        onProgress(status, listeners);
    };

    /**
     * @param {jQuery} $image
     * @param {Status} status
     * @param {Listeners} listeners
     */
    onImageError = function ($image, status, listeners) {
        status.failed += 1;

        listeners.error($image);

        onProgress(status, listeners);
    };

    /**
     * @param {Array|string} imagePaths
     * @param {Object} [listeners]
     */
    $.imagePathPreloader = function (imagePaths, listeners) {
        var status;

        // Make sure imagePaths is an array
        imagePaths = $.isArray(imagePaths) ? imagePaths : [imagePaths];
        listeners = $.extend({}, defaultListeners, listeners || {});

        status = {
            loaded: 0,
            failed: 0,
            total: imagePaths.length
        };

        $.each(imagePaths, function (index, imagePath) {
            var $image = $('<img src="' + imagePath + '" />');

            loadImage($image, function ($image) {
                onImageLoad($image, status, listeners);
            }, function ($image) {
                onImageError($image, status, listeners);
            });
        });
    };

    /**
     * @param listeners
     * @returns {jQuery}
     */
    $.fn.imagePreloader = function (listeners) {
        var status = {
            loaded: 0,
            failed: 0,
            total: this.size()
        };

        listeners = $.extend({}, defaultListeners, listeners || {});

        return this.each(function () {
            loadImage($(this), function ($image) {
                onImageLoad($image, status, listeners);
            }, function ($image) {
                onImageError($image, status, listeners);
            });
        });
    };
}(jQuery));