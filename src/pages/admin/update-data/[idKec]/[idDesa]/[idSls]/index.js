// "use client";

// import { Box, Button, Grid } from '@mui/material';
// import axios from 'axios';
// import { Plus, Sync } from 'mdi-material-ui';
// import MUIDataTable from 'mui-datatables';
// import { useRouter } from 'next/router';
// import React, { useEffect, useState } from 'react';
// import ModalAddAnggota from 'src/layouts/components/modal/addDataAnggota';
// import ModaEditSls from 'src/layouts/components/modal/editSls';

// function DataPendudukSls() {
//   const [data, setData] = useState([]);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [offset, setOffset] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);
//   const [idSls, setIdSls] = useState('');
//   const router = useRouter();
  
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);


//   const [openModalSLS, setOpenModalSLS] = useState(false);
//   const handleOpenModalSLS = () => setOpenModalSLS(true);
//   const handleCloseModalSLS = () => setOpenModalSLS(false);



//   const handleSubmit = (event) => {
//     event.preventDefault();
//     handleClose();

//   };

//   const handleAction = (kodeDesa, kodeKec, kodeSls, noKK) => {
//     router.push(`/admin/update-data/${kodeKec}/${kodeDesa}/${kodeSls}/${noKK}`);
//   };

//   const columns = [
//     "Alamat KK",
//     "Nama Kepala Keluarga",
//     {
//       name: "Aksi",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta, updateValue) => {
//           const kodeSls = router.query.idSls;
//           const kodeKec = router.query.idKec;
//           const kodeDesa = router.query.idDesa;
//           const noKK = tableMeta.rowData[2];

//           return (
//             <Grid container spacing={2} justifyContent="left" alignItems="center">
//             <Grid item>
//               <Button
//                 variant="outlined"
//                 onClick={() => handleAction(kodeDesa, kodeKec, kodeSls, noKK)}
//               >
//                 Detail
//               </Button>
//             </Grid>
//             <Grid item>
//               <Button
//                 variant="contained"
//                 color='secondary'
//                 sx={{ color: "white !important" }}
//                 onClick={() => {
//                   setIdSls(kodeSls);
//                   handleOpenModalSLS();
//                 }}
//               >
//                 Ubah SLS
//               </Button>
//             </Grid>
//           </Grid>
//           );
//         }
//       }
//     }
//   ];

//   const options = {
//     filterType: 'checkbox',
//     serverSide: true, 
//     count: totalRecords,
//     rowsPerPage: rowsPerPage,
//     rowsPerPageOptions: [10, 15, 25, 100], 
//     onTableChange: (action, tableState) => {
//       switch (action) {
//         case 'changePage':
//           setOffset(tableState.page * rowsPerPage);
//           break;
//         case 'changeRowsPerPage':
//           setRowsPerPage(tableState.rowsPerPage);
//           setOffset(0);
//           break;
//         default:
//           break;
//       }
//     }
//   };

//   const getPendudukSls = async (id_desa, id_kec, id_sls, offset, limit) => {
//     const requestOptions = {
//       method: 'GET',
//       url: process.env.NEXT_PUBLIC_NOCO_PDDK_API,
//       headers: {
//         'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
//       },
//       params: {
//         "where": `(kode_desa,eq,${id_desa})~and(kode_kec,eq,${id_kec})~and(kode_sls,eq,${id_sls})~and(SHDK,eq,Kepala Keluarga)`,
//         "offset": offset,
//         "limit": limit
//       }
//     };

//     try {
//       const res = await axios(requestOptions);
//       setTotalRecords(res.data.pageInfo.totalRows); 
      
//       return res.data.list;
//     } catch (err) {
//       return [];
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const { idDesa, idKec, idSls } = router.query;
//       if (idDesa && idKec && idSls) {
//         const result = await getPendudukSls(idDesa, idKec, idSls, offset, rowsPerPage);

//         const transformedData = result.map(item => [
//           item.alamat,
//           item.nama_pddk,
//           item.nomor_kk,
//           item.kode_sls,
//           "Action"
//         ]);
//         setData(transformedData);
//       }
//     };

//     fetchData();
//   }, [router.query.idDesa, router.query.idKec, router.query.idSls, offset, rowsPerPage]);

//   return (
//     <div>
//       <Grid container spacing={2} justifyContent="left" alignItems="center">
//       <Grid item>
//         <Button onClick={handleOpen}  variant="contained" sx={{mb:3}} startIcon={<Plus />}>
//           Tambah Keluarga
//         </Button>
//       </Grid>
//       <Grid item>
//       <Button onClick={() => location.reload()} variant="contained" sx={{mb:3}} startIcon={<Sync />}>
//         Sync Data
//       </Button>
//       </Grid>
//     </Grid>
     
     
//       <MUIDataTable
//         title={"Data Penduduk SLS"}
//         data={data}
//         columns={columns}
//         options={options}
//       />
//        <ModalAddAnggota open={open} handleClose={handleClose} handleSubmit={handleSubmit} noKK={''}/>
//        <ModaEditSls open={openModalSLS} handleClose={handleCloseModalSLS} noKK={}/>
//     </div>
//   );
// }

// export default DataPendudukSls;

import { Box, Button, Grid } from '@mui/material';
import axios from 'axios';
import { Plus, Sync } from 'mdi-material-ui';
import MUIDataTable from 'mui-datatables';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ModalAddAnggota from 'src/layouts/components/modal/addDataAnggota';
import ModaEditSls from 'src/layouts/components/modal/editSls';

function DataPendudukSls() {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [offset, setOffset] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [idSls, setIdSls] = useState('');
  const [noKK, setNoKK] = useState('');  // State to store the selected noKK
  const router = useRouter();
  
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openModalSLS, setOpenModalSLS] = useState(false);
  const handleOpenModalSLS = () => setOpenModalSLS(true);
  const handleCloseModalSLS = () => setOpenModalSLS(false);

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
              <Grid item>
                <Button
                  variant="contained"
                  color='secondary'
                  sx={{ color: "white !important" }}
                  onClick={() => {
                    setIdSls(kodeSls);
                    setNoKK(noKK); 
                    handleOpenModalSLS();
                  }}
                >
                  Ubah SLS
                </Button>
              </Grid>
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
          setOffset(tableState.page * rowsPerPage);
          break;
        case 'changeRowsPerPage':
          setRowsPerPage(tableState.rowsPerPage);
          setOffset(0);
          break;
        default:
          break;
      }
    }
  };

  const getPendudukSls = async (id_desa, id_kec, id_sls, offset, limit) => {
    const requestOptions = {
      method: 'GET',
      url: process.env.NEXT_PUBLIC_NOCO_PDDK_API,
      headers: {
        'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
      },
      params: {
        "where": `(kode_desa,eq,${id_desa})~and(kode_kec,eq,${id_kec})~and(kode_sls,eq,${id_sls})~and(SHDK,eq,Kepala Keluarga)`,
        "offset": offset,
        "limit": limit
      }
    };

    try {
      const res = await axios(requestOptions);
      setTotalRecords(res.data.pageInfo.totalRows); 
      
      return res.data.list;
    } catch (err) {
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { idDesa, idKec, idSls } = router.query;
      if (idDesa && idKec && idSls) {
        const result = await getPendudukSls(idDesa, idKec, idSls, offset, rowsPerPage);

        const transformedData = result.map(item => [
          item.alamat,
          item.nama_pddk,
          item.nomor_kk,
          item.kode_sls,
          "Action"
        ]);
        setData(transformedData);
      }
    };

    fetchData();
  }, [router.query.idDesa, router.query.idKec, router.query.idSls, offset, rowsPerPage]);

  return (
    <div>
      <Grid container spacing={2} justifyContent="left" alignItems="center">
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
      </Grid>

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
