describe("Vector", function() {

  var vector = new Vector();

  // beforeEach(function() {
  //   vector = new Vector();
  // });

  it("empty constructor", function() {
    
    expect(vector.x).toEqual(0);
    expect(vector.y).toEqual(0);
    
  });

  it("constructor assignment", function() {
    
    vector = new Vector(1, -1);
    
    expect(vector.x).toEqual(1);
    expect(vector.y).toEqual(-1);
    
  });

  it("set", function() {
    
    vector.set(3, -5);
    
    expect(vector.x).toEqual(3);
    expect(vector.y).toEqual(-5);
    
  });

  it("copy", function() {
    
    vector.set(3, -5);
    
    var vec = new Vector();
    
    vec.copy(vector);
    
    expect(vec.x).toEqual(vector.x);
    expect(vec.y).toEqual(vector.y);
    
    vec.x = 2;
    
    expect(vec.x).not.toEqual(vector.x);
    
  });

  it("clone", function() {
    
    vector.set(3, -5);
    
    var vec = vector.clone();
    
    expect(vec.x).toEqual(vector.x);
    expect(vec.y).toEqual(vector.y);
    
    vec.x = 2;
    
    expect(vec.x).not.toEqual(vector.x);
    
  });

  it("normSquared", function() {
    
    vector.set(3, 4);
    expect(vector.normSquared()).toEqual(25);
    
  });

  it("norm", function() {
    
    vector.set(3, 4);
    expect(vector.norm()).toEqual(5);
    
  });

  it("normalize", function() {
    
    vector.set(-13, 13);
    vector.normalizeSelf();
    
    expect(vector.norm()).toEqual(1);
    
  });

});