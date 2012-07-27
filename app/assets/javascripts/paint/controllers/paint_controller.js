/*
  PaintController

  Fix:
    - Fix: SelectTool in BG
    - Fix: FlipVH in BG
    - Fix: Remove sprite

  Refactor:
    - Save image to savemodel    

*/
var PaintController =  Ember.ArrayController.extend({

  graphic : null,

  //
  content : [],         // contains sprite models
  mode : null,          // [ 'graphic', 'background' ]
  tabState : 'paint',   // Different views [ 'paint', 'setSize' ]

  //
  spriteSize : null,    // Object {width: , height: }
  currentSprite : null, // type of spriteModel
  spriteWrapper : 'sprites-area-scroll', // 'sprites-area',
  spriteCounter : 0,    // spriteModel.index
  LIMIT : 8,            // Limit of sprites
  type : null,          // background or object
  isBackground : false,
  
  //
  strokeSize : 2,          // init stroke size (thickness for draw tools)

  init : function() {

    this.spriteSize = { width: 64, height: 64 };

    this.pixelDrawer = new PixelDrawer();
    this.canvasModifier = CanvasModifierModel.create();

  },

  // Loaded when type of sprite is selected
  initType : function(_type, _width, _height) {

    this.type = _type || 'object';

    this.setSpriteSize({ width: _width, height: _height });

  },

  // Called when Paint_View init (after dom ready)
  initView : function() {

    this.isBackground = this.type === 'background' ? true : false; 

    // Create and init ZoomModel
    this.zoomModel = ZoomCanvasModel.create({

      width: this.spriteSize.width,
      height: this.spriteSize.height,
      isBackground: this.isBackground

    });
    this.zoomModel.initDomReady();

    // 
    // this.colorPicker = ColorPickerModel.create();
    // this.colorPicker.initDomReady();

    //
    this.tempCanvas = TempCanvasModel.create({
      width: this.spriteSize.width,
      height: this.spriteSize.height
    });
    this.tempCanvas.initDomReady();
    
    //
    this.handleType();

    this.add();
    this.finalCanvas = $('#canvas-merged');
    this.initEvents();

  },

  // React if type is background or sprite
  handleType : function() {

    var areaWrapper = $('#area-wrapper');
    
    this.zoomModel.handleType();

    // *** Type is background ***
    if(this.type === 'background') {

      this.spriteSize.width = this.zoomModel.width;
      this.spriteSize.height = this.zoomModel.height;
      
      // Hide unnecessary buttons and divs
      App.spritePlayer.hide();

      areaWrapper.find('#sprites-area').hide();
      $('#copySpriteButton').hide();
      $('#clearSpritesButton').remove();
      $('#removeSpriteButton').remove();
      $('.bgToggle').remove();
    }


  },

  // Init DOM events
  initEvents : function() {
    
    // Key Events
    $(document).keyup(function(e) {
      if(e.keyCode === 17) this.isCtrl=true;
    });

    $(document).keydown(function(e) {

        var that = App.paintController;

        if(e.keyCode === 17) this.isCtrl = true;

        // Ctrl + Z
        if(e.keyCode === 90 && this.isCtrl) {
          that.undo();
        }        

        // Escape
        if(e.keyCode === 27) {
          try {
            that.getCurrentTool().reset();
          } catch(e) {
            console.log("Reset method does not exists for current tool");
          }
        } 
    });


    // Onclick sprite area
    /* Note: this should be exchanged in the future with emberJs stuff */
    $('.canvas').live('click', function(e) {

      var index = parseInt($(this).attr("data-index"));
      var spriteModel = App.paintController.getCurrentSpriteModelByIndex(index);      

      App.paintController.setCurrentSpriteModel(spriteModel);

    });


    // Slider for pencil size
    $("#sizeSlider").slider({

      value: 2, 
      min: 1,
      max: 20, 
      step: 1,

      change: function( event, ui ) {
        App.paintController.setStrokeSize(ui.value);
      },

      slide: function( event, ui) {
        $('#slidervalue').html(ui.value);
      }

    });


    // Init file load
    if (!window.File && !window.FileReader && !window.FileList && !window.Blob) {

      $('#file').remove();

    } else {

      $("#loadFileButton").click(function() { 
        $('#file').trigger("click"); // trigger hidden file field
      });
      
      $('#file').change(function(e) {App.paintController.handleFile(e)});
    }

  },

  // ---------------------------------------
  // Save
  save : function() {

    var imageTitle = $("#imageName").val();
    var makePublic = $("#makePublic").is(":checked") ? 1 : 0;

    var count = this.content.length;
    var width = this.spriteSize.width;
    var totalWidth = count * width;
    var height = this.spriteSize.height;

    var isBackground = this.type === 'background' ? true : false;
    
    if(!imageTitle || !count) {alert("Image has no name!");return false;}

    Notifier.showLoader("Saving your image ...");

    this.finalCanvas.attr('width', totalWidth).attr('height', height).show();
    var canvas = this.finalCanvas[0];
    var context = canvas.getContext('2d');

    // Merge sprites into final canvas
    for (var i = 0; i < this.content.length; i++) {
      var area = this.content[i];
      var xPos = i * width;
      context.drawImage(area.canvas, xPos, 0);
    };
    
    // Push to Server
    var imgData = this.finalCanvas[0].toDataURL("image/png");

    $.ajax({
      url: "/graphics",
      type: "post",
      data: { 
        graphic: {
          name : imageTitle,
          image_data: imgData,
          frame_count: count,
          frame_width: width,
          frame_height: height,
          public : makePublic,
          background : isBackground,
        },
      },
      
      success : function( data ) {
        App.paintController.goToTypeSelection(false);
        Notifier.hideLoader();
      },

      error : function() {
        Notifier.hideLoader();
      }
      
    });    
    //this.stop();
  },

  // ---------------------------------------
  reset : function(_ask) {

    if(_ask) {
      var ok = confirm("Remove all sprites and reset paint editor?");
      if(!ok) return false;
    }
    
    for (var i = this.content.length - 1; i >= 0; i--) {
      this.remove(this.content[i]);
    };

    this.spriteCounter = 0;
    //this.zoom = this.isBackground ? 1 : 2; /* MovedTo: zoomCanvasModel.reset()*/
    this.set('content', []);

    this.zoomModel.reset();

  },

  // Resets paint and shows paintSizeView
  goToTypeSelection : function (_ask) {   

    if(_ask === true || typeof(_ask) === "object") {
      var ok = confirm("Delete all and go back to type selection?");
      if(!ok) return false;
    }
        
    this.reset();

    App.paintView.remove();
    App.paintSizeView.appendTo('#content');

  },


  // ---------------------------------------
  // Sprite Actions

  // Undo current SpriteModel
  undo : function() {

    this.getCurrentSpriteModel().popState();

    if(this.isBackground)
      this.zoomModel.context.drawImage(this.getCurrentSpriteModel().canvas, 0, 0);
    else
      this.zoomModel.updateZoom(true);
  },

  flipH : function() {

    this.canvasModifier.flipHorizontal(this.zoomModel.context, this.spriteSize.width, this.spriteSize.height);

    this.clearCurrentSprite(false);
    this.drawToSprite();

  },

  flipV : function() {

    this.canvasModifier.flipVertical(this.zoomModel.context, this.spriteSize.width, this.spriteSize.height);

    this.clearCurrentSprite(false);
    this.drawToSprite();
   
  },

  rotate : function(_angle) {

    this.canvasModifier.rotate(_angle, this.zoomModel.context, this.spriteSize.width, this.spriteSize.height);

    this.clearCurrentSprite(false);
    this.drawToSprite();

  },
  
  // Clear current SpriteModel
  clearCurrentSprite : function(clearZoomToo) {

    var clearZoom = clearZoomToo === undefined ? true : false;

    this.getCurrentSpriteModel().clear();

    if(clearZoom)
      this.zoomModel.clear();

  },

  erase : function(_x, _y, _w, _h) {        

    var w = _w || this.strokeSize;
    var h = _h || this.strokeSize;
    
    if(!this.isBackground) {

      this.zoomModel.eraseArea(_x, _y, w, h);
      //Moved: this.zoomContext.clearRect(_x, _y, w, h);

    } else {

      // Draw white rect if background
      this.pixelDrawer.popImageData();
      this.pixelDrawer.fillRect(_x, _y, _x + w, _y + h, "#FFFFFF");
      this.pixelDrawer.pushImageData();

    }

    // Erase on current SpriteModel
    this.getCurrentSpriteModel().erase(Math.floor(_x), Math.floor(_y), w, h);
  },

  // ---------------------------------------
  // onMouseZoomCanvas Delegate events to current Tool

  click : function() {
    var options = {sprite: this.getCurrentSpriteModel()};
    this.getCurrentTool().click(options);
  },

  mousedown : function(e) { 
    var coord = this.getMouseCoordinates(e);
    var options = {x: coord.x, y: coord.y, sprite: this.getCurrentSpriteModel()};
    this.getCurrentTool().mousedown(options);
  },

  mousemove : function(e) {    
    var coord = this.getMouseCoordinates(e);
    var options = {x: coord.x, y: coord.y, sprite: this.getCurrentSpriteModel()};
    this.getCurrentTool().mousemove(options);
  },

  mouseup : function(e) {
    var coord = this.getMouseCoordinates(e);
    var options = {x: coord.x, y: coord.y, sprite: this.getCurrentSpriteModel()};
    this.getCurrentTool().mouseup(options);
  },

  // ---------------------------------------  
  // SpriteModel

  // Add new spriteModel
  add : function(copy) {

    if(this.content.length >= this.LIMIT) return false;
    var copyData = copy ? this.getCurrentSpriteModel().context.getImageData(0, 0, this.spriteSize.width, this.spriteSize.height) : null;
    
    var spriteModel = SpriteModel.create({

      index:    this.spriteCounter++,
      width:    this.spriteSize.width,
      height:   this.spriteSize.height,
      wrapper:  this.spriteWrapper,
      imgData : copyData

    });

    this.addObject(spriteModel);

    spriteModel.initView();
    $('.canvas').css({width: this.spriteSize.width, height: this.spriteSize.height});
    this.setCurrentSpriteModel(spriteModel);

    // Draw white background
    if(this.isBackground) this.zoomModel.fillBackground("#FFFFFF");

    if(copy) this.getCurrentSpriteModel().pushState();

    //this.updateZoom(true);
    this.zoomModel.updateZoom(spriteModel, true);

  },

  remove : function(_spriteModel) {

    if(this.content.length === 0) return false;

    var spriteModel = _spriteModel || this.getCurrentSpriteModel();

    this.removeObject(spriteModel);

    $("#" + spriteModel.id).remove();
    //this.content.splice(spriteModel.index, 1);
    //console.log("after del", this.content.length, spriteModel);
    // set currentSpriteModel

  },

  // Removes current sprite
  removeCurrent : function() {

    if(this.isBackground) return false;

    
    if(this.content.length === 1) {

      this.clearCurrentSprite();

    } else {

      this.remove(this.getCurrentSpriteModel());
      this.setCurrentSpriteModel(this.content[this.content.length - 1]);

    }

  },

  // ---------------------------------------
  // Getter And Setter
  setCurrentSpriteModel : function(spriteModel) {

    if(!spriteModel || typeof(spriteModel) !== 'object') return false;

    this.set('currentSprite', spriteModel);
    spriteModel.highlight();

    this.pixelDrawer.setCanvasContext(this.zoomModel.canvas);
    this.zoomModel.updateZoom(spriteModel, true);
    
  },

  getCurrentSpriteModel : function() {

    return this.get('currentSprite');

  },

  getCurrentSpriteModelByIndex : function(_index) {

    for (var i = 0; i < this.content.length; i++) {

      var spriteModel = this.content[i];
      if(spriteModel.index === _index)
        return spriteModel;

    };

    return null;

  },

  getCurrentTool : function() {

    return App.toolBoxController.getCurrentTool();

  },
 
  setStrokeSize : function(_size) {

    this.strokeSize = _size || 1;

  },

  getStrokeSize : function() {

    return this.strokeSize;

  },

  setSpriteSize : function(_obj) {

    this.spriteSize = _obj;

  },


  // ---------------------------------------
  // View changing

  getColor : function() {

    return '#000'; //this.colorPicker.color;

  },

  // ---------------------------------------

  drawToSprite : function(canvas) {

    this.getCurrentSpriteModel().drawTo(this.zoomModel.canvas);

  },

  hideTempCanvas : function() {

    this.tempCanvas.hide();
    this.pixelDrawer.setCanvasContext(this.zoomModel.canvas);

  },
  
  // ---------------------------------------
  // Helper

  getMouseCoordinates : function(e) {

    var zoomCanvas = this.zoomModel.domObj; //$('#zoomCanvas');
      
    var x = e.pageX - zoomCanvas.offset().left;
    var y = e.pageY - zoomCanvas.offset().top;
 
    x = Math.floor(x / this.zoomModel.zoom);
    y = Math.floor(y / this.zoomModel.zoom);

    return {x: x, y: y};

  },

  // Loads file from hard drive to canvas
  handleFile : function(e) {

    var goon = confirm("This will overwrite your current canvas. Proceed?");
    if(!goon) return false;

    reader = new FileReader;

    reader.onload = function(event) {

      var w = App.paintController.spriteSize.width;
      var h = App.paintController.spriteSize.height;
      var img = new Image;
      
      img.width = w;
      img.height = h;

      img.onload = function() {
        
        App.paintController.zoomModel.context.drawImage(img, 0,0, w, h);      
        App.paintController.getCurrentSpriteModel().drawTo(App.paintController.zoomModel.canvas);

      };

      img.src = event.target.result;

    };

    reader.readAsDataURL(e.target.files[0]);
  }

});
