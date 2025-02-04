import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";

interface SpendingData {
  date: Date;
  amount: number;
}

export function SpendingPatternD3() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { formatAmount } = useCurrency();

  const { data: spendingData, isLoading } = useQuery({
    queryKey: ['spendingPattern'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('amount, activation_date')
        .order('activation_date', { ascending: true });
      
      if (error) throw error;

      return subscriptions.map(sub => ({
        date: new Date(sub.activation_date),
        amount: Number(sub.amount)
      }));
    }
  });

  useEffect(() => {
    if (!spendingData || !svgRef.current) return;

    // Clear previous rendering
    d3.select(svgRef.current).selectAll("*").remove();

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(spendingData, d => d.date) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(spendingData, d => d.amount) as number])
      .range([height, 0]);

    // Create line generator
    const line = d3.line<SpendingData>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.amount))
      .curve(d3.curveMonotoneX);

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "text-muted-foreground text-xs")
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .attr("class", "text-muted-foreground text-xs")
      .call(d3.axisLeft(yScale)
        .tickFormat(d => formatAmount(d as number)));

    // Add the line path
    const path = svg.append("path")
      .datum(spendingData)
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add interactive dots
    const dots = svg.selectAll(".dot")
      .data(spendingData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.amount))
      .attr("r", 4)
      .attr("fill", "hsl(var(--primary))")
      .style("opacity", 0);

    // Add hover effects
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "absolute hidden bg-background border border-border rounded-md p-2 text-xs shadow-lg");

    svg.selectAll("circle")
      .on("mouseover", function(event, d: SpendingData) {
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1);

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
          .style("opacity", 0);

        tooltip.style("display", "none");
      });

    // Add animation
    const pathLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);

  }, [spendingData, formatAmount]);

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="animate-pulse text-muted-foreground">Loading visualization...</div>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-br from-background to-muted/50">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary/50" />
          Spending Pattern
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px] w-full">
          <svg ref={svgRef} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
}