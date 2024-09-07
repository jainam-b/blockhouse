"use client"
import { useState, useEffect } from 'react';

const backend = "http://127.0.0.1:8000";

interface CandlestickData {
  ts: string;
  open: number;
  close: number;
  low: number;
  high: number;
}

interface ChartData {
  name: string;
  value: number;
}

const useChartData = () => {
  const [candlestickData, setCandlestickData] = useState<CandlestickData[]>([]);
  const [lineChartData, setLineChartData] = useState<ChartData[]>([]);
  const [barChartData, setBarChartData] = useState<ChartData[]>([]);
  const [pieChartData, setPieChartData] = useState<ChartData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candlestick, line, bar, pie] = await Promise.all([
          fetch(`${backend}/api/candlestick-data`).then(res => res.json()),
          fetch(`${backend}/api/line-chart-data`).then(res => res.json()),
          fetch(`${backend}/api/bar-chart-data`).then(res => res.json()),
          fetch(`${backend}/api/pie-chart-data`).then(res => res.json())
        ]);

        // Transform candlestick data
        const transformedCandlestickData = candlestick.data.map((item: CandlestickData) => ({
          ...item,
          openClose: [item.open, item.close]
        }));

        setCandlestickData(transformedCandlestickData);
        setLineChartData(line.data.map((value: number, index: number) => ({ name: line.labels[index], value })));
        setBarChartData(bar.data.map((value: number, index: number) => ({ name: bar.labels[index], value })));
        setPieChartData(pie.data.map((value: number, index: number) => ({ name: pie.labels[index], value })));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch chart data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  return { candlestickData, lineChartData, barChartData, pieChartData, error };
};

export default useChartData;