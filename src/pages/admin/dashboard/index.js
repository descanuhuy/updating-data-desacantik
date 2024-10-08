import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';
import { supabase } from 'src/pages/api/supabase';
import { Card } from '@mui/material';

const ReactApexcharts = dynamic(() => import('src/@core/components/react-apexcharts'), { ssr: false });
const Trophy = dynamic(() => import('src/views/dashboard/Trophy'), { ssr: false });
const KoorDesaCard = dynamic(() => import('src/views/dashboard/KoorDesaCard'), { ssr: false });
const KoorKecCard = dynamic(() => import('src/views/dashboard/KoorKecCard'), { ssr: false });
const SuperAdminCard = dynamic(() => import('src/views/dashboard/SuperAdminCard'), { ssr: false });

const Dashboard = () => {
  const [role, setRole] = useState('');

  const [genderData, setGenderData] = useState({ series: [0, 0], labels: ['Laki-laki', 'Perempuan'] });

  const [statusData, setStatusData] = useState({
    series: [0, 0, 0, 0, 0],
    labels: ['Ada', 'Meninggal', 'Pecah KK', 'Pindah', 'Tidak Terdaftar']
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
     title: {
      text: 'Jumlah Penduduk Berdasarkan Pendidikan',
      align: 'left',
      margin: 20,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize:  '18px',
        fontFamily:  undefined,
        color:  '#0066B2'
      },
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
      const kodeDesa = localStorage.getItem('kode_desa') || '';
      const kodeKec = localStorage.getItem('kode_kec') || '';
      setRole(getRole);

      const fetchGenderData = async () => {
        try {
          let query = supabase.from('penduduks').select('*', { count: 'exact' }).eq('jk', 'Laki-Laki');
          
          if (getRole === 'koor_desa' || getRole === 'enum_desa') {
            query = query.eq('kode_desa', kodeDesa).eq('kode_kec', kodeKec);
          } else if (getRole === 'koor_kec' || getRole === 'enum_kec') {
            query = query.eq('kode_kec', kodeKec);
          }

          const { count: lakiLakiCount, error: lakiLakiError } = await query;
          

          if (lakiLakiError) {
            throw lakiLakiError;
          }

          query = supabase.from('penduduks').select('*', { count: 'exact' }).eq('jk', 'Perempuan');
          
          if (getRole === 'koor_desa' || getRole === 'enum_desa') {
            query = query.eq('kode_desa', kodeDesa).eq('kode_kec', kodeKec);
          } else if (getRole === 'koor_kec' || getRole === 'enum_kec') {
            query = query.eq('kode_kec', kodeKec);
          }

          const { count: perempuanCount, error: perempuanError } = await query;
        

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
          const statuses = ['Ada', 'Tidak ada, Meninggal', 'Tidak ada, Pecah KK', 'Tidak ada, Pindah', 'Tidak Terdaftar'];
          
          const statusCounts = statuses.reduce((acc, status) => {
            acc[status] = 0;

            return acc;
          }, {});

          await Promise.all(statuses.slice(0, -1).map(async (status) => {
            let query = supabase
              .from('penduduks')
              .select('*', { count: 'exact' })
              .eq('status', status);

            if (getRole === 'koor_desa' || getRole === 'enum_desa') {
              query = query.eq('kode_desa', kodeDesa).eq('kode_kec', kodeKec);
            } else if (getRole === 'koor_kec' || getRole === 'enum_kec') {
              query = query.eq('kode_kec', kodeKec);
            }

            const { count, error } = await query;

            if (error) {
              throw error;
            }

            statusCounts[status] = count || 0;
          }));

          let query = supabase
            .from('penduduks')
            .select('*', { count: 'exact' })
            .or('status.is.null,status.eq.');

          if (getRole === 'koor_desa' || getRole === 'enum_desa') {
            query = query.eq('kode_desa', kodeDesa).eq('kode_kec', kodeKec);
          } else if (getRole === 'koor_kec' || getRole === 'enum_kec') {
            query = query.eq('kode_kec', kodeKec);
          }

          const { count: nullCount, error: nullError } = await query;

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
            let query = supabase
              .from('penduduks')
              .select('*', { count: 'exact' })
              .eq('pendidikan', pendidikan);

            if (getRole === 'koor_desa' || getRole === 'enum_desa') {
              query = query.eq('kode_desa', kodeDesa).eq('kode_kec', kodeKec);
            } else if (getRole === 'koor_kec' || getRole === 'enum_kec') {
              query = query.eq('kode_kec', kodeKec);
            }

            const { count, error } = await query;

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
    title: {
      text: 'Proporsi Berdasarkan Jenis Kelamin',
      align: 'left',
      margin: 20,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize:  '16px',
        fontFamily:  undefined,
        color:  '#0066B2'
      },
    },
    labels: genderData.labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
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
    toolbar: {
        show: true,
        export: {
          svg: {
            filename: "status_chart.svg",
          },
          png: {
            filename: "status_chart.png",
          }
        },
        autoSelected: 'zoom' 
    },

    title: {
      text: 'Proporsi Berdasarkan Status Kependudukan',
      align: 'left',
      margin: 20,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize:  '16px',
        fontFamily:  undefined,
        color:  '#0066B2'
      },
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

  if (!isMounted) return null;

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
      <Grid item xs={12}>
             {(role === 'koor_desa' || role === 'enum_desa') && <KoorDesaCard />}
             {(role === 'koor_kec' || role === 'enum_kec') && <KoorKecCard />}
             {role === 'superadmin' && <SuperAdminCard />}
           </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <ReactApexcharts options={genderOptions} series={genderData.series} type='donut' height={350} />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <ReactApexcharts options={statusOptions} series={statusData.series} type='donut' height={350} />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <ReactApexcharts options={educationOptions} series={educationSeries} type='bar' height={350} />
          </Card>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default Dashboard;
