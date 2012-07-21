/*
  PaintController
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
  bgCounter : 0,
  color : "FF0000",    // init Paint color
  toolSize : 2,             // init Paint stroke size
  zoom : 2,             // init Zoom size (background has 1)

  //  
  /*
    Probably moved to  spriteplayer
    playDelay : 200,
    currentFrameIndex : 0,
  */

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

/*
    this.zoomCanvas  = document.getElementById("zoomCanvas");
    this.zoomContext = this.zoomCanvas.getContext("2d");
    this.zoomCanvas.width   = this.spriteSize.width;
    this.zoomCanvas.height  = this.spriteSize.height;

    this.tempCanvas   = $('#canvas-temp');
    this.tempContext  = this.tempCanvas[0].getContext("2d");
    this.tempCanvas[0].width  = this.spriteSize.width;
    this.tempCanvas[0].height = this.spriteSize.height;  
*/  

    // Create and init ZoomModel
    this.zoomModel = ZoomCanvasModel.create({

      width: this.spriteSize.width,
      height: this.spriteSize.height,
      isBackground: this.isBackground

    });
    this.zoomModel.initDomReady();

    // 
    this.colorPicker = ColorPickerModel.create();
    this.colorPicker.initDomReady();

    //
    this.tempCanvas = TempCanvasModel.create();
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

      /*moved 
      this.zoom = 1;  
      
      // Set Size of zoomCanvas wrapper
      var _width = 700;
      var _height = 420;
      areaWrapper.find('#zoom-canvas-area')
        .attr('width', _width).attr('height', _height)
        .css({'max-width' : _width, 'max-height' : _height, 'width' : _width, 'height' : _height});
      */
     
      
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

/* MoveTo ZoomCanvas

    // OnMouse on zoomed canvas
    $('#zoomCanvas').mousedown(function(e){
      App.paintController.mousedown(e);
    });

    $('#zoomCanvas').mousemove(function(e){
      App.paintController.mousemove(e);
    });

    $('#zoomCanvas').mouseup(function(e){
      App.paintController.mouseup(e);
    });

    $('#zoomCanvas').mouseout(function(e){
      App.paintController.mouseup(e);
    });

*/

    // Onclick sprite area
    /* Note: this should be exchanged in the future with emberJs stuff */
    $('.canvas').live('click', function(e) {

      var index = parseInt($(this).attr("data-index"));
      var spriteModel = App.paintController.getCurrentSpriteModelByIndex(index);      

      App.paintController.setCurrentSpriteModel(spriteModel);

    });

/* MovedTo: ColorPickerModel

    $('#colorPicker').ColorPicker({
      onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        return false;
      },
      onHide: function (colpkr) {
        $(colpkr).fadeOut(500);
        return false;
      },
      onChange : function(hsb, hex, rgb){
        App.paintController.colorPicked(hsb, hex, rgb);
      }
    });
    $('#colorPicker').ColorPickerSetColor('FF0000');
*/

    // Slider for pencil size
    $("#sizeSlider").slider({

      value: 2, 
      min: 1,
      max: 20, 
      step: 1,

      change: function( event, ui ) {
        App.paintController.setToolSize(ui.value);
      },

      slide: function( event, ui) {
        $('#slidervalue').html(ui.value);
      }

    });

/* MoveTo: tool_view
    // Init file load
    if (!window.File && !window.FileReader && !window.FileList && !window.Blob) {

      $('#file').remove();

    } else {

      $("#loadFileButton").click(function() { 
        $('#file').trigger("click"); // trigger hidden file field
      });
      
      $('#file').change(function(e) {App.paintController.handleFile(e)});
    }
*/
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
      this.updateZoom(true);
  },

  flipH : function() {

    this.canvasModifier.flipHorizontal(this.zoomContext, this.spriteSize.width, this.spriteSize.height);

    this.clearCurrentSprite(false);
    this.drawToSprite();

  },

  flipV : function() {

    this.canvasModifier.flipVertical(this.zoomContext, this.spriteSize.width, this.spriteSize.height);

    this.clearCurrentSprite(false);
    this.drawToSprite();
   
  },

  rotate : function(_angle) {

    this.canvasModifier.rotate(_angle, this.zoomContext, this.spriteSize.width, this.spriteSize.height);

    this.clearCurrentSprite(false);
    this.drawToSprite();

  },
  
  // Clear current SpriteModel
  clearCurrentSprite : function(clearZoomToo) {

    var clearZoom = clearZoomToo === undefined ? true : false;

    this.getCurrentSpriteModel().clear();

    if(clearZoom)
      this.zoomModel.clear();
      //this.clearZoomCanvas();

  },

  erase : function(_x, _y, _w, _h) {        

    var w = _w || this.toolSize;
    var h = _h || this.toolSize;
    
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

  /* Move this to zoomCanvasModel?? */

  click : function() {
    var options = {sprite: this.getCurrentSpriteModel()};
    this.getCurrentTool().click(options);
  },

  mousedown : function(e) { 
    var coord = this.getMouseCoordinates(e);
    var options = {x: coord.x, y: coord.y, sprite: this.getCurrentSpriteModel()};
    this.getCurrentTool().mousedown(options, this.pixelDrawer);
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
    //if(this.isBackground) this.fillBackground("#FFFFFF");
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

    /*Moved
    this.pixelDrawer.setCanvasContext(this.zoomCanvas);
    this.updateZoom(true);
    */
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

 
/* Rename this to tool size or do own model */

  setToolSize : function(_size) {

    this.toolSize = _size || 1;

  },

  setSpriteSize : function(_obj) {

    this.spriteSize = _obj;

  },


  /*
   Moved to zoomCanvas Model

  fillBackground : function(_color) {
    if(_color) {
      this.zoomContext.fillStyle = _color;
      this.zoomContext.fillRect(0, 0, this.spriteSize.width, this.spriteSize.height);

      //this.getCurrentSpriteModel().context.fillStyle = _color;
      //this.getCurrentSpriteModel().context.fillRect(0, 0, this.spriteSize.width, this.spriteSize.height);

      $('#zoomCanvas').css({'background-image' : 'none'});
    }
  },  
  
  */

  // ---------------------------------------
  // View changing

  // Necessary??
  showPaintView : function() {

    this.set( 'tabState', 'paint' );

  },

  // Necessary??
  showSizeView : function() {

    this.set( 'tabState', 'setSize' );

  },


  // ---------------------------------------

  /* Move to color_picker_model */

  // toggleColorPalette : function(_visible) {
  //   if(_visible)
  //     $('#colorChooser').show(); //palette
  //   else
  //     $('#colorChooser').hide();
  // },
  
  // colorPicked : function (hsb, hex, rgb) {

  //     $('#colorPicker').css('background-color', '#'+hex);
  //     $('#colorPicker').css('background-image', 'none');
  //     $('#colorPicker').ColorPickerSetColor(hex);
      
  //     this.color = hex;
  // },

  // setColor : function(_color) {

  //   var color = _color || "#000000";
  //   this.color = color.substr(0,1) != '#' ? '#' + color : color;

  // },

  getColor : function() {

    return this.colorPicker.color; //this.color;

  }

  // ---------------------------------------
  // Zoom Canvas

  /*
  zoomIn : function() {
    if(this.zoom > 10) return false;
    this.zoom++;    
    this.updateZoom();
  },

  zoomOut : function() {
    if(this.zoomCanvas.style.width === this.spriteSize.width+"px") return false;
    this.zoom--;
    this.updateZoom();
  },

  clearZoomCanvas : function() {    
    this.zoomContext.clearRect(0, 0, this.zoomCanvas.width, this.zoomCanvas.height);
    if(this.isBackground) this.fillBackground("#FFFFFF");
  },

  // Copy zoomCanvas data to current sprite
  drawToSprite : function() {

    var img_data = this.zoomCanvas.toDataURL("image/png");
    var w = this.spriteSize.width;
    var h = this.spriteSize.height;
    
    var img = new Image();
    img.src = img_data;
    img.width = w;
    img.height = h;

    var currentSpriteModel = this.getCurrentSpriteModel();
    img.onload = function() {
      currentSpriteModel.context.drawImage(img, 0, 0, w, h);
      currentSpriteModel.pushState();
    };
    
  },

  setZoomCanvasSize : function () {
    var width  = this.zoom * this.spriteSize.width;
    var height = this.zoom * this.spriteSize.height;
    this.zoomCanvas.style.width     = width +"px";
    this.zoomCanvas.style.height    = height +"px";    
    
    this.tempCanvas[0].style.width  = width + "px";
    this.tempCanvas[0].style.height = height + "px";
  },

  updateZoom : function(clear) {
    this.setZoomCanvasSize();
    if(clear) this.clearZoomCanvas();
    this.zoomContext.drawImage(this.getCurrentSpriteModel().canvas, 0, 0);
  },

  toogleZoomCanvasBg : function() {
    var bgClasses = ['bgTransparent', 'bgWhite', 'bgBlack'];
    this.bgCounter++;
    this.bgCounter = (this.bgCounter > bgClasses.length - 1) ? 0 : this.bgCounter;
    
    var addClass = bgClasses[this.bgCounter];

    var bgToggleButton = $('.bgToggle');
    var zoomCanvas = $("#zoomCanvas");

    $.each(bgClasses, function(k,v) {
      bgToggleButton.removeClass(v);
      zoomCanvas.removeClass(v);
    });
    
    bgToggleButton.addClass(addClass);
    zoomCanvas.addClass(addClass);   
  },
  */

  // ---------------------------------------
  // Temp canvas

  /*

  // Set position of temp canvas and display it over zoomCanvas
  showTempCanvas : function() { 
    
    var canvasObject = $("#zoomCanvas");    
 
    var newLeft = $("#zoom-canvas-area")[0].scrollLeft + canvasObject.position().left,
        newTop = $("#zoom-canvas-area")[0].scrollTop + canvasObject.position().top;

    this.tempCanvas.css({     
                            left: newLeft,
                            top: newTop,
                            width: canvasObject.width(),
                            height: canvasObject.height()
                        }).show();
  },

  hideTempCanvas : function() {
    this.tempCanvas.hide();
    this.pixelDrawer.setCanvasContext(this.zoomCanvas);
  },

  */

  drawToSprite : function() {

    this.getCurrentSpriteModel().drawTo();

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

      /*
        var w = App.paintController.zoomCanvas.width;
        var h = App.paintController.zoomCanvas.height;
      */
        var w = App.paintController.spriteSize.width;
        var h = App.paintController.spriteSize.height;
        var img = new Image;
        
        img.width = w;
        img.height = h;

        img.onload = function() {
          /*
          App.paintController.zoomContext.drawImage(img, 0,0, w, h);      
          App.paintController.drawToSprite();
          */

          App.paintController.zoomModel.context.drawImage(img, 0,0, w, h);      
          App.paintController.getCurrentSpriteModel().drawTo();
        };

        img.src = event.target.result;

    };

    reader.readAsDataURL(e.target.files[0]);
  }

});
