// import React, { useEffect, useState } from 'react'

// import Box from '@mui/material/Box'
// import Card from '@mui/material/Card'
// import Rating from '@mui/material/Rating'
// import Button from '@mui/material/Button'
// import { styled } from '@mui/material/styles'
// import Typography from '@mui/material/Typography'
// import CardContent from '@mui/material/CardContent'
// import CardActions from '@mui/material/CardActions'
// import Grid from '@mui/material/Grid'
// import axios from 'axios'
// import KecamatanCard from 'src/layouts/components/card/kecamatanCard'
// import { supabase } from 'src/pages/api/supabase'
// import Breadcrumb from 'src/layouts/components/breadcrumb'


// function UpdateData() {

//   const [data, setData] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchData = async () => {      
    
//     let { data: kecamatan, error } = await supabase
//     .from('kecamatan')
//     .select('*')

//     setData(kecamatan);
//     setLoading(false);
        
//     }

//     fetchData()
//   }, [])

//   if (loading) {
//     return <Typography variant='h6'>Loading...</Typography>
//   }

//   return (
//       <Grid container spacing={6}>
//         {data.map((item, index) => (
//           <KecamatanCard key={index} data={item} />
//         ))}
//       </Grid>
//   )
// }

// export default UpdateData

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import KecamatanCard from 'src/layouts/components/card/kecamatanCard';
import { supabase } from 'src/pages/api/supabase';

function UpdateData() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check the role and redirect accordingly
    const role = localStorage.getItem('role');
    const kodeKec = localStorage.getItem('kode_kec');
    const kodeDesa = localStorage.getItem('kode_desa');

    if (role === 'koor_desa' || role === 'enum_desa') {
      router.push(`/admin/update-data/${kodeKec}/${kodeDesa}`);
    } else if (role === 'koor_kec' || role === 'enum_kec') {
      router.push(`/admin/update-data/${kodeKec}`);
    }

    const fetchData = async () => {      
      let { data: kecamatan, error } = await supabase
        .from('kecamatan')
        .select('*');

      if (!error) {
        setData(kecamatan);
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <Typography variant='h6'>Loading...</Typography>;
  }

  return (
    <Grid container spacing={6}>
      {data.map((item, index) => (
        <KecamatanCard key={index} data={item} />
      ))}
    </Grid>
  );
}

export default UpdateData;
