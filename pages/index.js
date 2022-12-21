import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";

import 'swiper/css';
import 'swiper/css/navigation';

import { 
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography
} from '@mui/material';

function HomePage() {
  
  return (
    <Grid
      container
      direction="row"
    >
      <Grid item xs={12}>
        <Swiper 
          navigation={true} 
          modules={[Navigation]} 
          // className="mySwiper"
          style={{ height: '500px', textAlign: 'center' }}
        >
          <SwiperSlide style={{ width: '100%', height: '100%', textAlign: 'center'}}>Slide 1</SwiperSlide>
          <SwiperSlide style={{ width: '100%', height: '100%', textAlign: 'center'}}>Slide 2</SwiperSlide>
          <SwiperSlide style={{ width: '100%', height: '100%', textAlign: 'center'}}>Slide 3</SwiperSlide>
          <SwiperSlide style={{ width: '100%', height: '100%', textAlign: 'center'}}>Slide 4</SwiperSlide>
        </Swiper>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="row">
          <Grid item xs={4}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Apparel</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Accessories</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Projects</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} textAlign="left">
        <Typography variant="h4" gutterBottom>Trending Now</Typography>
        <Grid container direction="row">
          <Grid item xs={3}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Top 1</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Top 2</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Top 3</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Top 4</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} textAlign="left">
        <Typography variant="h3" gutterBottom>Shop by collection</Typography>
        <Grid container direction="row">
          <Grid item xs={3}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Project 1</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Project 2</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Project 3</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Project 4</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Project 5</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Project 6</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Project 7</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ borderRadius: '16px', margin: '15px' }}>
              <CardContent>
                image
              </CardContent>
              <CardActions>
                <Button>Project 8</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default HomePage

