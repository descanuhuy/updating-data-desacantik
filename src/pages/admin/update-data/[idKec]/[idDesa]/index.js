"use client";

import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { Download } from 'mdi-material-ui';
import MUIDataTable from 'mui-datatables';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { saveAs } from 'file-saver';
import { supabase } from 'src/pages/api/supabase';

function DaftarSls() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [offset, setOffset] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); 
  const [downloading, setDownloading] = useState(false); 
  const router = useRouter();


  const handleAction = (kodeDesa, kodeKec, kodeSls) => {
    router.push(`/admin/update-data/${kodeKec}/${kodeDesa}/${kodeSls}`);
  };

  const columns = [
    "Nama Desa",
    "Nama SLS",
    {
      name: "Aksi",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const kodeSls = tableMeta.rowData[2]; 
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
    serverSide: true, 
    count: totalRecords,
    rowsPerPage: rowsPerPage,
    onTableChange: (action, tableState) => {
      switch (action) {
        case 'changePage':
          setOffset(tableState.page * rowsPerPage);
          break;
        case 'changeRowsPerPage':
          setRowsPerPage(tableState.rowsPerPage);
          setOffset(0);
          break;
        default:
          break;
      }
    }
  };

  const getSls = async (id_desa, id_kec, offset, limit) => {
    const options = {
      method: 'GET',
      url: process.env.NEXT_PUBLIC_NOCO_SLS_API,
      headers: {
        'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
      },
      params: {
        "where": `(kode_desa,eq,${id_desa})~and(kode_kec,eq,${id_kec})`,
        "offset": offset,
        "limit": limit
      }
    }

    try {
      const res = await axios(options);
      setTotalRecords(res.data.pageInfo.totalRows); 
      
      return res.data.list;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const getDesas = async (id_desa, id_kec) => {
    const options = {
      method: 'GET',
      url: process.env.NEXT_PUBLIC_NOCO_DESA_API,
      headers: {
        'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
      },
      params: {
        "where": `(kode_kec,eq,${id_kec})~and(kode_desa,eq,${id_desa})`
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

  const fetchData = async () => {
    const { idDesa, idKec } = router.query;
    if (idDesa && idKec) {
      const result = await getSls(idDesa, idKec, offset, rowsPerPage);
      const desasData = await getDesas(idDesa, idKec);
      const desaMap = desasData.reduce((acc, desa) => {
        acc[desa.kode_desa] = desa.nama_desa;
        return acc;
      }, {});

      const transformedData = result.map(item => [
        desaMap[item.kode_desa] || 'Unknown Desa',
        item.nama_sls,
        item.kode_sls, 
        "Action"
      ]);

      setData(transformedData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router.query.idDesa, router.query.idKec, offset, rowsPerPage]);

  const downloadCSV = async () => {
    setDownloading(true);
    try {
      let allData = [];
      let shouldFetchMore = true;
      let offset = 0;
      const limit = 1000; 
  
      while (shouldFetchMore) {
        const { data, error, count } = await supabase
          .from('penduduks')
          .select('*', { count: 'exact' }) 
          .range(offset, offset + limit - 1); 
  
        if (error) throw error;
  
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
  
      // Convert data to CSV format
      const csvContent = 
        "data:text/csv;charset=utf-8," +
        [Object.keys(allData[0]).join(","), ...allData.map(row => Object.values(row).join(","))].join("\n");
  
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'penduduks_data.csv');
    } catch (error) {
      console.error('Error downloading CSV:', error.message);
    } finally {
      setDownloading(false);
    }
  };
  

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Button
            variant="contained"
            sx={{ mb: 3 }}
            startIcon={downloading ? <CircularProgress size={24} /> : <Download />}
            onClick={downloadCSV}
            disabled={downloading}
          >
            {downloading ? "Mengunduh..." : "Unduh Data"}
          </Button>

          <MUIDataTable
            title={"Daftar SLS"}
            data={data}
            columns={columns}
            options={options}
          />
        </>
      )}
    </div>
  );
}

export default DaftarSls;
