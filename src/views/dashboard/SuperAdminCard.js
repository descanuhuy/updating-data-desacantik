// // // ** MUI Imports
// // import Box from '@mui/material/Box'
// // import Grid from '@mui/material/Grid'
// // import Card from '@mui/material/Card'
// // import Avatar from '@mui/material/Avatar'
// // import CardHeader from '@mui/material/CardHeader'
// // import IconButton from '@mui/material/IconButton'
// // import Typography from '@mui/material/Typography'
// // import CardContent from '@mui/material/CardContent'

// // // ** Icons Imports
// // import TrendingUp from 'mdi-material-ui/TrendingUp'
// // import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
// // import DotsVertical from 'mdi-material-ui/DotsVertical'
// // import CellphoneLink from 'mdi-material-ui/CellphoneLink'
// // import AccountOutline from 'mdi-material-ui/AccountOutline'
// // import { AccountSupervisorOutline, Collage } from 'mdi-material-ui'

// // const statistikData = [
// //   {
// //     stats: '20',
// //     title: 'Kecamatan',
// //     color: 'primary',
// //     icon: <Collage sx={{ fontSize: '1.75rem' }} />
// //   },
// //   {
// //     stats: '20',
// //     title: 'Desa',
// //     color: 'secondary',
// //     icon: <Collage sx={{ fontSize: '1.75rem' }} />
// //   },
// //   {
// //     stats: '20',
// //     title: 'SLS',
// //     color: 'warning',
// //     icon: <Collage sx={{ fontSize: '1.75rem' }} />
// //   },
// //   {
// //     stats: '200',
// //     title: 'Keluarga',
// //     color: 'success',
// //     icon: <AccountSupervisorOutline sx={{ fontSize: '1.75rem' }} />
// //   },
// //   {
// //     stats: '1.54k',
// //     color: 'info',
// //     title: 'Penduduk',
// //     icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
// //   },
// // ]

// // const renderStats = () => {
// //   return statistikData.map((item, index) => (
// //     <Grid item xs={12} sm={2} columnGap={2} rowGap={2} key={index}>
// //       <Box key={index} sx={{ display: 'flex', alignItems: '', justifyContent: '' }}>
// //         <Avatar
// //           variant='rounded'
// //           sx={{
// //             mr: 3,
// //             width: 44,
// //             height: 44,
// //             boxShadow: 3,
// //             color: 'common.white',
// //             backgroundColor: `${item.color}.main`
// //           }}
// //         >
// //           {item.icon}
// //         </Avatar>
// //         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
// //           <Typography variant='caption'>{item.title}</Typography>
// //           <Typography variant='h6'>{item.stats}</Typography>
// //         </Box>
// //       </Box>
// //     </Grid>
// //   ))
// // }

// // const SuperAdminCard = () => {
// //   return (
// //     <Card>
// //       <CardHeader
// //         title='Statistik'
// //         action={
// //           <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
// //             <DotsVertical />
// //           </IconButton>
// //         }
// //         subheader={
// //           <Typography variant='body2'>
// //             KABUPATEN TUBAN
// //              {/* <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
// //               Total 48.5% growth
// //             </Box>{' '}
// //             😎 this month */}
// //           </Typography>
// //         }
// //         titleTypographyProps={{
// //           sx: {
// //             mb: 1,
// //             lineHeight: '2rem !important',
// //             letterSpacing: '0.15px !important'
// //           }
// //         }}
// //       />
// //       <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
// //         <Grid container spacing={[5, 0]}>
// //           {renderStats()}
// //         </Grid>
// //       </CardContent>
// //     </Card>
// //   )
// // }

// // export default SuperAdminCard

// import { useEffect, useState } from 'react'

// // ** MUI Imports
// import Box from '@mui/material/Box'
// import Grid from '@mui/material/Grid'
// import Card from '@mui/material/Card'
// import Avatar from '@mui/material/Avatar'
// import CardHeader from '@mui/material/CardHeader'
// import IconButton from '@mui/material/IconButton'
// import Typography from '@mui/material/Typography'
// import CardContent from '@mui/material/CardContent'

// // ** Icons Imports
// import { Collage, AccountSupervisorOutline, AccountOutline, DotsVertical } from 'mdi-material-ui'
// import { supabase } from 'src/pages/api/supabase'

// const SuperAdminCard = () => {
//   const [statistikData, setStatistikData] = useState([
//     {
//       stats: '0',
//       title: 'Kecamatan',
//       color: 'primary',
//       icon: <Collage sx={{ fontSize: '1.75rem' }} />
//     },
//     {
//       stats: '0',
//       title: 'Desa',
//       color: 'secondary',
//       icon: <Collage sx={{ fontSize: '1.75rem' }} />
//     },
//     {
//       stats: '0',
//       title: 'SLS',
//       color: 'warning',
//       icon: <Collage sx={{ fontSize: '1.75rem' }} />
//     },
//     {
//       stats: '0',
//       title: 'Keluarga',
//       color: 'success',
//       icon: <AccountSupervisorOutline sx={{ fontSize: '1.75rem' }} />
//     },
//     {
//       stats: '0',
//       color: 'info',
//       title: 'Penduduk',
//       icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
//     },
//   ])

//   const fetchData = async () => {
//     try {
//       const { count: kecamatanCount, error: kecamatanError } = await supabase
//         .from('kecamatan')
//         .select('*', { count: 'exact' });

//       const { count: desaCount, error: desaError } = await supabase
//         .from('desa_kelurahan')
//         .select('*', { count: 'exact' });

//       const { count: slsCount, error: slsError } = await supabase
//         .from('sls')
//         .select('*', { count: 'exact' });

//       if (kecamatanError || desaError || slsError) {
//         console.error('Error fetching data:', kecamatanError || desaError || slsError);
//       } else {
//         setStatistikData(prevData => [
//           { ...prevData[0], stats: kecamatanCount },
//           { ...prevData[1], stats: desaCount },
//           { ...prevData[2], stats: slsCount },
//           ...prevData.slice(3) // Keep the remaining items unchanged
//         ]);
//       }
//     } catch (err) {
//       console.error('Unexpected error fetching data:', err);
//     }
//   }

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const renderStats = () => {
//     return statistikData.map((item, index) => (
//       <Grid item xs={12} sm={2} columnGap={2} rowGap={2} key={index}>
//         <Box key={index} sx={{ display: 'flex', alignItems: '', justifyContent: '' }}>
//           <Avatar
//             variant='rounded'
//             sx={{
//               mr: 3,
//               width: 44,
//               height: 44,
//               boxShadow: 3,
//               color: 'common.white',
//               backgroundColor: `${item.color}.main`
//             }}
//           >
//             {item.icon}
//           </Avatar>
//           <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//             <Typography variant='caption'>{item.title}</Typography>
//             <Typography variant='h6'>{item.stats}</Typography>
//           </Box>
//         </Box>
//       </Grid>
//     ))
//   }

//   return (
//     <Card>
//       <CardHeader
//         title='Statistik'
//         action={
//           <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
//             <DotsVertical />
//           </IconButton>
//         }
//         subheader={
//           <Typography variant='body2'>
//             KABUPATEN TUBAN
//           </Typography>
//         }
//         titleTypographyProps={{
//           sx: {
//             mb: 1,
//             lineHeight: '2rem !important',
//             letterSpacing: '0.15px !important'
//           }
//         }}
//       />
//       <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
//         <Grid container spacing={[5, 0]}>
//           {renderStats()}
//         </Grid>
//       </CardContent>
//     </Card>
//   )
// }

// export default SuperAdminCard

import { useEffect, useState } from 'react'

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
import { Collage, AccountSupervisorOutline, AccountOutline, DotsVertical } from 'mdi-material-ui'
import { supabase } from 'src/pages/api/supabase'

const SuperAdminCard = () => {
  const [statistikData, setStatistikData] = useState([
    {
      stats: '0',
      title: 'Kecamatan',
      color: 'primary',
      icon: <Collage sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: '0',
      title: 'Desa',
      color: 'secondary',
      icon: <Collage sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: '0',
      title: 'SLS',
      color: 'warning',
      icon: <Collage sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: '0', // Updated dynamically
      title: 'Keluarga',
      color: 'success',
      icon: <AccountSupervisorOutline sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: '0', // Updated dynamically
      color: 'info',
      title: 'Penduduk',
      icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
    },
  ])

  const fetchData = async () => {
    try {
      const { count: kecamatanCount, error: kecamatanError } = await supabase
        .from('kecamatan')
        .select('*', { count: 'exact' });

      const { count: desaCount, error: desaError } = await supabase
        .from('desa_kelurahan')
        .select('*', { count: 'exact' });

      const { count: slsCount, error: slsError } = await supabase
        .from('sls')
        .select('*', { count: 'exact' });

      const { count: pendudukCount, error: pendudukError } = await supabase
        .from('penduduks')
        .select('*', { count: 'exact' });

      const { count: keluargaCount, error: keluargaError } = await supabase
        .from('penduduks')
        .select('*', {count: 'exact'}).eq('shdk', 'Kepala Keluarga')

      if (kecamatanError || desaError || slsError || pendudukError || keluargaError) {
        console.error('Error fetching data:', kecamatanError || desaError || slsError || pendudukError || keluargaError);
      } else {
        setStatistikData(prevData => [
          { ...prevData[0], stats: kecamatanCount },
          { ...prevData[1], stats: desaCount },
          { ...prevData[2], stats: slsCount },
          { ...prevData[3], stats: keluargaCount },
          { ...prevData[4], stats: pendudukCount }
        ]);
      }
    } catch (err) {
      console.error('Unexpected error fetching data:', err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const renderStats = () => {
    return statistikData.map((item, index) => (
      <Grid item xs={12} sm={2} columnGap={2} rowGap={2} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: '', justifyContent: '' }}>
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
            <Typography variant='h6'>{
              new Intl.NumberFormat('id-ID').format(item.stats)
              }</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }

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
            KABUPATEN TUBAN
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

export default SuperAdminCard
