var PlacementView = Ember.View.extend({

  templateName: 'templates_placement_template',
  
  didInsertElement: function(){
    
    this.$('.draggable').draggable({ containment: '#previewCanvas', scroll: false });
    
  }

});