// Generated by CoffeeScript 1.8.0
(function() {
  var CSS_PROPS, HTML_TAGS, IE, JS_EVENT, check_selectors, css, css_chain, css_def, css_rule_chain, current_rule, current_tag, dom_build, dom_scan, dont_refresh_flag, dont_refresh_this_time, full_refresh, inserted, js_event, levels, make_css, make_event, make_selectors, make_tag, needs_refresh_flag, old_oml, parse_selectors, parse_url, redraw, render, requestAnimationFrame, setup_new_window, tag, tag_add, tag_build, tag_chain, tag_remove, tag_replace, tag_scan, tags, visibilitychange, _i, _j, _k, _len, _len1, _len2,
    __slice = [].slice;

  window.onecup = {};

  HTML_TAGS = "a\naudio\nb\nblockquote\nbr\nbutton\ncanvas\ncode\ndiv\nem\nembed\nform\nh1\nh2\nh3\nh4\nh5\nh6\nheader\nhr\ni\niframe\nimg\ninput\nlabel\nli\nobject\nol\noption\np\npre\nscript\nselect\nsmall\nsource\nspan\nstrong\nsub\nsup\ntable\ntbody\ntd\ntextarea\ntfoot\nth\nthead\ntime\ntr\nu\nul\nvideo".split(/\s/);

  CSS_PROPS = "background\nbackground_attachment\nbackground_color\nbackground_image\nbackground_size\nbackground_position\nbackground_position_x\nbackground_position_y\nbackground_repeat\nborder\nborder_bottom\nborder_bottom_color\nborder_bottom_style\nborder_bottom_width\nborder_collapse\nborder_color\nborder_left\nborder_left_color\nborder_left_style\nborder_left_width\nborder_radius\nborder_right\nborder_right_color\nborder_right_style\nborder_right_width\nborder_spacing\nborder_style\nborder_top\nborder_top_color\nborder_top_style\nborder_top_width\nborder_width\nbottom\nbox_shadow\nclear\nclip\ncolor\ncursor\ndirection\ndisplay\nfloat\nfont\nfont_family\nfont_size\nfont_size_adjust\nfont_stretch\nfont_style\nfont_variant\nfont_weight\nheight\nleft\nline_break\nline_height\nlist_style\nlist_style_image\nlist_style_position\nlist_style_type\nmargin\nmargin_bottom\nmargin_left\nmargin_right\nmargin_top\nmarker_offset\nmax_height\nmax_width\nmin_height\nmin_width\nopacity\noverflow\noverflow_x\noverflow_y\npadding\npadding_bottom\npadding_left\npadding_right\npadding_top\nposition\nright\ntable_layout\ntext_align\ntext_align_last\ntext_decoration\ntext_indent\ntext_justify\ntext_overflow\ntext_shadow\ntext_transform\ntext_autospace\ntext_kashida_space\ntext_underline_position\ntop\ntransform\ntransition\nvertical_align\nvisibility\nwhite_space\nwidth\nword_break\nword_spacing\nword_wrap\nz_index".split(/\s/);

  JS_EVENT = "onblur\nonchange\noncontextmenu\nonfocus\noninput\nonselect\nonsubmit\nonkeydown\nonkeypress\nonkeyup\nonclick\nondblclick\nondrag\nondragend\nondragenter\nondragleave\nondragover\nondragstart\nondrop\nonmouseenter\nonmousedown\nonmousemove\nonmouseout\nonmouseover\nonmouseup\nonload\nonscroll\nonwheel".split(/\s/);

  IE = navigator.msMaxTouchPoints;

  if (Array.isArray == null) {
    Array.isArray = function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  onecup.new_page = function() {};

  current_tag = null;

  tag_chain = [];

  css_chain = [];

  css_rule_chain = [];

  current_rule = null;

  levels = [];

  tags = [];

  old_oml = null;

  full_refresh = true;

  dont_refresh_flag = false;

  render = function() {
    var finished_tags;
    finished_tags = tags;
    tags = [];
    return finished_tags;
  };

  check_selectors = function(args) {
    var first_arg;
    first_arg = args[0];
    if (typeof first_arg === 'string') {
      if ("#" === first_arg[0] || "." === first_arg[0]) {
        return parse_selectors(args.shift());
      }
    }
    return {};
  };

  parse_selectors = function(arg) {
    var attributes, classes, i, _i, _len, _ref;
    attributes = {};
    classes = [];
    _ref = arg.split('.');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      if (i.length === 0) {
        continue;
      } else if ("#" === i[0]) {
        if (attributes.id) {
          throw Error("mulitple ids " + arg);
        }
        attributes.id = i.slice(1);
      } else {
        classes.push(i);
      }
    }
    if (classes.length > 0) {
      attributes["class"] = classes.join(" ");
    }
    return attributes;
  };

  make_selectors = function(attrs) {
    var selector;
    selector = "";
    if (attrs.id) {
      selector += "#" + attrs.id;
    }
    if (attrs["class"]) {
      selector += "." + attrs["class"].split(" ").join(".");
    }
    return selector;
  };

  css_def = function(css) {
    var k, lines, v;
    if (typeof css !== 'object') {
      return css;
    }
    lines = [];
    for (k in css) {
      v = css[k];
      if (typeof v === 'number') {
        v = v + "px";
      }
      lines.push("" + k + ":" + v);
    }
    return lines.join(";");
  };

  make_tag = function(tag_name) {
    return function() {
      var arg, args, attributes, inner_fn, inner_tags, k, newv, this_tag, v, _i, _len;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      attributes = check_selectors(args);
      if (typeof args[args.length - 1] === 'function') {
        inner_fn = args.pop();
      }
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        if (typeof arg === 'object') {
          for (k in arg) {
            v = arg[k];
            if (typeof v === 'function') {
              newv = onecup.event_fn(v);
            } else if (typeof v === 'undefined') {
              continue;
            } else if (k === "style") {
              newv = v;
            } else {
              newv = v;
            }
            attributes[k] = newv;
          }
        } else {
          throw Error("invalid tag argument " + (JSON.stringify(arg)) + " of type " + (typeof arg) + " for <" + tag_name + ">");
        }
      }
      this_tag = {
        tag: tag_name,
        attrs: attributes,
        children: null
      };
      levels.push(tags);
      tags = inner_tags = [];
      current_tag = this_tag;
      tag_chain.push(current_tag);
      css_chain.push(make_selectors(current_tag.attrs));
      if (typeof inner_fn === "function") {
        inner_fn();
      }
      tags = levels.pop(tags);
      this_tag.children = inner_tags;
      if (this_tag.attrs.style != null) {
        this_tag.attrs.style = css_def(this_tag.attrs.style);
      }
      tag_chain.pop();
      css_chain.pop();
      current_tag = tag_chain[tag_chain.length - 1];
      return tags.push(this_tag);
    };
  };

  make_css = function(css_name) {
    var css_real_name;
    css_real_name = css_name.replace("_", "-").replace("_", "-");
    return function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (current_rule) {
        current_rule[css_real_name] = args[0];
        return;
      }
      if (current_tag.attrs.style == null) {
        current_tag.attrs.style = {};
      }
      return current_tag.attrs.style[css_real_name] = args[0];
    };
  };

  make_event = function(js_name) {
    return function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return current_tag.attrs[js_name] = onecup.event_fn(args[0]);
    };
  };

  for (_i = 0, _len = HTML_TAGS.length; _i < _len; _i++) {
    tag = HTML_TAGS[_i];
    onecup[tag] = make_tag(tag);
  }

  for (_j = 0, _len1 = CSS_PROPS.length; _j < _len1; _j++) {
    css = CSS_PROPS[_j];
    onecup[css] = make_css(css);
  }

  for (_k = 0, _len2 = JS_EVENT.length; _k < _len2; _k++) {
    js_event = JS_EVENT[_k];
    onecup[js_event] = make_event(js_event);
  }

  onecup.text = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return tags.push({
      special: "text",
      text: args.join("")
    });
  };

  onecup.raw = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return tags.push({
      special: "raw",
      text: args.join("")
    });
  };

  onecup.nbsp = function(n) {
    var i, _l, _results;
    if (n == null) {
      n = 1;
    }
    _results = [];
    for (i = _l = 0; 0 <= n ? _l < n : _l > n; i = 0 <= n ? ++_l : --_l) {
      _results.push(onecup.raw("&nbsp;"));
    }
    return _results;
  };

  onecup.raw_img = onecup.img;

  onecup.img = function() {
    var a, args, kargs, src, _l, _len3;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_l = 0, _len3 = args.length; _l < _len3; _l++) {
      a = args[_l];
      if (a.src != null) {
        kargs = a;
        break;
      }
    }
    if (!kargs) {
      console.error("Image without source", args);
      return;
    }
    src = kargs.src;
    if (window.devicePixelRatio !== 1 && src.indexOf(".png") !== -1 && src.slice(0, 4) !== "http") {
      kargs.src = src.replace(".png", "@2x.png");
    }
    return onecup.raw_img.apply(onecup, args);
  };

  inserted = {};

  onecup.css = function() {
    var args, fn, full_rule_selector, rule_body, rule_css, rule_selector;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length === 2) {
      rule_selector = args[0], fn = args[1];
    } else {
      rule_selector = "";
      fn = args[0];
    }
    if (rule_selector[0] === ":") {
      full_rule_selector = css_chain.join(" ") + rule_selector;
    } else {
      full_rule_selector = css_chain.join(" ") + " " + rule_selector;
    }
    css_chain.push(rule_selector);
    css_rule_chain.push(current_rule);
    current_rule = {};
    fn();
    rule_body = css_def(current_rule);
    current_rule = null;
    if (rule_body) {
      rule_css = full_rule_selector + " {" + rule_body + "}";
      if (inserted[rule_css] !== true) {
        inserted[rule_css] = true;
        document.styleSheets[0].insertRule(rule_css, 0);
      }
    }
    css_chain.pop();
    return current_rule = css_rule_chain.pop();
  };

  onecup["import"] = function() {
    var all, k;
    all = [];
    for (k in onecup) {
      if (k !== "import") {
        all.push("" + k + " = onecup." + k);
      }
    }
    return "var " + all.join(", ") + ";";
  };

  redraw = function(time) {
    var e, new_oml;
    onecup.fn_count = 0;
    onecup.params = parse_url();
    if (!onecup.body) {
      try {
        onecup.body = document.getElementById('onecup');
        if (!onecup.body && document.body) {
          onecup.body = document.body.innerHTML += "<div id='onecup'></div>";
        } else {
          onecup.after(refresh);
          return;
        }
      } catch (_error) {
        e = _error;
        console.log("init", e);
        onecup.after(refresh);
      }
    }
    if (typeof window.body === "function") {
      window.body();
    }
    new_oml = render();
    if (!full_refresh && old_oml) {
      dom_scan(onecup.body, new_oml, old_oml);
    } else {
      onecup.body.innerHTML = '';
      dom_build(onecup.body, new_oml);
      full_refresh = false;
    }
    old_oml = new_oml;
    return typeof onecup.post_render === "function" ? onecup.post_render() : void 0;
  };

  dom_build = function(parent, oml) {
    var elm, _l, _len3;
    for (_l = 0, _len3 = oml.length; _l < _len3; _l++) {
      elm = oml[_l];
      tag_build(elm);
      tag_add(parent, elm);
    }
  };

  tag_add = function(parent, elm) {
    var dom, _l, _len3, _ref, _results;
    if (!(parent != null ? parent.appendChild : void 0)) {
      return;
    }
    elm.parentNode = parent;
    if (elm.dom != null) {
      parent.appendChild(elm.dom);
    }
    if (elm.doms != null) {
      _ref = elm.doms;
      _results = [];
      for (_l = 0, _len3 = _ref.length; _l < _len3; _l++) {
        dom = _ref[_l];
        _results.push(parent.appendChild(dom));
      }
      return _results;
    }
  };

  tag_build = function(elm) {
    var child, dom, k, v, _l, _len3, _ref, _ref1;
    if (elm.special === "raw") {
      dom = document.createElement("span");
      dom.innerHTML = elm.text;
      elm.doms = [];
      _ref = dom.childNodes;
      for (_l = 0, _len3 = _ref.length; _l < _len3; _l++) {
        child = _ref[_l];
        elm.doms.push(child);
      }
      if (elm.doms.length === 0) {
        elm.doms.push(document.createTextNode(""));
      }
    } else if (elm.special === "text") {
      dom = document.createTextNode(elm.text);
      elm.dom = dom;
    } else {
      dom = document.createElement(elm.tag);
      elm.dom = dom;
      _ref1 = elm.attrs;
      for (k in _ref1) {
        v = _ref1[k];
        if (Array.isArray(v)) {
          v = v.join(" ");
        }
        dom.setAttribute(k, v);
      }
      if (elm.children) {
        dom_build(dom, elm.children);
      }
    }
  };

  dom_scan = function(parent, as, bs) {
    var elm, i, scan_length, _l, _m, _n, _ref, _ref1, _ref2, _ref3;
    if ((as == null) && (bs == null)) {
      return;
    } else if (as == null) {
      parent.innerHTML = '';
    } else if (bs == null) {
      dom_build(parent, as);
    } else {
      if (as.length < bs.length) {
        for (i = _l = _ref = as.length, _ref1 = bs.length; _ref <= _ref1 ? _l < _ref1 : _l > _ref1; i = _ref <= _ref1 ? ++_l : --_l) {
          tag_remove(bs[i]);
        }
        scan_length = as.length;
      } else {
        scan_length = bs.length;
      }
      for (i = _m = 0; 0 <= scan_length ? _m < scan_length : _m > scan_length; i = 0 <= scan_length ? ++_m : --_m) {
        tag_scan(as[i], bs[i]);
      }
      if (as.length > bs.length) {
        for (i = _n = _ref2 = bs.length, _ref3 = as.length; _ref2 <= _ref3 ? _n < _ref3 : _n > _ref3; i = _ref2 <= _ref3 ? ++_n : --_n) {
          elm = as[i];
          tag_build(elm);
          tag_add(parent, elm);
        }
      }
    }
  };

  tag_scan = function(a, b) {
    var k, v, _ref, _ref1;
    if (b == null) {
      throw "no tag b";
    } else if ((a.special != null) || (b.special != null)) {
      if (a.special !== b.special || a.text !== b.text) {
        tag_build(a);
        tag_replace(a, b);
      } else {
        if (b.dom != null) {
          a.dom = b.dom;
        } else if (b.doms != null) {
          a.doms = b.doms;
        } else {
          throw "b has no doms";
        }
      }
    } else if (a.tag !== b.tag) {
      tag_build(a);
      tag_replace(a, b);
    } else if (a.attrs.id !== b.attrs.id) {
      tag_build(a);
      tag_replace(a, b);
    } else {
      a.dom = b.dom;
      _ref = a.attrs;
      for (k in _ref) {
        v = _ref[k];
        if (v !== b.attrs[k]) {
          if (k === 'value' && document.activeElement !== a.dom) {
            a.dom.value = v;
          } else if (k === 'style' && IE) {
            a.dom.style = v;
          } else if (k === 'src') {
            a.dom.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D";
            a.dom.src = v;
          } else {
            a.dom.setAttribute(k, v);
          }
        }
      }
      _ref1 = b.attrs;
      for (k in _ref1) {
        v = _ref1[k];
        if (a.attrs[k] == null) {
          a.dom.removeAttribute(k);
        }
      }
      dom_scan(a.dom, a.children, b.children);
    }
  };

  tag_replace = function(a, b) {
    var b_dom, dom, parent, _l, _len3, _ref;
    if (b.dom != null) {
      b_dom = b.dom;
    } else if (b.doms != null) {
      b_dom = b.doms[0];
    } else {
      throw "element b not created";
    }
    parent = b_dom.parentNode;
    if (parent == null) {
      parent = b.parentNode;
      tag_add(parent, a);
      return;
    }
    if (a.dom != null) {
      parent.insertBefore(a.dom, b_dom);
      a.parentNode = parent;
    } else if (a.doms != null) {
      _ref = a.doms;
      for (_l = 0, _len3 = _ref.length; _l < _len3; _l++) {
        dom = _ref[_l];
        parent.insertBefore(dom, b_dom);
      }
      a.parentNode = parent;
    } else {
      throw "element a not created yet";
    }
    return tag_remove(b);
  };

  tag_remove = function(b) {
    var dom, parent, _l, _len3, _ref;
    if (b.dom != null) {
      parent = b.dom.parentNode;
      if (parent) {
        parent.removeChild(b.dom);
      }
    } else if (b.doms != null) {
      parent = b.doms[0].parentNode;
      _ref = b.doms;
      for (_l = 0, _len3 = _ref.length; _l < _len3; _l++) {
        dom = _ref[_l];
        parent.removeChild(dom);
      }
    }
  };

  parse_url = function() {
    var params;
    if (window.location == null) {
      return {};
    }
    params = window.location.search.slice(1);
    return onecup.parse_query_string(params);
  };

  onecup.parse_query_string = function(params) {
    var args, k, pair, v, _l, _len3, _ref, _ref1;
    args = {};
    _ref = params.split("&");
    for (_l = 0, _len3 = _ref.length; _l < _len3; _l++) {
      pair = _ref[_l];
      if (!pair) {
        continue;
      }
      _ref1 = pair.split("="), k = _ref1[0], v = _ref1[1];
      if (v) {
        args[k] = unescape(decodeURI(v.replace(/\+/g, " ")));
      }
    }
    return args;
  };

  onecup.mk_url = function(base, params) {
    var key, part, parts, url, value;
    url = base;
    if (url[url.length - 1] !== "?") {
      url += "?";
    }
    parts = (function() {
      var _results;
      _results = [];
      for (key in params) {
        value = params[key];
        part = "";
        part += key;
        part += "=";
        part += encodeURIComponent(value);
        _results.push(part);
      }
      return _results;
    })();
    return url + parts.join("&");
  };

  onecup.lookup = function(selector) {
    var selectorType;
    selectorType = 'querySelectorAll';
    if (selector.indexOf('#') === 0) {
      selectorType = 'getElementById';
      selector = selector.substr(1, selector.length);
    }
    return document[selectorType](selector);
  };

  setup_new_window = function() {
    onecup.new_page();
    return refresh();
  };

  onecup.goto = window.goto = function(url) {
    track("goto", {
      url: url
    });
    if (url.substr(0, 4) === "http") {
      window.location = url;
      return;
    }
    if (window.self !== window.top) {
      window.open(url);
      return;
    }
    window.history.pushState("", url, url);
    return setup_new_window();
  };

  window.onpopstate = function(event) {
    onecup.scroll_top();
    return setup_new_window();
  };

  onecup.scroll_top = function() {
    try {
      return window.scrollTo(0, 0);
    } catch (_error) {
      return track("scroll_error");
    }
  };

  window.current_view = null;

  window.last_view_params = null;

  window.with_view = function(view_name, params) {
    var _ref;
    if (view_name !== window.current_view) {
      if ((_ref = window.last_view_params) != null) {
        if (typeof _ref.exit === "function") {
          _ref.exit();
        }
      }
      if (params != null) {
        if (typeof params.enter === "function") {
          params.enter();
        }
      }
      window.current_view = view_name;
      refresh();
    }
    return window.last_view_params = params;
  };

  onecup.on_click = function(event) {
    var href, target;
    if (event.ctrlKey || event.metaKey || event.altKey || event.button === 1) {
      return;
    }
    target = event.target;
    href = target.getAttribute("href");
    while (!href) {
      target = target.parentNode;
      if (target.getAttribute == null) {
        return;
      }
      href = target.getAttribute("href");
    }
    if (typeof target.onclick === "function") {
      target.onclick();
    }
    if (href.substr(0, 4) !== "http") {
      goto(href);
      refresh();
      event.preventDefault();
    } else {
      if (target.target == null) {
        track("exit", {
          url: href
        });
        window.location = href;
      } else {
        track("new_window", {
          url: href
        });
      }
    }
    event.stopPropagation();
  };

  window.addEventListener("click", onecup.on_click, true);

  onecup.on_submit = function(event) {
    event.preventDefault();
    return event.stopPropagation();
  };

  window.addEventListener("submit", onecup.on_submit, true);

  window._handler = {};

  onecup.fn_count = 0;

  onecup.event_fn = function(fn) {
    var str_fn;
    str_fn = "window._handler[" + onecup.fn_count + "].apply(null, arguments);";
    window._handler[onecup.fn_count] = function() {
      onecup.track_error.apply(onecup, [fn].concat(__slice.call(arguments)));
      return refresh();
    };
    onecup.fn_count += 1;
    return str_fn;
  };

  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
    return window.setTimeout(callback, 17);
  };

  onecup.after = function(fn) {
    var wrap_fn;
    wrap_fn = function() {
      fn();
      return refresh();
    };
    return setTimeout(wrap_fn, 1);
  };

  needs_refresh_flag = false;

  dont_refresh_this_time = false;

  window.refresh = onecup.refresh = function() {
    var tick;
    if (dont_refresh_this_time) {
      dont_refresh_this_time = false;
      return;
    }
    if (needs_refresh_flag === false) {
      needs_refresh_flag = true;
      tick = function() {
        needs_refresh_flag = false;
        return onecup.track_error(redraw);
      };
      return requestAnimationFrame(tick, 0);
    }
  };

  onecup.no_refresh = function() {
    return dont_refresh_this_time = true;
  };

  onecup.track_error = function() {
    var args, e, fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    try {
      return fn.apply(null, args);
    } catch (_error) {
      e = _error;
      return track('error', {
        type: "handled",
        stack: e.stack,
        message: "" + e
      });
    }
  };

  window.onerror = function(name, file, line, char, e) {
    return track("error", {
      message: e.message,
      type: "unhandled",
      stack: e.stack
    });
  };

  window.onresize = function() {
    return refresh();
  };

  visibilitychange = function() {
    return refresh();
  };

  document.addEventListener("visibilitychange", visibilitychange, false);

  onecup.after(refresh);

}).call(this);