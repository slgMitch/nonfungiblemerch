import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Grid,
  Backdrop,
  CircularProgress,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";

export default function CustomVariant(props) {
    const { products, variant } = props
    console.log('{ products, variant }', { products, variant });
    return (
        <Grid
        container
        direction='row'
    >
        <Typography>Custom Variant by External Id</Typography>

    </Grid>
    )
}



export async function getServerSideProps(context) {
  const { syncProductId, syncVariantId } = context.params;
  console.log("{ syncProductId, syncVariantId }", { syncProductId, syncVariantId });
  const response = await fetch(`http://localhost:3000/api/product/${syncProductId}/variant/${syncVariantId}`);
  const { products, variant } = await response.json()
  console.log('getServerSideProps data', { products, variant });
  return {
    props: {
        products,
        variant
    }
  }
}
