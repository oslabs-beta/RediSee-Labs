import React from "react";
import { useSelector } from "react-redux";
import { GraphBox } from "../StyledComponents/GraphGrid";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function Latency() {
  const keyspace = useSelector((state) => state.basicActivity.keyspace);
  console.log(keyspace);
  return (
    <GraphBox>
      <h3>Keyspaces</h3>
      <BarChart width={730} height={250} data={keyspace}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis padding={{ top: 20 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="keyspace" fill="#8884d8" />
      </BarChart>
    </GraphBox>
  );
}