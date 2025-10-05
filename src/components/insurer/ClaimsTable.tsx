import {
  Paper,
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

interface ClaimsTableProps {
  claims: Claim[];
  loading: boolean;
}

const ClaimsTable = ({ claims, loading }: ClaimsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'DENIED':
        return 'error';
      case 'PENDING':
        return 'warning';
      case 'UNDER_REVIEW':
        return 'info';
      default:
        return 'default';
    }
  };

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
        <CircularProgress />
      </Box>
    );
  }

  if (claims.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No claims found
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f5f5f5' }}>
            <TableCell><strong>Claim #</strong></TableCell>
            <TableCell><strong>Patient</strong></TableCell>
            <TableCell><strong>Provider</strong></TableCell>
            <TableCell><strong>Type</strong></TableCell>
            <TableCell><strong>Service Date</strong></TableCell>
            <TableCell align="right"><strong>Claimed</strong></TableCell>
            <TableCell align="right"><strong>Approved</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Flags</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {claims.map((claim) => (
            <TableRow key={claim.id} hover>
              <TableCell>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {claim.claimNumber}
                </Typography>
              </TableCell>
              <TableCell>{claim.patientName}</TableCell>
              <TableCell>{claim.providerName}</TableCell>
              <TableCell>
                <Chip label={claim.claimType} size="small" variant="outlined" />
              </TableCell>
              <TableCell>{formatDate(claim.serviceDate)}</TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(claim.claimedAmount)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {claim.approvedAmount !== null && claim.approvedAmount !== undefined ? (
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(claim.approvedAmount)}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    -
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={claim.status}
                  size="small"
                  color={getStatusColor(claim.status) as any}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {claim.isHighCost && (
                    <Chip
                      icon={<WarningIcon />}
                      label="High Cost"
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  )}
                  {claim.isFraudSuspect && (
                    <Chip
                      icon={<SecurityIcon />}
                      label="Review"
                      size="small"
                      color="warning"
                      variant="outlined"
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
