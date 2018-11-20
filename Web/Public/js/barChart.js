







mainApp.directive('barChart', function () {
    function link(scope, el, attr) {
        function barChart(){
            var svgWidth=400;
            var svgHeight=400;
            var margin = {top: 20, right: 20, bottom: 70, left: 40};
            var svgBG = d3.select(el[0]).append("svg");
            svg=svgBG
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
            var xAxisSVG =svg.append("g")
                .attr("class", "x axis");
            var yAxisSVG = svg.append("g")
                .attr("class", "y axis");


            var bars = svg.selectAll("bar");

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    if(d.all==undefined)
                        return "<strong>Score:</strong> <span style='color:red'>" + d.count+"</span>";
                    else
                        return "<strong>Frequency:</strong> <span style='color:red'>" + d.count+"/"+ d.all + "</span>";
                });
            svg.call(tip);


            scope.$watch(function () {
                //    console.log("watching===============svgStreamBG")
                svgWidth = el[0].clientWidth;
                svgHeight = el[0].clientHeight;
            //    if(svgWidth<600) svgWidth=600;
            //    if(svgHeight<400) svgHeight=400;

                return svgWidth + svgHeight;
            }, resize);
            // response the size-change
            function resize() {
            //    console.log("====================resize barChart=================");
            //    console.log(svgWidth);
            //    console.log(svgHeight);
                redraw();
            }

            // get the display field
            function getField(d){
                if(d.all==undefined) return Math.abs(d.count);
                else return d.count/ d.all;
            }

            function redraw(){
            //    console.log("redraw bar chart");
                var data=scope.data.Data;


                var width = svgWidth - margin.left - margin.right;
                var height = svgHeight - margin.top - margin.bottom;

                svgBG
                    .attr("width", svgWidth)
                    .attr("height", svgHeight)

                svg
                    .attr("width", width)
                    .attr("height", height)


                var x=d3.scaleBand().range([0, width]).round(.05);
                //var x = d3.scaleOrdinal().rangeRoundBands([0, width], .05);

                var y = d3.scaleLinear().range([height, 0]);

                var xAxis = d3.axisBottom()
                    .scale(x)

                var yAxis = d3.axisLeft()
                    .scale(y)
                    .ticks(10);


                x.domain(data.map(function(d) { return d.name; }));
                y.domain([0, d3.max(data, function(d) { return getField(d); })]);

                xAxisSVG
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)

                yAxisSVG
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("");
                bars=bars.data(data);

                function _setBars(bars){
                    bars
                        .attr("x", function(d) { return x(d.name); })
                        .attr("width", x.bandwidth())
                        .attr("y", function(d) { return y(getField(d)); })
                        .attr("height", function(d) { return height - y(getField(d)); })
                        .style('fill',function(d){
                            if(d.count>0) return 'blue'
                            else return 'red'
                        })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide)
                        .on('click',function(d){
                            scope.data.onClick(d.name);
                        });
                }
                _setBars(bars
                    .enter().append("rect")
                    .attr("class", "bar"))
                _setBars(bars);


                bars.exit()
                    .remove();
            }
            redraw();

            scope.$watch('data', redraw);
            scope.$watch('data.Data', redraw);

        }
        barChart();



    }
    return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
    };
});