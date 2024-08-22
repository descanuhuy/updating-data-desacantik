
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Alert, Grid, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { Check, Close, CloseCircleOutline } from 'mdi-material-ui';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

function ModaEditSls({ open, handleClose, noKK }) {
  const [sls, setSls] = useState('');
  const [alamat, setAlamat] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fetchOptions = {
        method: 'GET',
        url: process.env.NEXT_PUBLIC_NOCO_PDDK_API,
        headers: {
          'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN,
        },
        params: {
          where: `(nomor_kk,eq,${noKK})`,
        },
      };

      const res = await axios(fetchOptions);
      const records = res.data.list;

      const updatePromises = records.map(record => {
        const requestOptions = {
          method: 'PATCH',
          url: process.env.NEXT_PUBLIC_NOCO_PDDK_API,
          headers: {
            'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN,
            'Content-Type': 'application/json',
          },
          data: {
            Id: record.Id, 
  
            kode_sls: sls,
            alamat: alamat
            
          }
        };
        return axios(requestOptions);
      });

      await Promise.all(updatePromises);

      setLoading(false);
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
      // handleClose();
      // Trigger snackbar or any other notification for successful update
    } catch (err) {
      console.error(err);
      setLoading(false);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
          <Typography id="modal-title" variant="h6">
            Edit SLS
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        {/* <Typography id="modal-modal-title" variant="h6" component="h2">
          Ubah SLS
        </Typography> */}
        {alert && 
         <Alert icon={<Check fontSize="inherit" />} severity="success">
         Berhasil! Silahkan lakukan sinkronisasi data
       </Alert>
        }
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type='text'
            label='sls'
            name="sls"
            value={sls}
            onChange={(e) => setSls(e.target.value)}
            sx={{mb:2, mt:4}}
          />
          <TextField
            fullWidth
            type='text'
            label='alamat'
            name="alamat"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            sx={{mb:4}}
          />
          <Grid item xs={12} md={12}>
            {loading ? (
              <LoadingButton fullWidth loading variant='contained'>
                Loading...
              </LoadingButton>
            ) : (
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Simpan
              </Button>
            )}
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}

export default ModaEditSls;
