import React, { useState } from 'react';
import { Alert, Autocomplete, Box, Button, Grid, IconButton, Modal, Snackbar, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';
import { Check } from 'mdi-material-ui';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '1px solid #fff',
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
};

const ModalEditAnggota = ({ open, handleClose, dataAnggota }) => {
  const [formData, setFormData] = useState({
    noKK: dataAnggota.nomor_kk,
    nik: dataAnggota.NIK,
    jk: dataAnggota.jk,
    statusKawin: dataAnggota.status_kawin,
    statusHub: dataAnggota.SHDK,
    agama: dataAnggota.Agama,
    pendidikan: dataAnggota.Pendidikan,
    namaKepalaKeluarga: dataAnggota.nama_kk,
    namaLengkap: dataAnggota.nama_pddk,
    tempatLahir: dataAnggota.tempat_lahir,
    pekerjaan: dataAnggota.Pekerjaan,
    tanggalLahir: dayjs(dataAnggota.tgl_lahir),
    gol_darah: dataAnggota.gol_darah,
    status: dataAnggota.status,
    cacat: dataAnggota.Cacat,
    ayah: dataAnggota.Ayah,
    ibu: dataAnggota.Ibu,
  });

  const statusKawinList = ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'];
  const jkList = ['Laki-Laki', 'Perempuan'];
  const statusHubList = ['Kepala Keluarga', 'Istri', 'Anak', 'Menantu', 'Cucu', 'Mertua', 'Orang Tua', 'Famili Lain', 'Lainnya'];
  const pendidikanList = [
    'Tidak/Belum Sekolah', 'Belum Tamat SD/Sederajat', 'Tamat SD/Sederajat', 
    'SLTP/Sederajat', 'SLTA/Sederajat', 'Diploma I/II', 
    'Akademi/Diploma III/S. Muda', 'Diploma IV/Strata I', "Strata II"
  ];
  const agamaList = ['Islam', 'Kristen', 'Katholik', 'Konghuchu', 'Budha', 'Hindu'];
  const top100Films = [
    "Pedagang", "Belum/Tidak Bekerja", "Wiraswasta", "Petani/Pekebun", 
    "Karyawan Swasta", "Transportasi", "Buruh Harian Lepas", "Pelajar/Mahasiswa", 
    "Perdagangan", "Karyawan Honorer", "Guru", "Tentara Nasional Indonesia", 
    "Sopir", "Tukang Batu", "Pensiunan", "Pegawai Negeri Sipil", "Nelayan/Perikanan", 
    "Perawat", "Kepolisian RI", "Mekanik", "Karyawan BUMN", "Pelaut", 
    "Buruh Tani/Perkebunan", "Industri", "Perangkat Desa", "Tukang Kayu", 
    "Konstruksi", "Tukang Jahit", "Peternak", "Lainnya", "Mengurus Rumah Tangga", 
    "Buruh Nelayan/Perikanan", "Tukang Las/Pandai Besi", "Karyawan BUMD", 
    "Kepala Desa", "Dokter", "Dosen", "Pendeta", "Seniman", "Ustadz/Mubaligh", 
    "Bidan", "Pembantu Rumah Tangga", "Notaris"
  ];

  const statusPddk = [
    "Ada",
    "Tidak ada, Meninggal",
    "Tidak ada, Pindah",
    "Tidak, ada, Pecah KK",
  ]

  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const [sttsPddk, setSttsPddk] = useState('');

  dayjs.locale('id');

  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({ ...prevData, tanggalLahir: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const requestOptions = {
      method: 'PATCH',
      url: process.env.NEXT_PUBLIC_NOCO_PDDK_API,
      headers: {
        'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN,
        'Content-Type': 'application/json'
      },
      data: [
        {
          Id: dataAnggota.Id,
          nomor_kk: formData.noKK,
          NIK: formData.nik,
          nama_kk: formData.namaKepalaKeluarga,
          nama_pddk: formData.namaLengkap,
          jk: formData.jk,
          tempat_lahir: formData.tempatLahir,
          tgl_lahir: formData.tanggalLahir.format('YYYY-MM-DD'),
          Agama: formData.agama,
          Pendidikan: formData.pendidikan,
          Pekerjaan: formData.pekerjaan,
          status_kawin: formData.statusKawin,
          SHDK: formData.statusHub,
          gol_darah: formData.gol_darah,
          status: formData.status,
          Cacat: formData.cacat,
          Ayah: formData.ayah,
          Ibu: formData.ibu
        }
      ]
      
    };

    try {
      const res = await axios(requestOptions);
        setLoading(false);
        setSnackBar(true);
        setTimeout(() => {
          setSnackBar(false);
        }, 3000);
        // handleClose();
      
    } catch (err) {
      console.error(err);
    }
  };

  

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={style}>
        {snackBar && 
         <Alert icon={<Check fontSize="inherit" />} severity="success">
         Berhasil! Silahkan lakukan sinkronisasi data
       </Alert>
        }
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
          <Typography id="modal-title" variant="h6">
            Ubah Anggota Keluarga
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='No KK'
                name="noKK"
                value={formData.noKK}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type='text'
                label='NIK'
                name="nik"
                value={formData.nik}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Nama Kepala Keluarga'
                name="namaKepalaKeluarga"
                value={formData.namaKepalaKeluarga}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Nama Lengkap'
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="jenis-kelamin">Jenis Kelamin</InputLabel>
                <Select
                  labelId="jenis-kelamin"
                  id="jk-select"
                  value={formData.jk}
                  name='jk'
                  label="Jenis Kelamin"
                  onChange={handleChange}
                >
                  {jkList.map((item, index) => (
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label='Tempat Lahir'
                name="tempatLahir"
                value={formData.tempatLahir}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
                <DatePicker
                  label="Tanggal Lahir"
                  value={formData.tanggalLahir}
                  onChange={handleDateChange}
                  name="tanggalLahir"
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="agama">Agama</InputLabel>
                <Select
                  labelId="agama"
                  id="agama-select"
                  value={formData.agama}
                  label="Agama"
                  name='agama'
                  onChange={handleChange}
                  // onChange={(e) => setAgama(e.target.value)}
                >
                  {agamaList.map((item, index) => (
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="pendidikan">Pendidikan</InputLabel>
                <Select
                  labelId="pendidikan"
                  name="pendidikan"
                  id="pendidikan-select"
                  value={formData.pendidikan}
                  label="Pendidikan"
                  onChange={handleChange}
                  // onChange={(e) => setPendidikan(e.target.value)}
                >
                  {pendidikanList.map((item, index) => (
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                name="pekerjaan"
                options={top100Films}
                value={formData.pekerjaan}
                renderInput={(params) => <TextField {...params} label="Pekerjaan" name="pekerjaan" />}
                onChange={(e, value) => handleChange({ target: { name: 'pekerjaan', value } })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="status-kawin">Status Perkawinan</InputLabel>
                <Select
                  labelId="status-kawin"
                  id="status-kawin-select"
                  name="statusKawin"
                  value={formData.statusKawin}
                  label="Status Perkawinan"
                  onChange={handleChange}
                  // onChange={(e) => setStatusKawin(e.target.value)}
                >
                  {statusKawinList.map((item, index) => (
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="status-hubungan">Status Hubungan</InputLabel>
                <Select
                  labelId="status-hubungan"
                  id="status-hubungan-select"
                  value={formData.statusHub}
                  name="statusHub"
                  label="Status Hubungan"
                  onChange={handleChange}
                  // onChange={(e) => setStatusHub(e.target.value)}
                >
                  {statusHubList.map((item, index) => (
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Gol. Darah'
                name="gol_darah"
                value={formData.gol_darah}
                onChange={handleChange}
                
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Nama Ayah'
                name="ayah"
                value={formData.ayah}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Nama Ibu'
                name="ibu"
                value={formData.ibu}
                onChange={handleChange}
              />
            </Grid>


            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel id="status-pddk">Status Penduduk</InputLabel>
                <Select
                  labelId="status-pddk"
                  id="status-pddk-select"
                  value={sttsPddk}
                  label="Status Penduduk"
                  onChange={(e) => setSttsPddk(e.target.value)}
                >
                  {statusPddk.map((item, index) => (
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='No Kitas'
                name="noKitas"
                value={formData.noKitas}
                onChange={handleChange}
              />
            </Grid> */}
            
            <Grid item xs={12} md={12}>
              {
                loading ? (<LoadingButton
                  fullWidth
                  loading
                  variant='contained'>
                    Loading...
                  </LoadingButton>) : ( <Button variant="contained" color="primary" type="submit" fullWidth>
                Simpan
              </Button>)
              }
             
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalEditAnggota;
