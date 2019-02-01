var container = document.getElementById("container"),
    new_game_btn = document.getElementById('newGame');

// game loader
var game_app = {

    /**
     * Adds time to a date. Modelled after MySQL DATE_ADD function.
     * Example: dateAdd(new Date(), 'minutes', 30)  //returns 30 minutes from now.
     * 
     * @param date  Date to start with
     * @param interval  One of: year, quarter, month, week, day, hour, minute, second
     * @param units  Number of units of the given interval to add.
     */
    dateAdd: function(date, interval, units) {
        var ret = new Date(date); //don't change original date
        var checkRollover = function() {
            if (ret.getDate() != date.getDate()) ret.setDate(0);
        };
        switch (interval.toLowerCase()) {
            case 'year':
                ret.setFullYear(ret.getFullYear() + units);
                checkRollover();
                break;
            case 'quarter':
                ret.setMonth(ret.getMonth() + 3 * units);
                checkRollover();
                break;
            case 'month':
                ret.setMonth(ret.getMonth() + units);
                checkRollover();
                break;
            case 'week':
                ret.setDate(ret.getDate() + 7 * units);
                break;
            case 'day':
                ret.setDate(ret.getDate() + units);
                break;
            case 'hour':
                ret.setTime(ret.getTime() + units * 3600000);
                break;
            case 'minute':
                ret.setTime(ret.getTime() + units * 60000);
                break;
            case 'second':
                ret.setTime(ret.getTime() + units * 1000);
                break;
            default:
                ret = undefined;
                break;
        }
        return ret;
    },
    date: function(day) {
        var date = new Date();
        if (day) {
            var now = date.addDays(day);
            // add a day
        } else {
            var now = date.addDays(0);
        }
        return now;
    },
    user_agent: function() {
        return navigator.userAgent;
    },
    in_array: function(el, array) {

        if (array.length <= 0) {
            console.log(el + ' not in ');
            console.log(array);
            return false;
        }

        if (array.indexOf(el) == -1) {
            console.log(el + ' not in ');
            console.log(array);
            return false;
        } else {
            console.log(el + ' find in in ');
            console.log(array);

            return true;
        }

        // return (array.indexOf(el) == -1) ? false : true;

        /*
        for (var i = 0; i < array.length; i++) {
            console.log(array[i]);
            if (array[i] == el) return true;
        }
        return false;*/
    },
    make_array_nums: function(length) {
        var numberArray = [];
        for (var i = 1; i <= length; i++) {
            numberArray.push(i);
        }
        return numberArray;
        /*
        return Array.apply(null, {
            length: length
        }).map(Function.call, Number);*/
    },
    // randomize array
    shuffle_array: function(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },
    get_rand: function(arr, excludeNum) {
        var randNumber = Math.floor(Math.random() * arr.length);
        if (randNumber == 0) {
            randNumber = 1;
        }
        if (game_app.in_array(randNumber, excludeNum)) {
            return game_app.get_rand(arr, excludeNum);
        } else {
            return randNumber;
        }
    },
    is: function(el, selector) {
        return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
    },
    getParents: function(el, parentSelector /* optional */ ) {

        // If no parentSelector defined will bubble up all the way to *document*
        if (parentSelector === undefined) {
            parentSelector = document;
        }

        var parents = [];
        var p = el.parentNode;

        while (game_app.is(p, parentSelector)) {
            var o = p;
            parents.push(o);
            p = o.parentNode;
        }

        if (p !== null) {
            //parents.push(parentSelector); // Push that parentSelector you wanted to stop at
            //console.log('parents');
            //console.log(parents);
            //console.log(p.parentNode);
            return p.parentNode;
        } else {
            return false;
        }

    },
    removeClass: function(el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    },
    addClass: function(el, className) {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    },
    hasClass: function(el, className) {
        if (el.classList)
            return el.classList.contains(className);
        else
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    },
    toggleClass: function(el, className) {
        if (el.classList) {
            el.classList.toggle(className);
        } else {
            var classes = el.className.split(' ');
            var existingIndex = classes.indexOf(className);

            if (existingIndex >= 0)
                classes.splice(existingIndex, 1);
            else
                classes.push(className);

            el.className = classes.join(' ');
        }
    },
    is_mobile: function() {
        return (document.body.clientWidth > 1024) ? false : true;
    },
    height: function(el) {
        return el.offsetHeight;
    },
    outerHeight: function(el) {
        var height = el.offsetHeight,
            style = getComputedStyle(el);
        height += parseInt(style.marginTop) + parseInt(style.marginBottom);
        return height;
    },
    str_lang: function(str) {

        var langs = '';

        // number
        if (/^[a-zA-Z]/.test(str))
            langs += "la-num";

        // english
        if (/^[a-zA-Z]/.test(str))
            langs += " la-en";

        // persian
        if (/^[\u0600-\u06FF\s]/.test(str)) {
            langs += " la-per";
        } else {
            if (/^[آ ا ب پ ت ث ج چ ح خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن و ه ی]/.test(str))
                langs += " la-per";
        }

        langs = langs.replace('  ', ' ');

        return (!langs || langs == '') ? '' : langs;

    },
    make_game: function(_items_num) {

        game_app.removeClass(container, 'hide');
        game_app.addClass(container, 'show');

        //console.log('_items_num: ' + _items_num);
        // creat 2 time more than _items_num
        var nums = game_app.make_array_nums(_items_num * 2);
        // console.log('nums: ');
        //console.log(nums);

        var generated_nums = [];
        var images = [];

        // get images, place them in an array & randomize the order
        for (var i = 0; i < _items_num / 2; i++) {
            var rand = game_app.get_rand(nums, generated_nums);
            generated_nums.push(rand);

            var img = 'img/' + rand + '.jpg';
            images.push({
                id: rand,
                src: img
            });
            images.push({
                id: rand,
                src: img
            });

        }
        //console.log(images);
        // shuffle images array
        images = game_app.shuffle_array(images);

        // output images then hide them
        var output = "<ol>";
        for (var i = 0; i < _items_num; i++) {
            output += '<li data-id="' + images[i].id + '" class="show">';
            output += '<img src="' + images[i].src + '"/>';
            output += "</li>";
        }
        output += "</ol>";
        container.innerHTML = output;

        setTimeout(function() {
            var elements = document.querySelectorAll('li');
            Array.prototype.forEach.call(elements, function(el, i) {
                game_app.removeClass(el, 'show');
            });
        }, 2000);

        var img_clicked = 0,
            img_1 = '',
            img_2 = '';

        var _img_els = document.querySelectorAll('li');

        if (_img_els.length > 0) {
            for (var i = 0; i < _img_els.length; i++) {
                var _this_el = _img_els[i];

                _this_el.onclick = function(e) {

                    e.preventDefault();
                    var _this = this;

                    // if it's < as 2 times click on images
                    if ((img_clicked <= 2) && !game_app.hasClass(_this, 'show')) {

                        img_clicked++;

                        // show this image
                        game_app.addClass(_this, 'show');

                        // if is first image
                        if (img_clicked === 1) {
                            img_1 = _this.getAttribute('data-id');
                        }

                        // else if is second image
                        else {

                            img_2 = _this.getAttribute('data-id');

                            // now check if iamges is same
                            // if is true
                            if (img_1 === img_2) {

                                var img_2_els = document.querySelectorAll("li[data-id='" + img_2 + "']");

                                Array.prototype.forEach.call(img_2_els, function(el, i) {
                                    game_app.addClass(el, 'match');
                                    // prepend to the element's content
                                    el.innerHTML = el.innerHTML + '<svg class="icon"><use xlink:href="#checkbox"/></svg>';
                                });

                                setTimeout(function() {
                                    Array.prototype.forEach.call(img_2_els, function(el, i) {
                                        game_app.addClass(el, 'checked');
                                    });
                                }, 10);

                            }

                            // reset
                            setTimeout(function() {

                                img_1 = img_2 = '';
                                img_clicked = 0;

                                var els = document.querySelectorAll("li:not(.match)");

                                Array.prototype.forEach.call(els, function(el, i) {
                                    game_app.removeClass(el, 'show');
                                });

                            }, 200);

                        }

                    }

                }

            }
        }

    },
    destroy_game: function() {
        game_app.removeClass(container, 'show');
        game_app.addClass(container, 'hide');
        setTimeout(function() {
            container.innerHTML = '';
        }, 300);
    },
    make_new_game: function(items_num) {
        game_app.destroy_game();
        game_app.addClass(new_game_btn, 'loading');
        setTimeout(function() {
            // start game
            game_app.make_game(items_num);
            game_app.removeClass(new_game_btn, 'loading');
        }, 1000);
    }
};

// start game
game_app.make_new_game(16);

// make new game on click
new_game_btn.onclick = function(e) {
    e.preventDefault();
    game_app.make_new_game(16);
};