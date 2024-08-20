import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Autocomplete } from '@mui/material';

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

const getSls = async (id_desa, id_kec, offset, limit) => {
  const options = {
    method: 'GET',
    url: process.env.NEXT_PUBLIC_NOCO_SLS_API,
    headers: {
      'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
    },
    params: {
      "where": `(kode_sls,eq)`,
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

function ModaEditSls({open, handleClose, idSls}) {
  return (
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Ubah SLS
      </Typography>
      <Autocomplete
      disablePortal
      id="combo-box-demo"
      // options={top100Films}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
    </Box>
  </Modal>
  )
}

export default ModaEditSls