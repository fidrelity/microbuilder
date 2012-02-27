var toServer = function() {
  var dataUrl = document.getElementById('canvas').toDataURL("image/png");

  
  $.post("users/1/assets/", 
    { asset: {
        name: "dummy",
        states: {
          0: {
           image_data: dataUrl,
            content_type: "image/png",
            original_filename: "dummy.png"
          }     
        }
      }
    },
    
     function(data) {
       console.log("Data Loaded: " + data);
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
