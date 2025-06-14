
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (formData) => {
  try {
    const element = document.getElementById('certificate-preview');
    if (!element) {
      throw new Error('Certificate preview element not found');
    }

    // Configure html2canvas for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF with A4 dimensions
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate dimensions to fit the image properly
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 3; // Small margin from top
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    
    // Generate filename from party name or use default
    const filename = formData.partyName 
      ? `Material_Certificate_${formData.partyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      : 'Material_Certificate.pdf';
    
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
