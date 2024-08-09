import React from 'react'
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import Trophy from 'src/views/dashboard/Trophy'
import KoorDesaCard from 'src/views/dashboard/KoorDesaCard'
import KoorKecCard from 'src/views/dashboard/KoorKecCard'
import SuperAdminCard from 'src/views/dashboard/SuperAdminCard'
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'

const Dashboard = () => {
  const [role, setRole] = useState('');

  useEffect(() => {
    const getRole = localStorage.getItem('role');
    setRole(getRole);
  }, []);

  const data = {
    series: [60, 20], 
    labels: ['Laki2', 'Perempuan']
  };

  const total = data.series.reduce((a, b) => a + b, 0);

  const options = {
    chart: {
      type: 'donut',
    },
    labels: data.labels,
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: function () {
                return total; 
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${val}%`;
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const series = [{
    name: "Jumlah Penduduk",
    data: [400, 430, 448, 470, 540, 580]
  }];

  const options2 = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Tidak Sekolah', 'SD', 'SMP', 'SMA', 'S1', 'S2'
      ],
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Trophy />
        </Grid>
        <Grid item xs={12} md={8}>
          {role === 'koor_desa' ? (
            <KoorDesaCard /> 
          ): (
            role === 'koor_kec' ? (
              <KoorKecCard />
            ) : (
              <SuperAdminCard />
            )
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: '#fff', padding: 4, borderRadius: 1, boxShadow: 1, height: '400px' }}>
            <ReactApexcharts options={options} series={data.series} type="donut" height="100%" />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: '#fff', padding: 4, borderRadius: 1, boxShadow: 1, height: '400px' }}>
            <ReactApexcharts options={options2} series={series} type='bar' height="100%" />
          </Box>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
