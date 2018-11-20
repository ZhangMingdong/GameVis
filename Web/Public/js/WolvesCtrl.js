var mainApp = angular.module("myApp", ['ngRoute']);

// controller for wolves data in csv
mainApp.controller('WolvesCtrl', function ($scope, $http,$window) {
    angular.element($window).on('resize', function () { $scope.$apply() });

    $scope.data={
        raw:[]              // raw data
        ,network:{}         // data of the network
        ,clique:[]          // data of the clique
        ,vmData:{
            Data:[]
        }       // data of v/m
        ,hshrData:{
            Data:[]
        }     // data of HS-HR
    }

    // build a matrix data from data list
    function _buildMatrixData(data){
        var nameByIndex = new d3.map();
        var indexByName=new d3.map();
        var index=0;
        // 1.build maps
        data.forEach(function(d){
            var player1=d['Player1'];
            var player2=d['Player2'];

            if(undefined==indexByName.get(player1)){
                indexByName.set(player1,index);
                nameByIndex.set(index,player1);
                index++
            }
            if(undefined==indexByName.get(player2)){
                indexByName.set(player2,index);
                nameByIndex.set(index,player2);
                index++
            }
        })
        // 2.build cliques
        var cliqueByName=new d3.map();
        for(var i=0;i<index;i++){
            cliqueByName.set(nameByIndex.get(i),i);
        }
        data.forEach(function(d){
            var player1=d['Player1'];
            var player2=d['Player2'];
            var clique1=cliqueByName.get(player1);
            var clique2=cliqueByName.get(player2);
            if(clique1<clique2) cliqueByName.set(player2,clique1);
            else if(clique2<clique1) cliqueByName.set(player1,clique2);
        })
        // 3.build matrix
        var matrix=[];
        for(var i=0;i<index;i++){
            var row=[]
            for(var j=0;j<index;j++){
                row.push(0)
            }
            matrix.push(row)
        }
        data.forEach(function(d){
            var player1=d['Player1'];
            var player2=d['Player2'];
            var score1=d['Score1']
            var score2=d['Score2']
            var index1=indexByName.get(player1);
            var index2=indexByName.get(player2);
            matrix[index1][index2]=+score1;
            matrix[index2][index1]=+score2;
        });
        return {
            matrix:matrix,
            nameByIndex:nameByIndex,
            indexByName:indexByName,
            cliqueByName:cliqueByName
        }
    }

    d3.csv("data/fencing.csv",function(data){
        // 1.build the map
        $scope.data.network=_buildMatrixData(data);
        $scope.data.network.click=function(d){
            var name=$scope.data.network.nameByIndex.get(d.index);
            var clique=$scope.data.network.cliqueByName.get(name);
            $scope.data.clique=_buildMatrixData($scope.data.raw.filter(function(d){

                var player1=d['Player1'];
                return $scope.data.network.cliqueByName.get(player1)==clique;
            }))
            $scope.$apply();
        }


        var length=$scope.data.network.matrix.length;


        // 3.build barchart data
        var vmData=[];
        var hshrData=[]
        for(var i=0;i<length;i++){
            vmData.push({
                name:$scope.data.network.nameByIndex.get(i),
                count:0,
                all:0
            })
            hshrData.push({
                name:$scope.data.network.nameByIndex.get(i),
                count:0
            })
        }
        data.forEach(function(d){
            var player1=d['Player1'];
            var player2=d['Player2'];
            var score1=+d['Score1']
            var score2=+d['Score2']
            var index1=$scope.data.network.indexByName.get(player1);
            var index2=$scope.data.network.indexByName.get(player2);
            //console.log(i,vmData,index1,index2);
            vmData[index1].all++;
            vmData[index2].all++;
            if(score1>score2)
                vmData[index1].count++;
            else
                vmData[index2].count++;
            hshrData[index1].count+=(score1-score2);
            hshrData[index2].count+=(score2-score1);
        })
        vmData.sort(function(a,b){
            return a.count/a.all-b.count/b.all;
        })
        hshrData.sort(function(a,b){
            return a.count-b.count;
        })
        $scope.data.vmData.Data=vmData;
        $scope.data.hshrData.Data=hshrData;
        $scope.data.raw=data;

        $scope.$apply();
    });

});

