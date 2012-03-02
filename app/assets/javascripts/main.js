function editor_main() {
   
   window.App = Ember.Application.create();
    
    // The top level layout
    App.main = Ember.View.create({
      templateName: 'templates_main_template'
    });
    
    GameObjectView = Ember.View.extend({
      
      removeItem: function() {
        
        var person = this.get( 'person' );
        App.editorController.removeObject( person );
        
      }
      
    });
    
    App.editorController = EditorController.create();
    
    App.editorController.addObject( 'ebsi', new Vector(1, 2) );
    App.editorController.addObject( 'chad', new Vector(5, 3) );
    
    App.routeManager = Ember.RouteManager.create({
      
      rootView: App.main,
      
      general: Ember.LayoutState.create({
        viewClass: GeneralView
      }),
   
      paint: Ember.LayoutState.create({
        route: 'paint',
        viewClass: PaintView
      }),
   
      placement: Ember.LayoutState.create({
        route: 'placement',
        viewClass: PlacementView
      }),
   
      behaviour: Ember.LayoutState.create({
        route: 'behaviour',
        viewClass: BehaviourView
      }),
   
      library: Ember.LayoutState.create({
        route: 'library',
        viewClass: LibraryView
      })
      
   });

   App.main.appendTo('#content');

};