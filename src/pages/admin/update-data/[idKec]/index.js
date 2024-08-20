import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button } from '@mui/material';

function DaftarDesa() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAction = (kodeDesa, kodeKec) => {
    router.push(`/admin/update-data/${kodeKec}/${kodeDesa}`);
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
          const kodeDesa = tableMeta.rowData[2];
          const kodeKec = router.query.idKec;

          return (
            <Button variant="outlined" onClick={() => handleAction(kodeDesa, kodeKec)}>
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

  const getDesas = async (id_kec) => {
    const options = {
      method: 'GET',
      url: process.env.NEXT_PUBLIC_NOCO_DESA_API,
      headers: {
        'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
      },
      params: {
        "where": `(kode_kec,eq,${id_kec})`
      }
    };

    try {
      const res = await axios(options);
      return res.data.list;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const getKec = async () => {
    const options = {
      method: 'GET',
      url: process.env.NEXT_PUBLIC_NOCO_KEC_API,
      headers: {
        'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
      }
    };

    try {
      const res = await axios(options);
      return res.data.list; // Ensure you're getting the array
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { idKec } = router.query;
      if (idKec) {
        const kecamatanData = await getKec();
        const result = await getDesas(idKec);

        const kecMap = kecamatanData.reduce((acc, kec) => {
          acc[kec.id_kec] = kec.nama_kec;
          return acc;
        }, {});

        const transformedData = result.map(item => [
          kecMap[item.kode_kec], 
          item.nama_desa,
          item.kode_desa,
          "Action"
        ]);

        setData(transformedData);
        setLoading(false);
      }
    };

    fetchData();
  }, [router.query.idKec]);

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
  );
}

export default DaftarDesa;
