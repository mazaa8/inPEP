import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { Warning as WarningIcon, Security as SecurityIcon } from '@mui/icons-material';
import { type Claim } from '../../services/insurerService';
import { roleColors } from '../../styles/glassmorphism';

interface ClaimsTableProps {
  claims: Claim[];
  loading: boolean;
}

const ClaimsTable = ({ claims, loading }: ClaimsTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: roleColors.INSURER.primary }} />
      </Box>
    );
  }

  if (claims.length === 0) {
    return (
      <Box sx={{ 
        p: 4, 
        textAlign: 'center',
        background: 'rgba(156, 39, 176, 0.05)',
        borderRadius: '16px',
        border: '1px dashed rgba(156, 39, 176, 0.3)',
      }}>
        <Typography variant="h6" sx={{ color: '#4a148c', fontWeight: 600 }}>
          No claims found
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer sx={{ 
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.8)',
    }}>
      <Table>
        <TableHead>
          <TableRow sx={{ background: 'rgba(156, 39, 176, 0.08)' }}>
            <TableCell sx={{ fontWeight: 700, color: '#4a148c' }}>Claim #</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#4a148c' }}>Patient</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#4a148c' }}>Provider</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#4a148c' }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#4a148c' }}>Service Date</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: '#4a148c' }}>Claimed</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: '#4a148c' }}>Approved</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#4a148c' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#4a148c' }}>Flags</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {claims.map((claim) => (
            <TableRow 
              key={claim.id} 
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(156, 39, 176, 0.05)',
                },
              }}
            >
              <TableCell>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#4a148c', fontWeight: 600 }}>
                  {claim.claimNumber}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: '#4a148c', fontWeight: 600 }}>
                  {claim.patientName}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: 'rgba(74, 20, 140, 0.8)' }}>
                  {claim.providerName}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={claim.claimType} 
                  size="small" 
                  sx={{
                    bgcolor: 'rgba(156, 39, 176, 0.1)',
                    color: '#9C27B0',
                    fontWeight: 600,
                    border: '1px solid rgba(156, 39, 176, 0.3)',
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: 'rgba(74, 20, 140, 0.8)' }}>
                  {formatDate(claim.serviceDate)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#4a148c' }}>
                  {formatCurrency(claim.claimedAmount)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {claim.approvedAmount !== null && claim.approvedAmount !== undefined ? (
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                    {formatCurrency(claim.approvedAmount)}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: 'rgba(74, 20, 140, 0.4)' }}>
                    -
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={claim.status}
                  size="small"
                  sx={{
                    bgcolor: claim.status === 'APPROVED' ? 'rgba(76, 175, 80, 0.15)' :
                             claim.status === 'DENIED' ? 'rgba(244, 67, 54, 0.15)' :
                             claim.status === 'PENDING' ? 'rgba(255, 193, 7, 0.15)' : 'rgba(33, 150, 243, 0.15)',
                    color: claim.status === 'APPROVED' ? '#4CAF50' :
                           claim.status === 'DENIED' ? '#f44336' :
                           claim.status === 'PENDING' ? '#FFC107' : '#2196F3',
                    fontWeight: 700,
                    border: 'none',
                  }}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {claim.isHighCost && (
                    <Chip
                      icon={<WarningIcon />}
                      label="High Cost"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(244, 67, 54, 0.15)',
                        color: '#f44336',
                        fontWeight: 600,
                        border: '1px solid rgba(244, 67, 54, 0.3)',
                      }}
                    />
                  )}
                  {claim.isFraudSuspect && (
                    <Chip
                      icon={<SecurityIcon />}
                      label="Review"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 152, 0, 0.15)',
                        color: '#FF9800',
                        fontWeight: 600,
                        border: '1px solid rgba(255, 152, 0, 0.3)',
                      }}
                    />
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClaimsTable;
