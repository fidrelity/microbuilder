var EditorController = Ember.ArrayController.extend({

  content : [],

  addObject : function( name, pos ) {
    
    console.log( name );
    
    this.pushObject( GameObjectModel.create({ 'name' : name, 'pos' : pos }) );
    
  },
  
  removeObject : function( item ) {
    
    console.log( item );
    
    return this._super( item );
    
  }

    // fsm: null,
    // 
    // rootView: Ember.View.create({
    //   templateName : 'templates_main_template'
    // }),
    // 
    // behaviourController: null,
    // libraryController: null,
    // paintController: null,
    // 
    // init: function() {
    //     
    //     console.log('initEditorContr');
    //     
    //     var self = this;
    //     
    //     this.fsm = Ember.StateManager.create({
    //       
    //         rootView : this.rootView,
    //         
    //         initialState : 'general',
    //         
    //         general: Ember.LayoutState.create({
    //             viewClass: GeneralView
    //         }),
    //         
    //         library: Ember.LayoutState.create({
    //             viewClass: LibraryView
    //         }),
    //         
    //         placement: Ember.LayoutState.create({
    //             viewClass: PlacementView
    //         }),
    //         
    //         behaviour: Ember.LayoutState.create({
    //             viewClass: BehaviourView
    //         }),
    //         
    //         paint: Ember.LayoutState.create({
    //             viewClass: PaintView
    //         })
    //         
    //     });
    // 
    // }
})