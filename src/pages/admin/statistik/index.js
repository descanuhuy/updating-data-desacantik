import Grid from '@mui/material/Grid'
import React from 'react'
import BalitaCard from 'src/layouts/components/card/balitaCard'
import CardSupport from 'src/views/cards/CardSupport'

function Statistik() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={4}>
        <BalitaCard />
      </Grid>
    </Grid>
  )
}

export default Statistik