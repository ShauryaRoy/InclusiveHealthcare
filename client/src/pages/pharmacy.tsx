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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
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
  Phone
} from "lucide-react";

interface Medicine {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  stockCount: number;
  prescription: boolean;
  brand: string;
  dosage: string;
  image: string;
  rating: number;
  reviews: number;
}

interface CartItem extends Medicine {
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  estimatedDelivery: string;
  shippingAddress: string;
  createdAt: string;
}

export default function Pharmacy() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeTab, setActiveTab] = useState("medicines");

  // Fetch medicines from API
  const { data: medicines = [], isLoading: medicinesLoading } = useQuery({
    queryKey: ["/api/medicines", { category: selectedCategory, search: searchTerm }],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Mock orders data - replace with real API call when user authentication is implemented
  const mockOrders = [
    {
      id: "ORD-2025-001",
      items: [
        { name: "Acetaminophen 500mg", quantity: 2, price: 12.99 },
        { name: "Vitamin D3 2000 IU", quantity: 1, price: 15.99 }
      ],
      total: 41.97,
      status: "shipped" as const,
      trackingNumber: "TRK123456789",
      estimatedDelivery: "January 5, 2025",
      shippingAddress: "123 Main St, Anytown, ST 12345",
      createdAt: "2025-01-02"
    },
    {
      id: "ORD-2025-002", 
      items: [
        { name: "Lisinopril 10mg", quantity: 1, price: 24.99 },
        { name: "Metformin 500mg", quantity: 1, price: 18.50 }
      ],
      total: 43.49,
      status: "preparing" as const,
      estimatedDelivery: "January 6, 2025",
      shippingAddress: "123 Main St, Anytown, ST 12345",
      createdAt: "2025-01-03"
    }
  ];

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

  const filteredMedicines = (medicines as Medicine[]).filter((medicine: Medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...medicine, quantity: 1 }];
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

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'preparing': return <Package className="w-4 h-4 text-orange-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Order Pending';
      case 'confirmed': return 'Order Confirmed';
      case 'preparing': return 'Being Prepared';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
    }
  };

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
                {filteredMedicines.map((medicine) => (
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
                                i < Math.floor(medicine.rating)
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
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Order History & Tracking</h2>
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            Order {order.id}
                            {getStatusIcon(order.status)}
                            <span className="text-sm font-normal text-gray-600">
                              {getStatusText(order.status)}
                            </span>
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            Placed on {order.createdAt} • Total: ${order.total.toFixed(2)}
                          </p>
                        </div>
                        {order.trackingNumber && (
                          <Badge variant="outline">
                            Tracking: {order.trackingNumber}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Items Ordered:</h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center text-sm">
                                <span>{item.name} × {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {order.shippingAddress}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Est. delivery: {order.estimatedDelivery}
                          </div>
                        </div>

                        {order.status === 'shipped' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h5 className="font-semibold text-blue-900 mb-2">Tracking Information</h5>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                  <span className="text-sm">Order Confirmed</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                  <span className="text-sm">Shipped</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                                  <span className="text-sm text-gray-600">In Transit</span>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Track Package
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                    <Button className="w-full">Start Transfer</Button>
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
                    <Button className="w-full">Schedule Consultation</Button>
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
                      <Button className="w-full mt-4" size="lg">
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}