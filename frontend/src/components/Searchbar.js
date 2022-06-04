import { useEffect, useState } from 'react';
// material
import { styled, alpha } from '@mui/material/styles';
import { Input, Button, InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
// component
import Iconify from 'src/components/Iconify';

// ----------------------------------------------------------------------

const APPBAR_MOBILE = 52;
const APPBAR_DESKTOP = 68;

const SearchbarStyle = styled('div')(({ theme }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    height: APPBAR_MOBILE,
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
    padding: theme.spacing(0, 1),
    boxShadow: 'inset 0px 0 10px 4px rgb(145 158 171 / 14%)',
    borderRadius: 8,
    [theme.breakpoints.up('md')]: {
        height: APPBAR_DESKTOP,
        padding: theme.spacing(0, 5),
    },
}));

// ----------------------------------------------------------------------

export default function Searchbar({ placeholder = "Search…", handleSearch }) {
    const [search, setSearch] = useState("");

    useEffect(() => {
        handleSearch(search);
    }, [search]);

    return (
        <SearchbarStyle>
            <Input
                autoFocus
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disableUnderline
                placeholder={placeholder}
                startAdornment={
                    <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                    </InputAdornment>
                }
                sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
            />
            {/* <Button variant="contained">
                Search
            </Button> */}
            {search && <IconButton aria-label="clear search" onClick={() => setSearch("")}>
                <ClearIcon />
            </IconButton>}
        </SearchbarStyle>
    );
}
