import React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { ArrowRight, ChevronRight } from 'mdi-material-ui';

function Breadcrumb({ items }) {
  return (
    <div>
      <Breadcrumbs separator={<ChevronRight />} aria-label="breadcrumb">
        {items.map((item, index) => (
          index === items.length - 1 ? (
            <Typography key={index} color="text.primary">
              {item.name}
            </Typography>
          ) : (
            <Link 
              key={index} 
              underline="hover" 
              color="inherit" 
              href={item.url}
            >
              {item.name}
            </Link>
          )
        ))}
      </Breadcrumbs>
    </div>
  );
}

export default Breadcrumb;
