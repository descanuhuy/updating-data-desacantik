import Grid from '@mui/material/Grid'
import React from 'react'
import UsiaKerjaCard from 'src/layouts/components/card/angkatanKerja'
import BalitaCard from 'src/layouts/components/card/balitaCard'
import BatitaCard from 'src/layouts/components/card/batitaCard'
import RemajaCard from 'src/layouts/components/card/remajaCard'
import CardSupport from 'src/views/cards/CardSupport'

function Statistik() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={4}>
        <BalitaCard />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <BatitaCard />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <RemajaCard />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <UsiaKerjaCard />
      </Grid>
    </Grid>
  )
}

export default Statistik