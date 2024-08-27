// ** MUI Imports
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// ** Icons Imports
import { BabyBottle } from 'mdi-material-ui';

// ** React Imports
import { useEffect, useState } from 'react';
import { supabase } from 'src/pages/api/supabase';

const getAgeRange = () => {
  const today = new Date();
  const endDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()); // End date for age 1
  const startDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate()); // Start date for age 4
  return { startDate, endDate };
};


const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const downloadCSV = async (startDateStr, endDateStr) => {
  try {
    let allData = [];
    let shouldFetchMore = true;
    let offset = 0;
    const limit = 1000;

    while (shouldFetchMore) {
      const { data, error } = await supabase
        .from('penduduks')
        .select('*')
        .gte('tgl_lahir', startDateStr)
        .lte('tgl_lahir', endDateStr)
        .range(offset, offset + limit - 1);

      if (error) throw error;

      if (data.length > 0) {
        allData = allData.concat(data);
        offset += limit;
        if (data.length < limit) {
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

    // Generate CSV content
    const csvHeaders = ['nik', 'nama kepala keluarga', 'nama', 'nama ayah', 'nama ibu'];
    const csvRows = [
      csvHeaders.join(','), // CSV header
      ...allData.map(row => [
        row.nik || '',
        row.nama_kk || '',
        row.nama_pddk || '',
        row.ayah || '',
        row.ibu || ''
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'balita_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CSV:', error.message);
  }
};

const BalitaCard = () => {
  const [balitaCount, setBalitaCount] = useState(0);
  const [balitaData, setBalitaData] = useState([]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchBalitaData = async () => {
      try {
        const { startDate, endDate } = getAgeRange();
        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);

        const { data, error } = await supabase
          .from('penduduks')
          .select('nik, nama_kk, nama_pddk, ayah, ibu, tgl_lahir')
          .gte('tgl_lahir', startDateStr)
          .lte('tgl_lahir', endDateStr);

        if (error) {
          throw error;
        }

        console.log("balita:", data);

        setBalitaCount(data.length);
        setBalitaData(data);
      } catch (error) {
        console.error('Error fetching penduduks data:', error);
      }
    };

    fetchBalitaData();
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
        <Avatar
          sx={{ width: 50, height: 50, marginBottom: 2.25, color: 'common.white', backgroundColor: 'primary.main' }}
        >
          <BabyBottle sx={{ fontSize: '2rem' }} />
        </Avatar>
        <Typography variant='h6' sx={{ marginBottom: 2.75 }}>
          Balita
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 6 }}>
          Terdapat {balitaCount} penduduk Balita di Desa Plumpang
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
      </CardContent>
    </Card>
  );
};

export default BalitaCard;
