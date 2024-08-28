import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { IconButton, Modal, Typography } from '@mui/material';
import { Delete, NoteEdit, Plus, Sync } from 'mdi-material-ui';
import ModalAddAnggota from 'src/layouts/components/modal/addDataAnggota';
import ModalEditAnggota from 'src/layouts/components/modal/editDataAnggota';
import dayjs from 'dayjs';
import { supabase } from 'src/pages/api/supabase';

const getKeluargas = async (noKK) => {
  const { data, error } = await supabase
    .from('penduduks')
    .select('*')
    .eq('nomor_kk', noKK);
    console.log(data);
    

  if (error) {
    console.error('Error fetching data:', error);

    return [];
  }
  
  return data;
};


const formatDate = (dateString) => {
  if (!dateString) return '';

  const [year, month, day] = dateString.split('-').map(Number);

  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};


function DataKeluarga() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noKK, setNoKK] = useState('');

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const router = useRouter();

  const [openEditModal, setOpenEditModal] = useState(false);
  const handleOpenEdit = () => setOpenEditModal(true);
  const handleCloseEdit = () => setOpenEditModal(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    handleClose();
  };

  const [value, setValue] = useState('0');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { noKK } = router.query;
      setNoKK(noKK);
      if (noKK) {
        const result = await getKeluargas(noKK);
        setData(result);
        setLoading(false);
      }
    };

    fetchData();
  }, [router.query.noKK]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ display: 'flex', columnGap: 2 }}>
            <Button onClick={handleOpen} variant="contained" sx={{ mb: 3 }} startIcon={<Plus />}>
              Tambah
            </Button>

            <Button onClick={() => location.reload()} variant="contained" sx={{ mb: 3 }} startIcon={<Sync />}>
              Sync Data
            </Button>
          </Box>

          <ModalAddAnggota open={open} handleClose={handleClose} handleSubmit={handleSubmit} noKK={noKK} />

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {data.map((item, index) => (
                <Tab key={index} label={`Anggota ${index + 1}`} value={`${index}`} />
              ))}
            </TabList>
          </Box>
          {data.map((item, index) => (
            <TabPanel key={index} value={`${index}`}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Data Anggota Keluarga" titleTypographyProps={{ variant: 'h6' }} />
                    <CardContent>
                      <form onSubmit={(e) => e.preventDefault()}>
                        <Grid container spacing={5}>
                          <Grid item xs={12} md={6}>
                            <TextField fullWidth label="No KK" value={item.nomor_kk} />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField fullWidth type="text" label="NIK" value={item.nik} />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Nama Kepala Keluarga" value={item.nama_kk} />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Nama Lengkap" value={item.nama_pddk} />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Jenis Kelamin" value={item.jk} />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Tempat Lahir" value={item.tempat_lahir} />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Tanggal Lahir"
                              value={formatDate(item.tgl_lahir)}
                              InputProps={{ readOnly: true }} // Make TextField read-only if it's just for display
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Agama" value={item.agama} />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Pendidikan" value={item.pendidikan} />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Jenis Pekerjaan" value={item.pekerjaan} />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Status Perkawinan" value={item.status_kawin} />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Status Hubungan Keluarga" value={item.shdk} />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Gol. Darah"
                              value={item.gol_darah === null || item.gol_darah === 'Tdk Th' ? '-' : item.gol_darah}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Ayah" value={item.ayah} />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Ibu" value={item.ibu} />
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <TextField fullWidth label="Status" value={item.status ? item.status : '-'} />
                          </Grid>
                          <Grid container item xs={12}>
                            <Button fullWidth onClick={handleOpenEdit} variant="contained" startIcon={<NoteEdit />}>
                              Ubah
                            </Button>
                          </Grid>

                          <ModalEditAnggota open={openEditModal} handleClose={handleCloseEdit} dataAnggota={item} />
                        </Grid>
                      </form>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </div>
  );
}

export default DataKeluarga;
