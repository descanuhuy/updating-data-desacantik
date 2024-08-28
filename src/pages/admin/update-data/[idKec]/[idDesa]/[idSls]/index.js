import { Box, Button, Grid } from '@mui/material';
import axios from 'axios';
import { Plus, Sync } from 'mdi-material-ui';
import MUIDataTable from 'mui-datatables';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Breadcrumb from 'src/layouts/components/breadcrumb';
import ModalAddAnggota from 'src/layouts/components/modal/addDataAnggota';
import ModaEditSls from 'src/layouts/components/modal/editSls';
import { supabase } from 'src/pages/api/supabase';

function DataPendudukSls() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [offset, setOffset] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [noKK, setNoKK] = useState(''); 
  const [role, setRole ] = useState('');
  const router = useRouter();
  
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openModalSLS, setOpenModalSLS] = useState(false);
  const handleOpenModalSLS = () => setOpenModalSLS(true);
  const handleCloseModalSLS = () => setOpenModalSLS(false);
  const { idKec, idDesa, idSls } = router.query;

  const handleAction = (kodeDesa, kodeKec, kodeSls, noKK) => {
    router.push(`/admin/update-data/${kodeKec}/${kodeDesa}/${kodeSls}/${noKK}`);
  };

  const handleSubmit = (event) => {

    event.preventDefault();

    handleClose();
  };

  const columns = [
    "Alamat KK",
    "Nama Kepala Keluarga",
    {
      name: "Aksi",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const kodeSls = router.query.idSls;
          const kodeKec = router.query.idKec;
          const kodeDesa = router.query.idDesa;
          const noKK = tableMeta.rowData[2];

          return (
            <Grid container spacing={2} justifyContent="left" alignItems="center">
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => handleAction(kodeDesa, kodeKec, kodeSls, noKK)}
                >
                  Detail
                </Button>
              </Grid>
              {role === 'koor_desa' || role === 'koor_kec' ? (<></>) : (<>
                <Grid item>
                  <Button
                    variant="contained"
                    color='secondary'
                    sx={{ color: "white !important" }}
                    onClick={() => {
                      setNoKK(noKK); 
                      handleOpenModalSLS();
                    }}
                    >
                    Ubah SLS
                  </Button>
                </Grid>
              </>)}
            </Grid>
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
    rowsPerPageOptions: [10, 15, 25, 100],
    onTableChange: (action, tableState) => {
      switch (action) {
        case 'changePage':
          setOffset(tableState.page * tableState.rowsPerPage);
          break;
        case 'changeRowsPerPage':
          setRowsPerPage(tableState.rowsPerPage);
          setOffset(0);
          break;
        case 'search':
          fetchData(tableState.searchText);  // Pass the search text
          break;
        default:
          break;
      }
    }
  };
  

  const fetchData = async (search = '') => {  
    setLoading(true);
  
    let query = supabase
      .from('penduduks')
      .select(`
        nama_kk,
        nomor_kk,
        kode_sls,
        wilayah_terkecil_id (nama_sls)
      `, { count: 'exact' })
      .eq('kode_kec', idKec)  
      .eq('kode_desa', idDesa) 
      .eq('kode_sls', idSls)
      .eq('shdk', 'Kepala Keluarga')
      .range(offset, offset + rowsPerPage - 1);
  
    if (search) {
      query = query.ilike('nama_kk', `%${search}%`); 
    }
  
    const { data: penduduks, error, count } = await query;
  
    if (error) {
      console.error('Error fetching data:', error.message);
      setLoading(false);
      
      return;
    }
  
    const transformedData = penduduks.map(item => [
      item.wilayah_terkecil_id.nama_sls, 
      item.nama_kk,   
      item.nomor_kk,        
      "Action"
    ]);
  
    setData(transformedData);
    setTotalRecords(count);
    setLoading(false);
  };
  
  
  useEffect(() => {

    const role = localStorage.getItem('role');
    setRole(role);
    const kodeKec = localStorage.getItem('kode_kec');
    const kodeDesa = localStorage.getItem('kode_desa');
    
    if (idKec && idDesa && idSls) {
      fetchData();
    }
  }, [idKec, idDesa, idSls, offset, rowsPerPage]);

  return (
    <div>

      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
        {/* Container for Breadcrumb and Buttons */}
        <Grid container spacing={2} alignItems="center">
          {/* Breadcrumb - Stays on the left */}
          <Grid item xs={12} md={6}>
            <Breadcrumb 
              items={[
                { name: 'Update Data', url: '/admin/update-data' },
                { name: 'Kelurahan/Desa', url: `/admin/update-data/${router.query.idKec}` },
                { name: 'SLS', url: `/admin/update-data/${router.query.idKec}/${router.query.idDesa}` },
                { name: 'Penduduk', url: `#` },
              ]}
            />
          </Grid>

          {/* Buttons - Moves to the right on medium screens and up */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
              <Grid container spacing={2} justifyContent="flex-end">
                {role === 'koor_desa' || role === 'koor_kec'? (<></>) : (
                  <>
                  <Grid item>
                    <Button onClick={handleOpen} variant="contained" sx={{ mb: 3 }} startIcon={<Plus />}>
                    Tambah Keluarga
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button onClick={() => location.reload()} variant="contained" sx={{ mb: 3 }} startIcon={<Sync />}>
                    Sync Data
                    </Button>
                  </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>


      <MUIDataTable
        title={"Data Penduduk SLS"}
        data={data}
        columns={columns}
        options={options}
      />

      <ModalAddAnggota open={open} handleClose={handleClose} handleSubmit={handleSubmit} noKK={''} />
      <ModaEditSls open={openModalSLS} handleClose={handleCloseModalSLS} noKK={noKK} />
    </div>
  );
}

export default DataPendudukSls;
