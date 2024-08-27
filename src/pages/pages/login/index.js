// ** React Imports
"use client"
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { LoadingButton } from '@mui/lab'
import Image from 'next/image'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState({
    password: '',
    showPassword: false
  })

  const [username, setUsername] = useState('');
  const [errorUname, setErrorUname] = useState(false);
  const [errorPass, setErrorPass] = useState(false);
  const [isloading, setLoading] = useState(false);

  // ** Hook
  const theme = useTheme()
  const router = useRouter()

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorUname(false);
    setErrorPass(false);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password: values.password
      })
    });

    const data = await res.json();

    if (res.status === 404) {
      setErrorUname(true);
      setLoading(false);
    }

    if (res.status === 401) {
      setErrorPass(true);
      setLoading(false);
    }

    if (res.status === 200) {
      router.push('/admin/dashboard'); 
      setLoading(false);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);
      localStorage.setItem('kode_kec', data.kode_kec);
      localStorage.setItem('kode_desa', data.kode_desa);

    } else {
      // Handle errors
      console.error(data.message);
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{marginBottom: 10}}
          
        >
          <Image
            src="/images/logos/spanduk_logo.png"
            width={150}
            height={150}
            alt="Desa cantik"
          />
        </Box>
      
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5, color:'#FFA823' }}>
              Selamat datang! 👋🏻
            </Typography>
            <Typography variant='body2'>Silakan login terlebih dahulu</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <Box sx={{marginBottom: 4}}>
              <TextField
                autoFocus
                fullWidth
                id='username'
                label='Username'
                sx={{ marginBottom: 0 }}
                value={username}
                onChange={e => setUsername(e.target.value)}
                />
              {errorUname && (
                <Typography sx={{ mr: 2, color: '#f50057', fontSize:14 }}>Username tidak terdaftar</Typography>
              )}
            </Box>

          
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-login-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errorPass && (
                <Typography sx={{ mr: 2, color: '#f50057', fontSize:14 }}>Password tidak sesuai</Typography>
              )}
              {/* {errorUname && (
                
              )} */}
            </FormControl>
            <Box
              sx={{
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'space-between'
              }}
            >
              {/* <FormControlLabel control={<Checkbox />} label='Remember Me' />
              <Link passHref href='/'>
                <LinkStyled>Forgot Password?</LinkStyled>
              </Link> */}
            </Box>
            {isloading ? (   <LoadingButton
            fullWidth
            loading
            variant='contained'>
              Loading...
            </LoadingButton>) : (
              <Button
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              sx={{ marginBottom: 7, marginTop: 5 , ':hover': {
                bgcolor: '#0083E5',
                color: 'white',
              },}}
            >
              Login
            </Button>
            )}
         
            
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              {/* <Typography sx={{ mr: 2, color: 'text.secondary' }}>New on our platform?</Typography>
              <Typography>
                <Link passHref href='/'>
                  <LinkStyled>Create an account</LinkStyled>
                </Link>
              </Typography> */}
            </Box>
           
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
