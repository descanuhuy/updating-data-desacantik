
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DotsVertical from 'mdi-material-ui/DotsVertical';
import AccountOutline from 'mdi-material-ui/AccountOutline';
import { AccountSupervisorOutline, Collage } from 'mdi-material-ui';
import { supabase } from 'src/pages/api/supabase';
import { CircularProgress } from '@mui/material';

const KoorDesaCard = () => {
  const [stats, setStats] = useState({
    sls: 0,
    keluarga: 0,
    penduduk: 0,
  });

  const [loading, setLoading] = useState(false);
  const [namaDesa, setNamaDesa] = useState('');

  useEffect(() => {
    const fetchAllData = async (table, conditions = {}, additionalFilters = []) => {
      let allData = [];
      let shouldFetchMore = true;
      let offset = 0;
      const limit = 1000;

      while (shouldFetchMore) {
        let query = supabase.from(table).select('*').range(offset, offset + limit - 1);

        for (const [key, value] of Object.entries(conditions)) {
          query = query.eq(key, value);
        }

        for (const filter of additionalFilters) {
          query = query[filter.method](...filter.args);
        }

        const { data, error } = await query;

        if (error) {
          console.error(`Error fetching ${table} data:`, error);
          break;
        }

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

      return allData;
    };

    const fetchStats = async () => {
      setLoading(true);
      const kodeKec = localStorage.getItem('kode_kec');
      const kodeDesa = localStorage.getItem('kode_desa');

      // Fetch SLS data
      const slsData = await fetchAllData('sls', { kode_kec: kodeKec, kode_desa: kodeDesa });

      // Fetch Kepala Keluarga data
      const keluargaData = await fetchAllData('penduduks', { kode_kec: kodeKec, kode_desa: kodeDesa }, [
        { method: 'eq', args: ['shdk', 'Kepala Keluarga'] },
      ]);

      // Fetch Penduduk data
      const pendudukData = await fetchAllData('penduduks', { kode_kec: kodeKec, kode_desa: kodeDesa });

      // Fetch Desa Kelurahan data
      const { data: desa_kelurahan, error } = await supabase
        .from('desa_kelurahan')
        .select('nama_desa')
        .eq('kode_kec', kodeKec)
        .eq('kode_desa', kodeDesa)
        .single();

      if (error) {
        console.error('Error fetching Desa Kelurahan data:', error);
      }

      // Update stats
      setStats({
        sls: slsData.length,
        keluarga: keluargaData.length,
        penduduk: pendudukData.length,
      });

      setNamaDesa(desa_kelurahan?.nama_desa || 'Unknown');
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statistikData = [
    {
      stats: stats.sls,
      title: 'SLS',
      color: 'primary',
      icon: <Collage sx={{ fontSize: '1.75rem' }} />,
    },
    {
      stats: stats.keluarga,
      title: 'Keluarga',
      color: 'success',
      icon: <AccountSupervisorOutline sx={{ fontSize: '1.75rem' }} />,
    },
    {
      stats: stats.penduduk,
      title: 'Penduduk',
      color: 'info',
      icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />,
    },
  ];

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
              backgroundColor: `${item.color}.main`,
            }}
          >
            {item.icon}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>{item.title}</Typography>
            <Typography variant='h6'>{Intl.NumberFormat('id-ID').format(item.stats)}</Typography>
          </Box>
        </Box>
      </Grid>
    ));
  };

  return (
    <Card>
      {loading ? (
        <Box>
          <CircularProgress />
          <p>Memuat data...</p>
        </Box>
      ) : (
        <>
          <CardHeader
            title='Statistik'
            action={
              <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
                <DotsVertical />
              </IconButton>
            }
            subheader={
              <Typography variant='body2'>
                DESA {namaDesa}
              </Typography>
            }
            titleTypographyProps={{
              sx: {
                mb: 1,
                lineHeight: '2rem !important',
                letterSpacing: '0.15px !important',
              },
            }}
          />
          <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
            <Grid container spacing={[5, 0]}>
              {renderStats()}
            </Grid>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default KoorDesaCard;
