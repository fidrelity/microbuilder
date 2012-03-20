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


var player;

function player_main( data ) {
  
  player = new Player();
  
  data = {
    background:"/assets/preview.png",
    gameObjects:[
      {
        ID: 0,
        name:"Luigi",
        imagePath:"/assets/luigi.png",
        position: {
          x:533,
          y:228
        }
      },{
        ID: 1,
        name:"Raidel",
        imagePath:"https://s3.amazonaws.com/mbgfx/app/public/graphics/7/4_1331553640.png",
        position: {
          x:20,
          y:328
        }
      }
    ],
    behaviours:[
      {
        triggers:[
          {
            type: "onStart"
          }
        ],
        actions:[
          {
            type: "moveTo",
            gameObjectID: 0,
            // targetID: 1
            target:{
              x:0,
              y:0
            }
          },{
            type: "moveTo",
            gameObjectID: 1,
            targetID: 0
            // target:{
            //   x:333,
            //   y:128
            // }
          }
        ]
      }
      // ,{
      //   triggers:[],
      //   actions:[]
      // },{
      //   triggers:[],
      //   actions:[]
      // }
    ]
  }
  
  console.log( JSON.stringify( data ) );
  
  player.setCanvas( $( '#playerCanvas' )[0] );
  
  if ( data ) {
  
    player.parse( data );
  
  }
  
}