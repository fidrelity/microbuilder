function editor_main() {

  window.App = Ember.Application.create();

  App.game = GameModel.create();
  App.gameController = GameController.create();
  
  App.libraryController = LibraryController.create();

  App.gameObjectsController = GameObjectsController.create();
  App.behaviourController = BehaviourController.create();
  
  App.triggerController = TriggerController.create();
  App.actionController = ActionController.create();

  App.mainView = MainView.create();
  App.mainView.appendTo('#content');
  
  setTimeout( function() {
  
    App.gameController.selectGraphic( App.libraryController.get( 'content' )[0] );
    App.gameController.selectGraphic( App.libraryController.get( 'content' )[1] );
    
    App.mainView.hideOverlay();
    
    App.mainView.stageView.player.parse( App.game.getData().game );
  
  }, 100 );

};

function paint_main() {
  
  window.App = Ember.Application.create();
  
  App.paintController = PaintController.create();  
  App.pencilTool = PencilToolModel.create();
  
  App.toolBoxController = ToolBoxController.create();
  App.drawTool = DrawToolModel.create();
  
  App.paintView = PaintView.create();
  App.paintView.appendTo('#content');
  
};

function player_main( data ) {
  
  window.player = new Player();
  
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
    //player.debug();
  
    if ( data ) {
  
      player.parse( data );
  
    }
    
  }
  
}