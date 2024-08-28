import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { useRouter } from 'next/router';
import axios from 'axios';
import { Box, Button } from '@mui/material';
import { supabase } from 'src/pages/api/supabase';
import Breadcrumb from 'src/layouts/components/breadcrumb';

function DaftarDesa() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAction = (wilayahId, kodeKec) => {
    router.push(`/admin/update-data/${kodeKec}/${wilayahId}`);
  };

  const columns = [
    "Nama Kecamatan",
    "Nama Desa",
    {
      name: "Aksi",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const wilayahId = tableMeta.rowData[2];
          const kodeKec = router.query.idKec;

          return (
            <Button variant="outlined" onClick={() => handleAction(wilayahId, kodeKec)}>
              Pilih
            </Button>
          );
        }
      }
    }
  ];

  const options = {
    filterType: 'checkbox',
  };


  useEffect(() => {

    const role = localStorage.getItem('role');
    const kodeKec = localStorage.getItem('kode_kec');
    const kodeDesa = localStorage.getItem('kode_desa');

    if (role === 'koor_desa' || role === 'enum_desa') {
      router.push(`/admin/update-data/${kodeKec}/${kodeDesa}`);
    } else if (role === 'koor_kec' || role === 'enum_kec') {
      router.push(`/admin/update-data/${kodeKec}`);
    }
    
    const fetchData = async () => {

    const { idKec } = router.query;
      
    let { data: desa_kelurahan, error } = await supabase
    .from('desa_kelurahan')
    .select(`
        id,
        kode_desa,
        nama_desa,
        kecamatan ( nama_kec )
      `)
    .eq('kode_kec', idKec);

      const transformedData = desa_kelurahan.map(item => [
        // kecMap[item.kode_kec], 
        item.kecamatan.nama_kec,
        item.nama_desa,
        item.kode_desa,
        "Action"
      ]);

    // console.log(desa_kelurahan);
    
    setData(transformedData);
    setLoading(false);
        
    
    };

    fetchData();
  }, [router.query.idKec]);

  return (
    <div>
      {loading ? (<div>Loading...</div>) : (
        <>
          <Box sx={{ flexGrow: 1, marginBottom:2 }}>
            <Breadcrumb 
            items={[
              { name: 'Update Data', url: '/admin/update-data' },
              {name: 'Kelurahan/Desa', url: '#'}
            ]}
            />
          </Box>
        <MUIDataTable
          title={"Daftar Kelurahan / Desa"}
          data={data}
          columns={columns}
          options={options}
          />
        </>
      )}
    </div>
  );
}

export default DaftarDesa;
