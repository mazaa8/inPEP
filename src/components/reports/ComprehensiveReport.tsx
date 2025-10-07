import { useState } from 'react';
import { Dialog, DialogContent, Box, Typography, Button, IconButton, Grid, Card } from '@mui/material';
import { Close, Download, Email } from '@mui/icons-material';
import jsPDF from 'jspdf';

interface ComprehensiveReportProps {
  open: boolean;
  onClose: () => void;
}

const ComprehensiveReport = ({ open, onClose }: ComprehensiveReportProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add new page
    const addNewPage = () => {
      doc.addPage();
      yPosition = margin;
    };

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number, isBold: boolean = false, color: string = '#000000') => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const rgb = parseInt(color.slice(1), 16);
      const r = (rgb >> 16) & 255;
      const g = (rgb >> 8) & 255;
      const b = rgb & 255;
      doc.setTextColor(r, g, b);
      
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          addNewPage();
        }
        doc.text(line, margin, yPosition);
        yPosition += fontSize * 0.5;
      });
      yPosition += 5;
    };

    // PAGE 1: Executive Summary
    doc.setFillColor(255, 152, 0);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Comprehensive Analytics Report', margin, 25);
    doc.setFontSize(12);
    doc.text('AI-Generated Insights • 101 Patients • Last 90 Days', margin, 35);
    
    yPosition = 50;
    addText('PAGE 1: EXECUTIVE SUMMARY', 18, true, '#FF9800');
    addText('', 10);
    
    addText('Key Performance Indicators:', 14, true, '#000000');
    addText('• Readmission Rate: ↓ 25% (from 5.2% to 3.9%)', 12, false, '#4caf50');
    addText('  Impact: Estimated $450,000 cost savings annually', 11);
    addText('', 10);
    
    addText('• Patient Satisfaction: 92%', 12, false, '#2196f3');
    addText('  Breakdown: Care Quality (90%), Communication (85%), Responsiveness (88%)', 11);
    addText('', 10);
    
    addText('Top 3 AI-Generated Insights:', 14, true, '#000000');
    addText('1. Post-Discharge Recovery Improving', 12, true, '#4caf50');
    addText('   Recovery rates increased from 65% to 85% over 5 weeks, indicating effective care protocols.', 11);
    addText('', 10);
    
    addText('2. Caregiver Stress Needs Attention', 12, true, '#ff9800');
    addText('   Stress management at 75% - recommend hiring additional support staff or respite care resources.', 11);
    addText('', 10);
    
    addText('3. Predictive Models Show Continued Growth', 12, true, '#2196f3');
    addText('   AI forecasts 20% improvement in health outcomes for adherent patients over next quarter.', 11);
    addText('', 10);
    
    addText('Overall System Health Score: 87/100', 14, true, '#FF9800');
    addText('Excellent Performance - AI system is effectively managing patient care, reducing costs, and improving outcomes.', 11);

    // PAGE 2: Hospital Administrators
    addNewPage();
    doc.setFillColor(33, 150, 243);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Hospital Administrators Report', margin, 25);
    
    yPosition = 50;
    addText('PAGE 2: HOSPITAL ADMINISTRATORS', 18, true, '#2196f3');
    addText('Operational Efficiency & Resource Management', 12, false, '#666666');
    addText('', 10);
    
    addText('💰 Cost Savings Analysis:', 14, true, '#000000');
    addText('• Annual Savings: $450,000 from reduced readmissions', 12, false, '#4caf50');
    addText('• ROI: 15% cost reduction across patient care operations', 12);
    addText('• Projected Savings (Next Year): $525,000 with continued improvement', 12);
    addText('', 10);
    
    addText('👥 Staffing Recommendations:', 14, true, '#000000');
    addText('• Caregiver Stress Level: 75% (Yellow Alert)', 12, false, '#ff9800');
    addText('• Recommendation: Hire +2 FTE support staff to reduce burnout', 12);
    addText('• Alternative: Implement respite care program for caregivers', 12);
    addText('', 10);
    
    addText('📋 Compliance & Accreditation:', 14, true, '#000000');
    addText('• Patient Satisfaction: 92% (Exceeds CMS benchmarks of 85%)', 12, false, '#4caf50');
    addText('• Readmission Rate: 3.9% (Below national average of 5.5%)', 12, false, '#4caf50');
    addText('• Quality Metrics: All indicators in green zone', 12, false, '#4caf50');
    addText('', 10);
    
    addText('🎯 Resource Allocation Priorities:', 14, true, '#000000');
    addText('1. Invest in caregiver support programs (High Priority)', 12);
    addText('2. Expand AI monitoring to additional patient cohorts', 12);
    addText('3. Enhance patient education on medication adherence', 12);

    // PAGE 3: Clinical Providers
    addNewPage();
    doc.setFillColor(76, 175, 80);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Clinical Providers Report', margin, 25);
    
    yPosition = 50;
    addText('PAGE 3: CLINICAL PROVIDERS', 18, true, '#4caf50');
    addText('Patient Outcomes & Clinical Recommendations', 12, false, '#666666');
    addText('', 10);
    
    addText('📈 Patient Outcomes Analysis:', 14, true, '#000000');
    addText('• Post-Discharge Recovery: 65% → 85% improvement over 5 weeks', 12, false, '#4caf50');
    addText('• Medication Adherence: Average 78% across all patients', 12);
    addText('• Vitals Monitoring: 92% compliance with recording schedule', 12, false, '#4caf50');
    addText('', 10);
    
    addText('⚠️ High-Risk Patient Alerts:', 14, true, '#000000');
    addText('• Critical Risk: 10 patients requiring immediate intervention', 12, false, '#f44336');
    addText('• High Risk: 20 patients needing close monitoring', 12, false, '#ff9800');
    addText('• Medium Risk: 30 patients with preventive care needs', 12, false, '#ffc107');
    addText('', 10);
    
    addText('🤖 AI Prediction Accuracy:', 14, true, '#000000');
    addText('• Medication Non-Adherence: 87% accuracy', 12, false, '#2196f3');
    addText('• Hospital Readmission Risk: 76% accuracy', 12, false, '#2196f3');
    addText('• Caregiver Burnout Detection: 82% accuracy', 12, false, '#2196f3');
    addText('', 10);
    
    addText('💡 Clinical Recommendations:', 14, true, '#000000');
    addText('1. Focus on exercise and mood support for medium-risk patients', 12);
    addText('2. Implement daily check-ins for critical patients', 12);
    addText('3. Review care protocols for patients with declining trends', 12);
    addText('4. Enhance communication with caregivers showing stress indicators', 12);

    // PAGE 4: Investors/Stakeholders
    addNewPage();
    doc.setFillColor(156, 39, 176);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Investors & Stakeholders Report', margin, 25);
    
    yPosition = 50;
    addText('PAGE 4: INVESTORS & STAKEHOLDERS', 18, true, '#9c27b0');
    addText('ROI Metrics & Market Differentiation', 12, false, '#666666');
    addText('', 10);
    
    addText('💼 Financial Impact & ROI:', 14, true, '#000000');
    addText('• Annual Cost Savings: $450,000 (15% reduction)', 12, false, '#4caf50');
    addText('• Revenue Protection: Reduced readmissions save $1.2M in penalties', 12, false, '#4caf50');
    addText('• Efficiency Gains: 30% reduction in manual monitoring time', 12);
    addText('• Projected 3-Year ROI: 285%', 12, true, '#4caf50');
    addText('', 10);
    
    addText('🚀 Market Differentiation:', 14, true, '#000000');
    addText('• AI-Powered Predictive Care: 87% prediction accuracy', 12, false, '#2196f3');
    addText('• Real-Time Patient Monitoring: 101 patients tracked continuously', 12);
    addText('• Proactive vs Reactive: Interventions 24-48 hours before incidents', 12, false, '#2196f3');
    addText('• Data-Driven Decisions: 2,400+ data points analyzed weekly', 12);
    addText('', 10);
    
    addText('📊 Growth Projections:', 14, true, '#000000');
    addText('• Health Outcomes: 20% improvement projected for adherent patients', 12, false, '#9c27b0');
    addText('• Patient Satisfaction: Target 95% within 6 months', 12);
    addText('• Readmission Rate: Projected to reach 3.5% (industry-leading)', 12, false, '#9c27b0');
    addText('• Market Expansion: Scalable to 500+ patients with current infrastructure', 12);
    addText('', 10);
    
    addText('🏆 Competitive Advantages:', 14, true, '#000000');
    addText('1. Only platform with multi-dashboard AI aggregation', 12);
    addText('2. Predictive analytics with proven 87% accuracy', 12);
    addText('3. Comprehensive reporting for all stakeholders', 12);
    addText('4. Measurable ROI with clear cost savings', 12);
    addText('5. Scalable architecture for enterprise deployment', 12);

    // Save the PDF
    doc.save('Comprehensive-Analytics-Report.pdf');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent sx={{ background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 30%, #2d1f1a 70%, #3d2a1f 100%)', p: 0 }}>
        {/* Header */}
        <Box sx={{ background: 'rgba(0, 0, 0, 0.4)', borderBottom: '1px solid rgba(255, 152, 0, 0.3)', p: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" sx={{ color: '#FFB74D', fontWeight: 700 }}>Comprehensive Analytics Report</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>AI-Generated • 101 Patients • Last 90 Days</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button startIcon={<Email />} sx={{ color: '#64b5f6' }}>Email</Button>
            <Button 
              startIcon={<Download />} 
              onClick={handleDownloadPDF}
              sx={{ background: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)', color: 'white' }}
            >
              Download PDF
            </Button>
            <IconButton onClick={onClose}><Close /></IconButton>
          </Box>
        </Box>

        {/* Page Nav */}
        <Box sx={{ display: 'flex', gap: 1, p: 2, borderBottom: '1px solid rgba(255, 152, 0, 0.2)' }}>
          {['Executive Summary', 'Administrators', 'Providers', 'Investors'].map((title, idx) => (
            <Button key={idx} onClick={() => setCurrentPage(idx + 1)} sx={{ background: currentPage === idx + 1 ? 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)' : 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
              {idx + 1}. {title}
            </Button>
          ))}
        </Box>

        {/* Content */}
        <Box sx={{ p: 4, maxHeight: '60vh', overflow: 'auto' }}>
          {currentPage === 1 && (
            <Box>
              <Typography variant="h4" sx={{ color: '#FFB74D', mb: 3 }}>📊 Executive Summary</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card sx={{ background: 'rgba(76, 175, 80, 0.15)', p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#4caf50' }}>Readmissions ↓ 25%</Typography>
                    <Typography sx={{ color: 'white' }}>From 5.2% to 3.9% • $450K saved</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ background: 'rgba(33, 150, 243, 0.15)', p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#2196f3' }}>Satisfaction: 92%</Typography>
                    <Typography sx={{ color: 'white' }}>Care Quality 90% • Communication 85%</Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {currentPage === 2 && (
            <Box>
              <Typography variant="h4" sx={{ color: '#2196f3', mb: 3 }}>🏥 Administrators Report</Typography>
              <Typography sx={{ color: 'white', mb: 2 }}>• Cost Savings: $450K annually from reduced readmissions</Typography>
              <Typography sx={{ color: 'white', mb: 2 }}>• Staffing: Caregiver stress at 75% - recommend +2 FTE</Typography>
              <Typography sx={{ color: 'white' }}>• Compliance: 92% patient satisfaction exceeds CMS benchmarks</Typography>
            </Box>
          )}

          {currentPage === 3 && (
            <Box>
              <Typography variant="h4" sx={{ color: '#4caf50', mb: 3 }}>👨‍⚕️ Providers Report</Typography>
              <Typography sx={{ color: 'white', mb: 2 }}>• Recovery rates improved 65% → 85% over 5 weeks</Typography>
              <Typography sx={{ color: 'white', mb: 2 }}>• 10 critical patients need immediate intervention</Typography>
              <Typography sx={{ color: 'white' }}>• AI predictions: 87% accuracy on medication adherence</Typography>
            </Box>
          )}

          {currentPage === 4 && (
            <Box>
              <Typography variant="h4" sx={{ color: '#9c27b0', mb: 3 }}>💼 Investors Report</Typography>
              <Typography sx={{ color: 'white', mb: 2 }}>• ROI: $450K annual savings = 15% cost reduction</Typography>
              <Typography sx={{ color: 'white', mb: 2 }}>• Market Edge: AI-powered predictive care (87% accuracy)</Typography>
              <Typography sx={{ color: 'white' }}>• Growth: 20% projected health outcome improvement</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ComprehensiveReport;
