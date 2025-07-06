import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import logo from './logo.png'; // Import your logo
import image1 from './image1.png';
import image2 from './image2.png';
import image3 from './image3.png';
import image4 from './image4.png';
import roll from './roll.png';

const CertificatePreview = ({ data }) => {
  // Add function to format decimal values
  const formatDecimal = (value) => {
    if (!value) return '-';
    // If the value starts with a decimal point, add a leading zero
    if (value.startsWith('.')) {
      return `0${value}`;
    }
    return value;
  };

  return (
    <Card className="shadow-none" id="certificate-preview">
      <CardContent className="p-0">
          <div className="border-4 border-black h-full p-4 flex flex-col justify-between m-2 mb-1 ml-2 relative">
            {/* Watermark Roll Image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img src={roll} alt="Roll" className="w-85 h-85 object-contain opacity-25" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4 -mt-5">
              <div className="w-20 h-20 flex items-center justify-center">
                <img src={logo} alt="Company Logo" className="max-w-full max-h-full object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-center  ml-20 -mt-4">COMPOSITION </h1>
              <h1 className="text-2xl font-bold  flex-1 ml-5  -mt-4 ">CERTIFICATION</h1>
            </div>

            {/* Company/Party */}
            <div className="grid  text-xs gap-10 mb-8 ">
              <div className='-mt-2'>
                <p className="font-bold text-xl -mt-3 mb-1">  C.S CASTINGS PVT. LTD.</p>
                <p className='mb-2.5 text-[#1168b5] font-semibold' >[A Unit of Hardesh Group Of Companies]</p>
                <p className="font-semibold">  VILL - KUMBH ,OPP POWER GRID,AMLOH ROAD , MANDI GOBINDGARH - 147301 (PB) </p>
              </div>
              <div  >
             <hr style={{ width: '106%',marginLeft:'-17px', marginTop: '-30px',marginBottom:'10px', height: '2px', backgroundColor: 'black', border: 'none' }} />


              <br />
                <p className='mb-1.5'>• PARTY NAME - {data.partyName}</p>
                <p >• ADDRESS- {data.partyAddress}</p>
              </div>
            </div>

            {/* Details Box */}
            <div className="border-2 border-black p-3 text-xs mb-8">
              <div className="grid grid-cols-2">
                <div className="space-y-1">
                  <div className="text-l">T.C NO : {data.tcNumber || 'N/A'}</div>
                  <div className="text-l">Invoice No : {data.invoiceNo || 'N/A'}</div>
                  <div className="text-l">P.O : {data.purchaseOrder}</div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-l">Date : {format(data.date, 'dd/MM/yy')}</div>
                  <div className="text-l">Date : {format(data.date, 'dd/MM/yy')}</div>
                  <div className="text-l text-right">
                    Date: {Array.isArray(data.poDates) && data.poDates.length > 0
                      ? data.poDates.map((d, i) => (
                          <span key={i} className="inline-block">
                            {format(d, 'dd/MM/yy')}{i < data.poDates.length - 1 ? ', ' : ''}
                          </span>
                        ))
                      : '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* First Table */}
            <table className="w-full border border-black border-collapse text-xs mb-10">
              <thead>
                <tr>
                  <th className="border border-black py-2">S.No</th>
                  <th className="border border-black py-2">Roll No</th>
                  <th className="border border-black py-2">Roll Dimensions</th>
                  <th className="border border-black py-2">Grade</th>
                  <th className="border border-black py-2">Hardness</th>
                  <th className="border border-black py-2">Colour Code</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-black h-8 text-center">{index + 1}</td>
                    <td className="border border-black h-8 text-center">{item.rollNo || '-'}</td>
                    <td className="border border-black h-8 text-center">{item.rollSize || '-'}</td>
                    <td className="border border-black h-8 text-center">{item.material || '-'}</td>
                    <td className="border border-black h-8 text-center">{item.hardness || '-'}</td>
                    <td className="border border-black h-8 text-center">{item.color || '-'}</td>
                  </tr>
                ))}
                {[...Array(Math.max(0, 6 - data.items.length))].map((_, index) => (
                  <tr key={`empty-${index}`}>
                    {Array(6).fill(null).map((_, i) => (
                      <td key={i} className="border border-black h-8">&nbsp;</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Second Table */}
            <table className="w-full border border-black border-collapse text-xs mb-8">
              <colgroup>
                <col style={{ width: '10%' }} />
                {Array(12).fill(null).map((_, i) => (
                  <col key={i} style={{ width: `${90 / 12}%` }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {["ROLL No", "C", "MN", "SI", "S", "P", "CR", "NI", "MO", "V", "MG", "CU", "TI"].map((head, i) => (
                    <th key={i} className="border border-black py-4 -pt-5">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-black h-10 text-center">{item.rollNo || '-'}</td>
                    <td className="border border-black h-10 text-center">{formatDecimal(item.chemicalProperties.C)}</td>
                    <td className="border border-black h-10 text-center">{formatDecimal(item.chemicalProperties.MN)}</td>
                    <td className="border border-black h-10 text-center">{formatDecimal(item.chemicalProperties.SI)}</td>
                    <td className="border border-black h-10 text-center">{formatDecimal(item.chemicalProperties.S)}</td>
                    <td className="border border-black h-10 text-center">{formatDecimal(item.chemicalProperties.P)}</td>
                    <td className="border border-black h-10 text-center">{formatDecimal(item.chemicalProperties.CR)}</td>
                    <td className="border border-black h-10 text-center">{formatDecimal(item.chemicalProperties.NI)}</td>
                    <td className="border border-black h-10 text-center">{formatDecimal(item.chemicalProperties.MO)}</td>
                    <td className="border border-black h-10 text-center">{formatDecimal(item.chemicalProperties.V)}</td>
                    <td className="border border-black h-10 text-center">{formatDecimal(item.chemicalProperties.MG)}</td>
                    <td className="border border-black h-10 text-center">{formatDecimal(item.chemicalProperties.CU)}</td>
                    <td className="border border-black h-10 text-center">{formatDecimal(item.chemicalProperties.TI)}</td>
                  </tr>
                ))}
                {[...Array(Math.max(0, 6 - data.items.length))].map((_, index) => (
                  <tr key={`empty-${index}`}>
                    {Array(13).fill(null).map((_, i) => (
                      <td key={i} className="border border-black h-10">&nbsp;</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-end">
              <div className="flex gap-2 -mb-4">
                <img src={image1} alt="Image 1" className="w-15 h-7 object-contain" />
                <img src={image2} alt="Image 2" className="w-15 h-7 object-contain" />
                <img src={image3} alt="Image 3" className="w-15 h-7 object-contain" />
                <img src={image4} alt="Image 4" className="w-15 h-7 object-contain" />
              </div>
              <div className="text-right text-sm font-bold pt-4">AUTHORISED SIGNATORY</div>
            </div>
          </div>
      </CardContent>
      <div className="text-xs text-center mb-3  mt-2">
        <p>Note: This is a computer-generated document and does not require a signature.</p>
        </div>
    </Card>
  );
};

export default CertificatePreview;
