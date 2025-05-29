require(['baja!', 'bajaux/events', 'nmodule/sbidcnew/rc/sbidcnew', 'jquery', 'nmodule/sbidcnew/rc/SbidcnewWidget', 'hbs!nmodule/sbidcnew/rc/template/sbidcnew'], function (baja, events, sbidcnew, $, SbidcnewWidget, template) {
  'use strict';

  $("#template").html(template({
    virtues: sbidcnew.extolVirtues()
  }));
  var widget = new SbidcnewWidget(),
    comp = baja.$('baja:Component', {
      'meritorious': true,
      'superb': true,
      'resplendent': true,
      'sublime': true,
      'magnificent': true
    });
  var widgetDiv = $('#widget'),
    description = $('#description');
  widget.initialize(widgetDiv).then(function () {
    widgetDiv.on(events.MODIFY_EVENT, function () {
      widget.read().then(function (value) {
        description.text(value);
      })["catch"](baja.error);
    });
    return widget.load(comp);
  })["catch"](baja.error);
});
