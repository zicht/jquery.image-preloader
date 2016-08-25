/* global jQuery */

(function ($) {
    /**
     * @typedef {object} Status
     * @property {number} loaded
     * @property {number} failed
     * @property {number} total
     */

    /**
     * @typedef {object} Listeners
     * @property {Function} progress
     * @property {Function} load
     * @property {Function} error
     * @property {Function} finish
     */

    var /** @type {Listeners} */
        defaultListeners = {
            progress: function () {}, // eslint-disable-line no-empty-function
            load: function () {}, // eslint-disable-line no-empty-function
            error: function () {}, // eslint-disable-line no-empty-function
            finish: function () {} // eslint-disable-line no-empty-function
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
        if (img.complete && ('undefined' !== typeof img.naturalWidth)) {
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
     * @param {Object} [config]
     */
    $.imagePathPreloader = function (imagePaths, config) {
        var status,
            imagePathsArr = $.isArray(imagePaths) ? imagePaths : [imagePaths],
            listeners = $.extend({}, defaultListeners, config || {});

        status = {
            loaded: 0,
            failed: 0,
            total: imagePathsArr.length
        };

        $.each(imagePathsArr, function (index, imagePath) {
            var $image = $('<img src="' + imagePath + '" />');

            loadImage($image, function () {
                onImageLoad($image, status, listeners);
            }, function () {
                onImageError($image, status, listeners);
            });
        });
    };

    /**
     * @param {Listeners} config
     * @returns {jQuery}
     */
    $.fn.imagePreloader = function (config) {
        var status = {
                loaded: 0,
                failed: 0,
                total: this.size()
            },
            listeners = $.extend({}, defaultListeners, config || {});

        return this.each(function (index, el) {
            loadImage($(el), function ($image) {
                onImageLoad($image, status, listeners);
            }, function ($image) {
                onImageError($image, status, listeners);
            });
        });
    };
}(jQuery));
