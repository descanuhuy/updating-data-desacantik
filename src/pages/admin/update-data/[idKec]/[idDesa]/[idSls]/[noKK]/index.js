import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';


import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import { IconButton, Modal, Typography } from '@mui/material';
import { Delete, NoteEdit, Plus, Sync, TagEdit } from 'mdi-material-ui';
import ModalAddAnggota from 'src/layouts/components/modal/addDataAnggota';
import ModalEditAnggota from 'src/layouts/components/modal/editDataAnggota';

const getKeluargas = async (noKK) => {
  const requestOptions = {
    method: 'GET',
    url: process.env.NEXT_PUBLIC_NOCO_PDDK_API,
    headers: {
      'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN,
    },
    params: {
      where: `(nomor_kk,eq,${noKK})`,
    },
  };

  try {
    const res = await axios(requestOptions);

    return res.data.list;
  } catch (err) {

    return [];
  }
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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.secondary',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{display: 'flex', columnGap: 2}}>

          <Button onClick={handleOpen} variant="contained" sx={{mb:3}} startIcon={<Plus />}>
            Tambah
          </Button>

          <Button onClick={() => location.reload()} variant="contained" sx={{mb:3}} startIcon={<Sync />}>
            Sync Data
          </Button>
          </Box>

          <ModalAddAnggota open={open} handleClose={handleClose} handleSubmit={handleSubmit} noKK={noKK}/>

    

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
                    <CardHeader title='Data Anggota Keluarga' titleTypographyProps={{ variant: 'h6' }} />
                    <CardContent>
                      <form onSubmit={e => e.preventDefault()}>
                        <Grid container spacing={5}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label='No KK'
                              value={item.nomor_kk}
                             
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              type='text'
                              label='NIK'
                              value={item.NIK}
                              
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label='Nama Kepala Keluarga'
                              value={item.nama_kk}
                             
                            />
                         
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label='Nama Lengkap'
                              value={item.nama_pddk}
                             
                            />
                         
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label='Jenis Kelamin'
                              value={item.jk}
                             
                            />
                         
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label='Tempat Lahir'
                              value={item.tempat_lahir}
                             
                            />
                         
                          </Grid>
                       

                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label='Tanggal Lahir'
                              value={new Date(item.tgl_lahir).toLocaleDateString('id-ID')}
                             
                            />
                         
                          </Grid>

                   
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label='Agama'
                              value={item.Agama}
                             
                            />
                         
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label='Pendidikan'
                              value={item.Pendidikan}
                             
                            />
                         
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label='Jenis Pekerjaan'
                              value={item.Pekerjaan}
                             
                            />
                         
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label='Status Perkawinan'
                              value={item.status_kawin}
                             
                            />
                         
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label='Status Hubungan Keluarga'
                              value={item.SHDK}
                             
                            />
                         
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label='Gol. Darah'
                              value={item.gol_darah !== 'Tdk Th' ? item.no_paspor : '-'}
                             
                            />
                         
                          </Grid>

                        

                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label='Ayah'
                              value={item.Ayah}
                             
                            />
                         
                          </Grid>


                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label='Ibu'
                              value={item.Ibu}
                             
                            />
                         
                          </Grid>

                          <Grid item xs={12} md={12}>
                            <TextField
                              fullWidth
                              label='Status'
                              value={item.status ? item.status : '-'}
                             
                            />
                         
                          </Grid>

                         

                          {/* <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label='Cacat'
                              value={item.cacat ? item.no_kitas_kitab : '-'}
                             
                            />
                         
                          </Grid> */}

                          <Grid container item xs={12}>
                            <Button fullWidth onClick={handleOpenEdit} variant="contained" startIcon={<NoteEdit />}>
                              Ubah
                            </Button>
                          </Grid>

                          <ModalEditAnggota open={openEditModal} handleClose={handleCloseEdit} dataAnggota={item}/>

                        </Grid>
                      </form>
                    </CardContent>
                  </Card>
                  {/* <FormLayoutsBasic /> */}
                </Grid>
                {/* <Grid item xs={12} md={6} md={6}>
                  <FormLayoutsIcons />
                </Grid> */}
              </Grid>
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </div>
  );
}

export default DataKeluarga;
