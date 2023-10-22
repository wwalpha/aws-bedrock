import React from 'react';
// import { bindActionCreators } from 'redux';
// import { useDispatch, useSelector } from 'react-redux';
// import { Controller, useForm } from 'react-hook-form';
// import { Link } from 'react-router-dom';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import MButton from '@mui/material/Button';
import Box from '@mui/material/Box';
// import LoadingButton from '@mui/lab/LoadingButton';
// import { UserActions } from '@actions';
// import { ROUTE_PATHS } from '@constants';
// import { RootState, SignInForm } from 'typings';
// import { styles } from './SignIn.style';

const app = (state: RootState) => state.app;
const defaultValues: SignInForm = {
  username: '',
  password: '',
};

const SignIn = () => {
  const { isLoading } = useSelector(app);
  const actions = bindActionCreators(UserActions, useDispatch());

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({ defaultValues });

  // 編集
  const onSubmit = handleSubmit((datas) => {
    actions.signin(datas.username, datas.password);
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={styles.paper}>
        <Avatar sx={styles.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in to PocketCards
        </Typography>
        <form noValidate onSubmit={onSubmit}>
          <Controller
            name="username"
            control={control}
            rules={{
              required: 'required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Entered value does not match email format',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                error={errors.username !== undefined}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email Address"
                autoFocus
                autoComplete="email"
                value={value}
                onChange={onChange}
                helperText={errors.username?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'required',
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                error={errors.password !== undefined}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                value={value}
                onChange={onChange}
                helperText={errors.password?.message}
              />
            )}
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <LoadingButton
            loading={isLoading}
            type="submit"
            size="large"
            fullWidth
            variant="contained"
            color="primary"
            sx={styles.signin}>
            Sign In
          </LoadingButton>
          <MButton
            sx={styles.signup}
            size="large"
            fullWidth
            variant="contained"
            color="secondary"
            component={React.forwardRef((props: any, ref: any) => (
              <Link to={ROUTE_PATHS.SIGN_UP} {...props} />
            ))}>
            Sign Up
          </MButton>

          <Grid container>
            <Grid item xs></Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default SignIn;