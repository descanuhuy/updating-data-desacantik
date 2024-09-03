// // ** MUI Imports
// import Card from '@mui/material/Card';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import CardContent from '@mui/material/CardContent';

// // ** Icons Imports
// import { Baby, BabyBottle } from 'mdi-material-ui';

// // ** React Imports
// import { useEffect, useState } from 'react';
// import { supabase } from 'src/pages/api/supabase';
// import { CircularProgress } from '@mui/material';

// // Utility function to calculate date range for age 1-2
// const getAgeRange = () => {
//   const today = new Date();
//   const endDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
//   const startDate = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
//   return { startDate, endDate };
// };

// // Utility function to format date in yyyy-mm-dd
// const formatDate = (date) => {
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${year}-${month}-${day}`;
// };

// // Utility function to generate and download CSV
// const downloadCSV = async (startDateStr, endDateStr) => {
//   try {
//     let allData = [];
//     let shouldFetchMore = true;
//     let offset = 0;
//     const limit = 1000;

//     while (shouldFetchMore) {
//       const { data, error } = await supabase
//         .from('penduduks')
//          .select(`
//             nik,
//             nama_kk,
//             nama_pddk,
//             ayah,
//             ibu,
//             tgl_lahir,
//             wilayah_terkecil_id (nama_sls)
//           `)
//         .gte('tgl_lahir', startDateStr)
//         .lte('tgl_lahir', endDateStr)
//         .range(offset, offset + limit - 1);

//       if (error) throw error;

//       if (data.length > 0) {
//         allData = allData.concat(data);
//         offset += limit;
//         if (data.length < limit) {
//           shouldFetchMore = false;
//         }
//       } else {
//         shouldFetchMore = false;
//       }
//     }

//     if (allData.length === 0) {
//       console.warn('No data to download');
//       return;
//     }

//     const csvHeaders =  ['nik', 'nama kepala keluarga', 'nama', 'nama ayah', 'nama ibu', 'tgl lahir', 'alamat'];
//     const csvRows = [
//       csvHeaders.join(','),
//       ...allData.map(row => [
//         row.nik || '',
//         row.nama_kk || '',
//         row.nama_pddk || '',
//         row.ayah || '',
//         row.ibu || '',
//         row.tgl_lahir || '',
//         row.wilayah_terkecil_id.nama_sls || '',
//       ].join(','))
//     ];

//     const csvContent = csvRows.join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'batita_data.csv';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error('Error downloading CSV:', error.message);
//   }
// };

// const BatitaCard = () => {
//   const [batitaCount, setBatitaCount] = useState(0);
//   const [batitaData, setBatitaData] = useState([]);
//   const [downloading, setDownloading] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     const kodeKec = localStorage.getItem('kode_kec');
//     const kodeDesa = localStorage.getItem('kode_desa');
//     const fetchBatitaData = async () => {
//       try {
//         const { startDate, endDate } = getAgeRange();
//         const startDateStr = formatDate(startDate);
//         const endDateStr = formatDate(endDate);

//         const { data, error } = await supabase
//           .from('penduduks')
//           .select('nik, nama_kk, nama_pddk, ayah, ibu, tgl_lahir')
//           .gte('tgl_lahir', startDateStr)
//           .lte('tgl_lahir', endDateStr)
//           .eq('kode_kec', kodeKec)  // Apply kode_kec filter
//           .eq('kode_desa', kodeDesa) //

//         if (error) {
//           throw error;
//         }


//         setBatitaCount(data.length);
//         setBatitaData(data);
//       } catch (error) {
//         console.error('Error fetching penduduks data:', error);
//       }
//       setLoading(false);
//     };

//     fetchBatitaData();
//   }, []);

//   const { startDate, endDate } = getAgeRange();
//   const startDateStr = formatDate(startDate);
//   const endDateStr = formatDate(endDate);

//   return (
//     <Card>
//       <CardContent
//         sx={{
//           display: 'flex',
//           textAlign: 'center',
//           alignItems: 'center',
//           flexDirection: 'column',
//           padding: theme => `${theme.spacing(9.75, 5, 9.25)} !important`
//         }}
//       >

//         {loading ? (<>
//           <CircularProgress />
//         </>) : (<>
//         <Avatar
//           sx={{ width: 50, height: 50, marginBottom: 2.25, color: 'common.white', backgroundColor: 'primary.main' }}
//           >
//           <BabyBottle sx={{ fontSize: '2rem' }} />
//         </Avatar>
//         <Typography variant='h6' sx={{ marginBottom: 2.75 }}>
//           Batita
//         </Typography>
//         <Typography variant='body2' sx={{ marginBottom: 6 }}>
//           Terdapat {batitaCount} penduduk Batita di Desa Plumpang
//         </Typography>
//         <Button 
//           variant='contained' 
//           sx={{ padding: theme => theme.spacing(1.75, 5.5) }}
//           onClick={() => {
//             setDownloading(true);
//             downloadCSV(startDateStr, endDateStr).finally(() => setDownloading(false));
//           }}
//           disabled={downloading}
//         >
//           {downloading ? 'Downloading...' : 'Unduh'}
//         </Button>
//         </>)}
//       </CardContent>
//     </Card>
//   );
// };

// export default BatitaCard;

import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { ArmFlex, Baby, BabyBottle } from 'mdi-material-ui';
import { useEffect, useState } from 'react';
import { supabase } from 'src/pages/api/supabase';
import { CircularProgress } from '@mui/material';

const getAgeRange = () => {
  const today = new Date();
  const endDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  const startDate = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
  return { startDate, endDate };
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const downloadCSV = async (startDateStr, endDateStr) => {
  try {
    let allData = [];
    let offset = 0;
    const limit = 1000;
    let shouldFetchMore = true;

    while (shouldFetchMore) {
      const { data, error, count } = await supabase
        .from('penduduks')
        .select(`
            nik,
            nama_kk,
            nama_pddk,
            ayah,
            ibu,
            tgl_lahir,
            wilayah_terkecil_id (nama_sls)
          `, { count: 'exact' })
        .gte('tgl_lahir', startDateStr)
        .lte('tgl_lahir', endDateStr)
        .range(offset, offset + limit - 1);

      if (error) throw error;

      if (data.length > 0) {
        allData = allData.concat(data);
        offset += limit;

        if (data.length < limit || allData.length >= count) {
          shouldFetchMore = false;
        }
      } else {
        shouldFetchMore = false;
      }
    }

    if (allData.length === 0) {
      console.warn('No data to download');
      return;
    }

    const csvHeaders = ['nik', 'nama kepala keluarga', 'nama', 'nama ayah', 'nama ibu', 'tgl lahir', 'alamat'];
    const csvRows = [
      csvHeaders.join(','),
      ...allData.map(row => [
        row.nik || '',
        row.nama_kk || '',
        row.nama_pddk || '',
        row.ayah || '',
        row.ibu || '',
        row.tgl_lahir || '',
        row.wilayah_terkecil_id.nama_sls || '',
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'remaja_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CSV:', error.message);
  }
};

const RemajaCard = () => {
  const [batitaCount, setbatitaCount] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [namaDesa, setNamaDesa] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    setLoading(true);
    const kodeKec = localStorage.getItem('kode_kec');
    const kodeDesa = localStorage.getItem('kode_desa');
    const namaDesa = localStorage.getItem('nama_desa');
    const role = localStorage.getItem('role'); 

    setUserRole(role);
    setNamaDesa(namaDesa);

    const fetchRemajaData = async () => {
      try {
        const { startDate, endDate } = getAgeRange();
        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);

        let allData = [];
        let offset = 0;
        const limit = 1000;
        let shouldFetchMore = true;

        const query = supabase
          .from('penduduks')
          .select('nik, nama_kk, nama_pddk, ayah, ibu, tgl_lahir', { count: 'exact' })
          .eq('kode_kec', kodeKec)
          .gte('tgl_lahir', startDateStr)
          .lte('tgl_lahir', endDateStr);

        // Add kodeDesa condition if it's not empty
        if (kodeDesa && role !== 'koor_kec' && role !== 'enum_kec') {
          query.eq('kode_desa', kodeDesa);
        }

        while (shouldFetchMore) {
          const { data, error, count } = await query.range(offset, offset + limit - 1);

          if (error) {
            throw error;
          }

          if (data.length > 0) {
            allData = allData.concat(data);
            offset += limit;
            if (data.length < limit || offset >= count) {
              shouldFetchMore = false;
            }
          } else {
            shouldFetchMore = false;
          }
        }

        setbatitaCount(allData.length);
      } catch (error) {
        console.error('Error fetching penduduks data:', error);
      }
      setLoading(false);
    };

    fetchRemajaData();
  }, []);

  const { startDate, endDate } = getAgeRange();
  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);

  return (
    <Card>
      <CardContent
        sx={{
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: theme => `${theme.spacing(9.75, 5, 9.25)} !important`
        }}
      >
        {loading ? (<>
          <CircularProgress />
        </>) : (<>
        
        <Avatar
          sx={{ width: 50, height: 50, marginBottom: 2.25, color: 'common.white', backgroundColor: 'primary.main' }}
        >
          <BabyBottle sx={{ fontSize: '2rem' }} />
        </Avatar>
        <Typography variant='h6' sx={{ marginBottom: 2.75 }}>
          Batita
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 6 }}>
          {userRole === 'koor_kec' || userRole === 'enum_kec'
            ? `Terdapat ${batitaCount} penduduk Batita di kecamatan ini.`
            : `Terdapat ${batitaCount} penduduk Batita di Desa ${namaDesa}.`}
        </Typography>
        <Button 
          variant='contained' 
          sx={{ padding: theme => theme.spacing(1.75, 5.5) }}
          onClick={() => {
            setDownloading(true);
            downloadCSV(startDateStr, endDateStr).finally(() => setDownloading(false));
          }}
          disabled={downloading}
          >
          {downloading ? 'Downloading...' : 'Unduh'}
        </Button>
        </>)}
      </CardContent>
    </Card>
  );
};

export default RemajaCard;
