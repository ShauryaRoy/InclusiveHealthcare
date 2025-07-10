import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";

export default function TrackOrder() {
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string>("");
  const [trackingInput, setTrackingInput] = useState("");
  const { toast } = useToast();

  // Dummy orders for demonstration  
  const dummyOrders = [
    {
      orderNumber: "ORD-2025-123456",
      customerName: "John Doe", 
      total: "89.97",
      items: "Acetaminophen 500mg, Vitamin D3, Ibuprofen 200mg",
      status: "confirmed",
      date: new Date().toLocaleDateString() // Today's date
    }
  ];

  // Fetch tracking information
  const { data: trackingData, isLoading, error } = useQuery({
    queryKey: [`/api/track/${selectedOrderNumber}`],
    enabled: !!selectedOrderNumber,
  });

  const handleTrackOrder = (orderNumber: string) => {
    setSelectedOrderNumber(orderNumber);
  };

  const handleManualTracking = () => {
    if (trackingInput.trim()) {
      setSelectedOrderNumber(trackingInput.trim());
      setTrackingInput("");
    } else {
      toast({
        title: "Please enter an order number",
        description: "Enter a valid order number to track your package.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-600";
      case "processing": return "bg-yellow-500";
      case "shipped": return "bg-blue-500";
      case "in_transit": return "bg-purple-500";
      case "out_for_delivery": return "bg-orange-500";
      case "delivered": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getProgressPercentage = (steps: any[]) => {
    if (!steps) return 0;
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Track Your Order
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Monitor your medication delivery in real-time. Get updates on your order status and estimated delivery time.
            </p>
          </div>

          {!selectedOrderNumber ? (
            <div className="space-y-8">
              {/* Manual Tracking Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Track by Order Number
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Input
                      placeholder="Enter your order number (e.g., ORD-2025-123456)"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleManualTracking}>
                      Track Order
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dummyOrders.map((order) => (
                      <div
                        key={order.orderNumber}
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleTrackOrder(order.orderNumber)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-lg">{order.orderNumber}</span>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-gray-600">{order.items}</p>
                            <p className="text-sm text-gray-500">Order Date: {order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">${order.total}</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Track Package
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Back Button */}
              <Button 
                variant="outline" 
                onClick={() => setSelectedOrderNumber("")}
                className="mb-4"
              >
                ← Back to Orders
              </Button>

              {isLoading ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                    <span className="ml-3">Loading tracking information...</span>
                  </CardContent>
                </Card>
              ) : error ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-red-600">Order not found. Please check your order number and try again.</p>
                  </CardContent>
                </Card>
              ) : trackingData ? (
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Tracking Progress */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Order Summary */}
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-2xl">{trackingData.orderNumber}</CardTitle>
                            <p className="text-gray-600 mt-1">
                              Shipped via {trackingData.carrier} • Tracking: {trackingData.trackingNumber}
                            </p>
                          </div>
                          <Badge className={`${getStatusColor(trackingData.status)} text-white px-3 py-1 text-sm`}>
                            {trackingData.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">Delivery Progress</span>
                              <span className="text-sm font-medium">{getProgressPercentage(trackingData.progressSteps)}%</span>
                            </div>
                            <Progress value={getProgressPercentage(trackingData.progressSteps)} className="h-3" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span>Est. Delivery: {trackingData.estimatedDelivery}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-500" />
                              <span>Total: ${trackingData.orderTotal}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Progress Steps */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Tracking Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {trackingData.progressSteps.map((step: any, index: number) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  step.completed 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                  {step.completed ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                  )}
                                </div>
                                {index < trackingData.progressSteps.length - 1 && (
                                  <div className={`w-0.5 h-12 mt-2 ${
                                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                                  }`} />
                                )}
                              </div>
                              <div className="flex-1 pb-8">
                                <div className="flex justify-between items-start">
                                  <h3 className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {step.status}
                                  </h3>
                                  {step.timestamp && (
                                    <span className="text-sm text-gray-500">
                                      {new Date(step.timestamp).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <p className={`text-sm mt-1 ${step.completed ? 'text-gray-700' : 'text-gray-400'}`}>
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Customer & Delivery Info */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          Delivery Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {trackingData.customerInfo.address}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{trackingData.customerInfo.email}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Order placed on {new Date(trackingData.createdAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Need Help?</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600">
                          Questions about your delivery? Contact our support team.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>(555) 123-4567</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span>support@healthcareplus.com</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}