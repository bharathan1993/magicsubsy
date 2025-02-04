import * as d3 from 'd3';
import { SpendingData } from '../types/spendingTypes';

export const setupD3Chart = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  width: number,
  height: number,
  data: SpendingData[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  formatAmount: (amount: number) => string
) => {
  // Add axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .attr("class", "text-muted-foreground text-xs")
    .call(d3.axisBottom(xScale));

  svg.append("g")
    .attr("class", "text-muted-foreground text-xs")
    .call(d3.axisLeft(yScale)
      .tickFormat(d => formatAmount(d as number)));
};

export const createLine = (
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
) => {
  return d3.line<SpendingData>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.amount))
    .curve(d3.curveMonotoneX);
};

export const addDataPoints = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: SpendingData[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  formatAmount: (amount: number) => string
) => {
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "absolute hidden bg-background border border-border rounded-md p-2 text-xs shadow-lg");

  const dots = svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.date))
    .attr("cy", d => yScale(d.amount))
    .attr("r", 4)
    .attr("fill", "hsl(var(--primary))")
    .style("opacity", 1); // Changed from 0 to 1 to always show data points

  // Add value labels
  svg.selectAll(".value-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "value-label text-xs text-muted-foreground")
    .attr("x", d => xScale(d.date))
    .attr("y", d => yScale(d.amount) - 10)
    .attr("text-anchor", "middle")
    .text(d => formatAmount(d.amount));

  // Enhanced hover effects
  svg.selectAll("circle")
    .on("mouseover", function(event, d: SpendingData) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 6);

      tooltip
        .style("display", "block")
        .html(`Date: ${d.date.toLocaleDateString()}<br/>Amount: ${formatAmount(d.amount)}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");
    })
    .on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 4);

      tooltip.style("display", "none");
    });

  return tooltip;
};