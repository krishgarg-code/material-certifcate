import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarIcon, Download, FileText, Plus, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import CertificatePreview from "../components/CertificatePreview";
import { generatePDF } from "../utils/pdfGenerator";

interface Item {
  material: string;
  rollNo: string;
  rollSize: string;
  hardness: string;
  color: string;
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
  const inputRefs = useRef([]);

  const generateTCNumber = () => {
    const now = new Date();
    const datePart = now.toISOString().slice(2, 10).replace(/-/g, ''); // e.g., "240614"
    const randomDigits = Math.floor(100 + Math.random() * 900); // 3 random digits
    return `CSC${datePart}${randomDigits}`;
  };
  

  const [formData, setFormData] = useState({
    date: new Date(),
    poDate: new Date(),
    partyName: '',
    partyAddress: '',
    purchaseOrder: '',
    invoiceNo: '',
    tcNumber: generateTCNumber(),
    items: []
  });

  // Ensure TC number is generated on component mount
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
    chemicalProperties: {
      C: '',
      MN: '',
      SI: '',
      S: '',
      P: '',
      CR: '',
      NI: '',
      MO: '',
      V: '',
      MG: '',
      CU: '',
      TI: ''
    }
  });

  const [showPreview, setShowPreview] = useState(false);

  const materialOptions = [
    "WSG",
    "SGACC",
    "Adamite",
    "Alloys",
    "SGI",
    "EN-8",
    "EN-9",
    "EN-42",
    "Chill"
  ];

  const chemicalElements = ['C', 'MN', 'SI', 'S', 'P', 'CR', 'NI', 'MO', 'V', 'MG', 'CU', 'TI'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCurrentItemChange = (field, value) => {
    setCurrentItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChemicalPropertyChange = (element, value) => {
    setCurrentItem(prev => ({
      ...prev,
      chemicalProperties: {
        ...prev.chemicalProperties,
        [element]: value
      }
    }));
  };

  const resetCurrentItem = () => {
    setCurrentItem({
      material: '',
      rollNo: '',
      rollSize: '',
      hardness: '',
      color: '',
      chemicalProperties: {
        C: '',
        MN: '',
        SI: '',
        S: '',
        P: '',
        CR: '',
        NI: '',
        MO: '',
        V: '',
        MG: '',
        CU: '',
        TI: ''
      }
    });
  };

  const addCurrentItem = () => {
    if (!currentItem.material) {
      toast({ 
        title: "Error", 
        description: "Please select a material before adding", 
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...currentItem }]
    }));

    resetCurrentItem();
    toast({ 
      title: "Success", 
      description: "Item added successfully!",
      duration: 2000
    });
  };

  const removeItem = (itemIndex) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, index) => index !== itemIndex)
    }));
    toast({ 
      title: "Success", 
      description: "Item removed successfully!",
      duration: 2000
    });
  };

  const editItem = (itemIndex) => {
    const itemToEdit = formData.items[itemIndex];
    setCurrentItem({ ...itemToEdit });
    removeItem(itemIndex);
    toast({ 
      title: "Info", 
      description: "Item loaded for editing",
      duration: 2000
    });
  };

  const validateForm = () => {
    if (!formData.partyName) {
      toast({ 
        title: "Error", 
        description: "Please enter party name", 
        variant: "destructive",
        duration: 2000
      });
      return false;
    }
    
    if (formData.items.length === 0) {
      toast({ 
        title: "Error", 
        description: "Please add at least one item", 
        variant: "destructive",
        duration: 2000
      });
      return false;
    }
    
    return true;
  };

  const handleGenerateCertificate = () => {
    if (validateForm()) {
      setShowPreview(true);
      toast({ 
        title: "Success", 
        description: "Certificate preview generated successfully!",
        duration: 2000
      });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(formData);
      toast({ 
        title: "Success", 
        description: "PDF downloaded successfully!",
        duration: 2000
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to generate PDF", 
        variant: "destructive",
        duration: 2000
      });
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date(),
      poDate: new Date(),
      partyName: '',
      partyAddress: '',
      purchaseOrder: '',
      invoiceNo: '',
      tcNumber: generateTCNumber(),
      items: []
    });
    resetCurrentItem();
    toast({ 
      title: "Success", 
      description: "Form reset successfully!",
      duration: 2000
    });
  };

  // Autofocus on Party Name
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const next = inputRefs.current[index + 1];
      if (next) next.focus();
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = inputRefs.current[index + 1];
      if (next) next.focus();
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = inputRefs.current[index - 1];
      if (prev) prev.focus();
    }

    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleGenerateCertificate();
    }

    if (e.key === 'Shift') {
      e.preventDefault();
      addCurrentItem();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-4 max-w-[1800px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 ml-2">Material Certification</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetForm}><Trash2 className="mr-2 h-4 w-4" /> Reset</Button>
            <Dialog onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleGenerateCertificate}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={formData.items.length === 0}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-3xl h-auto max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Certificate Preview</DialogTitle>
                  <DialogDescription>
                    Review the generated certificate before downloading.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-auto p-4 border rounded-md">
                  {showPreview && <CertificatePreview data={formData} />}
                </div>
                <div className="flex justify-end p-4">
                  <Button
                    onClick={handleDownloadPDF}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Basic Information */}
          <Card className="shadow-lg">
            <CardHeader className="bg-slate-800 text-white flex flex-row items-center justify-between p-4">
              <CardTitle className="flex items-center gap-2 text-base p-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <Label htmlFor="partyName">Party Name *</Label>
                <Input
                  id="partyName"
                  placeholder="Enter party name"
                  value={formData.partyName}
                  onChange={(e) => handleInputChange('partyName', e.target.value)}
                  ref={(el) => (inputRefs.current[0] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                />
              </div>
              <div>
                <Label htmlFor="partyAddress">Party Address</Label>
                <Textarea
                  id="partyAddress"
                  placeholder="Enter complete address"
                  value={formData.partyAddress}
                  onChange={(e) => handleInputChange('partyAddress', e.target.value)}
                  rows={3}
                  ref={(el) => (inputRefs.current[1] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                />
              </div>
              <div>
                <Label htmlFor="purchaseOrder">Purchase Order</Label>
                <Input
                  placeholder="e.g., PO123456"
                  value={formData.purchaseOrder}
                  onChange={(e) => handleInputChange('purchaseOrder', e.target.value)}
                  ref={(el) => (inputRefs.current[2] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 2)}
                />
              </div>
              <div>
                <Label htmlFor="invoiceNo">Invoice Number</Label>
                <Input
                  placeholder="e.g., INV123456"
                  value={formData.invoiceNo}
                  onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
                  ref={(el) => (inputRefs.current[3] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 3)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="poDate">PO Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.poDate ? format(formData.poDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.poDate}
                        onSelect={(date) => handleInputChange('poDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => handleInputChange('date', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label htmlFor="tcNumber">T.C. Number</Label>
                <Input
                  id="tcNumber"
                  value={formData.tcNumber}
                  readOnly
                  className="bg-slate-50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Material Details */}
          <Card className="shadow-lg">
            <CardHeader className="bg-slate-800 text-white p-4">
              <CardTitle className="flex items-center gap-2 text-base p-2">
                <FileText className="h-5 w-5" />
                Material  Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-3">
                {/* <Card className="border-2 border-slate-200"> */}
                  <CardContent className="p-0 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Grade Type</Label>
                        <Select
                          value={currentItem.material}
                          onValueChange={(value) => handleCurrentItemChange('material', value)}
                        >
                          <SelectTrigger
                            ref={(el) => (inputRefs.current[4] = el)}
                            onKeyDown={(e) => handleKeyDown(e, 4)}
                          >
                            <SelectValue placeholder="Select grade type" />
                          </SelectTrigger>
                          <SelectContent>
                            {materialOptions.map((material) => (
                              <SelectItem key={material} value={material}>
                                {material}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Roll Number</Label>
                        <Input
                          id="rollNo"
                          placeholder="Enter roll number"
                          value={currentItem.rollNo}
                          onChange={(e) => handleCurrentItemChange('rollNo', e.target.value)}
                          ref={(el) => (inputRefs.current[5] = el)}
                          onKeyDown={(e) => handleKeyDown(e, 5)}
                        />
                      </div>
                      <div>
                        <Label>Roll Size</Label>
                        <Input
                          id="rollSize"
                          placeholder="e.g., 520X800/240X320"
                          value={currentItem.rollSize}
                          onChange={(e) => handleCurrentItemChange('rollSize', e.target.value)}
                          ref={(el) => (inputRefs.current[6] = el)}
                          onKeyDown={(e) => handleKeyDown(e, 6)}
                        />
                      </div>
                      <div>
                        <Label>Hardness</Label>
                        <Input
                          id="hardness"
                          placeholder="Enter hardness value"
                          value={currentItem.hardness}
                          onChange={(e) => handleCurrentItemChange('hardness', e.target.value)}
                          ref={(el) => (inputRefs.current[7] = el)}
                          onKeyDown={(e) => handleKeyDown(e, 7)}
                        />
                      </div>
                      <div className='col-span-2'>
                        <Label>Color</Label>
                        <Input
                          id="color"
                          placeholder="Enter color"
                          value={currentItem.color}
                          onChange={(e) => handleCurrentItemChange('color', e.target.value)}
                          ref={(el) => (inputRefs.current[8] = el)}
                          onKeyDown={(e) => handleKeyDown(e, 8)}
                        />
                      </div>
                      {/* Chemical Properties */}
                      <div className="space-y-3 mt-4 md:col-span-2">
                        <h5 className="font-medium text-slate-600">Chemical Properties</h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {chemicalElements.map((element, idx) => (
                            <div key={element}>
                              <Label>{element}</Label>
                              <Input
                                type="number"
                                step="0.001"
                                placeholder="0.000"
                                value={currentItem.chemicalProperties[element]}
                                onChange={e => handleChemicalPropertyChange(element, e.target.value)}
                                ref={el => (inputRefs.current[9 + idx] = el)}
                                onKeyDown={e => handleKeyDown(e, 9 + idx)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                {/* </Card> */}
                <Button
                  onClick={addCurrentItem}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item to List
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add Items */}
          <Card className="shadow-lg">
            <CardHeader className="bg-slate-800 text-white p-4">
              <CardTitle className="flex items-center gap-2 text-base p-2">
                <Plus className="h-5 w-5" />
                Add Items ({formData.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-700 border-b pb-2">Items Added</h3>
                {formData.items.length > 0 ? (
                  <div className="h-[calc(100vh-350px)] overflow-y-auto pr-2">
                    <div className="space-y-2">
                      {formData.items.map((item, index) => (
                        <Card key={index} className="bg-slate-50">
                          <CardContent className="p-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-sm font-medium text-slate-600 mb-1">Item {index + 1}</div>
                                <div className="text-xs space-y-0.5 text-slate-500">
                                  <div>Material: {item.material}</div>
                                  <div>Roll Number: {item.rollNo}</div>
                                  <div>Hardness: {item.hardness}</div>
                                  <div>Color: {item.color}</div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                  onClick={() => editItem(index)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => removeItem(index)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card className="h-40 flex items-center justify-center border-dashed border-2 text-slate-500">
                    <div className="text-center">
                      <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No items added yet</p>
                    </div>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index; 