import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';
import { supabase } from 'src/pages/api/supabase';

const ReactApexcharts = dynamic(() => import('src/@core/components/react-apexcharts'), { ssr: false });
const Trophy = dynamic(() => import('src/views/dashboard/Trophy'), { ssr: false });
const KoorDesaCard = dynamic(() => import('src/views/dashboard/KoorDesaCard'), { ssr: false });
const KoorKecCard = dynamic(() => import('src/views/dashboard/KoorKecCard'), { ssr: false });
const SuperAdminCard = dynamic(() => import('src/views/dashboard/SuperAdminCard'), { ssr: false });

const Dashboard = () => {
  const [role, setRole] = useState('');
  const [genderData, setGenderData] = useState({ series: [0, 0], labels: ['Laki-laki', 'Perempuan'] });
  const [statusData, setStatusData] = useState({
    series: [0, 0, 0, 0],
    labels: ['Ada', 'Tidak Ada', 'Meninggal', 'Pecah KK', 'Pindah', 'Tidak Terdaftar']
  });

  const [educationSeries, setEducationSeries] = useState([
    {
      name: 'Jumlah Penduduk',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  ]);

  const [educationOptions, setEducationOptions] = useState({
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: [
        'Tidak/Belum Sekolah', 'Belum Tamat SD/Sederajat', 'Tamat SD/Sederajat',
        'SLTP/Sederajat', 'SLTA/Sederajat', 'Diploma I/II',
        'Akademi/Diploma III/S. Muda', 'Diploma IV/Strata I', 'Strata II'
      ]
    }
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);

      const getRole = localStorage.getItem('role') || '';
      setRole(getRole);

      const fetchGenderData = async () => {
        try {
          const { count: lakiLakiCount, error: lakiLakiError } = await supabase
            .from('penduduks')
            .select('*', { count: 'exact' })
            .eq('jk', 'Laki-Laki');

          if (lakiLakiError) {
            throw lakiLakiError;
          }

          const { count: perempuanCount, error: perempuanError } = await supabase
            .from('penduduks')
            .select('*', { count: 'exact' })
            .eq('jk', 'Perempuan');

          if (perempuanError) {
            throw perempuanError;
          }

          setGenderData({
            series: [lakiLakiCount, perempuanCount],
            labels: ['Laki-laki', 'Perempuan']
          });
        } catch (error) {
          console.error('Error fetching gender data:', error);
        }
      };

      const fetchStatusData = async () => {
        try {
          const statuses = ['Ada', 'Tidak Ada', 'Meninggal', 'Pecah KK', 'Pindah', 'Tidak Terdaftar'];
          const statusCounts = statuses.reduce((acc, status) => {
            acc[status] = 0;
            return acc;
          }, {});

          await Promise.all(statuses.slice(0, -1).map(async (status) => {
            const { count, error } = await supabase
              .from('penduduks')
              .select('*', { count: 'exact' })
              .eq('status', status);

            if (error) {
              throw error;
            }
            statusCounts[status] = count || 0;
          }));

          const { count: nullCount, error: nullError } = await supabase
            .from('penduduks')
            .select('*', { count: 'exact' })
            .eq('status', '');

          if (nullError) {
            throw nullError;
          }
          statusCounts['Tidak Terdaftar'] = nullCount || 0;

          setStatusData({
            series: statuses.map(status => statusCounts[status]),
            labels: statuses
          });
        } catch (error) {
          console.error('Error fetching status data:', error);
        }
      };

      const fetchPendidikanData = async () => {
        try {
          const pendidikans = [
            'Tidak/Belum Sekolah', 'Belum Tamat SD/Sederajat', 'Tamat SD/Sederajat',
            'SLTP/Sederajat', 'SLTA/Sederajat', 'Diploma I/II',
            'Akademi/Diploma III/S. Muda', 'Diploma IV/Strata I', 'Strata II'
          ];
          const pendidikanCounts = pendidikans.reduce((acc, pendidikan) => {
            acc[pendidikan] = 0;
            return acc;
          }, {});

          await Promise.all(pendidikans.map(async (pendidikan) => {
            const { count, error } = await supabase
              .from('penduduks')
              .select('*', { count: 'exact' })
              .eq('pendidikan', pendidikan);

            if (error) {
              throw error;
            }
            pendidikanCounts[pendidikan] = count || 0;
          }));

          setEducationSeries([{
            name: 'Jumlah Penduduk',
            data: pendidikans.map(pendidikan => pendidikanCounts[pendidikan])
          }]);
        } catch (error) {
          console.error('Error fetching pendidikan data:', error);
        }
      };

      fetchGenderData();
      fetchStatusData();
      fetchPendidikanData();
    }
  }, []);

  const genderOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    labels: genderData.labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  const statusOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    labels: statusData.labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  return (
    <ApexChartWrapper>
      {isMounted && (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {role === 'koor_desa' && <KoorDesaCard />}
            {role === 'koor_kec' && <KoorKecCard />}
            {role === 'superadmin' && <SuperAdminCard />}
            {!role && <Trophy />}
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: '#fff',
                padding: 4,
                borderRadius: 1,
                boxShadow: 1,
                height: '400px'
              }}
            >
              <ReactApexcharts
                options={genderOptions}
                series={genderData.series}
                type="donut"
                height="100%"
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: '#fff',
                padding: 4,
                borderRadius: 1,
                boxShadow: 1,
                height: '400px'
              }}
            >
              <ReactApexcharts
                options={statusOptions}
                series={statusData.series}
                type="donut"
                height="100%"
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={12}>
            <Box
              sx={{
                backgroundColor: '#fff',
                padding: 4,
                borderRadius: 1,
                boxShadow: 1,
                height: '400px'
              }}
            >
              <ReactApexcharts
                options={educationOptions}
                series={educationSeries}
                type="bar"
                height="100%"
              />
            </Box>
          </Grid>
        </Grid>
      )}
    </ApexChartWrapper>
  );
};

export default Dashboard;
