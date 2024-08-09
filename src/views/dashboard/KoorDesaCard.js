// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import { AccountSupervisorOutline, Collage } from 'mdi-material-ui'

const statistikData = [
  {
    stats: '20',
    title: 'SLS',
    color: 'primary',
    icon: <Collage sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: '200',
    title: 'Keluarga',
    color: 'success',
    icon: <AccountSupervisorOutline sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: '1.54k',
    color: 'info',
    title: 'Penduduk',
    icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
  },
]

const renderStats = () => {
  return statistikData.map((item, index) => (
    <Grid item xs={12} sm={4} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: `${item.color}.main`
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const KoorDesaCard = () => {
  return (
    <Card>
      <CardHeader
        title='Statistik'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            DESA PEKEWUH  
            {/* <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Total 48.5% growth
            </Box>{' '}
            😎 this month */}
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 1,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default KoorDesaCard
