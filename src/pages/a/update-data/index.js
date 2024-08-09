
import React, { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Rating from '@mui/material/Rating'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import KecamatanCard from 'src/layouts/components/card/kecamatanCard'



const getKecamatans = async () => {
  const options = {
    method: 'GET',
    url: 'https://db.bpstuban.my.id/api/v2/tables/mk3l0tnuzfhtg0a/records',
    headers: {
      'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
    }
  }

  try {
    const res = await axios(options)
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const handleClick = async () => {
  const datas = await getKecamatans()
  console.log(datas)
}

function UpdateData() {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const result = await getKecamatans()
      setData(result.list)
   
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return <Typography variant='h6'>Loading...</Typography>
  }

  return (

    <Grid container spacing={6}>
        {data.map((item, index) => (
        <KecamatanCard key={index} data={item} />
      ))}
      {/* <KecamatanCard data={data} /> */}
      
      
    </Grid>
  )
}

export default UpdateData