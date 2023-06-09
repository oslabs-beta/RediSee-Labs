import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { closeForm, addOneRedis } from '../redux/globalSlice';
import { FormModal, Input } from './StyledComponents/Form';

function Form() {
  const [redisName, typeRedisName] = useState('');
  const [port, typePort] = useState('');
  const [host, typeHost] = useState('');
  const dispatch = useDispatch();

  const redisNameChange = (e) => {
    typeRedisName(e.target.value);
  };
  const portChange = (e) => {
    typePort(e.target.value);
  };
  const hostChange = (e) => {
    typeHost(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addOneRedis({
        redisName,
        port,
        host,
      })
    );
  };

  return (
    <FormModal onClick={() => dispatch(closeForm())}>
      <form
        onClick={(e) => {
          e.stopPropagation();
        }}
        onSubmit={handleSubmit}
      >
        <h2>Connect with your Redis</h2>
        <label>Redis Name:</label>
        <br />
        <Input
          type='text'
          value={redisName}
          required
          onChange={(e) => {
            redisNameChange(e);
          }}
        />
        <br />

        <label>Port:</label>
        <br />
        <Input
          value={port}
          required
          onChange={(e) => {
            portChange(e);
          }}
        />
        <br />
        <label>Host:</label>
        <br />
        <Input
          type='text'
          value={host}
          required
          onChange={(e) => {
            hostChange(e);
          }}
        />
        <br />
        <button
          onClick={(e) => {
            handleSubmit(e);
          }}
          type='submit'
        >
          Submit
        </button>
      </form>
    </FormModal>
  );
}

export default Form;
