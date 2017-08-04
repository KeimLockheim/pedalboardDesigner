angular.module('pedalboardDesignerApp').factory('PedalboardService', function() {

  var service = {};

  service.deepCopyPedal = function (pedalObject){
    var copiedPedal = {};
    copiedPedal.name = pedalObject.name;

    copiedPedal.potentiometers =[];

    pedalObject.pots.forEach(function (pot) {
        copiedPedal.potentiometers.push({name:pot.name, value:pot.value});

        
        
    })
    copiedPedal.switch = false;

    return copiedPedal;
  }

  service.detectMIDIDevice = function (scope, devices){
    scope.devices = [];

        devices
            .connect()
            .then(function(access) {
                if('function' === typeof access.inputs) {
                    // deprecated
                    scope.devices = access.inputs();
                    console.error('Update your Chrome version!');
                } else {
                    if(access.inputs && access.inputs.size > 0) {
                        var inputs = access.inputs.values(),
                            input = null;

                        // iterate through the devices
                        for (input = inputs.next(); input && !input.done; input = inputs.next()) {
                            scope.devices.push(input.value);
                        }
                    } else {
                        console.error('No devices detected!');
                    }

                }
            })
            .catch(function(e) {
                console.error(e);
            });
  }


  return service;
});

angular.module('pedalboardDesignerApp').controller('PedalboardCtrl',['$scope','Devices' ,'PedalboardService' ,function( $scope, devices, PedalboardService) {

  console.log(devices);
  $scope.switchTouched = false;

  
  //
  //Detect midi devices
  //
  $scope.devices = [];

        devices
            .connect()
            .then(function(access) {
                if('function' === typeof access.inputs) {
                    // deprecated
                    $scope.devices = access.inputs();
                    console.error('Update your Chrome version!');
                } else {
                    if(access.inputs && access.inputs.size > 0) {
                        var inputs = access.inputs.values(),
                            input = null;

                        // iterate through the devices
                        for (input = inputs.next(); input && !input.done; input = inputs.next()) {
                            $scope.devices.push(input.value);
                        }
                    } else {
                        console.error('No devices detected!');
                    }

                }
            })
            .catch(function(e) {
                console.error(e);
            });




  var potsNewValues = [];

  //
  // JQuery lines
  //
  $('#codeZone').toggle();


  //
  // Creation of the differents pedals
  //
  var pedals = {
    pedals:[
      {
        name: "Distortion",
        pots: [
          {
            name: "volume",
            value: "50",
          },
          {
            name: "tone",
            value: "50",
          },
          {
            name: "drive",
            value: "50",
          }
        ],
        switch:{
          enabled: false
        }
      },
      {
        name: "Overdrive",
        pots: [
          {
            name: "volume",
            value: "50",
          },
          {
            name: "tone",
            value: "50",
          },
          {
            name: "drive",
            value: "50",
          }
        ],
        switch:{
          enabled: false
        }
      },
      {
        name: "Chorus",
        pots: [
          {
            name: "speed",
            value: "50",
          },
          {
            name: "depth",
            value: "50",
          },
          {
            name: "volume",
            value: "50",
          }
        ],
        switch:{
          enabled: false
        }
      },
      {
        name: "8band E.Q",
        pots: [
          {
            name: "100Hz",
            value: "50",
          },
          {
            name: "170Hz",
            value: "50",
          },
          {
            name: "280Hz",
            value: "50",
          },
          {
            name: "500Hz",
            value: "50",
          },
          {
            name: "800Hz",
            value: "50",
          },
          {
            name: "1.4kHz",
            value: "50",
          },
          {
            name: "2.3kHz",
            value: "50",
          },
          {
            name: "5.0kHz",
            value: "50",
          },
          {
            name: "Gain",
            value: "50",
          },
        ],
        switch:{
          enabled: false
        }
      }

    ]
  };

  $scope.pedals = pedals;

  //
  // Code for the delete key.
  //
  var deleteKeyCode = 46;

  //
  // Code for control key.
  //
  var ctrlKeyCode = 17;

  //
  // Set to true when the ctrl key is down.
  //
  var ctrlDown = false;

  //
  // Code for A key.
  //
  var aKeyCode = 65;

  //
  // Code for esc key.
  //
  var escKeyCode = 27;

  //
  // Selects the next node id.
  //
  var nextNodeID = 10;

  //
  // Setup the data-model for the chart.
  //

  var chartDataModel = {
    "nodes": [],
    "connections": []
  };

  //
  // Ouvre le modal de l'effet sélectionné et affiche tous ses paramètres
  //
  $scope.openModal = function(effect) {

    $scope.modalEffect = effect.data;

    $('#pedalName').text(effect.data.name);
    $('.box').attr('data-id',effect.data.id)
    $.each(effect.data.pots,function( key, val) {

       $('.pots').append("<div class='pot col s4'><input type='text' value='"+val.value+"' class='"+effect.data.id+"_"+val.name+"' data-min='0' data-max='100' data-step='.1' data-fgColor='#a1887f' data-angleOffset='-125' data-angleArc='250' data-displayInput=false data-height='75' data-width='75'> <div>"+val.name+"</div></div>");
      $("."+effect.data.id+"_"+val.name).knob({
        'release' : function (v) {
          console.log(v);
          console.log(potsNewValues);
          $("."+effect.data.id+"_"+val.name).attr('value', v);
        }
      });
      $("."+effect.data.id+"_"+val.name).attr('value', val.value);

    });


    

    if(effect.data.switch.enabled == false){
      
      $('.switchPedal').prop('checked',false);
    }else if(effect.data.switch.enabled == true){

      $('.switchPedal').prop('checked',true);

    }
    
  };

  $scope.saveModal = function(event) {
      

      //Récupère les valeurs des potentiomètres
      var nbPot = event.target.parentElement.previousElementSibling.children["0"].children.length;
      var pots = [];

      for (var i = 0; i < nbPot; ++i) {
        index = event.target.parentElement.previousElementSibling.children["0"].children[i].children["0"].lastChild.className;
        value = event.target.parentElement.previousElementSibling.children["0"].children[i].children["0"].lastChild.attributes[1].value;
        pots.push({index: index, value:value});
      }

      $scope.editPotentiometer(pots);



      if($scope.switchTouched){
         $scope.toggleSwitch();
      }
      
      $scope.switchTouched = false;
      $scope.closeModal();
  };

  $scope.closeModal = function() {
      $('.pots').text("");
  };


  //
  // Event handler for key-down on the flowchart.
  //
  $scope.keyDown = function (evt) {

    if (evt.keyCode === ctrlKeyCode) {

      ctrlDown = true;
      evt.stopPropagation();
      evt.preventDefault();
    }
  };

  //
  // Event handler for key-up on the flowchart.
  //
  $scope.keyUp = function (evt) {

    if (evt.keyCode === deleteKeyCode) {
      //
      // Delete key.
      //
      $scope.chartViewModel.deleteSelected();
    }

    if (evt.keyCode == aKeyCode && ctrlDown) {
      // 
      // Ctrl + A
      //
      $scope.chartViewModel.selectAll();
    }

    if (evt.keyCode == escKeyCode) {
      // Escape.
      $scope.chartViewModel.deselectAll();
    }

    if (evt.keyCode === ctrlKeyCode) {
      ctrlDown = false;

      evt.stopPropagation();
      evt.preventDefault();
    }
  };


  //
  // Enable/disable switch
  //
  $scope.toggleSwitch = function (idModule) {
    $scope.chartViewModel.toggleSwitch(idModule);
  }

  //
  // Edit potentiometer value
  //
  $scope.editPotentiometer = function (values) {
    $scope.chartViewModel.editPotentiometer(values);
 
  }

  //
  // Add a new node to the chart.
  //
  $scope.addNewNode = function (pedalId) {

    var pedal = PedalboardService.deepCopyPedal(pedals.pedals[pedalId]);

    //
    // Template for a new node.
    //
    var newNodeDataModel = {
      name: pedal.name,
      id: nextNodeID++,
      x: 0,
      y: 0,
      pots: pedal.potentiometers,
      switch: {enabled:pedal.switch}, 
      inputConnectors: [
        {
          name: "X"
        }
      ],
      outputConnectors: [ 
        {
          name: "1"
        }
      ],
    };

    $scope.chartViewModel.addNode(newNodeDataModel);
  };

  //
  // Add an input connector to selected nodes.
  //
  $scope.addNewInputConnector = function () {
    var connectorName = prompt("Enter a connector name:", "New connector");
    if (!connectorName) {
      return;
    }

    var selectedNodes = $scope.chartViewModel.getSelectedNodes();
    for (var i = 0; i < selectedNodes.length; ++i) {
      var node = selectedNodes[i];
      node.addInputConnector({
        name: connectorName,
      });
    }
  };

  //
  // Add an output connector to selected nodes.
  //
  $scope.addNewOutputConnector = function () {
    var connectorName = prompt("Enter a connector name:", "New connector");
    if (!connectorName) {
      return;
    }

    var selectedNodes = $scope.chartViewModel.getSelectedNodes();
    for (var i = 0; i < selectedNodes.length; ++i) {
      var node = selectedNodes[i];
      node.addOutputConnector({
        name: connectorName,
      });
    }
  };

  //
  // Delete selected nodes and connections.
  //
  $scope.deleteSelected = function () {

    $scope.chartViewModel.deleteSelected();
  };

  //
  // Create the view-model for the chart and attach to the scope.
  //
  $scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);




  //
  // Show the codeZone and scroll to the bottom of the page
  //
  $scope.toggleCode = function () {
    $('#codeZone').toggle();
    window.scrollTo(0,document.body.scrollHeight);
  };

}]);