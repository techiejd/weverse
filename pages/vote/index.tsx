import type { NextPage } from 'next'
import {useState, useEffect} from 'react'
import {Candidate, Media, VotesRes } from '../../modules/sofia/schemas';
import styles from "../../styles/Home.module.css";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Carousel from 'react-material-ui-carousel';



const RespuestaVotes : VotesRes = {
  candidates: [
    {
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      id:"aksdlasdjlasd",
      medias:[{
              height: 50,
              width: 50,
              image:"https://firebasestorage.googleapis.com/v0/b/mavifun-e06ed.appspot.com/o/pantalon%20Pat%201.png?alt=media&token=f54db53d-1dc7-4fe4-baeb-4a79a02bf493",
              type:"image"
          },
      ]
    },
    {
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      id:"asdasd",
      medias:[
        {
          height: 50,
          width: 50,
          image:"https://firebasestorage.googleapis.com/v0/b/mavifun-e06ed.appspot.com/o/pantalon%20Pat%201.png?alt=media&token=f54db53d-1dc7-4fe4-baeb-4a79a02bf493",
          type:"image"
        },
        {
          height: 50,
          width: 50,
          image:"https://firebasestorage.googleapis.com/v0/b/mavifun-e06ed.appspot.com/o/pantalon%20Pat%201.png?alt=media&token=f54db53d-1dc7-4fe4-baeb-4a79a02bf493",
          type:"image"
      }
    ]
  }],
  starAllowance: 5,
  psid: "5813040455394701"
}

const Challenge: NextPage = () => {
    const[candidates,setCandidates]= useState<Array<Candidate>>([]);
    const[images,setImages]= useState<Array<Media>>([]); 
    // const voteFetch=async()=>{
    //   // let data = await fs.promises.readFile(RespuestaVotes,'utf-8');
    //   // let result = JSON.parse(data);
    //   // console.log(result);
    //   // const response = await fetch('http://localhost:3000/api/vote?psid=5813040455394701');
    //   // const voteInfo = votesRes.parse(await response.json());
    //   // console.log(voteInfo)
    //     // setCandidates(voteInfo.candidates);
    // }
    // useEffect(() => {
      // voteFetch();
    // });
    useEffect(() => {
      setCandidates(RespuestaVotes.candidates);
      candidates.forEach(candidate =>{
        if (candidate.medias != undefined) {
          setImages(images.concat(candidate.medias));
        }
      });
        
      console.log(images);

    })
    

  return (<>
        {candidates ?(<div className={styles.GridPost}>
          {candidates.map((can)=>(
              <Card sx={{ maxWidth: 345 }}>
                {can.medias?(<>
                  <Carousel>
                    {can.medias.map((m, i)=>(
                      <CardMedia
                      component="img"
                      height={m.height}
                      image={m.image}
                      alt="green iguana"
                    />
                    ))}
                  </Carousel>
                </>):(<></>)}
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {can.message}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
              </Card>
            ))}
        </div>):(<>
          loading...
        </>)}
      </>)
};

export default Challenge
