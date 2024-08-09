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

    router.push(`/a/update-data/${kodeKec}/${kodeDesa}`);
  };

  const columns = [
    "Kode Kecamatan",
    "Kode Desa",
    "Nama Desa",
    {
      name: "Aksi",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const kodeKec = tableMeta.rowData[0]; 
          const kodeDesa = tableMeta.rowData[1];

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
      url: 'https://db.bpstuban.my.id/api/v2/tables/m2peq82th9s0k3c/records',
      headers: {
        'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
      },
      params: {
        "where": `(kode_kec,eq,${id_kec})`
      }
    }

    try {
      const res = await axios(options);

      return res.data.list;
    } catch (err) {
      console.error(err);

      return [];
    }
  }

  useEffect(() => {

    const fetchData = async () => {

      const { idKec } = router.query;
      if (idKec) {

        const result = await getDesas(idKec);

        const transformedData = result.map(item => [
          item.kode_kec,
          item.kode_desa,
          item.nama_desa,
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
