describe('A single remote image', function () {
    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';

    beforeEach(function () {
        loadFixtures('remote.html');
    });

    it('the fixture file should be available', function () {
        expect($('#container')).toExist();
    });

    it('there should be an image', function () {
        expect($('#container').find('img').size()).toBe(1);
    });

    it('preload the image', function () {
        var $img = $('#container').find('img'),
            ready = false,
            success = null;

        runs(function () {
            $img.imagePreloader({
                finish: function () {
                    ready = true;
                },
                load: function () {
                    success = true;
                },
                error: function () {
                    success = false;
                }
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The loaded value should be true', 2000);

        runs(function () {
            expect(success).toBe(true);
        });
    });

    it('unable to preload non existing image', function () {
        var $img = $('#container').find('img'),
            ready = false,
            fail = null;

        $img.prop('src', 'http://foo.nl/piet.gif');

        runs(function () {
            $img.imagePreloader({
                finish: function () {
                    ready = true;
                },
                load: function () {
                    fail = false;
                },
                error: function () {
                    fail = true;
                }
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The loaded value should be true', 5000);

        runs(function () {
            expect(fail).toBe(true);
        });
    });
});

describe('Multiple remote images', function () {
    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';

    beforeEach(function () {
        loadFixtures('multiple-remote.html');
    });

    it('the fixture file should be available', function () {
        expect($('#container')).toExist();
    });

    it('there should be 5 images', function () {
        expect($('#container').find('img').size()).toBe(5);
    });

    it('preload the images', function () {
        var $img = $('#container').find('img'),
            count = 0,
            ready = false;

        runs(function () {
            $img.imagePreloader({
                finish: function () {
                    ready = true;
                },
                load: function () {
                    count += 1;
                }
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The loaded value should be true', 2000);

        runs(function () {
            expect(count).toBe(5);
        });
    });

    it('preload the images with one failing', function () {
        var $img = $('#container').find('img'),
            count = 0,
            ready = false;

        $img.first().prop('src', 'http://foo.nl/piet.gif');

        runs(function () {
            $img.imagePreloader({
                finish: function () {
                    ready = true;
                },
                load: function () {
                    count += 1;
                }
            });
        });

        waitsFor(function () {
            return ready;
        }, 'The loaded value should be true', 2000);

        runs(function () {
            expect(count).toBe(4);
        });
    });
});