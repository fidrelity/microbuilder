var toServer = function() {
  var dataUrl = document.getElementById('canvas').toDataURL("image/png");
 
  $.ajax({
    url: "graphics/",
    type: "post",
    success: function(data) {
       console.log("Data Loaded: " + data);
    },
    data: { graphic: {
        image_data: dataUrl,
        frame_count: 0,
        frame_width: 120,
        frame_height: 120
      },
    }
  });
};

function draw(){  
  var canvas = document.getElementById('canvas');  
  if (canvas.getContext){  
    var ctx = canvas.getContext('2d');  
  
    ctx.fillRect(25,25,100,100);  
    ctx.clearRect(45,45,60,60);  
    ctx.strokeRect(50,50,50,50);  
  }  
}  

$(document).ready(function(){
  draw();
  
  $("#save_button").click(function(){
    toServer();
  });
});
