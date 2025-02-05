import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { setupD3Chart, createLine, addDataPoints } from './utils/d3Utils';
import { useSpendingData } from './hooks/useSpendingData';
import { ChartDimensions } from './types/spendingTypes';

export function SpendingPatternD3() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { formatAmount } = useCurrency();
  const { session } = useAuth();
  const { data: spendingData, isLoading } = useSpendingData(session?.user?.id);

  useEffect(() => {
    if (!spendingData || !svgRef.current || spendingData.length === 0) return;

    // Clear previous rendering
    d3.select(svgRef.current).selectAll("*").remove();

    const dimensions: ChartDimensions = {
      margin: { top: 40, right: 50, bottom: 40, left: 80 },
      width: svgRef.current.clientWidth - 80 - 50, // margin.left + margin.right
      height: 420 - 40 - 40 // margin.top + margin.bottom
    };

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
      .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
      .append("g")
      .attr("transform", `translate(${dimensions.margin.left},${dimensions.margin.top})`);

    // Set scales with more padding
    const xScale = d3.scaleTime()
      .domain(d3.extent(spendingData, d => d.date) as [Date, Date])
      .range([0, dimensions.width])
      .nice(); // Add nice() to round the domain to nice values

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(spendingData, d => d.amount) as number])
      .range([dimensions.height, 0])
      .nice(); // Add nice() to round the domain to nice values

    // Setup basic chart elements
    setupD3Chart(svg, dimensions.width, dimensions.height, spendingData, xScale, yScale, formatAmount);

    // Create and add the line
    const line = createLine(xScale, yScale);
    const path = svg.append("path")
      .datum(spendingData)
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add data points and tooltips
    const tooltip = addDataPoints(svg, spendingData, xScale, yScale, formatAmount);

    // Add animation
    const pathLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, [spendingData, formatAmount]);

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="animate-pulse text-muted-foreground">Loading visualization...</div>
      </Card>
    );
  }

  if (!spendingData || spendingData.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="text-muted-foreground">No subscription data available</div>
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
        <div className="h-[420px] w-full">
          <svg ref={svgRef} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
}