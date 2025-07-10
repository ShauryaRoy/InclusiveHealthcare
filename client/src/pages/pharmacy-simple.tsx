import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import AccessibilityToolbar from "@/components/accessibility-toolbar";
import Footer from "@/components/footer";
import PharmacyCheckout from "@/components/pharmacy-checkout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Package, 
  Truck, 
  CheckCircle,
  Star,
  Plus,
  Minus,
  Heart,
  Shield,
  Clock,
  MapPin,
  Phone,
  Upload,
  Calendar,
  MessageSquare
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  prescription: boolean;
  brand: string;
  dosage: string;
}

// Form schemas for pharmacy services
const prescriptionFormSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  patientEmail: z.string().email("Please enter a valid email address"),
  doctorName: z.string().min(2, "Doctor name is required"),
  doctorPhone: z.string().min(10, "Doctor phone number is required"),
  medications: z.string().min(10, "Please list your medications"),
  notes: z.string().optional(),
});

const consultationFormSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  patientEmail: z.string().email("Please enter a valid email address"),
  patientPhone: z.string().min(10, "Phone number is required"),
  consultationType: z.string().min(1, "Please select consultation type"),
  preferredDate: z.string().min(1, "Please select a date"),
  preferredTime: z.string().min(1, "Please select a time"),
  questions: z.string().min(10, "Please describe your questions"),
});

type PrescriptionFormData = z.infer<typeof prescriptionFormSchema>;
type ConsultationFormData = z.infer<typeof consultationFormSchema>;

export default function Pharmacy() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeTab, setActiveTab] = useState("medicines");

  // Prescription form
  const prescriptionForm = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      patientName: "",
      patientEmail: "",
      doctorName: "",
      doctorPhone: "",
      medications: "",
      notes: "",
    },
  });

  // Consultation form
  const consultationForm = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      consultationType: "",
      preferredDate: "",
      preferredTime: "",
      questions: "",
    },
  });

  // Prescription upload mutation
  const prescriptionMutation = useMutation({
    mutationFn: async (data: PrescriptionFormData) => {
      const response = await apiRequest("POST", "/api/pharmacy/prescription", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Prescription Uploaded",
        description: "Your prescription has been uploaded successfully. Our pharmacist will verify it within 24 hours.",
      });
      prescriptionForm.reset();
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload prescription. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Consultation booking mutation
  const consultationMutation = useMutation({
    mutationFn: async (data: ConsultationFormData) => {
      const response = await apiRequest("POST", "/api/pharmacy/consultation", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Consultation Scheduled",
        description: "Your consultation has been scheduled successfully. You'll receive a confirmation email shortly.",
      });
      consultationForm.reset();
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "Failed to schedule consultation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Fetch medicines from API
  const { data: medicines = [], isLoading: medicinesLoading } = useQuery({
    queryKey: ["/api/medicines"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "pain-relief", label: "Pain Relief" },
    { value: "cardiovascular", label: "Heart & Blood Pressure" },
    { value: "diabetes", label: "Diabetes Care" },
    { value: "vitamins", label: "Vitamins & Supplements" },
    { value: "antibiotics", label: "Antibiotics" },
    { value: "mental-health", label: "Mental Health" },
    { value: "skincare", label: "Skin Care" }
  ];

  const filteredMedicines = medicines.filter((medicine: any) => {
    const matchesSearch = medicine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        id: parseInt(medicine.id),
        name: medicine.name,
        price: parseFloat(medicine.price),
        quantity: 1,
        prescription: medicine.prescription,
        brand: medicine.brand,
        dosage: medicine.dosage
      }];
    });
    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (medicinesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AccessibilityToolbar />
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Online Pharmacy
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Convenient access to medications and health products with prescription verification,
                secure ordering, and reliable home delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Browse Medications
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Prescription Upload
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Shopping Cart Float Button */}
          {cartItemCount > 0 && (
            <div className="fixed bottom-6 right-6 z-50">
              <Button
                onClick={() => setShowCart(true)}
                className="rounded-full h-16 w-16 shadow-lg"
                size="lg"
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </Badge>
                </div>
              </Button>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="medicines">Browse Medicines</TabsTrigger>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              <TabsTrigger value="services">Pharmacy Services</TabsTrigger>
            </TabsList>

            {/* Browse Medicines Tab */}
            <TabsContent value="medicines" className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search medicines, brands, or conditions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-64">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Medicine Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedicines.map((medicine: any) => (
                  <Card key={medicine.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{medicine.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{medicine.brand} • {medicine.dosage}</p>
                        </div>
                        {medicine.prescription && (
                          <Badge variant="secondary" className="ml-2">
                            <Shield className="w-3 h-3 mr-1" />
                            Rx
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {medicine.description}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(parseFloat(medicine.rating || "0"))
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {medicine.rating} ({medicine.reviews} reviews)
                        </span>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <div className="text-2xl font-bold text-green-600">
                          ${medicine.price}
                        </div>
                        <div className="text-sm text-gray-600">
                          {medicine.inStock ? (
                            <span className="text-green-600">In Stock ({medicine.stockCount})</span>
                          ) : (
                            <span className="text-red-600">Out of Stock</span>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => addToCart(medicine)}
                        disabled={!medicine.inStock}
                        className="w-full"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* My Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
                <p className="text-gray-600 mb-6">
                  Your order history will appear here once you place your first order.
                </p>
                <Button onClick={() => setActiveTab("medicines")}>
                  Start Shopping
                </Button>
              </div>
            </TabsContent>

            {/* Pharmacy Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Prescription Transfer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Transfer your prescriptions from another pharmacy with ease. 
                      We'll handle all the paperwork.
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">Start Transfer</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            Upload Prescription
                          </DialogTitle>
                        </DialogHeader>
                        <Form {...prescriptionForm}>
                          <form onSubmit={prescriptionForm.handleSubmit(data => prescriptionMutation.mutate(data))} className="space-y-4">
                            <FormField
                              control={prescriptionForm.control}
                              name="patientName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Patient Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Enter your full name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={prescriptionForm.control}
                              name="patientEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" placeholder="your@email.com" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={prescriptionForm.control}
                              name="doctorName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Doctor Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Dr. Smith" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={prescriptionForm.control}
                              name="doctorPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Doctor Phone</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="(555) 123-4567" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={prescriptionForm.control}
                              name="medications"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Medications</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="List your medications, dosages, and quantities" rows={3} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={prescriptionForm.control}
                              name="notes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Additional Notes (Optional)</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Any special instructions or notes" rows={2} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" disabled={prescriptionMutation.isPending} className="w-full">
                              {prescriptionMutation.isPending ? "Uploading..." : "Upload Prescription"}
                            </Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-600" />
                      Medication Synchronization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Align all your prescription refills to the same date for 
                      convenient monthly pickup.
                    </p>
                    <Button className="w-full">Sync Medications</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-green-600" />
                      Pharmacist Consultation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Speak with our licensed pharmacists about medication 
                      interactions, side effects, and proper usage.
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">Schedule Consultation</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Schedule Consultation
                          </DialogTitle>
                        </DialogHeader>
                        <Form {...consultationForm}>
                          <form onSubmit={consultationForm.handleSubmit(data => consultationMutation.mutate(data))} className="space-y-4">
                            <FormField
                              control={consultationForm.control}
                              name="patientName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Your Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Enter your full name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={consultationForm.control}
                              name="patientEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" placeholder="your@email.com" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={consultationForm.control}
                              name="patientPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="(555) 123-4567" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={consultationForm.control}
                              name="consultationType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Consultation Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select consultation type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="medication-review">Medication Review</SelectItem>
                                      <SelectItem value="drug-interaction">Drug Interaction Check</SelectItem>
                                      <SelectItem value="side-effects">Side Effects Discussion</SelectItem>
                                      <SelectItem value="general">General Questions</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={consultationForm.control}
                                name="preferredDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Preferred Date</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="date" min={new Date().toISOString().split('T')[0]} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={consultationForm.control}
                                name="preferredTime"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Preferred Time</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select time" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="09:00">9:00 AM</SelectItem>
                                        <SelectItem value="10:00">10:00 AM</SelectItem>
                                        <SelectItem value="11:00">11:00 AM</SelectItem>
                                        <SelectItem value="14:00">2:00 PM</SelectItem>
                                        <SelectItem value="15:00">3:00 PM</SelectItem>
                                        <SelectItem value="16:00">4:00 PM</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={consultationForm.control}
                              name="questions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Questions/Concerns</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Describe your questions or concerns for the pharmacist" rows={3} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" disabled={consultationMutation.isPending} className="w-full">
                              {consultationMutation.isPending ? "Scheduling..." : "Schedule Consultation"}
                            </Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-purple-600" />
                      Home Delivery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Free home delivery for orders over $35. Same-day delivery 
                      available in select areas.
                    </p>
                    <Button className="w-full">Learn More</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-orange-600" />
                      Auto-Refill Program
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Never run out of medications. Automatic refills with 
                      convenient delivery scheduling.
                    </p>
                    <Button className="w-full">Enroll Now</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Insurance Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      We work with most insurance plans to ensure you get 
                      the best coverage for your medications.
                    </p>
                    <Button className="w-full">Check Coverage</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowCart(false)}>
            <div 
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Shopping Cart</h3>
                  <Button variant="ghost" onClick={() => setShowCart(false)}>
                    ×
                  </Button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-gray-600">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">${item.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total: ${cartTotal.toFixed(2)}</span>
                      </div>
                      <Button 
                        className="w-full mt-4" 
                        size="lg"
                        onClick={() => {
                          setShowCart(false);
                          setShowCheckout(true);
                        }}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 py-8">
              <div className="bg-white rounded-lg max-w-4xl mx-auto">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-2xl font-bold">Checkout</h2>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowCheckout(false)}
                    className="text-2xl"
                  >
                    ×
                  </Button>
                </div>
                <div className="p-6">
                  <PharmacyCheckout 
                    cart={cart} 
                    onSuccess={() => {
                      setCart([]);
                      setShowCheckout(false);
                      toast({
                        title: "Order Placed Successfully!",
                        description: "Your pharmacy order has been confirmed. You'll receive tracking information shortly.",
                      });
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}