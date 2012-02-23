describe("Vector", function() {

  var vector = new Vector();

  // beforeEach(function() {
  //   vector = new Vector();
  // });

  it("is 0 after construction", function() {
    
    expect(vector.x).toEqual(0);
    expect(vector.y).toEqual(0);
    
  });

  it("is assigned to (1, -1) in constructor", function() {
    
    vector = new Vector(1, -1);
    
    expect(vector.x).toEqual(1);
    expect(vector.y).toEqual(-1);
    
  });

  it("norm is 5", function() {
    
    vector.set(3, 4);
    expect(vector.norm()).toEqual(5);
    
  });

  it("normSquared is 25", function() {
    
    vector.set(3, 4);
    expect(vector.normSquared()).toEqual(25);
    
  });

});