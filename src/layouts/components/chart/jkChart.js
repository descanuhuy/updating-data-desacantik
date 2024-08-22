import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { supabase } from 'src/pages/api/supabase';

// Dynamic import for ReactApexcharts with SSR disabled
const ReactApexcharts = dynamic(() => import('src/@core/components/react-apexcharts'), { ssr: false });

const JenisKelaminChart = () => {
  const [genderData, setGenderData] = useState({ series: [0, 0], labels: ['Laki-laki', 'Perempuan'] });

  useEffect(() => {
    const fetchGenderData = async () => {
      try {
        // Fetch data for Laki-laki
        const { count: lakiLakiCount, error: lakiLakiError } = await supabase
          .from('penduduks')
          .select('*', { count: 'exact' })
          .eq('jk', 'Laki-laki');

        if (lakiLakiError) {
          throw lakiLakiError;
        }

        // Fetch data for Perempuan
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

    fetchGenderData();
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

  return (
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
  );
};

export default JenisKelaminChart;
