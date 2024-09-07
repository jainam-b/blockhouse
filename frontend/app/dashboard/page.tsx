"use client";
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import useChartData from '../hooks/useChartData'; // Adjust the path as necessary

// Define types for chart data
interface CandlestickData {
  ts: string;
  open: number;
  close: number;
  low: number;
  high: number;
  openClose:number;
}

interface LineChartData {
  name: string;
  value: number;
}

interface BarChartData {
  name: string;
  value: number;
}

interface PieChartData {
  name: string;
  value: number;
}

// Custom Candlestick component
const Candlestick: React.FC<any> = (props) => {
  const {
    fill,
    x,
    y,
    width,
    height,
    low,
    high,
    openClose: [open, close],
  } = props;
  const isGrowing = open < close;
  const color = isGrowing ? 'green' : 'red';
  const ratio = Math.abs(height / (open - close));

  return (
    <g stroke={color} fill="none" strokeWidth="2">
      <path
        d={`
          M ${x},${y}
          L ${x},${y + height}
          L ${x + width},${y + height}
          L ${x + width},${y}
          L ${x},${y}
        `}
      />
      {isGrowing ? (
        <>
          <path d={`M ${x + width / 2}, ${y + height} v ${(open - low) * ratio}`} />
          <path d={`M ${x + width / 2}, ${y} v ${(close - high) * ratio}`} />
        </>
      ) : (
        <>
          <path d={`M ${x + width / 2}, ${y} v ${(close - low) * ratio}`} />
          <path d={`M ${x + width / 2}, ${y + height} v ${(open - high) * ratio}`} />
        </>
      )}
    </g>
  );
};

const Dashboard: React.FC = () => {
  const { candlestickData, lineChartData, barChartData, pieChartData } = useChartData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Calculate min and max values for Candlestick Y-axis
  const minValue = candlestickData.reduce(
    (min, { low, openClose: [open, close] }) => Math.min(min, low, open, close),
    Infinity
  );
  const maxValue = candlestickData.reduce(
    (max, { high, openClose: [open, close] }) => Math.max(max, high, open, close),
    -Infinity
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Candlestick Chart</h2>
          <BarChart width={400} height={300} data={candlestickData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="ts" />
            <YAxis domain={[minValue, maxValue]} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Bar dataKey="openClose" fill="#8884d8" shape={<Candlestick />}>
              {candlestickData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </div>

        {/* Line Chart */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Line Chart</h2>
          <LineChart width={400} height={300} data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Bar Chart */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Bar Chart</h2>
          <BarChart width={400} height={300} data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Pie Chart */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Pie Chart</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={pieChartData}
              cx={200}
              cy={150}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
