// Generated by CoffeeScript 1.3.3

/*
          >>>
          >>>                        >>>                         >>>
     >>>>>>>>   >>>>>>>    >>>>>>>   >>>>>   >>>>>>>    >>>>>>   >>>>>
    >>>   >>>  >>>   >>>  >>>   >>>  >>>    >>>   >>>  >>>       >>>
    >>>   >>>  >>>   >>>  >>>        >>>    >>>>>>>>>  >>>>>>>>  >>>
    >>>   >>>  >>>   >>>  >>>   >>>  >>>    >>>             >>>  >>>
     >>>>>>>>   >>>>>>>    >>>>>>>    >>>>   >>>>>>>    >>>>>>    >>>>
    .....................x.......xx.x.................................
*/


(function() {
  var doctest, fetch, q, rewrite,
    __slice = [].slice;

  doctest = function() {
    var urls;
    urls = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.each(urls, fetch);
  };

  doctest.version = '0.2.1';

  doctest.queue = [];

  doctest.input = function(fn) {
    return this.queue.push(fn);
  };

  doctest.output = function(num, fn) {
    fn.line = num;
    return this.queue.push(fn);
  };

  doctest.run = function() {
    var actual, expected, fn, input, num, results;
    results = [];
    input = null;
    while (fn = this.queue.shift()) {
      if (!(num = fn.line)) {
        if (typeof input === "function") {
          input();
        }
        input = fn;
        continue;
      }
      actual = (function() {
        try {
          return input();
        } catch (error) {
          return error.constructor;
        }
      })();
      expected = fn();
      results.push([_.isEqual(actual, expected), q(expected), q(actual), num]);
      input = null;
    }
    return this.complete(results);
  };

  doctest.complete = function(results) {
    var actual, expected, num, pass, r, _i, _len, _ref, _ref1, _results;
    console.log(((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        pass = results[_i][0];
        _results.push(pass ? '.' : 'x');
      }
      return _results;
    })()).join(''));
    _ref = (function() {
      var _j, _len, _results1;
      _results1 = [];
      for (_j = 0, _len = results.length; _j < _len; _j++) {
        r = results[_j];
        if (!r[0]) {
          _results1.push(r);
        }
      }
      return _results1;
    })();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _ref1 = _ref[_i], pass = _ref1[0], expected = _ref1[1], actual = _ref1[2], num = _ref1[3];
      _results.push(console.warn("expected " + expected + " on line " + num + " (got " + actual + ")"));
    }
    return _results;
  };

  fetch = function(url) {
    var $script;
    if (/^[.]/.test(url) && ($script = jQuery('script[src$="doctest.js"]')).length) {
      url = $script.attr('src').replace(/doctest[.]js$/, url);
    }
    console.log("retrieving " + url + "...");
    return jQuery.ajax(url, {
      dataType: 'text',
      success: function(text) {
        console.log("running doctests in " + (/[^/]+$/.exec(url)) + "...");
        eval(rewrite(text));
        return doctest.run();
      }
    });
  };

  rewrite = function(text) {
    var comment, expr, idx, line, lines, match, _i, _len, _ref;
    lines = [];
    expr = '';
    _ref = text.split(/\r?\n|\r/);
    for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
      line = _ref[idx];
      if (match = /^[ \t]*\/\/[ \t]*(.+)/.exec(line)) {
        comment = match[1];
        if (match = /^>(.*)/.exec(comment)) {
          if (expr) {
            lines.push("doctest.input(function(){return " + expr + "})");
          }
          expr = match[1];
        } else if (match = /^[.](.*)/.exec(comment)) {
          expr += '\n' + match[1];
        } else if (expr) {
          lines.push("doctest.input(function(){return " + expr + "})");
          lines.push("doctest.output(" + (idx + 1) + ",function(){return " + comment + "})");
          expr = '';
        }
      } else {
        lines.push(line);
      }
    }
    return lines.join('\n');
  };

  q = function(object) {
    switch (typeof object) {
      case 'string':
        return "\"" + object + "\"";
      case 'function':
        try {
          throw object();
        } catch (error) {
          if (error instanceof Error) {
            return object.name;
          }
        }
    }
    return object;
  };

  window.doctest = doctest;

}).call(this);
