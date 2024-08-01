import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const screenWidth = Dimensions.get('window').width;

const SimpleHistogram = ({ data }: { data: number[] }) => {
  const chartBackgroundColor = useThemeColor({}, 'chartBackground');
  const chartTextColor = useThemeColor({}, 'chartText');

  const maxDataValue = Math.max(...data);
  const minDataValue = Math.min(...data);

  const dataSet = {
    labels: [],
    datasets: [
      {
        data: data,
      },
    ],
  };

const chartConfig = {
    backgroundColor: chartBackgroundColor,
    backgroundGradientFrom: chartBackgroundColor,
    backgroundGradientTo: chartBackgroundColor,
    decimalPlaces: 0,
    color: (opacity = 1) => chartTextColor,
    labelColor: (opacity = 1) => chartTextColor,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: chartTextColor,
  },
    formatYLabel: (label: string | number) => {
      const numericLabel = Number(label);
      if (numericLabel === 0) {
        return ''; // Remove the "0" label
      }
      // if (numericLabel === minDataValue || numericLabel === maxDataValue) {
      //   return `${Math.round(numericLabel)}`;
      // }
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
        width={screenWidth + 40}
        height={210}
        chartConfig={chartConfig}
        yAxisLabel=""
        yAxisSuffix=""
        withInnerLines={false} // Remove horizontal guidelines
        withVerticalLabels={false} // Remove vertical labels if needed
        fromZero
        showBarTops
        showValuesOnTopOfBars
        style={styles.chart}
      />
    </ThemedView>
    </ThemedView>
  );
};

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
    marginLeft: -80,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    margin: -40,
    marginLeft: -40,
  },
});

export default SimpleHistogram;
