'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, useTheme } from '@mui/material';

export default function MuiNavLink({ href, label }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const theme = useTheme();

  return (
    <Link href={href} passHref style={{ textDecoration: 'none' }}>
      <Box
        component="span"
        sx={{
          textTransform: 'uppercase',
           color:
            theme.palette.mode === 'dark'
              ? isActive
                ? '#fff'
                : '#e0e0e0'
              : isActive
              ? '#fff'
              : '#222',
          px: 1.8,
          py: 1,
          borderRadius: '10px',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          background: isActive
            ? '#2281ced0'
            : 'transparent',
          '&:hover': {
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.05)',
            color:
              theme.palette.mode === 'dark'
                ? '#fff'
                : theme.palette.primary.main,
          },
        }}
      >
        {label}
      </Box>
    </Link>
  );
}
