function editor_main() {
    
  window.App = Ember.Application.create();

  App.main = Ember.View.create({
    templateName: 'templates_main_template'
  });


  App.gameController = GameController.create();

  App.libraryController = LibraryController.create();

  App.gameObjectsController = GameObjectsController.create();
  App.placementController = PlacementController.create();

  App.paintController = PaintController.create();

  App.behaviourController = BehaviourController.create();


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

    action: Ember.LayoutState.create({
      route: 'action',
      viewClass: ActionView
    }),

    triggerState: Ember.LayoutState.create({
      route: 'trigger',
      viewClass: TriggerView
    }),

    library: Ember.LayoutState.create({
      route: 'library',
      viewClass: LibraryView
    }),
    
    goToLocation: function( routeName ) {
      
      window.location.hash = routeName;
      
    }
  
  });


  App.main.appendTo('#content');

};

function player_main( data ) {
  
  var player = new Player();
  
  console.log(data);
  
  player.setCanvas( $( '#playerCanvas' )[0] );
  
  player.parse( data );
  
}