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
  
  data = data || {
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
            type: "onContact",
            object1ID: 1,
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
          }
        ]
      }
    ]
  }
  
  console.log( JSON.stringify( data ) );
  
  player.setCanvas( $( '#playerCanvas' )[0] );
  
  if ( data ) {
  
    player.parse( data );
  
  }
  
}