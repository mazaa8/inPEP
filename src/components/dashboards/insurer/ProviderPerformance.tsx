import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const providerData = [
  { id: 1, name: 'St. Jude Hospital', outcomeScore: 92, costScore: 88, overall: 90 },
  { id: 2, name: 'General Hospital', outcomeScore: 85, costScore: 91, overall: 88 },
  { id: 3, name: 'City Clinic', outcomeScore: 88, costScore: 82, overall: 85 },
  { id: 4, name: 'Community Health Center', outcomeScore: 78, costScore: 85, overall: 81 },
].sort((a, b) => b.overall - a.overall);

const ProviderPerformance = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Provider Network Performance</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="provider performance table">
          <TableHead>
            <TableRow>
              <TableCell>Provider Name</TableCell>
              <TableCell align="right">Patient Outcomes Score</TableCell>
              <TableCell align="right">Cost Efficiency Score</TableCell>
              <TableCell align="right">Overall Performance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {providerData.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.outcomeScore}</TableCell>
                <TableCell align="right">{row.costScore}</TableCell>
                <TableCell align="right">{row.overall}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProviderPerformance;
