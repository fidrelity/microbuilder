function editor_main() {
    
  window.App = Ember.Application.create();

  App.main = Ember.View.create({
    templateName: 'templates_main_template'
  });


  App.gameController = GameController.create();

  App.libraryController = LibraryController.create();

  App.gameObjectsController = GameObjectsController.create();
  App.placementController = PlacementController.create();

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

    behaviour: Ember.LayoutState.create({
      route: 'behaviour',
      viewClass: BehaviourView
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

function player_main() {
  
  var player = new Player(),
      data = JSON.parse( window.localStorage.game );
  
  player.setCanvas( $( '#playerCanvas' )[0] );
  
  player.parse( data );
  
}