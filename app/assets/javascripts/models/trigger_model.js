var TriggerModel = Ember.Object.extend({
  
  type : null // click, contact, time, win/lose
  
});

var ClickTriggerModel = TriggerModel.extend({
  
  type : 'click',
  
  area : null,
  object : null
  
});
