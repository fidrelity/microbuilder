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
  color : "#000000",

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
    this.getCurrentSpriteModel().popState();
  },

    // Undo current SpriteModel
  clearCurrentSprite : function() {
    this.getCurrentSpriteModel().clear();
  },

  // ---------------------------------------
  // onMouseZoomCanvas Delegate events to current Tool
  click : function() {
    var options = { sprite: this.getCurrentSpriteModel() };
    this.getCurrentTool().click(options);
  },

  mousedown : function(e) {    
    var coord = this.getMouseCoordinates(e);
    var options = { x: coord.x, y: coord.y, sprite: this.getCurrentSpriteModel()};
    this.getCurrentTool().mousedown(options, this.pixelDrawer);
  },

  mousemove : function(e) {    
    var coord = this.getMouseCoordinates(e);
    var options = { x: coord.x, y: coord.y, sprite: this.getCurrentSpriteModel() };
    this.getCurrentTool().mousemove(options);
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

  setColor : function(_color) {
    var color = _color || "#000000";
    this.color = color.substr(0,1) != '#' ? '#' + color : color;
  },

  // ---------------------------------------
  showPaintView : function() {
    this.set( 'tabState', 'paint' );
  },

  showSizeView : function() {
    this.set( 'tabState', 'setSize' );
  },

  // ---------------------------------------
  zoomIn : function() {
    this.zoomTool.zoomIn();
  },

  zoomOut : function() {
    this.zoomTool.zoomOut();
  },

  // ---------------------------------------
  // Helper
  getMouseCoordinates : function(e) {
    var zoomCanvas = this.zoomTool.zoomCanvas;
    var x = e.pageX - zoomCanvas.offset().left;
    var y = e.pageY - zoomCanvas.offset().top;

    x = Math.floor(x / this.zoomTool.gridSize);
    y = Math.floor(y / this.zoomTool.gridSize);

    return { x: x, y: y };
  }

});