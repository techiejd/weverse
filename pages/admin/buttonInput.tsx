import React, { Component } from 'react';

export const ButtonInput = () => {
  return (<div>
    <label><input type="radio" id="cbox1" value="first_checkbox"/> Url</label><br/>
    <label><input type="radio" id="cbox2" value="first_checkbox"/> Payload</label><br/>
    {/* <input type="checkbox">Payload</input> */}
  </div>)
}