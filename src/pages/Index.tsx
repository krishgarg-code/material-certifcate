import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  Download,
  FileText,
  Plus,
  Trash2,
  Edit,
  User,
  Box,
  ListChecks,
  Zap,
  Dna,
  RefreshCcw,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import CertificatePreview from "../components/CertificatePreview";
import { generatePDF } from "../utils/pdfGenerator";
import { motion, AnimatePresence } from "framer-motion";

interface Item {
  material: string;
  rollNo: string;
  rollSize: string;
  hardness: string;
  color: string;
  type: string;
  pieces: number;
  chemicalProperties: {
    C: string;
    MN: string;
    SI: string;
    S: string;
    P: string;
    CR: string;
    NI: string;
    MO: string;
    V: string;
    MG: string;
    CU: string;
    TI: string;
  };
}

const Index = () => {
  const inputRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeTab, setActiveTab] = useState("client");

  const generateTCNumber = () => {
    const now = new Date();
    const datePart = now.toISOString().slice(2, 10).replace(/-/g, ''); // e.g., "240614"
    const randomDigits = Math.floor(100 + Math.random() * 900); // 3 random digits
    return `CSC${datePart}${randomDigits}`;
  };

  const [formData, setFormData] = useState({
    date: new Date(),
    poDates: [new Date()],
    partyName: '',
    partyAddress: '',
    purchaseOrder: '',
    invoiceNo: '',
    workOrder: '',
    tcNumber: generateTCNumber(),
    items: []
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      tcNumber: generateTCNumber()
    }));
  }, []);

  const [currentItem, setCurrentItem] = useState<Item>({
    material: '',
    rollNo: '',
    rollSize: '',
    hardness: '',
    color: '',
    type: '',
    pieces: 1,
    chemicalProperties: {
      C: '', MN: '', SI: '', S: '', P: '', CR: '', NI: '', MO: '', V: '', MG: '', CU: '', TI: ''
    }
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const materialOptions = [
    "WSG", "SGACC", "Adamite", "Alloys", "SGI", "EN-8", "EN-9", "EN-42", "Chill"
  ];

  const chemicalElements = ['C', 'MN', 'SI', 'S', 'P', 'CR', 'NI', 'MO', 'V', 'MG', 'CU', 'TI'];

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, index: number, isLastSubmit = false) => {
    const isTextarea = (e.target as HTMLElement).tagName === 'TEXTAREA';

    if (e.key === 'Enter') {
      if (e.shiftKey && isTextarea) {
        return;
      }
      e.preventDefault();
      if (isLastSubmit) {
        addCurrentItem();
      } else {
        for (let i = index + 1; i < 50; i++) {
          const nextElem = inputRefs.current[i];
          if (nextElem && typeof nextElem.focus === 'function') {
            nextElem.focus();
            break;
          }
        }
      }
    } else if (e.key === 'ArrowDown') {
      if (isTextarea) return;
      e.preventDefault();
      for (let i = index + 1; i < 50; i++) {
        const nextElem = inputRefs.current[i];
        if (nextElem && typeof nextElem.focus === 'function') {
          nextElem.focus();
          break;
        }
      }
    } else if (e.key === 'ArrowUp') {
      if (isTextarea) return;
      e.preventDefault();
      for (let i = index - 1; i >= 0; i--) {
        const prevElem = inputRefs.current[i];
        if (prevElem && typeof prevElem.focus === 'function') {
          prevElem.focus();
          break;
        }
      }
    }
  };

  const handlePoDateChange = (index: number, date: Date | undefined) => {
    if (!date) return;
    setFormData(prev => {
      const newPoDates = [...prev.poDates];
      newPoDates[index] = date;
      return { ...prev, poDates: newPoDates };
    });
  };

  const addPoDate = () => {
    setFormData(prev => ({ ...prev, poDates: [...prev.poDates, new Date()] }));
  };

  const removePoDate = (index: number) => {
    setFormData(prev => ({ ...prev, poDates: prev.poDates.filter((_, i) => i !== index) }));
  };

  const handleCurrentItemChange = (field: string, value: string | number) => {
    setCurrentItem(prev => ({ ...prev, [field]: value }));
  };

  const handleChemicalPropertyChange = (element: string, value: string) => {
    setCurrentItem(prev => ({
      ...prev,
      chemicalProperties: { ...prev.chemicalProperties, [element]: value }
    }));
  };

  const resetCurrentItem = () => {
    setCurrentItem({
      material: '', rollNo: '', rollSize: '', hardness: '', color: '', type: '', pieces: 1,
      chemicalProperties: { C: '', MN: '', SI: '', S: '', P: '', CR: '', NI: '', MO: '', V: '', MG: '', CU: '', TI: '' }
    });
  };

  const addCurrentItem = () => {
    if (!currentItem.material) {
      toast({ title: "Error", description: "Please select a material before adding", variant: "destructive" });
      setTimeout(() => { if (inputRefs.current[9]) inputRefs.current[9].focus() }, 10);
      return;
    }

    if (editIndex === null && formData.items.length >= 7) {
      toast({ 
        title: "Limit Reached", 
        description: "You can only add up to 7 materials, as the certificate table holds exactly 7 rows.", 
        variant: "destructive" 
      });
      return;
    }

    setFormData(prev => {
      let newItems;
      if (editIndex !== null) {
        newItems = prev.items.map((item, idx) => idx === editIndex ? { ...currentItem } : item);
      } else {
        newItems = [...prev.items, { ...currentItem }];
      }
      return { ...prev, items: newItems };
    });

    setEditIndex(null);
    resetCurrentItem();
    toast({ title: "Success", description: editIndex !== null ? "Item updated!" : "Item added!" });
    setTimeout(() => { if (inputRefs.current[9]) inputRefs.current[9].focus() }, 10);
  };

  const removeItem = (itemIndex: number) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter((_, index) => index !== itemIndex) }));
    toast({ title: "Info", description: "Item removed" });
  };

  const editItem = (itemIndex: number) => {
    setCurrentItem({ ...formData.items[itemIndex] });
    setEditIndex(itemIndex);
    setActiveTab("material");
    toast({ title: "Edit Mode", description: "Editing item " + (itemIndex + 1) });
  };

  const handleGenerateCertificate = () => {
    if (!formData.partyName || formData.items.length === 0) {
      toast({ title: "Missing Info", description: "Please complete client info and add items.", variant: "destructive" });
      return;
    }
    setShowPreview(true);
  };

  const handlePrint = () => {
    const previewEl = document.getElementById('certificate-preview');
    if (!previewEl) return;

    // Clone the node
    const clone = previewEl.cloneNode(true) as HTMLElement;
    clone.id = 'certificate-print-clone';
    
    // Add print styles dynamically
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @media print {
        body > * {
          display: none !important;
        }
        body > #certificate-print-clone {
          display: block !important;
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 210mm !important;
          height: 297mm !important;
          margin: 0 !important;
          padding: 24px !important;
          border: none !important;
          box-shadow: none !important;
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box !important;
        }
        @page {
          size: A4 portrait;
          margin: 0;
        }
      }
    `;
    
    document.head.appendChild(styleEl);
    document.body.appendChild(clone);
    
    // Trigger print dialog
    window.print();
    
    // Clean up
    document.body.removeChild(clone);
    document.head.removeChild(styleEl);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await generatePDF(formData);
      toast({ title: "Success", description: "PDF generated successfully!" });
    } catch (error) {
      toast({ title: "Generation Failed", description: "Check all fields and try again.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date(), poDates: [new Date()], partyName: '', partyAddress: '', purchaseOrder: '', invoiceNo: '', workOrder: '', tcNumber: generateTCNumber(), items: []
    });
    resetCurrentItem();
    setActiveTab("client");
    toast({ title: "Reset complete" });
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ backgroundColor: '#F3EFE9' }}>
      {/* 
        =========================================
        SIDE NAVIGATION BAR
        =========================================
      */}
      <aside
        className="w-64 flex flex-col h-full z-40 border-r-0 relative"
        style={{ backgroundColor: '#212A18' }}
      >
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at 70% 30%, #303A1F 0%, transparent 60%), radial-gradient(circle at 30% 80%, #2A331B 0%, transparent 60%)' }} />

        {/* Sidebar Header: Branding */}
        <div className="p-6 pb-8 relative z-10 w-full">
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col items-start gap-1"
          >
            <h1 className="text-[2rem] leading-none uppercase tracking-[-0.02em]" style={{ color: '#F3EFE9', fontFamily: '"Anton", sans-serif' }}>
              Material
            </h1>
            <h1 className="text-[2rem] leading-none uppercase tracking-[-0.02em]" style={{ color: '#C4C969', fontFamily: '"Anton", sans-serif' }}>
              Certify
            </h1>
          </motion.div>
        </div>

        {/* Sidebar Navigation: 3 Steps */}
        <nav className="flex-1 px-6 space-y-4 relative z-10 mt-4">
          {[
            { id: 'client', label: 'Client Info' },
            { id: 'material', label: 'Material Details' },
            { id: 'review', label: 'Review items', badge: formData.items.length }
          ].map((step, idx) => {
            const isActive = activeTab === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={cn(
                  "w-full group relative flex flex-col items-start gap-1 py-4 border-b-2 transition-all duration-300",
                  isActive
                    ? "border-[#C4C969]"
                    : "border-[#303A1F] hover:border-[#F3EFE9]/40"
                )}
              >
                <div className="text-left w-full flex justify-between items-center">
                  <p
                    className={cn(
                      "font-black uppercase tracking-[0.1em] text-[11px] transition-all",
                      isActive ? "text-[#C4C969]" : "text-[#F3EFE9]/50"
                    )}
                    style={{ fontFamily: 'Inter, Arial, sans-serif' }}
                  >
                    STEP 0{idx + 1}
                  </p>
                  {step.badge !== undefined && step.badge > 0 && !isActive && (
                    <span className="text-[#212A18] text-[9px] font-black px-1.5 py-0.5" style={{ backgroundColor: '#C4C969' }}>
                      {step.badge}
                    </span>
                  )}
                </div>
                <p className="text-[1.4rem] italic leading-tight" style={{ color: isActive ? '#F3EFE9' : 'rgba(243, 239, 233, 0.4)', fontFamily: '"Playfair Display", serif' }}>
                  {step.label}
                </p>
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 relative z-10 w-full border-t-2 border-[#303A1F]">
          <div className="flex items-center gap-3 group cursor-help">
            <p className="text-[10px] font-black uppercase tracking-[0.1em]" style={{ color: 'rgba(243, 239, 233, 0.4)' }}>
              C.S Castings PVT LTD
            </p>
          </div>
        </div>
      </aside>

      {/* 
        =========================================
        MAIN WORKSPACE
        =========================================
      */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative" style={{ backgroundColor: '#F3EFE9' }}>
        {/* Top Header: Actions */}
        <header className="h-20 border-b-[2px] border-[#D9D1C6] flex items-center justify-between px-10 z-30 bg-transparent">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-black uppercase tracking-[0.05em]" style={{ color: '#2B3519', fontFamily: 'Inter, Arial, sans-serif' }}>
              {activeTab === 'client' ? 'Client Information' : activeTab === 'material' ? 'Material Properties' : 'Review & Finalize'}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Button variant="ghost" onClick={resetForm} className="h-10 rounded-none text-[#2B3519] border-none hover:bg-transparent font-bold tracking-widest uppercase hover:underline text-xs">
              Reset Form
            </Button>

            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleGenerateCertificate}
                  className="h-10 px-8 text-xs font-black tracking-[0.1em] shadow-none rounded-none border-none transition-all uppercase hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: '#212A18', color: '#F3EFE9' }}
                >
                  Generate Certificate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[1000px] max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-none border-[2px] border-[#2B3519] shadow-none bg-[#F3EFE9]">
                <DialogHeader className="p-8 pb-4 border-b-[2px] border-[#D9D1C6]">
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-3xl font-black uppercase tracking-tight" style={{ color: '#212A18', fontFamily: '"Anton", sans-serif' }}>Certificate Preview</DialogTitle>
                      <DialogDescription className="text-xs font-bold uppercase tracking-widest text-[#2B3519]/70 mt-1">Review the final document before publishing.</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto p-8 flex justify-center items-start" style={{ backgroundColor: '#EBE4DA' }}>
                  <AnimatePresence>
                    {showPreview && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="origin-top"
                        style={{ transform: 'scale(0.85)' }}
                      >
                        <CertificatePreview data={formData} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-6 border-t-[2px] border-[#D9D1C6] flex justify-end gap-4 px-8 bg-[#F3EFE9]">
                  <Button 
                    variant="ghost" 
                    onClick={handlePrint} 
                    className="rounded-none h-12 px-6 font-bold uppercase tracking-widest text-xs text-[#2B3519] hover:bg-transparent hover:underline hover:text-[#2B3519]"
                  >
                    Print Certificate
                  </Button>
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="h-12 px-10 text-xs font-black tracking-widest shadow-none rounded-none border-none uppercase transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: '#C4C969', color: '#2B3519' }}
                  >
                    {isDownloading ? "Generating..." : "Download PDF"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Content Area - Fitted & Centered */}
        <div className="flex-1 flex items-center justify-center p-6 scroll-smooth">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Step 1: Client Information */}
                <TabsContent value="client" className="mt-0 outline-none">
                  <div className="border-[2px] border-[#2B3519] bg-transparent rounded-none p-6 lg:p-8 mb-4">
                    <div className="flex flex-col items-start border-b-[2px] border-[#D9D1C6] pb-3 mb-5">
                      <h2 className="text-[3rem] md:text-[4rem] leading-[0.85] tracking-[-0.02em] uppercase text-[#2B3519]" style={{ fontFamily: '"Anton", sans-serif' }}>
                        STEP 01
                      </h2>
                      {/* <p className="text-[1.1rem] italic mt-1 text-[#2B3519]" style={{ fontFamily: '"Playfair Display", serif' }}>
                        Enterprise Recipient & Logistics Information
                      </p> */}
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-6 space-y-1">
                          <Label className="text-[11px] font-black uppercase tracking-[0.05em] text-[#2B3519]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>Company Name *</Label>
                          <Input
                            ref={(el) => inputRefs.current[0] = el}
                            onKeyDown={(e) => handleKeyDown(e, 0)}
                            placeholder="Enter the company name"
                            value={formData.partyName}
                            onChange={(e) => handleInputChange('partyName', e.target.value)}
                            className="h-10 bg-transparent border-[1.5px] border-[#D9D1C6] rounded-none focus-visible:ring-0 focus-visible:border-[#2B3519] px-4 shadow-none text-base text-[#2B3519] placeholder:text-[#2B3519]/40"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <Label className="text-[11px] font-black uppercase tracking-[0.05em] text-[#2B3519]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>P.O. Number</Label>
                          <Input
                            ref={(el) => inputRefs.current[2] = el}
                            onKeyDown={(e) => handleKeyDown(e, 2)}
                            placeholder="e.g. PO-8822"
                            value={formData.purchaseOrder}
                            onChange={(e) => handleInputChange('purchaseOrder', e.target.value)}
                            className="h-10 bg-transparent border-[1.5px] border-[#D9D1C6] rounded-none focus-visible:ring-0 focus-visible:border-[#2B3519] px-4 shadow-none text-base text-[#2B3519] placeholder:text-[#2B3519]/40"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <Label className="text-[11px] font-black uppercase tracking-[0.05em] text-[#2B3519]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>Invoice No.</Label>
                          <Input
                            ref={(el) => inputRefs.current[3] = el}
                            onKeyDown={(e) => handleKeyDown(e, 3)}
                            placeholder="e.g. INV-2024"
                            value={formData.invoiceNo}
                            onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
                            className="h-10 bg-transparent border-[1.5px] border-[#D9D1C6] rounded-none focus-visible:ring-0 focus-visible:border-[#2B3519] px-4 shadow-none text-base text-[#2B3519] placeholder:text-[#2B3519]/40"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <Label className="text-[11px] font-black uppercase tracking-[0.05em] text-[#2B3519]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>Work Order</Label>
                          <Input
                            ref={(el) => inputRefs.current[4] = el}
                            onKeyDown={(e) => handleKeyDown(e, 4)}
                            placeholder="e.g. WO-9931"
                            value={formData.workOrder}
                            onChange={(e) => handleInputChange('workOrder', e.target.value)}
                            className="h-10 bg-transparent border-[1.5px] border-[#D9D1C6] rounded-none focus-visible:ring-0 focus-visible:border-[#2B3519] px-4 shadow-none text-base text-[#2B3519] placeholder:text-[#2B3519]/40"
                          />
                        </div>
                        <div className="md:col-span-3 space-y-1">
                          <Label className="text-[11px] font-black uppercase tracking-[0.05em] text-[#2B3519]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>Certification Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start h-10 bg-transparent border-[1.5px] border-[#D9D1C6] rounded-none shadow-none text-base font-normal text-[#2B3519] hover:bg-transparent hover:border-[#2B3519]">
                                <CalendarIcon className="mr-3 h-4 w-4 opacity-50" />
                                {formData.date ? format(formData.date, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[280px] p-0 border-[2px] border-[#2B3519] rounded-none shadow-none bg-[#F3EFE9]" align="start">
                              <Calendar mode="single" selected={formData.date} onSelect={(d) => handleInputChange('date', d)} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="md:col-span-3 space-y-1">
                          <Label className="text-[11px] font-black uppercase tracking-[0.05em] text-[#2B3519]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>Certificate Number</Label>
                          <div className="h-10 bg-[#EBE4DA] border-[1.5px] border-[#D9D1C6] rounded-none flex items-center px-4 text-[#2B3519] font-mono tracking-widest select-all text-base font-bold">
                            {formData.tcNumber}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t-[2px] border-[#D9D1C6] space-y-3">
                        <div className="flex items-center gap-4">
                          <Label className="text-[12px] font-black uppercase tracking-[0.05em] text-[#2B3519]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>Multi-PO Batch Dates</Label>
                          <Button variant="outline" onClick={addPoDate} className="bg-transparent border-[1.5px] border-[#2B3519] rounded-none h-9 px-4 text-[10px] font-black tracking-[0.1em] uppercase text-[#2B3519] hover:bg-[#2B3519] hover:text-[#F3EFE9] transition-all w-fit">
                            New PO Date
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {formData.poDates.map((date, idx) => (
                            <div key={idx} className="flex items-stretch bg-transparent border-[1.5px] border-[#D9D1C6] rounded-none group transition-all hover:border-[#2B3519]">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button className="px-4 py-2 text-sm font-bold text-[#2B3519] flex items-center gap-2 hover:bg-black/5 transition-colors">
                                    {date ? format(date, "MMM d, yyyy") : "Date"}
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[280px] p-0 border-[2px] border-[#2B3519] rounded-none shadow-none bg-[#F3EFE9]" align="start">
                                  <Calendar mode="single" selected={date} onSelect={(d) => handlePoDateChange(idx, d)} initialFocus />
                                </PopoverContent>
                              </Popover>
                              {formData.poDates.length > 1 && (
                                <button onClick={() => removePoDate(idx)} className="px-3 border-l-[1.5px] border-[#D9D1C6] hover:bg-black/10 text-[#2B3519] transition-all flex items-center justify-center">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button onClick={() => setActiveTab("material")} className="rounded-none h-12 px-10 border-none uppercase text-xs tracking-[0.1em] font-black transition-all hover:opacity-90 shadow-none text-[#F3EFE9]" style={{ backgroundColor: '#2B3519' }}>
                        Proceed to Materials
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Step 2: Material Properties - Spacious Version */}
                <TabsContent value="material" className="mt-0 outline-none">
                  <div className="border-[2px] border-[#2B3519] bg-transparent rounded-none p-6 lg:p-8 mb-4">
                    <div className="flex flex-col items-start border-b-[2px] border-[#D9D1C6] pb-3 mb-5">
                      <h2 className="text-[3rem] md:text-[4rem] leading-[0.85] tracking-[-0.02em] mb-10 uppercase text-[#2B3519]" style={{ fontFamily: '"Anton", sans-serif' }}>
                        {editIndex !== null ? 'MODIFY' : 'STEP 02'}
                      </h2>
                      {/* <p className="text-[1.1rem] italic mt-1 text-[#2B3519]" style={{ fontFamily: '"Playfair Display", serif' }}>
                          .
                      </p> */}
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2 space-y-1">
                          <Label className="text-[11px] font-black uppercase tracking-[0.05em] text-[#2B3519]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>Material Grade *</Label>
                          <Select
                            value={currentItem.material}
                            onValueChange={(v) => {
                              handleCurrentItemChange('material', v);
                              setTimeout(() => { if (inputRefs.current[10]) inputRefs.current[10].focus(); }, 150);
                            }}
                          >
                            <SelectTrigger ref={(el) => inputRefs.current[9] = el} className="h-10 bg-transparent border-[1.5px] border-[#D9D1C6] rounded-none shadow-none text-base text-[#2B3519] focus:ring-0 focus:border-[#2B3519]">
                              <SelectValue placeholder="Select Grade" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-[2px] border-[#2B3519] shadow-none bg-[#F3EFE9]">
                              {materialOptions.map(m => <SelectItem key={m} value={m} className="rounded-none text-base focus:bg-[#EBE4DA] focus:text-[#2B3519]">{m}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label className="text-[11px] font-black uppercase tracking-[0.05em] text-[#2B3519]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>Roll No.</Label>
                          <Input ref={(el) => inputRefs.current[10] = el} onKeyDown={(e) => handleKeyDown(e, 10)} placeholder="e.g. RL-902" value={currentItem.rollNo} onChange={e => handleCurrentItemChange('rollNo', e.target.value)} className="h-10 bg-transparent border-[1.5px] border-[#D9D1C6] rounded-none focus-visible:ring-0 focus-visible:border-[#2B3519] px-4 shadow-none text-base text-[#2B3519] placeholder:text-[#2B3519]/40" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] font-black uppercase tracking-[0.05em] text-[#2B3519]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>Size / Dimension</Label>
                          <Input ref={(el) => inputRefs.current[11] = el} onKeyDown={(e) => handleKeyDown(e, 11)} placeholder="Dimensions" value={currentItem.rollSize} onChange={e => handleCurrentItemChange('rollSize', e.target.value)} className="h-10 bg-transparent border-[1.5px] border-[#D9D1C6] rounded-none focus-visible:ring-0 focus-visible:border-[#2B3519] px-4 shadow-none text-base text-[#2B3519] placeholder:text-[#2B3519]/40" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] font-black uppercase tracking-[0.05em] text-[#2B3519]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>Hardness</Label>
                          <Input ref={(el) => inputRefs.current[12] = el} onKeyDown={(e) => handleKeyDown(e, 12)} placeholder="e.g. 45-50" value={currentItem.hardness} onChange={e => handleCurrentItemChange('hardness', e.target.value)} className="h-10 bg-transparent border-[1.5px] border-[#D9D1C6] rounded-none focus-visible:ring-0 focus-visible:border-[#2B3519] px-4 shadow-none text-base text-[#2B3519] placeholder:text-[#2B3519]/40" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] font-black uppercase tracking-[0.05em] text-[#2B3519]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>Color Code</Label>
                          <Input ref={(el) => inputRefs.current[13] = el} onKeyDown={(e) => handleKeyDown(e, 13)} placeholder="Color" value={currentItem.color} onChange={e => handleCurrentItemChange('color', e.target.value)} className="h-10 bg-transparent border-[1.5px] border-[#D9D1C6] rounded-none focus-visible:ring-0 focus-visible:border-[#2B3519] px-4 shadow-none text-base text-[#2B3519] placeholder:text-[#2B3519]/40" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] font-black uppercase tracking-[0.05em] text-[#2B3519]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>Total Pieces</Label>
                          <Input ref={(el) => inputRefs.current[14] = el} onKeyDown={(e) => handleKeyDown(e, 14)} type="number" min={1} value={currentItem.pieces} onChange={e => handleCurrentItemChange('pieces', Number(e.target.value))} className="h-10 bg-transparent border-[1.5px] border-[#D9D1C6] rounded-none focus-visible:ring-0 focus-visible:border-[#2B3519] px-4 shadow-none text-base text-[#2B3519] placeholder:text-[#2B3519]/40" />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t-[2px] border-[#D9D1C6]">
                        <div className="flex items-center gap-4 pb-2">
                          <div>
                            <h4 className="text-[16px] font-black uppercase tracking-[0.05em] text-[#2B3519]" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>Chemical Analysis Spectrum (%)</h4>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-6">
                          {chemicalElements.map((el, index) => (
                            <div key={el} className="flex flex-col gap-2 group">
                              <Label className="text-[12px] font-black text-[#2B3519] uppercase tracking-[0.1em]">{el}</Label>
                              <Input
                                ref={(elNode) => inputRefs.current[15 + index] = elNode}
                                onKeyDown={(e) => handleKeyDown(e, 15 + index, index === chemicalElements.length - 1)}
                                type="number"
                                step="0.001"
                                placeholder="0.00"
                                value={currentItem.chemicalProperties[el as keyof typeof currentItem.chemicalProperties]}
                                onChange={e => handleChemicalPropertyChange(el, e.target.value)}
                                className="h-10 bg-[#F8F5F1] border-[1.5px] border-[#D9D1C6] rounded-none focus-visible:ring-0 focus-visible:border-[#2B3519] px-4 shadow-none text-base text-[#2B3519] placeholder:text-[#2B3519]/30"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center pt-4 border-t-[2px] border-[#D9D1C6]">
                      <Button variant="ghost" onClick={resetCurrentItem} className="text-[#2B3519] h-10 px-6 rounded-none font-bold uppercase tracking-widest text-[10px] transition-all hover:bg-transparent hover:underline">
                        Clear Fields
                      </Button>
                      <div className="flex gap-4">
                        {editIndex !== null && (
                          <Button variant="outline" onClick={() => { setEditIndex(null); resetCurrentItem(); }} className="h-10 px-8 rounded-none font-bold uppercase tracking-widest border-[#2B3519] text-[#2B3519] text-[10px]">Cancel</Button>
                        )}
                        <Button onClick={addCurrentItem} className="h-10 px-10 rounded-none text-[10px] font-black tracking-[0.1em] uppercase shadow-none border-none transition-all hover:opacity-90 active:scale-95" style={{ backgroundColor: '#C4C969', color: '#212A18' }}>
                          {editIndex !== null ? "Update Items" : "Add Items"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Step 3: Review Items */}
                <TabsContent value="review" className="mt-0 outline-none">
                  <div className="border-[2px] border-[#2B3519] bg-transparent rounded-none p-6 lg:p-8 mb-4">
                    <div className="flex flex-col items-start border-b-[2px] border-[#D9D1C6] pb-3 mb-5">
                      <h2 className="text-[3rem] md:text-[4rem] leading-[0.85] tracking-[-0.02em] uppercase text-[#2B3519]" style={{ fontFamily: '"Anton", sans-serif' }}>
                        STEP 03
                      </h2>
                      {/* <p className="text-[1.1rem] italic mt-1 text-[#2B3519]" style={{ fontFamily: '"Playfair Display", serif' }}>
                        Review & Finalize Certificate Draft
                      </p> */}
                    </div>

                    <div className="space-y-6">
                      {formData.items.length === 0 ? (
                        <div className="border-dashed border-[2px] border-[#2B3519]/30 h-[200px] flex items-center justify-center rounded-none bg-transparent">
                          <div className="text-center space-y-3">
                            <h3 className="text-[1.3rem] font-black text-[#2B3519] uppercase tracking-widest leading-none">Registry is Empty</h3>
                            <p className="text-sm text-[#2B3519]/70 font-medium">Please finalize material properties to see records here.</p>
                            <div className="pt-4">
                              <Button onClick={() => setActiveTab("material")} className="rounded-none h-12 px-8 uppercase text-xs tracking-[0.1em] font-black transition-all hover:brightness-110 shadow-none border-none text-[#212A18]" style={{ backgroundColor: '#C4C969' }}>
                                Create First Record
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between mb-4 pb-2 border-b-[1.5px] border-[#D9D1C6]">
                            <div>
                              <p className="text-[12px] text-[#2B3519] font-black uppercase tracking-[0.1em]">Reviewing {formData.items.length} records</p>
                            </div>
                            <Button 
                              variant="outline" 
                              onClick={() => setActiveTab("material")} 
                              disabled={formData.items.length >= 7}
                              className="h-10 rounded-none border-[1.5px] border-[#2B3519] text-[#2B3519] bg-transparent px-4 text-xs font-bold uppercase tracking-widest hover:bg-[#2B3519] hover:text-[#F3EFE9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              + Add Record
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 gap-4 max-h-[380px] overflow-auto pr-2 custom-scrollbar">
                            {formData.items.map((item: Item, idx: number) => (
                              <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={idx}
                              >
                                <div className="overflow-hidden group border-[1.5px] border-[#D9D1C6] rounded-none hover:border-[#2B3519] transition-all duration-300 bg-transparent flex flex-col sm:flex-row items-stretch">
                                  <div className="w-full sm:w-20 bg-[#212A18] flex flex-col items-center justify-center py-4 border-b-[1.5px] sm:border-b-0 sm:border-r-[1.5px] border-[#D9D1C6]">
                                    <p className="text-[10px] text-[#C4C969] font-black uppercase tracking-[0.2em] mb-1">ID</p>
                                    <p className="text-3xl font-black text-[#F3EFE9]">{idx + 1}</p>
                                  </div>
                                  <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-4 gap-6 items-center">
                                    <div className="sm:col-span-2">
                                      <Label className="text-[10px] uppercase text-[#2B3519]/70 font-black mb-1 block tracking-[0.1em]">Material Identity</Label>
                                      <p className="font-black text-2xl text-[#2B3519] leading-none uppercase tracking-[-0.02em]">{item.material}</p>
                                      <p className="text-[11px] text-[#2B3519]/80 font-bold mt-2 uppercase tracking-[0.1em]">Roll: {item.rollNo || 'N/A'}</p>
                                    </div>
                                    <div className="sm:col-span-1">
                                      <Label className="text-[10px] uppercase text-[#2B3519]/70 font-black mb-1 block tracking-[0.1em]">Total Pieces</Label>
                                      <p className="text-2xl font-black text-[#2B3519]">{item.pieces}</p>
                                    </div>
                                    <div className="sm:col-span-1 flex justify-end items-center gap-3">
                                      <Button variant="outline" size="icon" className="h-12 w-12 rounded-none text-[#2B3519] border-[1.5px] border-[#D9D1C6] bg-transparent hover:bg-[#2B3519] hover:text-[#F3EFE9] hover:border-[#2B3519] transition-all" onClick={() => editItem(idx)}>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="outline" size="icon" className="h-12 w-12 rounded-none text-[#2B3519] border-[1.5px] border-[#D9D1C6] bg-transparent hover:bg-black hover:text-white hover:border-black transition-all" onClick={() => removeItem(idx)}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;