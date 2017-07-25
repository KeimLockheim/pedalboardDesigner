angular.module('pedalboardDesignerApp').factory('PedalboardService', function() {

  var service = {};



  return service;
});

angular.module('pedalboardDesignerApp').controller('PedalboardCtrl', function(PedalboardService, $scope) {

  //
  // JQuery lines
  //
  $('#codeZone').toggle();
  $(".dropdown-button").dropdown();


  //
  // Creation of the differents pedals
  //
  var pedals = {
    pedals:[
      {
        name: "distortion",
        pots: [
          {
            name: "volume",
            value: "0.5",
          },
          {
            name: "tone",
            value: "0.5",
          },
          {
            name: "drive",
            value: "0.5",
          }
        ],
        switch:{
          enabled: false
        }
      }
    ]
  };

  var pedalboardCtrl = this;

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

  var chartDataModel = {};

  // var chartDataModel = {

  //   nodes: [
  //     {
  //       name: "Example Node 1",
  //       id: 0,
  //       x: 0,
  //       y: 0,
  //       width: 350,
  //       inputConnectors: [
  //         {
  //           name: "A",
  //         },
  //         {
  //           name: "B",
  //         },
  //         {
  //           name: "C",
  //         },
  //       ],
  //       outputConnectors: [
  //         {
  //           name: "A",
  //         },
  //         {
  //           name: "B",
  //         },
  //         {
  //           name: "C",
  //         },
  //       ],
  //     },

  //     {
  //       name: "Example Node 2",
  //       id: 1,
  //       x: 400,
  //       y: 200,
  //       inputConnectors: [
  //         {
  //           name: "A",
  //         },
  //         {
  //           name: "B",
  //         },
  //         {
  //           name: "C",
  //         },
  //       ],
  //       outputConnectors: [
  //         {
  //           name: "A",
  //         },
  //         {
  //           name: "B",
  //         },
  //         {
  //           name: "C",
  //         },
  //       ],
  //     },

  //   ],

  //   connections: [
  //     {
  //       name:'Connection 1',
  //       source: {
  //         nodeID: 0,
  //         connectorIndex: 1,
  //       },

  //       dest: {
  //         nodeID: 1,
  //         connectorIndex: 2,
  //       },
  //     },
  //     {
  //       name:'Connection 2',
  //       source: {
  //         nodeID: 0,
  //         connectorIndex: 0,
  //       },

  //       dest: {
  //         nodeID: 1,
  //         connectorIndex: 0,
  //       },
  //     },

  //   ]
  // };

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
  // Add a new node to the chart.
  //
  $scope.addNewNode = function (pedalId) {

    console.log("NewNode");

    console.log(pedals.pedals[0]);
    //var nodeName = prompt("Enter a pedal name:", "New pedal"); OLD

    // if (!nodeName) {
    //   return;
    // }

    pedalName = pedals.pedals[0].name;
    pedalPots = pedals.pedals[0].pots;
    pedalSwitch = pedals.pedals[0].switch;


    //
    // Template for a new node.
    //
    var newNodeDataModel = {
      name: pedalName,
      id: nextNodeID++,
      x: 0,
      y: 0,
      pots: pedalPots,
      switch: pedalSwitch, 
      inputConnectors: [
        {
          name: "X"
        },
        {
          name: "Y"
        },
        {
          name: "Z"
        }
      ],
      outputConnectors: [ 
        {
          name: "1"
        },
        {
          name: "2"
        },
        {
          name: "3"
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
    //$('#codeZone').removeClass('hidden');
    window.scrollTo(0,document.body.scrollHeight);
  };


});
