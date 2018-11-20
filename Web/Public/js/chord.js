/**
 * Created by Administrator on 2016/7/26.
 */

mainApp.directive('chord', function () {
    function link(scope, el, attr) {
        function chord(){

            var svgWidth=400;
            var svgHeight=400;
            var width=400;
            var height=400;

            var outerRadius = Math.min(width,height) / 2;
            var innerRadius = outerRadius*0.8;

            var fill = d3.scaleOrdinal(d3.schemeAccent)

            var svgBG=d3.select(el[0]).append("svg")
                .attr("width", outerRadius * 2)
                .attr("height", outerRadius * 2)

            var svg = svgBG
                .append("g")
                .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");


            scope.$watch(function () {
                svgWidth = el[0].clientWidth;
                svgHeight = el[0].clientHeight;
                return svgWidth + svgHeight;
            }, resize);
            // response the size-change
            function resize() {
                redraw();
            }

            function redraw(){
            //    console.log("===redraw chord===");
            //    console.log(scope.data);
                if(!scope.data.matrix||scope.data.matrix.length==0) return;

                width=svgWidth;
                height=svgHeight;
                outerRadius = Math.min(width,height) / 2;
                innerRadius = outerRadius*0.8;

                svgBG
                    .attr("width", svgWidth)
                    .attr("height", svgHeight)
                svg
                    .attr("width", svgWidth)
                    .attr("height", svgHeight)
                    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

                var arc = d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(innerRadius + 20);


                var chord = d3.chord()
                    .padAngle(.04)
                    .sortSubgroups(d3.descending)
                    .sortChords(d3.descending);

                svg.datum(chord(scope.data.matrix));
                // 2.bind data


                function _drawGroup(){
                    var svgGroup = svg.selectAll(".group");

                    svgGroup=svgGroup.data([])
                    svgGroup.exit().remove();
                    svgGroup=svgGroup.data(function(chords) { return chords.groups; })

                    function _setGroupPath(path){
                        path
                            .transition().duration(500)
                            .attr("d", arc)

                        path
                            .style("fill", function(d) { return fill(d.index); })
                            .style("stroke", function(d) { return fill(d.index); })
                            .on("mouseover", fade(.1))
                            .on("mouseout", fade(1))
                            .on("click",function(d){
                                //console.log(scope.data.nameByIndex.get(d.index))
                                scope.data.click(d);
                            })
                    }
                    function _setGroupText(text){
                        text
                            .transition().duration(500)
                            .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
                            .attr("dy", ".35em")
                            .attr("transform", function(d) {
                                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                                    + "translate(" + (innerRadius + 26) + ")"
                                    + (d.angle > Math.PI ? "rotate(180)" : "");
                            })
                            .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
                            .text(function(d) { return scope.data.nameByIndex.get(d.index); });
                    }

                    var g = svgGroup
                        .enter().append("g")
                        .attr("class", "group");

                    _setGroupPath(g.append("path").classed("gpath",true))
                    _setGroupText(g.append("text").classed("gtext",true))


                    _setGroupPath(svgGroup.selectAll(".gpath"))
                    _setGroupText(svgGroup.selectAll(".gtext"))

                    svgGroup.exit().remove();
                }

                function _drawChord(){
                    var svgChord = svg.selectAll(".chord");
                    function _setChord(chord){
                        chord
                            .transition().duration(500)
                            .attr("d",d3.ribbon().radius(innerRadius));
                        chord
                            .style("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); })
                            .style("fill", function(d) { return fill(d.source.index); })
                    }
                    svgChord=svgChord
                        .data(function(chords) { return chords; })

                    console.log(chord)

                    _setChord(svgChord.enter().append("path")
                        .attr("class", "chord"))

                    _setChord(svgChord);


                    svgChord.exit().remove();
                }

                _drawGroup();
                _drawChord();



            }
            //     d3.select(self.frameElement).style("height", outerRadius * 2 + "px");
            redraw();

            scope.$watch('data.matrix', redraw);
            scope.$watch('data', redraw);


            function fade(opacity) {
                return function(g, i) {
                    //    console.log(g);
                    svg.selectAll(".chord")
                        .filter(function(d) {
                            i= g.index;
                            return d.source.index != i && d.target.index != i;
                        })
                        .transition()
                        .style("opacity", opacity);
                };
            }
        }
        chord();
    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});