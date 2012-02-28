EditorController = Ember.Object.extend({
    fsm: null,
    
    behaviourController: null,
    libraryController: null,
    paintController: null,
    
    generalView: null,
    libraryView: null,
    placementView: null,
    behaviourView: null,
    paintView: null,
    
    text: 'Editor_controller_text',
    
    init: function() {
        
        console.log('initEdContr');
        
        var self = this;
        
        this.generalView = GeneralView.create();
        this.libraryView = LibraryView.create();
        this.placementView = PlacementView.create();
        this.behaviourView = BehaviourView.create();
        this.paintView = PaintView.create();
        
        this.view = GeneralView;
        
        this.fsm = Ember.StateManager.create({

            rootElement: '#editor_content',

            initialState: 'general',

            states: {
                general: Ember.ViewState.create({
                    view: self.generalView,
                    state: Ember.State.create()
                }),
                library: Ember.ViewState.create({
                    view: self.libraryView,
                    state: Ember.State.create()
                }),
                placement: Ember.ViewState.create({
                    view: self.placementView,
                    state: Ember.State.create()
                }),
                behaviour: Ember.ViewState.create({
                    view: self.behaviourView,
                    state: Ember.State.create()
                }),
                paint: Ember.ViewState.create({
                    view: self.paintView,
                    state: Ember.State.create()
                })
            }
        });
    
    }
})