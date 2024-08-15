// "use client";

// import { Button } from '@mui/material';
// import axios from 'axios';
// import MUIDataTable from 'mui-datatables';
// import { useRouter } from 'next/router';
// import React, { useEffect, useState } from 'react';



// function DataPendudukSls() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const handleAction = (kodeDesa, kodeKec, kodeSls, noKK) => {

//     router.push(`/admin/update-data/${kodeKec}/${kodeDesa}/${kodeSls}/${noKK}`);
//   };

//   const columns = [
//     "Nama SLS",
//     "Nomor KK",
//     "NIK",
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
//           const noKK = tableMeta.rowData[1];

//           return (
//             <Button variant="outlined" onClick={() => handleAction(kodeDesa, kodeKec, kodeSls, noKK)}>
//               Detail
//             </Button>
//           );
//         }
//       }
//     }
//   ];
  
//   const options = {
//     filterType: 'checkbox',
//   };
  
//   const getPendudukSls = async (id_desa, id_kec, id_sls) => {
//     const requestOptions = {
//       method: 'GET',
//       url: 'https://db.bpstuban.my.id/api/v2/tables/me1snqf4cn07esw/records',
//       headers: {
//         'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
//       },
//       params: {
//         "where": `(kode_desa,eq,${id_desa})~and(kode_kec,eq,${id_kec})~and(kode_sls,eq,${id_sls})~and(isKepalaKeluarga,eq,1)`
//       }
//     }
  
//     try {
//       const res = await axios(requestOptions);

//       return res.data.list;
//     } catch (err) {

//       return [];
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       const { idDesa, idKec, idSls } = router.query;
//       if (idDesa && idKec && idSls) {

//         const result = await getPendudukSls(idDesa, idKec, idSls);
        
//         const transformedData = result.map(item => [
//           item.nama_sls,
//           item.nomor_kk,
//           item.nik,
//           item.nama_lengkap,
//           "Action"  
//         ]);
//         setData(transformedData);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [router.query.idDesa, router.query.idKec, router.query.idSls]);

//   return (
//     <div>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <MUIDataTable
//           title={"Data Penduduk SLS"}
//           data={data}
//           columns={columns}
//           options={options}
//         />
//       )}
//     </div>
//   );
// }

// export default DataPendudukSls;

"use client";

import { Button } from '@mui/material';
import axios from 'axios';
import MUIDataTable from 'mui-datatables';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

function DataPendudukSls() {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [offset, setOffset] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const router = useRouter();

  const handleAction = (kodeDesa, kodeKec, kodeSls, noKK) => {
    router.push(`/admin/update-data/${kodeKec}/${kodeDesa}/${kodeSls}/${noKK}`);
  };

  const columns = [
    "Nama SLS",
    "Nomor KK",
    "NIK",
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
          const noKK = tableMeta.rowData[1];

          return (
            <Button variant="outlined" onClick={() => handleAction(kodeDesa, kodeKec, kodeSls, noKK)}>
              Detail
            </Button>
          );
        }
      }
    }
  ];

  const options = {
    filterType: 'checkbox',
    serverSide: true, // Enable server-side pagination
    count: totalRecords,
    rowsPerPage: rowsPerPage,
    rowsPerPageOptions: [10, 15, 25, 100], // Add 25 to the options
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
      url: 'https://db.bpstuban.my.id/api/v2/tables/me1snqf4cn07esw/records',
      headers: {
        'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
      },
      params: {
        "where": `(kode_desa,eq,${id_desa})~and(kode_kec,eq,${id_kec})~and(kode_sls,eq,${id_sls})~and(isKepalaKeluarga,eq,1)`,
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
          item.nama_sls,
          item.nomor_kk,
          item.nik,
          item.nama_lengkap,
          "Action"
        ]);
        setData(transformedData);
      }
    };

    fetchData();
  }, [router.query.idDesa, router.query.idKec, router.query.idSls, offset, rowsPerPage]);

  return (
    <div>
      <MUIDataTable
        title={"Data Penduduk SLS"}
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  );
}

export default DataPendudukSls;
