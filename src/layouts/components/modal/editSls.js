import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Alert, Grid, IconButton, Autocomplete, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Check, Close } from 'mdi-material-ui';
import { supabase } from 'src/pages/api/supabase';

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
  const [sls, setSls] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [slsOptions, setSlsOptions] = useState([]);

  useEffect(() => {
    const fetchSlsOptions = async () => {
      try {
        let { data, error } = await supabase.from('sls').select('id, kode_sls, nama_sls');
        if (error) throw error;
        setSlsOptions(data);
      } catch (err) {
        console.error('Failed to fetch SLS options:', err);
      }
    };

    fetchSlsOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!sls) {
      alert('Please select a valid SLS.');
      setLoading(false);
      return;
    }

    try {
      const wilayah_id_terkecil_id = sls.id;

      const { error } = await supabase
        .from('penduduks')
        .update({ 
          kode_sls: sls.kode_sls, 
          wilayah_terkecil_id: wilayah_id_terkecil_id
        })
        .eq('nomor_kk', noKK);

      if (error) throw error;

      setLoading(false);
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
      handleClose();
    } catch (err) {
      console.error('Failed to update penduduks:', err);
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
          <Typography id="modal-title" variant="h6">
            Edit SLS
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        {alert && (
          <Alert icon={<Check fontSize="inherit" />} severity="success">
            Berhasil! Silahkan lakukan sinkronisasi data
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Autocomplete
            fullWidth
            options={slsOptions}
            getOptionLabel={(option) => `${option.nama_sls}`}
            renderInput={(params) => <TextField {...params} label="SLS" />}
            value={sls}
            onChange={(event, newValue) => setSls(newValue)}
            sx={{ mb: 4, mt: 4 }}
          />
          <Grid item xs={12} md={12}>
            {loading ? (
              <LoadingButton fullWidth loading variant="contained">
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

