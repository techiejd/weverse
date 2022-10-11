import type { NextPage } from 'next'
import {useState, useEffect} from 'react'
import {Candidate, Media, VotesRes } from '../../modules/sofia/schemas';
import * as React from 'react';

import Cards from './card';
import Grid from '@mui/material/Grid';

const Challenge: NextPage = () => {
    const[candidates,setCandidates]= useState<Array<Candidate>>([]);
    const voteFetch=async()=>{
      const response = await fetch('http://localhost:3000/api/vote?psid=5813040455394701');
      const voteInfo = await response.json();
      console.log(voteInfo)
        setCandidates(voteInfo.candidates);
    }
    useEffect(() => {
      voteFetch();
    },[]);

  return (<>
        {candidates ?(<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

          {candidates.map(can=>(
              <Grid xs={8}>
                <Cards key={can.id} candidate={can}/>
              </Grid>
          ))}
          
        </Grid>):(<>
          loading...
        </>)}
      </>)
};

export default Challenge
