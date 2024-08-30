import React, { useEffect, useState } from 'react';
import { Alert, Autocomplete, Box, Button, Grid, IconButton, Modal, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { Check } from 'mdi-material-ui';
import router from 'next/router';
import { route } from 'next/dist/server/router';
import dayjs from 'dayjs';
import { supabase } from 'src/pages/api/supabase';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '55%', // Default width
  overflowY: 'auto',
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  border: '1px solid #fff',
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
  '@media (max-width: 960px)': { 
    width: '55%',
  },
  '@media (max-width: 600px)': { 
    width: '70%',
  },
};

const ModalAddAnggota = ({ open, handleClose, noKK }) => {
  const [statusKawin, setStatusKawin] = useState('');
  const [jk, setJk] = useState('');
  const [statusHub, setStatusHub] = useState('');
  const [pendidikan, setPendidikan] = useState('');
  const [sttsPddk, setSttsPddk] = useState('');
  const [agama, setAgama] = useState('');
  const [region, setRegion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState(false);


  const [formData, setFormData] = useState({
    noKK: noKK,
    nik: '',
    namaKepalaKeluarga: '',
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: dayjs('01-01-1975'),
    gol_darah: '',
    status: '',
    // cacat: '',
    ayah: '',
    ibu: ''
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
  const pekerjaanList = [
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
  
    try {
      const { data: slsData, error: slsError } = await supabase
        .from('sls')
        .select('*')
        .eq('kode_sls', router.query.idSls)
        .eq('kode_desa', router.query.idDesa)
        .eq('kode_kec', router.query.idKec)
        .single();

      if (slsError || !slsData) {
        throw new Error('Failed to fetch wilayah_id_terkecil');
      }
  
      const data = {
        nomor_kk: formData.noKK,
        nik: formData.nik,
        nama_kk: formData.namaKepalaKeluarga,
        nama_pddk: formData.namaLengkap,
        jk: jk,
        tempat_lahir: formData.tempatLahir,
        tgl_lahir: formData.tanggalLahir.format('YYYY-MM-DD'),
        agama: agama,
        pendidikan: pendidikan,
        pekerjaan: formData.pekerjaan,
        status_kawin: statusKawin,
        shdk: statusHub,
        gol_darah: formData.gol_darah,
        status: formData.status,
        ayah: formData.ayah,
        ibu: formData.ibu,
        kode_kec: router.query.idKec,
        kode_desa: router.query.idDesa,
        kode_sls: router.query.idSls,
        wilayah_terkecil_id: slsData.id, 
        isNew: 1,
      };
  

      const { error: insertError } = await supabase
        .from('penduduks')
        .insert([data]);
  
      if (insertError) {
        throw insertError;
      }
  
      // Handle success
      setLoading(false);
      setSnackBar(true);
      setTimeout(() => {
        setSnackBar(false);
      }, 3000);
      
    } catch (err) {
      console.error(err);
      // Handle error
      setLoading(false);
    }
  };
  
 

  const fetchWilayah = async () => {
    const options = {
      method: 'GET',
      url: "/api/wilayah", 
    };
  
    try {
      const data = await axios.request(options);
      const wilayah = data.data;
      return wilayah;
    } catch {
      console.error('Error fetching wilayah data');
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchWilayah();
      setRegion(result.data)
    }
  
    fetchData();
  }, []);
  

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
            Tambah Data
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
                  value={jk}
                  label="Jenis Kelamin"
                  onChange={(e) => setJk(e.target.value)}
                >
                  {jkList.map((item, index) => (
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                id="combo-box-wilayah"
                options={region}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="Tempat Lahir" name="tempatLahir" />
                )}
                onChange={(e, value) => handleChange({ target: { name: 'tempatLahir', value: value ? value.name : '' } })}
                value={region.find((item) => item.name === formData.tempatLahir) || null}
              />
            </Grid>

            
            
            <Grid item xs={12} md={4}>
              
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='id'>
                <DatePicker
                  label="Tanggal Lahir"
                  value={formData.tanggalLahir}
                  onChange={handleDateChange}
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
                  value={agama}
                  label="Agama"
                  onChange={(e) => setAgama(e.target.value)}
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
                  id="pendidikan-select"
                  value={pendidikan}
                  label="Pendidikan"
                  onChange={(e) => setPendidikan(e.target.value)}
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
                options={pekerjaanList}
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
                  value={statusKawin}
                  label="Status Perkawinan"
                  onChange={(e) => setStatusKawin(e.target.value)}
                >
                  {statusKawinList.map((item, index) => (
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="status-hubungan">Status Hubungan Dlm Keluarga</InputLabel>
                <Select
                  labelId="status-hubungan"
                  id="status-hubungan-select"
                  value={statusHub}
                  label="Status Hubungan Dlm Keluarga"
                  onChange={(e) => setStatusHub(e.target.value)}
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
                  name="status" 
                  value={formData.status}
                  label="Status Penduduk"
                  onChange={handleChange} 
                >
                  {statusPddk.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            
            </Grid>
            

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

export default ModalAddAnggota;
