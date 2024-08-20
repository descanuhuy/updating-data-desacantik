"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexcharts from 'react-apexcharts';
import { Box } from '@mui/material';

function StatusChart() {
  const [chartData, setChartData] = useState([0, 0, 0, 0]); // Ada, Tidak Ada Meninggal, Tidak Ada Pecah KK, Tidak Ada Pindah
  const [loading, setLoading] = useState(true);

  const statusLabels = [
    'Ada',
    'Tidak Ada, Meninggal',
    'Tidak Ada, Pecah KK',
    'Tidak Ada, Pindah'
  ];

  const fetchData = async (status) => {
    const options = {
      method: 'GET',
      url: process.env.NEXT_PUBLIC_NOCO_PDDK_API,
      params: {
        where: `(kode_kec,eq,090)~and(kode_desa,eq,015)~and(kode_sls,eq,11)~and(status,eq,"${status}")`
      },
      headers: {
        'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
      }
    };

    try {
      const response = await axios.request(options);
      return response.data.pageInfo.totalRows;
    } catch (error) {
      console.error('Error fetching data:', error);
      return 0;
    }
  };

  useEffect(() => {
    const getChartData = async () => {
      setLoading(true);
      const data = await Promise.all(statusLabels.map(status => fetchData(status)));
      setChartData(data);
      setLoading(false);
    };

    getChartData();
  }, []);

  const options = {
    labels: statusLabels,
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: function () {
                return chartData.reduce((a, b) => a + b, 0); 
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

  return (
    <Box>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ReactApexcharts options={options} series={chartData} type="pie" height="100%" />
      )}
    </Box>
  );
}

export default StatusChart;
