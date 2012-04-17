/*
  PaintController
  
  - manages the graphic being saved
*/
var PaintController =  Ember.ArrayController.extend({

  graphic : null,
  //
  content : [],       // sprites
  mode : null,        // [ 'graphic', 'background' ]
  tabState : 'paint',  // Different views [ 'paint', 'setSize' ]
  spriteSize : null,
  currentSprite : null,
  currentTool : null,
  spriteWrapper : 'paints',

  //
  init : function() {
    this.spriteSize = { width: 64, height: 64};
    // Add first Sprite
    //this.addObject(SpriteModel.create({ id: 0, width: this.spriteSize.width, height: this.spriteSize.height, wrapper: this.spriteWrapper }));
    //this.toolBox = ToolBox.create();
  },

  // Should be called when Paint_View called
  initView : function() {
    // Switch
      // isBackground
      // setImageSize
  },

  // ---------------------------------------
  save : function() {

  },

  reset : function() {
    // delete all sprites except first 
    // clear first one
    // 
  },

  // Undo current SpriteModel
  undo : function() {

  },

  // ---------------------------------------  
  add : function() {
    this.addObject(SpriteModel.create({ id: this.content.length, width: this.spriteSize.width, height: this.spriteSize.height, wrapper: this.spriteWrapper }));
  },

  // ---------------------------------------  
  // Getter And Setter
  setCurrentSpriteModel : function(spriteModel) {
    this.set('currentSprite', spriteModel);
  },

  getCurrentSpriteModel : function() {
    return this.content[this.currentSprite];
  },

  getCurrentTool : function() {
    return App.ToolBox.getCurrentTool();
  },

  // ---------------------------------------
  showPaintView : function() {
    this.set( 'tabState', 'paint' );
  },
  
  showSizeView : function() {    
    this.set( 'tabState', 'setSize' );    
  },


});