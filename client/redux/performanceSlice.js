import { createSlice } from '@reduxjs/toolkit';
import { fillGraph } from '../helperFunctions.js';
import axios from 'axios';

const initialState = {
  loading: true,
  latency: Array(15).fill({}),
  iops: Array(15).fill({}),
  //   hitRate: Array(2).fill({}),
  hitRate: [
    { name: 'keyspace_hits', value: 0, fill: '#00C49F' },
    { name: 'keyspace_misses', value: 0, fill: '#FF8042' },
    { name: 'keyspace_hits', value: 0, fill: '#00C49F' },
    { name: 'keyspace_misses', value: 0, fill: '#FF8042' },
  ],
  ratio: '0%',
  ratio: '0%',
};

let cache;

export const fetchPerformanceData = (api) => (dispatch, getState) => {
  if (api !== cache) {
    dispatch(performanceSlice.actions.clearState());
  }
  if (JSON.stringify(getState().performance.latency[0]) === '{}') {
    dispatch(performanceSlice.actions.startLoading());
  }
  axios
    .get(api)
    .then((res) => res.data)
    .then((data) => {
      dispatch(performanceSlice.actions.addToGraph(data));
      dispatch(performanceSlice.actions.stopLoading());
    });
  cache = api;
};

const performanceSlice = createSlice({
  name: 'performance',
  initialState: initialState,
  reducers: {
    startLoading: (state, action) => {
      state.loading = true;
    },
    stopLoading: (state, action) => {
      state.loading = false;
    },
    addToGraph: (state, action) => {
      fillGraph(
        state.latency,
        'latency',
        action.payload.latency,
        'Live_Redis_latency'
      );
      fillGraph(state.iops, 'iops', action.payload.iops, 'iops');
      state.hitRate[0].value = Number(action.payload.hitRate.keyspace_hits);
      state.hitRate[1].value = Number(action.payload.hitRate.keyspace_misses);
      state.ratio = `${Number(action.payload.hitRate.ratio).toFixed(3)}%`;
    },
    clearState: (state, action) => {
      state.loading = true;
      state.latency = Array(15).fill({});
      state.iops = Array(15).fill({});
      //   hitRate: Array(2).fill({}),
      state.hitRate = [
        { name: 'keyspace_hits', value: 0, fill: '#00C49F' },
        { name: 'keyspace_misses', value: 0, fill: '#FF8042' },
        { name: 'keyspace_hits', value: 0, fill: '#00C49F' },
        { name: 'keyspace_misses', value: 0, fill: '#FF8042' },
      ];
      state.ratio = '0%';
      state.ratio = '0%';
    },
  },
});

export const { startLoading, stopLoading } = performanceSlice.actions;

export default performanceSlice.reducer;
