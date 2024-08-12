// ThemedLineChart.tsx

import React from "react";
import { StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

import { ThemedView } from "@/components/ThemedView";

// Get the width of the device screen
const screenWidth = Dimensions.get("window").width;

// SimpleLineChart component to render a themed line chart
export function SimpleLineChart({ data }: { data: number[] }) {
  // Fetch theme colors for chart styling
  const chartBackgroundColor = useThemeColor({}, "chartBackground");
  const chartTextColor = useThemeColor({}, "chartText");

  // Calculate maximum value for yLabel
  const maxDataValue = Math.ceil(Math.max(...data));
  const midpointValue = (maxDataValue / 2).toFixed(1);

  // Prepare the dataset for the line chart
  const dataSet = {
    labels: data.map((_, index) => ""), // Remove X-axis labels by setting them to empty strings
    datasets: [
      {
        data: data, // Data for the line chart
        color: (opacity = 1) => chartTextColor, // Optional: specify line color
        strokeWidth: 2, // Optional: specify line thickness
      },
    ],
  };

  // Configuration for the line chart appearance and behavior
  const chartConfig = {
    backgroundColor: chartBackgroundColor,
    backgroundGradientFrom: chartBackgroundColor,
    backgroundGradientTo: chartBackgroundColor,
    decimalPlaces: 1, // No decimal places in data labels
    color: (opacity = 1) => chartTextColor, // Color for lines and labels
    labelColor: (opacity = 1) => chartTextColor, // Color for labels
    style: {
      borderRadius: 16, // Rounded corners for the chart
    },
    propsForDots: {
      r: "3", // Smaller radius for data point dots
      strokeWidth: "0", // Remove the stroke around dots
      stroke: "transparent", // Make the stroke transparent
    },
    propsForBackgroundLines: {
      stroke: "transparent", // Make the guideline transparent
    },
    formatYLabel: (label: string | number) => {
      // Format labels to show 0, midpoint, and max value
      const labelNumber = Number(label);
      if (labelNumber === 0 || labelNumber === maxDataValue) {
        return labelNumber.toFixed(0);
      }
      return labelNumber.toFixed(1); // Format with one decimal place
    },
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.container2}>
        <LineChart
          data={dataSet}
          width={screenWidth - 16} // Adjust width to fit within container
          height={210} // Height of the chart
          chartConfig={chartConfig} // Configuration object for the chart
          bezier // Use a bezier curve for the line
          style={styles.chart} // Custom styles for the chart
          fromZero={true} // Start Y-axis from zero
          segments={2}
          withInnerLines={false} // Remove inner grid lines
          withVerticalLabels={false} // Remove vertical labels
          withHorizontalLabels={true} // Enable horizontal labels to show Y-axis values
          withVerticalLines={false} // Remove vertical lines
          withHorizontalLines={false} // Remove horizontal lines
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chart: {
    marginVertical: 8, // Vertical margin around the chart
    borderRadius: 16, // Rounded corners for the chart
    margin: -20, // Adjust the overall margin
    marginLeft: 0, // Adjust the left margin
  },
});
