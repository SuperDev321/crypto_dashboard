import * as React from 'react';
import TextField from '@mui/material/TextField';
// import InputBase from '@mui/material/InputBase';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useAsync } from '../../hooks/useAsync';
import { searchAssets } from '../../api';

export default function SearchAsset({ addAsset }) {
  const [open, setOpen] = React.useState(false);

  const { data, setData, status, loading: dataLoading, run } = useAsync({
    data: []
  })

  React.useEffect(() => {
    if (open) {
      run(searchAssets('all').then((data) => {
        return data?.map((item) => ({ ...item, title: item.symbol }))
      }))
    }
  }, [setData, open, run])

  React.useEffect(() => {
    if (!open) {
      setData([]);
    }
  }, [open, setData]);

  const handleChange = (event, item) => {
    addAsset(item)
  }

  const loading = open && (status !== 'resolved' || dataLoading)

  return (
    <Autocomplete
      id="asynchronous-demo"
      sx={{ width: 300 }}
      open={open}
      clearOnEscape={true}
      clearOnBlur={true}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.title}
      options={data ?? []}
      loading={loading}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          variant="standard"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
          ),
          }}
        />
      )}
    />
  );
}
