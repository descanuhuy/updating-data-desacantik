"use client"

import { Button } from '@mui/material';
import axios from 'axios';
import MUIDataTable from 'mui-datatables';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function DaftarSls() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAction = (kodeDesa, kodeKec, kodeSls) => {

    router.push(`/a/update-data/${kodeKec}/${kodeDesa}/${kodeSls}`);
  };

  const columns = [
    "Kode SLS",
    "Nama SLS",
    "Jumlah Penduduk",
    {
      name: "Aksi",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const kodeSls = tableMeta.rowData[0]; 
          const kodeKec = router.query.idKec;
          const kodeDesa = router.query.idDesa;

          return (
            <Button variant="outlined" onClick={() => handleAction(kodeDesa, kodeKec, kodeSls)}>
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

  
const getSls = async (id_desa) => {
  const options = {
    method: 'GET',
    url: 'https://db.bpstuban.my.id/api/v2/tables/myeywligzkr9psc/records',
    headers: {
      'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
    },
    params: {
      "where": `(kode_desa,eq,${id_desa})`
    }
  }

  try {
    const res = await axios(options);

    return res.data.list;
  } catch (err) {
  
    return [];
  }
}

  useEffect(() => {
    
    const fetchData = async () => {

      const { idDesa } = router.query;
      if (idDesa) {
        const result = await getSls(idDesa);
        
        const transformedData = result.map(item => [
          item.kode_sls,
          item.nama_sls,
          item.kode_desa,
          "Action"  
        ]);
        setData(transformedData);
        setLoading(false);
      }
    };

    fetchData();
  }, [router.query.idDesa]);

  return (
    <div>
      {loading ? (<div>Loading...</div>) : (
        <MUIDataTable
         title={"Daftar Kelurahan / Desa"}
         data={data}
         columns={columns}
         options={options}
       />
      )}
     
    </div>
  )
}

export default DaftarSls