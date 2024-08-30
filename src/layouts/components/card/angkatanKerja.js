import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { Briefcase } from 'mdi-material-ui';
import { useEffect, useState } from 'react';
import { supabase } from 'src/pages/api/supabase';

// Utility function to calculate date range for age 15-64
const getAgeRange = () => {
  const today = new Date();
  const endDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
  const startDate = new Date(today.getFullYear() - 64, today.getMonth(), today.getDate());
  return { startDate, endDate };
};

// Utility function to format date in yyyy-mm-dd
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const UsiaKerjaCard = () => {
  const [usiaKerjaCount, setUsiaKerjaCount] = useState(0);
  const [usiaKerjaData, setUsiaKerjaData] = useState([]);
  const [downloading, setDownloading] = useState(false);

  const downloadCSV = async (startDateStr, endDateStr) => {
    setDownloading(true);
    try {
      let allData = [];
      let shouldFetchMore = true;
      let offset = 0;
      const limit = 1000;

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
          if (data.length < limit || offset >= count) {
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
      const csvHeaders = ['nik', 'nama kepala keluarga', 'nama', 'nama ayah', 'nama ibu', 'tgl lahir', 'alamat'];
      const csvRows = [
        csvHeaders.join(','), // CSV header
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
      a.download = 'usia_produktif_data.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error.message);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const kodeKec = localStorage.getItem('kode_kec');
    const kodeDesa = localStorage.getItem('kode_desa');
    const fetchUsiaKerjaData = async () => {
      try {
        const { startDate, endDate } = getAgeRange();
        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);

        let allData = [];
        let offset = 0;
        const limit = 1000;
        let shouldFetchMore = true;

        while (shouldFetchMore) {
          const { data, error, count } = await supabase
            .from('penduduks')
            .select('nik, nama_kk, nama_pddk, ayah, ibu, tgl_lahir', { count: 'exact' })
            .gte('tgl_lahir', startDateStr)
            .lte('tgl_lahir', endDateStr)
            .eq('kode_kec', kodeKec)
            .eq('kode_desa', kodeDesa) 
            .range(offset, offset + limit - 1);

          if (error) throw error;

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

        setUsiaKerjaCount(allData.length);
        setUsiaKerjaData(allData);
      } catch (error) {
        console.error('Error fetching penduduks data:', error);
      }
    };

    fetchUsiaKerjaData();
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
          <Briefcase sx={{ fontSize: '2rem' }} />
        </Avatar>
        <Typography variant='h6' sx={{ marginBottom: 2.75 }}>
          Usia Produktif
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 6 }}>
          Terdapat {usiaKerjaCount} Penduduk Usia Produktif di Desa Plumpang
        </Typography>
        <Button 
          variant='contained' 
          sx={{ padding: theme => theme.spacing(1.75, 5.5) }}
          onClick={() => downloadCSV(startDateStr, endDateStr)}
          disabled={downloading}
        >
          {downloading ? 'Downloading...' : 'Unduh'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UsiaKerjaCard;
