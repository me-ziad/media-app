'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, useTheme } from '@mui/material';

export default function MuiNavLink({ href, label }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const theme = useTheme();

  return (
    <Link href={href} passHref>
      <Box style={{ textDecoration: 'none', }}
        component="span"
                sx={{color: {
            xs: theme.palette.mode === "dark" ? "#b4b4b4ff" : "#424242ff" ,
            md: "#fff",     
          } ,
          fontWeight: isActive ? 'mideum' : 'normal',
          borderBottom: isActive ? '2px solid white' : 'none',
          py: 1,
          cursor: 'pointer',
          transition: '0.3s',
          textDecoration: 'none'    
        }}
      >
        {label}
      </Box>
    </Link>
  );
}
