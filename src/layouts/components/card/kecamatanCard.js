import React from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Rating from '@mui/material/Rating'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'

const StyledGrid1 = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  // height: 100,
  [theme.breakpoints.down('md')]: {
    paddingTop: '0 !important'
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(3, 4.75),
    [theme.breakpoints.down('md')]: {
      paddingTop: 0
    }
  }
}))

function KecamatanCard({data}) {

  const router = useRouter()

  const handleDetail = (id_kec) => {
    router.push(`update-data/${id_kec}`)
  }


  return (
    <Grid item xs={12} sm={6} md={3}>
        <Card>
          <Grid container>
            <StyledGrid1 item xs={12}>
              <CardContent>
                <Typography  sx={{ marginBottom: 2, fontSize: 16 }}>
                 KECAMATAN {data.nama_kec}
                </Typography>
              
              </CardContent>
              <CardActions className='card-action-dense' sx={{ width: '100%' }}>
                {/* <Button>Detail</Button> */}
                <Button variant='contained' sx={{ py: 2, width: '100%'}} onClick={() => handleDetail(data.kode_kec)}>
                  Lihat Detail
                </Button>
              </CardActions>
            </StyledGrid1>
            
          </Grid>
        </Card>
        
      </Grid>
  )
}

export default KecamatanCard