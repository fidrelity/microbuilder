PlacementView = Ember.View.extend({
    elementId: 'placement',
    templateName: 'templates_placement_template',
    didInsertElement: function(){
       this.$('.draggable').draggable({containment: '#previewCanvas', scroll: false});
    }
});