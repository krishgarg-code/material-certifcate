import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import logo from './logo.png'; // Import your logo
import roll from './roll.png'; // Import watermark

const CertificatePreview = ({ data }) => {
  // Function to format decimal values
  const formatDecimal = (value) => {
    if (value === undefined || value === null || value === '') return '-';
    const valStr = String(value);
    // If the value starts with a decimal point, add a leading zero
    if (valStr.startsWith('.')) {
      return `0${valStr}`;
    }
    return valStr;
  };

  const chemElements = ['C', 'MN', 'SI', 'S', 'P', 'CR', 'NI', 'MO', 'CU', 'V', 'TI', 'MG'];

  const elementLabels = {
    C: 'C%',
    MN: 'Mn%',
    SI: 'Si%',
    S: 'S%',
    P: 'P%',
    CR: 'Cr%',
    NI: 'Ni%',
    MO: 'Mo%',
    CU: 'Cu%',
    V: 'V%',
    TI: 'Ti%',
    MG: 'Mg%'
  };

  return (
    <Card 
      className="shadow-none bg-white mx-auto overflow-hidden border-none relative select-none" 
      id="certificate-preview" 
      style={{ width: '794px', height: '1123px', boxSizing: 'border-box' }}
    >
      <CardContent 
        className="p-6 h-full flex flex-col justify-between relative" 
        style={{ height: '100%', boxSizing: 'border-box' }}
      >
        {/* Watermark Roll Image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <img src={roll} alt="Roll" className="max-w-[75%] max-h-[75%] object-contain opacity-[0.06]" />
        </div>

        <div className="z-10 flex flex-col justify-between h-full w-full">
          {/* 1. Header Box */}
          <table className="w-full border-collapse border border-black text-xs" style={{ tableLayout: 'fixed' }}>
            <tbody>
              <tr>
                {/* Logo cell */}
                <td className="border border-black p-2 text-center align-middle" style={{ width: '18%' }}>
                  <img src={logo} alt="Company Logo" className="max-w-[70px] max-h-[70px] mx-auto object-contain" />
                </td>

                {/* Company Name & Address */}
                <td className="border border-black p-2 text-center align-middle" style={{ width: '58%' }}>
                  <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                    <div className="text-[20px] font-black tracking-wide text-black font-sans leading-normal">
                      C.S. CASTINGS PVT.LTD.
                    </div>
                    <div className="text-[10px] text-black font-bold font-sans leading-normal">
                      Amloh Road, Vill.- Kumbh, Mandi Gobindgarh-147301, Punjab
                    </div>
                  </div>
                </td>

                {/* Document Control Metadata */}
                <td className="border border-black p-2 align-middle text-[9px] font-bold leading-tight text-black font-sans" style={{ width: '24%' }}>
                  <div className="flex flex-col gap-0.5">
                    <div>DOC. NO. : F-SQA-01</div>
                    <div>REV No: 00</div>
                    <div>DATE: 05.01.2026</div>
                    <div>PAGE: 01 OF 01</div>
                    <div>APPROVED BY: M.R</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 2. Title & Certificate Metadata Section */}
          <table className="w-full border-collapse border border-black text-xs" style={{ tableLayout: 'fixed' }}>
            <tbody>
              <tr>
                {/* Title Cell */}
                <td className="border border-black px-4 py-2 align-middle text-left" style={{ width: '60%' }}>
                  <h2 className="text-[16px] font-black tracking-wide uppercase text-black font-sans leading-normal">
                    CHEMICAL COMPOSITION CERTIFICATE
                  </h2>
                </td>

                {/* Metadata fields */}
                <td className="border border-black p-0" style={{ width: '40%' }}>
                  <table className="w-full border-collapse text-[10px]">
                    <tbody>
                      <tr>
                        <td className="border-b border-r border-black p-1 font-bold w-[40%] text-black">Certificate No</td>
                        <td className="border-b border-black p-1 w-[60%] text-black font-bold uppercase">{data.tcNumber || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="border-b border-r border-black p-1 font-bold text-black">Date</td>
                        <td className="border-b border-black p-1 text-black font-semibold">
                          {data.date ? format(new Date(data.date), 'dd.MM.yyyy') : '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className="border-r border-black p-1 font-bold text-black">Work Order</td>
                        <td className="p-1 text-black font-bold uppercase">{data.workOrder || ''}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 3. Customer & Logistics Info Table */}
          <table className="w-full border-collapse border border-black text-[10px]" style={{ tableLayout: 'fixed' }}>
            <tbody>
              <tr className="h-9">
                <td className="border border-black p-1.5 font-bold text-black" style={{ width: '15%' }}>Customer</td>
                <td className="border border-black p-1.5 text-black font-semibold truncate" style={{ width: '45%' }}>
                  {data.partyName} {data.partyAddress ? `, ${data.partyAddress}` : ''}
                </td>
                <td className="border border-black p-1.5 font-bold text-black" style={{ width: '15%' }}>INVOICE NO.</td>
                <td className="border border-black p-1.5 text-black font-semibold uppercase" style={{ width: '25%' }}>
                  {data.invoiceNo || 'N/A'}
                </td>
              </tr>
              <tr className="h-9">
                <td className="border border-black p-1.5 font-bold text-black">Purchase Order No.</td>
                <td className="border border-black p-1.5 text-black font-semibold uppercase">
                  {data.purchaseOrder || 'N/A'}
                </td>
                <td className="border border-black p-1.5 font-bold text-black">PO. Date</td>
                <td className="border border-black p-1.5 text-black font-semibold">
                  {Array.isArray(data.poDates) && data.poDates.length > 0
                    ? data.poDates.filter(Boolean).map((d) => {
                        try {
                          return format(new Date(d), 'dd/MM/yyyy');
                        } catch (e) {
                          return '';
                        }
                      }).filter(Boolean).join(', ')
                    : '-'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* 4. Description Table */}
          <div>
            <div style={{ paddingBottom: '8px' }} className="text-[10px] font-black uppercase text-black font-sans leading-normal">
              DESCRIPTION:-
            </div>
            <table className="w-full border-collapse border border-black text-[10px]" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr className="bg-gray-50 h-8">
                  <th className="border border-black py-1 px-0.5 text-center font-bold text-black" style={{ width: '6%' }}>S. No.</th>
                  <th className="border border-black py-1 px-0.5 text-center font-bold text-black" style={{ width: '14%' }}>ROLL No.</th>
                  <th className="border border-black py-1 px-0.5 text-center font-bold text-black" style={{ width: '37%' }}>ROLL DIMENSIONS</th>
                  <th className="border border-black py-1 px-0.5 text-center font-bold text-black" style={{ width: '13%' }}>GRADE</th>
                  <th className="border border-black py-1 px-0.5 text-center font-bold text-black" style={{ width: '8%' }}>PIECES</th>
                  <th className="border border-black py-1 px-0.5 text-center font-bold text-black" style={{ width: '12%' }}>HARDNESS</th>
                  <th className="border border-black py-1 px-0.5 text-center font-bold text-black" style={{ width: '10%' }}>COLOUR CODE</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className="h-8 text-center align-middle">
                    <td className="border border-black p-1 text-black">{index + 1}</td>
                    <td className="border border-black p-1 text-black font-bold">{item.rollNo || '-'}</td>
                    <td className="border border-black p-1 text-black text-center font-semibold">{item.rollSize || '-'}</td>
                    <td className="border border-black p-1 text-black uppercase">
                      {(item.material || item.type) ? `${item.material}${item.type ? ` ${item.type}` : ''}` : '-'}
                    </td>
                    <td className="border border-black p-1 text-black">{item.pieces || '-'}</td>
                    <td className="border border-black p-1 text-black">{item.hardness || '-'}</td>
                    <td className="border border-black p-1 text-black uppercase">{item.color || '-'}</td>
                  </tr>
                ))}
                {[...Array(Math.max(0, 7 - data.items.length))].map((_, index) => (
                  <tr key={`empty-${index}`} className="h-8">
                    <td className="border border-black p-1 text-center text-black">&nbsp;</td>
                    <td className="border border-black p-1">&nbsp;</td>
                    <td className="border border-black p-1">&nbsp;</td>
                    <td className="border border-black p-1">&nbsp;</td>
                    <td className="border border-black p-1">&nbsp;</td>
                    <td className="border border-black p-1">&nbsp;</td>
                    <td className="border border-black p-1">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 5. Chemical Analysis Table */}
          <div>
            <div style={{ paddingBottom: '8px' }} className="text-[10px] font-black uppercase text-black font-sans leading-normal">
              CHEMICAL ANALYSIS:-
            </div>
            <table className="w-full border-collapse border border-black text-[10px]" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr className="bg-gray-50 h-8">
                  <th className="border border-black py-1 px-0.5 text-center font-bold text-black" style={{ width: '16%' }}>ROLL No.</th>
                  {chemElements.map((el) => (
                    <th key={el} className="border border-black py-1 px-0.5 text-center font-bold text-black" style={{ width: `${84 / 12}%` }}>
                      {elementLabels[el]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className="h-8 text-center align-middle">
                    <td className="border border-black p-0.5 text-black font-bold">{item.rollNo || '-'}</td>
                    {chemElements.map((el) => (
                      <td key={el} className="border border-black p-0.5 text-black">
                        {formatDecimal(item.chemicalProperties?.[el])}
                      </td>
                    ))}
                  </tr>
                ))}
                {[...Array(Math.max(0, 7 - data.items.length))].map((_, index) => (
                  <tr key={`empty-chem-${index}`} className="h-8">
                    <td className="border border-black p-0.5 text-center text-black">&nbsp;</td>
                    {chemElements.map((el) => (
                      <td key={el} className="border border-black p-0.5">&nbsp;</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 6. Signatures Table Block */}
          <table className="w-full border-collapse border border-black text-[9px]" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="bg-gray-50 text-center font-bold h-7">
                <th className="border border-black w-[33.3%] text-black p-1 align-middle">
                  <div className="flex flex-col items-center justify-center text-[10px] font-bold">
                    QC ENGINEER
                  </div>
                </th>
                <th className="border border-black w-[33.3%] text-black p-1 align-middle">
                  <div className="flex flex-col items-center justify-center text-[10px] font-bold">
                    Head-QC/QA
                  </div>
                </th>
                <th className="border border-black w-[33.3%] text-black p-1 align-middle">
                  <div className="flex flex-col items-center justify-center text-[10px] leading-tight font-bold">
                    <span>Inspection Authority</span>
                    <span className="text-[9px] font-semibold tracking-tight">(Witnessed/Reviewed)</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Signature Cells */}
              <tr className="h-16">
                {/* QC Engineer Signature */}
                <td className="border border-black p-2 align-top">
                  <div className="font-bold text-black text-[10px] uppercase leading-normal">
                    Signature:
                  </div>
                </td>
                {/* Head-QC/QA Signature */}
                <td className="border border-black p-2 align-top">
                  <div className="font-bold text-black text-[10px] uppercase leading-normal">
                    Signature:
                  </div>
                </td>
                {/* Inspection Authority Signature */}
                <td className="border border-black p-2 align-top">
                  <div className="font-bold text-black text-[10px] uppercase leading-normal">
                    Signature:
                  </div>
                </td>
              </tr>

              {/* Row 2: Name Cells */}
              <tr className="h-8">
                {/* QC Engineer Name */}
                <td className="border border-black p-2 align-middle">
                  <div className="text-black text-[10px] leading-normal">
                    <span className="font-bold uppercase">Name:</span>
                  </div>
                </td>
                {/* Head-QC/QA Name */}
                <td className="border border-black p-2 align-middle">
                  <div className="text-black text-[10px] leading-normal flex items-center">
                    <span className="font-bold uppercase">Name:</span>
                    <span className="font-bold pl-2 text-[10px]">C.S. CASTINGS PVT.LTD.</span>
                  </div>
                </td>
                {/* Inspection Authority Name */}
                <td className="border border-black p-2 align-middle">
                  <div className="text-black text-[10px] leading-normal">
                    <span className="font-bold uppercase">Name:</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificatePreview;
