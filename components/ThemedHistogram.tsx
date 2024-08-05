import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

// Get the width of the device screen
const screenWidth = Dimensions.get('window').width;

// SimpleHistogram component to render a themed bar chart
export function SimpleHistogram({ data }: { data: number[] }) {
  // Fetch theme colors for chart styling
  const chartBackgroundColor = useThemeColor({}, 'chartBackground');
  const chartTextColor = useThemeColor({}, 'chartText');

  // Calculate maximum and minimum values from data
  const maxDataValue = Math.max(...data);
  const minDataValue = Math.min(...data);

  // Prepare the dataset for the bar chart
  const dataSet = {
    labels: [], // No labels specified, adjust as needed
    datasets: [
      {
        data: data, // Data for the bar chart
      },
    ],
  };

  // Configuration for the bar chart appearance and behavior
  const chartConfig = {
    backgroundColor: chartBackgroundColor,
    backgroundGradientFrom: chartBackgroundColor,
    backgroundGradientTo: chartBackgroundColor,
    decimalPlaces: 0, // No decimal places in data labels
    color: (opacity = 1) => chartTextColor, // Color for bars and labels
    labelColor: (opacity = 1) => chartTextColor, // Color for labels
    style: {
      borderRadius: 16, // Rounded corners for the chart
    },
    propsForDots: {
      r: '6', // Radius for data point dots
      strokeWidth: '2', // Width of the stroke around dots
      stroke: chartTextColor, // Stroke color for dots
    },
    formatYLabel: (label: string | number) => {
      const numericLabel = Number(label);
      if (numericLabel === 0) {
        return ''; // Remove the "0" label
      }
      return '';
    },
    propsForBackgroundLines: {
      stroke: 'transparent', // Make the guideline transparent
    },
    propsForHorizontalLabels: {
      stroke: chartTextColor, // Solid line for horizontal axis
    },
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.container2}>
        <BarChart
          data={dataSet}
          width={screenWidth + 40} // Width of the chart
          height={210} // Height of the chart
          chartConfig={chartConfig} // Configuration object for the chart
          yAxisLabel="" // Prefix for Y-axis labels
          yAxisSuffix="" // Suffix for Y-axis labels
          withInnerLines={false} // Remove horizontal guidelines
          withVerticalLabels={false} // Remove vertical labels if needed
          fromZero // Start Y-axis from zero
          showBarTops // Show the tops of bars
          showValuesOnTopOfBars // Show values on top of bars
          style={styles.chart} // Custom styles for the chart
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -80, // Adjust the left margin
  },
  chart: {
    marginVertical: 8, // Vertical margin around the chart
    borderRadius: 16, // Rounded corners for the chart
    margin: -40, // Adjust the overall margin
    marginLeft: -40, // Adjust the left margin
  },
});
