export const PAGINATION_STYLE = {
  '& .MuiPagination-ul': {
    justifyContent: 'center',
  },
  '& .MuiPaginationItem-root': {
    borderRadius: '0px',
    border: '1px solid #E0DED3',
    backgroundColor: '#FAF9F6',
    color: '#1A3E35',
    width: '45px',
    height: '45px',
    margin: '0 5px',
    fontSize: '18px',
    '&:hover': {
      backgroundColor: '#F0EEE5',
    },
  },
  '& .MuiPaginationItem-root.Mui-selected': {
    backgroundColor: '#1A3E35 !important',
    color: '#FFFFFF',
    border: '1px solid #1A3E35',
  },
  '& .MuiPaginationItem-previousNext': {
    border: 'none',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '& svg': {
      fontSize: '24px',
      color: '#C4C2B8',
    },
  },
};

export const LABEL_STYLE = {
  color: '#063526 !important',
  textTransform: 'uppercase !important',
  background: '#fff !important',
};

export const SELECT_STYLE = {
  '& fieldset': {
    borderColor: '#063526 !important',
  },
};
