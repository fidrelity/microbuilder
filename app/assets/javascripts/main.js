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
  
  App.triggerController = TriggerController.create();
  App.actionController = ActionController.create();


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
  
  setTimeout( function() {
  
    App.gameController.placeGraphic( App.libraryController.get( 'content' )[0], new Vector( 100, 100 ) );
    App.gameController.placeGraphic( App.libraryController.get( 'content' )[1], new Vector( 400, 100 ) );
    
    App.gameController.updatePlayer();
  
  }, 100 );

};


var player;

function player_main( data ) {
  
  player = new Player();
  
  data = data || {
    background:"/assets/preview.png",
    graphics:[
      {
        ID:0,
        frameCount:1,
        imagePath:"/assets/luigi.png"
      },{
        ID:1,
        frameCount:1,
        imagePath:"https://s3.amazonaws.com/mbgfx/app/public/graphics/7/4_1331553640.png"
      },{
        ID:2,
        frameCount:1,
        imagePath:"/assets/mario.png"
      }
    ],
    gameObjects:[
      {
        ID: 0,
        name:"Luigi",
        graphicID:0,
        position: {
          x:533,
          y:228
        }
      },{
        ID: 1,
        name:"Raidel",
        graphicID:1,
        position: {
          x:220,
          y:228
        }
      }
    ],
    behaviours:[
      {
        triggers:[
          {
            type: "onClick",
            objectID: 1
          }
        ],
        actions:[
          {
            type: "moveIn",
            objectID: 0,
            angle: Math.PI / -4 * 3
          },
          {
            type: "moveTo",
            objectID: 1,
            targetID: 0
          }
        ]
      },
      {
        triggers:[
          {
            type: "onClick",
            objectID: 0
          }
        ],
        actions:[
          {
            type: "win"
          }
        ]
      },
      {
        triggers:[
          {
            type: "onContact",
            objectID: 1,
            object2ID: 0
          }
        ],
        actions:[
          {
            type: "moveIn",
            objectID: 0,
            angle: 0
          },
          {
            type: "jumpTo",
            objectID: 1,
            target: {
              x : 100,
              y : 100
            }
          },
          {
            type: "changeArt",
            objectID:1,
            graphicID:2,
          }
        ]
      }
    ]
  }
  
  // console.log( JSON.stringify( data ) );
  
  if ( $( '#playerCanvas' ) && $( '#playerCanvas' )[0] ) {
  
    player.setCanvas( $( '#playerCanvas' )[0] );
  
    if ( data ) {
  
      player.parse( data );
  
    }
    
  }
  
}