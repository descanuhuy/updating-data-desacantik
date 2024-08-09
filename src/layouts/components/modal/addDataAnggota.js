import React, { useState } from 'react';
import { Autocomplete, Box, Button, Grid, IconButton, Modal, TextField, Typography } from '@mui/material';
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

const ModalAddAnggota = ({ open, handleClose, noKK }) => {
  const [value, setValue] = useState(dayjs('2022-04-17'));
  const [statusKawin, setStatusKawin] = useState('');
  const [jk, setJk] = useState('');
  const [statusHub, setStatusHub] = useState('');
  const [pendidikan, setPendidikan] = useState('');
  const [agama, setAgama] = useState('');
  const [formData, setFormData] = useState({
    noKK: noKK,
    nik: '',
    namaKepalaKeluarga: '',
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: dayjs(),
    kewarganegaraan: '',
    noPaspor: '',
    noKitas: '',
    ayah: '',
    ibu: ''
  });

  const statusKawinList = ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'];
  const jkList = ['Laki-laki', 'Perempuan'];
  const statusHubList = ['Kepala Keluarga', 'Istri', 'Anak', 'Menantu', 'Cucu', 'Mertua', 'Orangtua'];
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
    const requestOptions = {
      method: 'POST',
      url: 'https://db.bpstuban.my.id/api/v2/tables/me1snqf4cn07esw/records',
      headers: {
        'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN,
        'Content-Type': 'application/json'
      },
      data: [
        {
          nomor_kk: formData.noKK,
          nik: formData.nik,
          nama_kk: formData.namaKepalaKeluarga,
          nama_lengkap: formData.namaLengkap,
          jk: jk,
          tempat_lahir: formData.tempatLahir,
          tgl_lahir: formData.tanggalLahir.format('YYYY-MM-DD'),
          agama: agama,
          pendidikan: pendidikan,
          jenis_pekerjaan: formData.pekerjaan,
          status_perkawinan: statusKawin,
          status_hub_keluarga: statusHub,
          kewarganegaraan: formData.kewarganegaraan,
          no_paspor: formData.noPaspor,
          no_kitas_kitab: formData.noKitas,
          ayah: formData.ayah,
          ibu: formData.ibu
        }
      ]
      
    };

    try {
      const res = await axios(requestOptions);
      // console.log(res.data);
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
          <Typography id="modal-title" variant="h6">
            Tambah Anggota Keluarga
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
                <InputLabel id="status-hubungan">Status Hubungan</InputLabel>
                <Select
                  labelId="status-hubungan"
                  id="status-hubungan-select"
                  value={statusHub}
                  label="Status Hubungan"
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
                label='Kewarganegaraan'
                name="kewarganegaraan"
                value={formData.kewarganegaraan}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='No Paspor'
                name="noPaspor"
                value={formData.noPaspor}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='No Kitas'
                name="noKitas"
                value={formData.noKitas}
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
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Simpan
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalAddAnggota;
