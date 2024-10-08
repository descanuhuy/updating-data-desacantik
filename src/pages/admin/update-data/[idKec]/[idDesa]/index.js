
"use client";

import { Box, Button, CircularProgress } from '@mui/material';
import { Download } from 'mdi-material-ui';
import MUIDataTable from 'mui-datatables';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback } from 'react';
import { saveAs } from 'file-saver';
import { supabase } from 'src/pages/api/supabase';
import Breadcrumb from 'src/layouts/components/breadcrumb';

function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


function DaftarSls() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
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
    page: page,
    rowsPerPage: rowsPerPage,
    searchText: searchQuery,
    onSearchChange: debounce((searchText) => {
      setSearchQuery(searchText);
    }, 800), 
    onTableChange: (action, tableState) => {
      switch (action) {
        case 'changePage':
          setPage(tableState.page);
          break;
        case 'changeRowsPerPage':
          setRowsPerPage(tableState.rowsPerPage);
          setPage(0);
          break;
        default:
          break;
      }
    }
  };

  const fetchData = async () => {
    setLoading(true);

    const { idKec, idDesa } = router.query;
    const offset = page * rowsPerPage;

    let query = supabase
      .from('sls')
      .select(`
          id,
          nama_sls,
          wilayah_id (nama_desa),
          kode_sls
        `, { count: 'exact' })
      .eq('kode_kec', idKec)
      .eq('kode_desa', idDesa)
      .range(offset, offset + rowsPerPage - 1);

    if (searchQuery) {
      query = query.ilike('nama_sls', `%${searchQuery}%`);
    }

    let { data: sls, error, count } = await query;

    if (error) {
      console.error('Error fetching data:', error.message);
      setLoading(false);
      
      return;
    }

    const transformedData = sls.map(item => [
      item.wilayah_id.nama_desa,
      item.nama_sls,
      item.kode_sls,
      "Action"
    ]);

    setData(transformedData);
    setTotalRecords(count);
    setLoading(false);
  };

  useEffect(() => {
    if (router.query.idDesa && router.query.idKec) {
      fetchData();
    }
  }, [router.query.idDesa, router.query.idKec, page, rowsPerPage, searchQuery]);

  const downloadCSV = async () => {
    setDownloading(true);
    try {

      const kodeKec = localStorage.getItem('kode_kec');
      const kodeDesa = localStorage.getItem('kode_desa');

      let allData = [];
      let shouldFetchMore = true;
      let offset = 0;
      const limit = 1000;

      while (shouldFetchMore) {
        const { data, error, count } = await supabase
          .from('penduduks')
          .select('*', { count: 'exact' })
          .eq('kode_kec', kodeKec)
          .eq('kode_desa', kodeDesa)
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
          <Box sx={{ flexGrow: 1, marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumb
              items={[
                { name: 'Update Data', url: '/admin/update-data' },
                { name: 'Kelurahan/Desa', url: `/admin/update-data/${router.query.idKec}` },
                { name: 'SLS', url: `#` },

              ]}
            />
            <Button
              variant="contained"
              sx={{ mb: 3 }}
              startIcon={downloading ? <CircularProgress size={24} /> : <Download />}
              onClick={downloadCSV}
              disabled={downloading}
            >
              {downloading ? "Mengunduh..." : "Unduh Data"}
            </Button>
          </Box>

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
