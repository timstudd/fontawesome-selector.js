(function(){
  'use strict';

  var css = '' +
    '.faSelector {' +
      'width: 200px;' +
      'background-color: #EEE;' +
      'position: absolute;' +
      'padding-top: 30px;' +
      'border-radius: 4px;' +
      'box-shadow: 0 2px 4px rgba(0,0,0,0.5);' +
    '}' +
    '.faSelector .fas-icons {' +
      'width: 100%;' +
      'height: 200px;' +
      'overflow-y: scroll;' +
      'margin: 4px 0;' +
      'background-color: #FFF;' +
      'box-shadow: 0 0 2px rgba(0, 0, 0, 0.3) inset;' +
    '}' +
    '.faSelector button {' +
      'position: absolute;' +
      'top: 5px;' +
      'right: 5px;' +
    '}' +
    '.faSelector .fas-icons i {' +
      'font-size: 20px;' +
      'margin: 5px;' +
      'cursor: pointer;' +
    '}';

  var _proto = {
    getContainer: function(){
      return $('<div class="faSelector"/>');
    },
    getIconsContainer: function(){
      return $('<div class="fas-icons"/>');
    },
    getCloseButton: function(){
      return $('<button class="btn btn-default btn-xs"><i class="fa fa-times"></i></button>').on('click', this.hide.bind(this));
    },
    listen: function(){
      var _this = this;
      $(this.iconsContainer).on('click', 'i', function(){
        var elem = $(this);
        var icon = elem.attr('class').split(' ')[2]; // 0: 'fa', 1: 'fa-fw'
        _this.setSelected(icon);
        _this.updateTargets(icon);
      });
    },
    updateTargets: function(cssClass){
      this.conf.targets.forEach(function(target){
        this.updateTarget(target, cssClass);
      }, this);
    },
    updateTarget: function(target, cssClass){
      if (target.prop('tagName') === 'INPUT') {
        this.updateTargetValue(target, cssClass);
      } else {
        this.updateTargetClass(target, cssClass);
      }
      target.trigger('change').trigger('click'); // Notify listeners of change
    },
    updateTargetValue: function(target, cssClass){
      target.val(cssClass);
    },
    updateTargetClass: function(target, cssClass){
      var targetClasses = [];
      var currClasses = target.attr('class') || '';
      currClasses.split(' ').forEach(function(cssClass){
        if (cssClass.length === 0 || cssClass === 'fa' || cssClass.indexOf('fa-') === 0) {
          return;
        }
        targetClasses.push(cssClass);
      });
      targetClasses = targetClasses.concat(['fa', cssClass]);
      target.attr('class', targetClasses.join(' '));
    },
    setSelected: function(cssClass){
      this.container.attr('data-selected', cssClass);     
    },
    show: function(){
      this.container.show();
    },
    hide: function(){
      this.container.hide();
    },
    createContainer: function(iconSet){
      var closeButton = this.getCloseButton();
      this.container = this.getContainer();
      this.iconsContainer = this.getIconsContainer();
      this.container.append(closeButton);
      this.container.append(this.iconsContainer);
      this.iconsContainer.append(this.getIconObjects());
      $('body').append(this.container);
    },
    positionContainer: function(){
      var elemPosition = this.elem.position();
      this.container.css('top', elemPosition.top + this.elem.outerHeight(true));
      this.container.css('left', elemPosition.left);
    },
    getIconObjects: function(){
      var iconSet = [];
      getIconClasses(this.conf.stylesheet).forEach(function(cssClass){
        iconSet.push('<i class="fa fa-fw ' + cssClass + '"></i>');
      });
      return iconSet;
    },
    fixTargets: function(){
      this.conf.targets.forEach(function(target, i){
        this.conf.targets[i] = $(target);
        if (!target) {
          this.conf.targets.splice(i, 1);
        }
      }, this);
    },
    init: function() {
      if (typeof this.conf !== "object") {
        this.conf = {};
      }

      this.conf.stylesheet = this.conf.stylesheet || 'font-awesome.';
      this.conf.targets = this.conf.targets || [this.elem];
      this.fixTargets();

      this.createContainer();
      this.positionContainer();
      this.listen();
    }
  };

  var iconClasses = {};

  var getStylesheet = function(sel){
    var selector = sel || 'font-awesome.';
    var sheets = document.styleSheets;
    for (var key in sheets){
      var href = sheets[key].href || '';
      if (href.indexOf(selector) >= 0) {
        return sheets[key];
      }
    }
    return null;
  };
  
  var getRuleClasses = function(stylesheet){
    try {
      var rules = stylesheet.cssRules;
    } catch(e){
      console.log('Font Awesome stylesheet must be on the same domain');
      return [];
    }
    var classes = [];
    for (var key in rules) {
      var rule = rules[key].selectorText;
      if (!rule) {
        continue;
      }
      if (rule.indexOf('::before') < 0){
        continue;
      }
      rule = rule.split(',')[0].trim();
      rule = rule.replace('::before', '').replace('.', '');
      classes.push(rule);
    }
    return classes.sort();
  };

  var getIconClasses = function(selector){
    if (selector in iconClasses) {
      return iconClasses[selector];
    }

    var stylesheet = getStylesheet(selector);
    if (!stylesheet) {
      console.log('Font Awesome stylesheet not found');
      return [];
    }

    var classes = getRuleClasses(stylesheet);
    iconClasses[selector] = classes;
    return classes;
  };

  var addStyle = function(){
    var style = $('<style/>').attr('type', 'text/css');
    style.html(css);

    $(($('head,body') || $(document)).get(0)).append(style); // Append to best candidate

    addStyle = function(){}; // Add only once
  };

  function FaSelector(elem, conf) {
    this.elem = elem;
    this.conf = conf;
    this.init();
  }

  FaSelector.prototype = _proto;
  FaSelector.prototype.constructor = FaSelector;

  var newFaSelector = function(conf){
    var instance = this.data('faSelector');
    if (!instance) {
      this.data('faSelector', new FaSelector(this, conf));
    } else {
      instance.show();
    }
  };

  $.fn.faSelector = function(conf){
    addStyle();
    return newFaSelector.call(this, conf);
  };
}(jQuery));