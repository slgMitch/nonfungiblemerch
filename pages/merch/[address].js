import { useState, useEffect, useContext } from 'react';
import { 
  Typography, 
  Button, 
  Grid, 
  Backdrop,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  CardActionArea
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';


export default function Merch(props) {
  const [merch, setMerch] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const { data: session } = useSession()
  const { address } = props
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const url = `/api/merch/${address}`;
  const { data, error } = useSWR(url, fetcher);

  useEffect(() => {
    setIsLoading(true)
    setMerch(data)
    setIsLoading(false)

  }, [data])

  const addMerch = (merchType) => {
    push(`/merch/add/${merchType}`)
  }

  const viewAll = (merchType) => {
    push(`/merch/${merchType}`)
  }

  const viewMerch = (id) => {
    console.log('hheres the selected id', id)
  }

  if(error) {
    return <p>Failed to load... {error}</p>
}

if(!data || !merch || isLoading) {
    return (
        <Backdrop
            open={!merch || isLoading}
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}


  return (
    <Grid container direction="row">
      <Grid item xs={12} textAlign="center" >
          <Typography variant="h3" gutterBottom>My NonFungible Merch</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h4" gutterBottom>Shirts</Typography>
      </Grid>
      <Grid item xs={8}>
        <Grid container justifyContent="flex-end">
          <Button onClick={() => addMerch('t-shirts')}>Add Shirt</Button>
          <Button onClick={() => viewAll('t-shirts')}>View All</Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid
          container
          spacing={3}
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          {
            merch && merch.map((m) => (
              <Grid item xs={3} key={m._id}>
                <Card 
                  key={m._id} 
                  onClick={() => viewMerch(m._id)}
                >
                  <CardActionArea>
                    <CardMedia 
                      component="img"
                      image={m.productImageUrl}
                      alt={m.productName}

                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {m.productName}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          }

        </Grid>
      </Grid>
    </Grid>
  );
}

export async function getServerSideProps(context) {
  const {address} = context.params
  return {
      props: {
        address
      }
  }
}



